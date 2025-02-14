import { Inject, Injectable, Type } from '@nestjs/common';
import * as Contracts from '@contracts/helpers/CqrsTypes';
import { ClassType } from '@vannatta-software/ts-core';

export * from '@contracts/helpers/CqrsTypes';

// Decorator metadata keys
export const COMMAND_HANDLER_METADATA = 'COMMAND_HANDLER_METADATA';
export const QUERY_HANDLER_METADATA = 'QUERY_HANDLER_METADATA';
export const EVENT_HANDLER_METADATA = 'EVENT_HANDLER_METADATA';

export function CommandHandler<TCommand extends Contracts.Command<TResult>, TResult>(
    command: Type<TCommand>
): ClassDecorator {
    return function (target: any) {
        Injectable()(target);
        
        const originalOnModuleInit = target.prototype.onModuleInit;
        target.prototype.onModuleInit = async function() {
            if (originalOnModuleInit) {
                await originalOnModuleInit.call(this);
            }
            const registry = this.registry as HandlerRegistry;
            registry.registerCommandHandler(command, this);
        };

        Inject(HandlerRegistry)(target.prototype, 'registry');
    };
}

export function QueryHandler<TQuery extends Contracts.Query<TResult>, TResult>(
    query: Type<TQuery>
): ClassDecorator {
    return function (target: any) {
        Injectable()(target);
        
        const originalOnModuleInit = target.prototype.onModuleInit;
        target.prototype.onModuleInit = async function() {
            if (originalOnModuleInit) {
                await originalOnModuleInit.call(this);
            }
            const registry = this.registry as HandlerRegistry;
            registry.registerQueryHandler(query, this);
        };

        Inject(HandlerRegistry)(target.prototype, 'registry');
    };
}

export function EventHandler(event: any): ClassDecorator {
    return function (target: any) {
        Injectable()(target);
        
        const originalOnModuleInit = target.prototype.onModuleInit;
        target.prototype.onModuleInit = async function() {
            if (originalOnModuleInit) {
                await originalOnModuleInit.call(this);
            }
            const registry = this.registry as HandlerRegistry;
            registry.registerEventHandler(event, this);
        };

        Inject(HandlerRegistry)(target.prototype, 'registry');
    };
}

export function IntegrationHandler(event: ClassType<any>): ClassDecorator {
    return function (target: any) {
        Injectable()(target);
        
        const originalOnModuleInit = target.prototype.onModuleInit;
        target.prototype.onModuleInit = async function() {
            if (originalOnModuleInit) {
                await originalOnModuleInit.call(this);
            }
            const registry = this.registry as HandlerRegistry;
            const name = typeof event == "string" ? event : new event().constructor.name;

            registry.registerIntegration(name, this);
        };

        Inject(HandlerRegistry)(target.prototype, 'registry');
    };
}

@Injectable()
export class HandlerRegistry {
    private commandHandlers = new Map<string, Contracts.ICommandHandler<Contracts.Command<any>>>();
    private queryHandlers = new Map<string, Contracts.IQueryHandler<Contracts.Query<any>>>();
    private eventHandlers = new Map<string, Contracts.IEventHandler<any>[]>();
    private integrationHandlers = new Map<string, Contracts.IIntegrationHandler<any>[]>();

    registerIntegration(event: string, handler: Contracts.IIntegrationHandler<any>) {
        const handlers = this.getIntegrationHandlers(event);
        handlers.push(handler);
        this.integrationHandlers.set(event, handlers);
    }

    registerCommandHandler<TCommand extends Contracts.Command<TResult>, TResult>(
        command: Type<TCommand>, 
        handler: Contracts.ICommandHandler<TCommand>
    ) {
        this.commandHandlers.set(command.name, handler);
    }

    registerQueryHandler<TQuery extends Contracts.Query<TResult>, TResult>(
        query: Type<TQuery>, 
        handler: Contracts.IQueryHandler<TQuery>
    ) {
        this.queryHandlers.set(query.name, handler);
    }

    registerEventHandler(event: Type<any>, handler: Contracts.IEventHandler<any>) {
        const handlers = this.eventHandlers.get(event.name) || [];
        handlers.push(handler);
        this.eventHandlers.set(event.name, handlers);
    }

    getCommandHandler<TCommand extends Contracts.Command<TResult>, TResult>(
        commandName: string
    ): Contracts.ICommandHandler<TCommand> | undefined {
        return this.commandHandlers.get(commandName);
    }

    getQueryHandler<TQuery extends Contracts.Query<TResult>, TResult>(
        queryName: string
    ): Contracts.IQueryHandler<TQuery> | undefined {
        return this.queryHandlers.get(queryName);
    }

    getEventHandlers(eventName: string) {
        return this.eventHandlers.get(eventName) || [];
    }

    getIntegrationHandlers(integration: string) {
        return this.integrationHandlers.get(integration) || [];
    }

    getIntegrationHandlerNames() {
        return Object.keys(this.integrationHandlers);
    }
} 