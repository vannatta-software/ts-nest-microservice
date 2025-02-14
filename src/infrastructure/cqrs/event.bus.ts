import { IEventBus } from '@contracts/helpers/EventBus';
import { Integration, Symbols } from '@contracts/index';
import { ClassProvider, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HandlerRegistry } from './handler.registry';

export abstract class EventBus implements IEventBus {
    protected readonly logger: Logger;
    private processedEvents = new Set<string>();
    private readonly TTL = 3600 * 1000; // 1 hour in milliseconds

    constructor(name?: string) {
        this.logger = new Logger(name ?? "EventBus");
        // Cleanup old events periodically
        setInterval(() => this.cleanupOldEvents(), this.TTL);
    }

    async publish(integration: Integration<any>): Promise<void> {
        const key = this.generateKey(integration);
        
        if (this.processedEvents.has(key)) {
            this.logger.debug(`Skipping duplicate event ${key}`);
            return;
        }

        try {
            await this.handleEvent(integration);
            this.processedEvents.add(key);
        } catch (error) {
            this.logger.error(`Failed to handle event ${key}:`, error);
            throw error;
        }
    }

    protected abstract handleEvent(integration: Integration<any>): Promise<void>;
    
    protected generateKey(integration: Integration): string {
        return `${integration.name}:${integration.eventId}`;
    }

    private cleanupOldEvents() {
        this.processedEvents.clear();
        this.logger.debug('Cleared processed events cache');
    }

    public static Provider(Bus: any): ClassProvider {
        return {
            provide: EventBus.Name,
            useClass: Bus
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
}