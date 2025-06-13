import { Integration, Symbols } from './CqrsTypes';
import { ClassType } from '@vannatta-software/ts-utils-core';

export interface IEventBus {
    publish(event: Integration, topic?: string): Promise<void>;
    subscribe<TData>(topic: string, handler: (data: TData) => Promise<void>, eventType?: ClassType<TData>): void;
}

export const EventBus = Symbols.EventBus;
