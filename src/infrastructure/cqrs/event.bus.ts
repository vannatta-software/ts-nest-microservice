import { IEventBus } from '@contracts/helpers/EventBus';
import { Integration, Symbols } from '@contracts/index';
import { ClassType } from '@vannatta-software/ts-utils-core'; // Import ClassType
import { ClassProvider, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HandlerRegistry } from './handler.registry';
import { RabbitMQEventBus } from './buses/rabbitmq.bus'; // Import RabbitMQEventBus
import { GooglePubSubEventBus } from './buses/google-pubsub.bus'; // Import GooglePubSubEventBus
import { RedisEventBus } from './buses/redis.bus'; // Import RedisEventBus

export enum EventBusType {
    RabbitMQ = 'rabbitmq',
    GooglePubSub = 'google-pubsub',
    Redis = 'redis',
    Base = 'base' // Default base event bus
}

export abstract class EventBus implements IEventBus {
    protected readonly logger: Logger;
    private processedEvents = new Set<string>();
    private readonly TTL = 3600 * 1000; // 1 hour in milliseconds

    constructor(name?: string) {
        this.logger = new Logger(name ?? "EventBus");
        // Cleanup old events periodically
        setInterval(() => this.cleanupOldEvents(), this.TTL);
    }

    async publish(integration: Integration<any>, topic?: string): Promise<void> {
        const key = this.generateKey(integration);
        
        if (this.processedEvents.has(key)) {
            this.logger.debug(`Skipping duplicate event ${key}`);
            return;
        }

        try {
            await this.handleEvent(integration, topic); // Pass topic to handleEvent
            this.processedEvents.add(key);
        } catch (error) {
            this.logger.error(`Failed to handle event ${key}:`, error);
            throw error;
        }
    }

    // New abstract method for subscribing
    public abstract subscribe<TData>(topic: string, handler: (data: TData) => Promise<void>, eventType?: ClassType<TData>): void;

    protected abstract handleEvent(integration: Integration<any>, topic?: string): Promise<void>; // Update signature
    
    protected generateKey(integration: Integration): string {
        return `${integration.name}:${integration.eventId}`;
    }

    private cleanupOldEvents() {
        this.processedEvents.clear();
        this.logger.debug('Cleared processed events cache');
    }

    public static Provider(busType: EventBusType): ClassProvider {
        let useClass: any;
        switch (busType) {
            case 'rabbitmq':
                useClass = RabbitMQEventBus;
                break;
            case 'google-pubsub':
                useClass = GooglePubSubEventBus;
                break;
            case 'redis':
                useClass = RedisEventBus;
                break;
            case 'base':
            default:
                useClass = BaseEventBus;
                break;
        }

        return {
            provide: EventBus.Name,
            useClass: useClass
        }
    }

    public static get Name() {
        return Symbols.EventBus
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

    public subscribe<TData>(topic: string, handler: (data: TData) => Promise<void>, eventType?: ClassType<TData>): void {
        // For BaseEventBus, subscription is handled by the HandlerRegistry for internal events
        // and EventEmitter2 for local (e.g., WebSocket) events.
        // The HandlerRegistry already registers handlers based on event name.
        // For EventEmitter2, we can directly listen to the topic.
        this.eventEmitter.on(topic, handler);
        this.logger.debug(`BaseEventBus subscribed to topic: ${topic}`);
    }
}
