import { Integration, Symbols } from './CqrsTypes';

export interface IEventBus {
    publish(event: Integration): Promise<void>;
}

export const EventBus = Symbols.EventBus;