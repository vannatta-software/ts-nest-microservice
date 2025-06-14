import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { EventBus } from '../event.bus';
import { HandlerRegistry } from '../handler.registry';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Redis } from 'ioredis';
import { ClassType } from '@vannatta-software/ts-utils-core';
import { Integration } from '@vannatta-software/ts-utils-domain';

@Injectable()
export class RedisEventBus extends EventBus implements OnModuleInit, OnModuleDestroy {
    private readonly redis: Redis;
    private readonly subscriber: Redis;
    private subscriptions: Map<string, (channel: string, message: string) => void> = new Map();

    constructor(
        private readonly registry: HandlerRegistry,
        private readonly eventEmitter: EventEmitter2
    ) {
        super('Redis Bus');
        this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
        this.subscriber = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    }

    async onModuleInit() {
        const handlerNames = this.registry.getIntegrationHandlerNames();
        
        for (const topic of handlerNames) {
            await this.setupSubscription(topic);
        }

        this.subscriber.on('message', async (channel, message) => {
            const messageHandler = this.subscriptions.get(channel);
            if (messageHandler) {
                await messageHandler(channel, message);
            }
        });
        this.logger.log('Redis Event Bus initialized and subscribed to handlers.');
    }

    protected async handleEvent(integration: Integration<any>, topicName?: string): Promise<void> {
        const targetTopicName = topicName || integration.name;
        await this.redis.publish(
            targetTopicName, 
            JSON.stringify(integration)
        );
        this.logger.debug(`Published integration ${targetTopicName} to Redis.`);
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
        await this.subscriber.subscribe(topicName);
        
        const messageHandler = async (channel: string, message: string) => {
            try {
                const integration = JSON.parse(message) as Integration<TData>;
                this.logger.debug(`Received message from Redis topic ${topicName}: ${JSON.stringify(integration)}`);

                // Handle event via HandlerRegistry for internal handlers
                const handlers = this.registry.getIntegrationHandlers(integration.name);
                await Promise.all(handlers.map(h => h.handle(integration.data)));

                // If a specific handler was provided to subscribe method, call it
                if (handler) {
                    await handler(integration.data);
                }

                // Also emit locally for websocket notifications
                this.eventEmitter.emit(integration.name, integration.data);
            } catch (error) {
                this.logger.error(`Failed to process Redis message for topic ${topicName}:`, error);
            }
        };
        this.subscriptions.set(topicName, messageHandler);
        this.logger.debug(`Redis subscribed to topic: ${topicName}`);
    }

    public async unsubscribe<TData = any>(topic: ClassType<TData>): Promise<void> {
        const topicName = (topic as any).name;
        if (this.subscriptions.has(topicName)) {
            try {
                await this.subscriber.unsubscribe(topicName);
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
        for (const topicName of this.subscriptions.keys()) {
            try {
                await this.subscriber.unsubscribe(topicName);
                this.logger.log(`Unsubscribed from topic ${topicName} during destroy.`);
            } catch (error) {
                this.logger.error(`Error unsubscribing from topic ${topicName} during destroy:`, error);
            }
        }
        this.subscriptions.clear();
        await this.redis.quit();
        await this.subscriber.quit();
        this.logger.log('Redis Event Bus destroyed.');
    }
}
