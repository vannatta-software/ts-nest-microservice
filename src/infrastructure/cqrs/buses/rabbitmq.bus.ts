import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { EventBus } from '../event.bus';
import { HandlerRegistry } from '../handler.registry';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Connection, Channel, connect } from 'amqplib'; // Import connect directly
import { ClassType } from '@vannatta-software/ts-utils-core'; // Fix typo: from instead of =>
import { Integration } from '@vannatta-software/ts-utils-domain';

@Injectable()
export class RabbitMQEventBus extends EventBus implements OnModuleInit, OnModuleDestroy {
    private connection: Connection;
    private channel: Channel;
    private subscriptions: Map<string, { handler: (msg: any) => Promise<void>, consumerTag: string }> = new Map();

    constructor(
        private readonly registry: HandlerRegistry,
        private readonly eventEmitter: EventEmitter2
    ) {
        super('RabbitMQ Bus');
    }

    async onModuleInit() {
        // Using 'any' as a workaround for persistent TypeScript type resolution issues with amqplib.
        // In a production environment, this should be investigated further to resolve the type conflicts.
        this.connection = await connect(process.env.RABBITMQ_URL || 'amqp://localhost') as any;
        this.channel = await (this.connection as any).createChannel();
        
        const handlerNames = this.registry.getIntegrationHandlerNames();
        
        for (const topic of handlerNames) {
            await this.setupSubscription(topic);
        }
        this.logger.log('RabbitMQ Event Bus initialized and subscribed to handlers.');
    }

    protected async handleEvent(integration: Integration<any>, topicName?: string): Promise<void> {
        const targetTopicName = topicName || integration.name;
        await this.channel.assertQueue(targetTopicName, { durable: true }); // Ensure queue exists
        this.channel.sendToQueue(
            targetTopicName,
            Buffer.from(JSON.stringify(integration)),
            { persistent: true }
        );
        this.logger.debug(`Published integration ${targetTopicName} to RabbitMQ.`);
        // Also emit locally for websocket notifications
        this.eventEmitter.emit(integration.name, integration.data);
    }

    public async subscribe<TData>(topicName: string, handler: (data: TData) => Promise<void>): Promise<void> {
        if (this.subscriptions.has(topicName)) {
            this.logger.warn(`Already subscribed to topic: ${topicName}`);
            return;
        }
        await this.setupSubscription(topicName, handler);
    }

    private async setupSubscription<TData>(topicName: string, handler?: (data: TData) => Promise<void>): Promise<void> {
        await this.channel.assertQueue(topicName, { durable: true });
        const consumerTag = `${topicName}-consumer-${process.env.NODE_ENV || 'development'}`;

        const messageHandler = async (msg: any) => {
            if (!msg) return;
            
            try {
                const integration = JSON.parse(msg.content.toString()) as Integration<TData>;
                this.logger.debug(`Received message from RabbitMQ topic ${topicName}: ${JSON.stringify(integration)}`);

                // Handle event via HandlerRegistry for internal handlers
                const handlers = this.registry.getIntegrationHandlers(integration.name);
                await Promise.all(handlers.map(h => h.handle(integration.data)));

                // If a specific handler was provided to subscribe method, call it
                if (handler) {
                    await handler(integration.data);
                }

                // Also emit locally for websocket notifications
                this.eventEmitter.emit(integration.name, integration.data);

                this.channel.ack(msg);
            } catch (error) {
                this.logger.error(`Failed to process RabbitMQ message for topic ${topicName}:`, error);
                this.channel.nack(msg);
            }
        };

        const { consumerTag: actualConsumerTag } = await this.channel.consume(topicName, messageHandler, { consumerTag });
        this.subscriptions.set(topicName, { handler: messageHandler, consumerTag: actualConsumerTag });
        this.logger.debug(`RabbitMQ subscribed to topic: ${topicName} with consumer tag: ${actualConsumerTag}`);
    }

    public async unsubscribe<TData = any>(topic: ClassType<TData>): Promise<void> {
        const topicName = (topic as any).name;
        const subscriptionInfo = this.subscriptions.get(topicName);
        if (subscriptionInfo) {
            try {
                await this.channel.cancel(subscriptionInfo.consumerTag);
                this.subscriptions.delete(topicName);
                this.logger.log(`Unsubscribed from topic: ${topicName}`);
            } catch (error) {
                this.logger.error(`Error unsubscribing from topic ${topicName}:`, error);
                // Do not re-throw as the interface specifies void
            }
        } else {
            this.logger.warn(`No active subscription found for topic: ${topicName}`);
        }
    }

    async onModuleDestroy() {
        for (const [topicName, subscriptionInfo] of this.subscriptions.entries()) {
            try {
                await this.channel.cancel(subscriptionInfo.consumerTag);
                this.logger.log(`Cancelled consumer for topic: ${topicName}`);
            } catch (error) {
                this.logger.error(`Error cancelling consumer for topic ${topicName} during destroy:`, error);
            }
        }
        this.subscriptions.clear();
        await (this.channel as any)?.close();
        await (this.connection as any)?.close();
        this.logger.log('RabbitMQ Event Bus destroyed.');
    }
}
