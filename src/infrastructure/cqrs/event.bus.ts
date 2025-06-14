
import { ClassType } from '@vannatta-software/ts-utils-core';
import { ClassProvider, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HandlerRegistry } from './handler.registry';
import { IEventBus, Integration } from '@vannatta-software/ts-utils-domain';

export enum EventBusType {
    RabbitMQ = 'rabbitmq',
    GooglePubSub = 'google-pubsub',
    Redis = 'redis',
    Base = 'base'
}

export abstract class EventBus implements IEventBus {
    protected readonly logger: Logger;
    private processedEvents = new Set<string>();
    private readonly TTL = 3600 * 1000; // 1 hour in milliseconds

    constructor(name?: string) {
        this.logger = new Logger(name ?? "EventBus");
        setInterval(() => this.cleanupOldEvents(), this.TTL);
    }

    async publish(integration: Integration<any>, topic?: string): Promise<void> {
        const key = this.generateKey(integration);
        
        if (this.processedEvents.has(key)) {
            this.logger.debug(`Skipping duplicate event ${key}`);
            return;
        }

        try {
            await this.handleEvent(integration, topic);
            this.processedEvents.add(key);
        } catch (error) {
            this.logger.error(`Failed to handle event ${key}:`, error);
            throw error;
        }
    }

    public abstract subscribe<TData>(topic: string, handler: (data: TData) => Promise<void>): void;
    public abstract unsubscribe<TData = any>(topic: ClassType<TData>): void;
    protected abstract handleEvent(integration: Integration<any>, topic?: string): Promise<void>; 
    
    protected generateKey(integration: Integration): string {
        return `${integration.name}:${integration.eventId}`;
    }

    private cleanupOldEvents() {
        this.processedEvents.clear();
        this.logger.debug('Cleared processed events cache');
    }

    public static createProvider(busType: EventBusType): ClassProvider {
        let useClass: any;
        
        switch (busType) {
            case EventBusType.RabbitMQ:
                useClass = require('./buses/rabbitmq.bus').RabbitMQEventBus;
                break;
            case EventBusType.GooglePubSub:
                useClass = require('./buses/google-pubsub.bus').GooglePubSubEventBus;
                break;
            case EventBusType.Redis:
                useClass = require('./buses/redis.bus').RedisEventBus;
                break;
            case EventBusType.Base:
            default:
                useClass = require('./event.bus').BaseEventBus;
                break;
        }

        return {
            provide: EventBus,
            useClass: useClass
        }
    }
}
@Injectable()
export class BaseEventBus extends EventBus {
    constructor(
        private readonly registry: HandlerRegistry,
        private readonly eventEmitter: EventEmitter2
    ) {
        super()
    }

    protected async handleEvent(integration: Integration<any>): Promise<void> {
        const handlers = this.registry.getIntegrationHandlers(integration.name);
        
        this.logger.debug(`Publishing integration ${integration.name} to ${handlers.length} handlers`);
        await Promise.all(handlers.map(h => h.handle(integration.data)));
        
        // Also emit through event emitter for websocket notifications
        this.eventEmitter.emit(integration.name, integration.data);
    }

    public subscribe<TData>(topic: string, handler: (data: TData) => Promise<void>): void {
        this.eventEmitter.on(topic, handler);
        this.logger.debug(`BaseEventBus subscribed to topic: ${topic}`);
    }

    public unsubscribe<TData = any>(topic: ClassType<TData>): void {
        this.eventEmitter.removeAllListeners((topic as any).name);
        this.logger.debug(`BaseEventBus unsubscribed from topic: ${(topic as any).name}`);
    }
}
