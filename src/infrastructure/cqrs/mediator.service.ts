import { Injectable, Logger, Type } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HandlerRegistry } from './handler.registry';
import { Entity, IDomainEvent, Model } from '@vannatta-software/ts-domain';
import Validator from '@vannatta-software/ts-core/dist/Validator';
import { Command, DTO, Query } from '@contracts/index';
import { ApiException } from '../filters/exception.filter';

@Injectable()
export class Mediator {
    private logger: Logger = new Logger("Mediator");

    constructor(
        private readonly registry: HandlerRegistry,
        private readonly eventEmitter: EventEmitter2
    ) {}
    
    private validate(model: Model): void {
        const validation = model.validation;
        if (!validation) return;

        const modelErrors: { [key: string]: string[] } = {};
        const validator = new Validator();

        Object.entries(validation).forEach(([field, rules]) => {
            try {
                const value = model[field];
                const validationRules = rules.reduce((acc, rule) => ({
                    ...acc,
                    ...(rule.required && { required: true }),
                    ...((rule.pattern && (rule.required || value)) && { format: rule.pattern }),
                    ...(rule.min && { min: rule.min }),
                    ...(rule.max && { max: rule.max }),
                    ...(rule.type === 'email' && { email: true }),
                    ...(rule.type === 'url' && { url: true }),
                    ...(rule.enum && { oneOf: rule.enum }),
                }), {});
    
                validator.validate(value, validationRules);

                if (validator.errors.length > 0) {
                    modelErrors[field] = validator.errors;
                }
            } catch (error) {
                modelErrors[field] = error.toString();
            }
        });

        if (Object.keys(modelErrors).length > 0) {
            throw new ApiException('Validation failed', modelErrors);
        }
    }

    async sendCommand<T extends Command<any>>(
        data: DTO<T>,
        type: Type<T>
    ): Promise<T extends Command<infer R> ? R : never> {
        const command = new type();
        Object.assign(command, data);

        this.validate(command);

        const handler = this.registry.getCommandHandler(command.constructor.name);
        if (!handler) {
            throw new ApiException(`No handler found for command ${command.constructor.name}`);
        }
        
        this.logger.debug(`Executing command ${command.constructor.name}`);

        return handler.handle(command) as T extends Command<infer R> ? R : never;
    }

    async sendQuery<T extends Query<any>>(
        data: DTO<T>,
        type: Type<T>
    ): Promise<T extends Query<infer R> ? R : never> {
        const query = new type();
        Object.assign(query, data);

        this.validate(query);

        const handler = this.registry.getQueryHandler(query.constructor.name);
        if (!handler) {
            throw new ApiException(`No handler found for query ${query.constructor.name}`);
        }

        this.logger.debug(`Executing query ${query.constructor.name}`);

        return handler.handle(query) as T extends Query<infer R> ? R : never;
    }

    async publishEvent(event: IDomainEvent): Promise<void> {
        const handlers = this.registry.getEventHandlers(event.constructor.name);
        
        this.logger.debug(`Publishing event ${event.constructor.name} to ${handlers.length} handlers`);
        await Promise.all(handlers.map(h => h.handle(event)));
        
        // Also emit through event emitter for websocket notifications
        this.eventEmitter.emit(event.constructor.name, event);
    }

    async publishEvents(entity: Entity) {
        const promises: Promise<void>[] = [];

        entity.domainEvents.forEach(event => {
            promises.push(this.publishEvent(event));
        });
        
        entity.clearDomainEvents();
        await Promise.all(promises);
    }
} 