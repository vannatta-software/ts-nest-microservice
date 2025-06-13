import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Integration } from '@contracts/index';
import { EventBus } from '../event.bus';
import { HandlerRegistry } from '../handler.registry';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PubSub, Topic, Subscription } from '@google-cloud/pubsub';
import { ClassType } from '@vannatta-software/ts-utils-core';

@Injectable()
export class GooglePubSubEventBus extends EventBus implements OnModuleInit, OnModuleDestroy {
    private pubSubClient: PubSub;
    private subscriptions: Map<string, Subscription> = new Map();

    constructor(
        private readonly registry: HandlerRegistry,
        private readonly eventEmitter: EventEmitter2
    ) {
        super('GooglePubSub Bus');
        this.pubSubClient = new PubSub({
            projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
            credentials: {
                client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
        });
    }

    async onModuleInit() {
        const handlerNames = this.registry.getIntegrationHandlerNames();
        for (const topicName of handlerNames) {
            await this.setupSubscription(topicName);
        }
        this.logger.log('Google Pub/Sub Event Bus initialized and subscribed to handlers.');
    }

    protected async handleEvent(integration: Integration<any>, topicName?: string): Promise<void> {
        const targetTopicName = topicName || integration.name;
        const dataBuffer = Buffer.from(JSON.stringify(integration));

        try {
            const messageId = await this.pubSubClient.topic(targetTopicName).publish(dataBuffer);
            this.logger.debug(`Message ${messageId} published to topic ${targetTopicName}.`);
            // Also emit locally for websocket notifications
            this.eventEmitter.emit(integration.name, integration.data);
        } catch (error) {
            this.logger.error(`Failed to publish message to topic ${targetTopicName}:`, error);
            throw error;
        }
    }

    public async subscribe<TData>(topicName: string, handler: (data: TData) => Promise<void>, eventType?: ClassType<TData>): Promise<void> {
        if (this.subscriptions.has(topicName)) {
            this.logger.warn(`Already subscribed to topic: ${topicName}`);
            return;
        }
        await this.setupSubscription(topicName, handler, eventType);
    }

    private async setupSubscription<TData>(topicName: string, handler?: (data: TData) => Promise<void>, eventType?: ClassType<TData>): Promise<void> {
        const topic: Topic = this.pubSubClient.topic(topicName);
        const subscriptionName = `${topicName}-subscription-${process.env.NODE_ENV || 'development'}`;
        let subscription: Subscription;

        try {
            // Ensure topic exists
            await topic.get({ autoCreate: true });
            this.logger.debug(`Topic ${topicName} ensured.`);

            // Ensure subscription exists
            [subscription] = await topic.createSubscription(subscriptionName, {
                ackDeadlineSeconds: 60, // 1 minute
                enableMessageOrdering: false,
            });
            this.logger.debug(`Subscription ${subscriptionName} ensured for topic ${topicName}.`);
        } catch (e) {
            if (e.code === 6) { // ALREADY_EXISTS
                subscription = this.pubSubClient.subscription(subscriptionName);
                this.logger.debug(`Subscription ${subscriptionName} already exists.`);
            } else {
                this.logger.error(`Error ensuring topic or subscription for ${topicName}:`, e);
                throw e;
            }
        }

        subscription.on('message', async (message) => {
            try {
                const integration = JSON.parse(message.data.toString()) as Integration<TData>;
                this.logger.debug(`Received message from ${topicName}: ${JSON.stringify(integration)}`);

                // Handle event via HandlerRegistry for internal handlers
                const handlers = this.registry.getIntegrationHandlers(integration.name);
                await Promise.all(handlers.map(h => h.handle(integration.data)));

                // If a specific handler was provided to subscribe method, call it
                if (handler) {
                    await handler(integration.data);
                }

                // Also emit locally for websocket notifications
                this.eventEmitter.emit(integration.name, integration.data);

                message.ack();
            } catch (error) {
                this.logger.error(`Error processing Pub/Sub message for topic ${topicName}:`, error);
                message.nack();
            }
        });

        subscription.on('error', (error) => {
            this.logger.error(`Error on subscription ${subscriptionName} for topic ${topicName}:`, error);
        });

        this.subscriptions.set(topicName, subscription);
    }

    async onModuleDestroy() {
        for (const [topicName, subscription] of this.subscriptions.entries()) {
            try {
                await subscription.close();
                this.logger.log(`Closed subscription for topic: ${topicName}`);
            } catch (error) {
                this.logger.error(`Error closing subscription for topic ${topicName}:`, error);
            }
        }
        this.subscriptions.clear();
        this.logger.log('Google Pub/Sub Event Bus destroyed.');
    }
}
