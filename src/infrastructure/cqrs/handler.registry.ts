import { Inject, Injectable, Type } from '@nestjs/common';
import { ClassType } from '@vannatta-software/ts-utils-core';
import { Command, ICommandHandler, IEventHandler, IIntegrationHandler, IQueryHandler, Query } from '@vannatta-software/ts-utils-domain';

// Decorator metadata keys
export const COMMAND_HANDLER_METADATA = 'COMMAND_HANDLER_METADATA';
export const QUERY_HANDLER_METADATA = 'QUERY_HANDLER_METADATA';
export const EVENT_HANDLER_METADATA = 'EVENT_HANDLER_METADATA';

export function CommandHandler<TCommand extends Command<TResult>, TResult>(
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

export function QueryHandler<TQuery extends Query<TResult>, TResult>(
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
    private commandHandlers = new Map<string, ICommandHandler<Command<any>>>();
    private queryHandlers = new Map<string, IQueryHandler<Query<any>>>();
    private eventHandlers = new Map<string, IEventHandler<any>[]>();
    private integrationHandlers = new Map<string, IIntegrationHandler<any>[]>();

    registerIntegration(event: string, handler: IIntegrationHandler<any>) {
        const handlers = this.getIntegrationHandlers(event);
        handlers.push(handler);
        this.integrationHandlers.set(event, handlers);
    }

    registerCommandHandler<TCommand extends Command<TResult>, TResult>(
        command: Type<TCommand>, 
        handler: ICommandHandler<TCommand>
    ) {
        this.commandHandlers.set(command.name, handler);
    }

    registerQueryHandler<TQuery extends Query<TResult>, TResult>(
        query: Type<TQuery>, 
        handler: IQueryHandler<TQuery>
    ) {
        this.queryHandlers.set(query.name, handler);
    }

    registerEventHandler(event: Type<any>, handler: IEventHandler<any>) {
        const handlers = this.eventHandlers.get(event.name) || [];
        handlers.push(handler);
        this.eventHandlers.set(event.name, handlers);
    }

    getCommandHandler<TCommand extends Command<TResult>, TResult>(
        commandName: string
    ): ICommandHandler<TCommand> | undefined {
        return this.commandHandlers.get(commandName);
    }

    getQueryHandler<TQuery extends Query<TResult>, TResult>(
        queryName: string
    ): IQueryHandler<TQuery> | undefined {
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