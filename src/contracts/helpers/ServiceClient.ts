import { ClassType, StringUtils } from "@vannatta-software/ts-utils-core";
import { Integration } from "./CqrsTypes";
import { IEventBus } from "./EventBus";
import { IHttpClient } from './HttpClient';

export interface IWebSocket {    
    address: string;
    connected: boolean;
    on<T = any>(e: ClassType<T>, response: (data: T) => void): void;
    off<T = any>(e: ClassType<T>): void;
    retry(): void;
}

export type Cache = { deletions?: string[] }

type CacheAction = "CREATE" | "UPDATE" | "DELETE"

type CacheCallback<T> = (action: CacheAction, cache: T) => void

export interface IServiceClient<T> {
    connect(socket: IWebSocket): void; // Removed eventBus from connect
    disconnect(): void;
    bindCache(type: string, handler: CacheCallback<T>): void;
    unbindCache(type: string): void;
}

export abstract class ServiceClient<T> implements IServiceClient<T> {
    protected socket?: IWebSocket;
    protected http: IHttpClient;
    protected eventBus?: IEventBus; // Now optional

    private notifications: Map<string, ClassType<any>>;
    private cacheUpdates: Record<string, CacheCallback<T>>;

    constructor(httpClient: IHttpClient, eventBus?: IEventBus) { // eventBus is now optional
        this.http = httpClient;
        this.eventBus = eventBus;
        this.notifications = new Map<string, ClassType<any>>();
        this.cacheUpdates = {};
    }

    public setEventBus(eventBus: IEventBus): void {
        this.eventBus = eventBus;
    }

    public get hasCache(): boolean {
        return Object.keys(this.cacheUpdates).length > 0;
    }

    protected publishEvent<TData>(
        event: TData, 
        type: ClassType<TData>,
        topic?: string // Added optional topic
    ): Promise<void> {
        return this.eventBus?.publish(new Integration(event, type), topic); // Use optional chaining
    }

    protected async setCacheAsync(action: CacheAction, callback: () => Promise<T>): Promise<void> {
        if (!this.hasCache) 
            return;
        const cacheUpdate = await callback();
        Object.values(this.cacheUpdates).forEach(update => update(action, cacheUpdate));
    }

    protected setCache: CacheCallback<T> = (action, cache) => {
        if (!this.hasCache)
            return;

        Object.values(this.cacheUpdates).forEach(update => update(action, cache));
    }

    public get connected(): boolean {
        return this.socket?.connected ?? false;
    }

    public connect(socket: IWebSocket): void {
        this.socket = socket;
        this.onConnect();
    }

    public disconnect(): void {
        // When disconnecting, we should also unsubscribe from event bus topics
        // For now, we'll rely on the event bus's internal cleanup or specific unsubscribe logic
        // if (this.eventBus?.unsubscribe) {
        //     for (const notification of this.notifications) {
        //         this.eventBus.unsubscribe(notification[0], this.getHandlerForNotification(notification[1]));
        //     }
        // }
        
        this.socket = undefined;
    }

    public unbindCache(type: string): void {
        delete this.cacheUpdates[type];
    }

    public bindCache(type: string, callback: CacheCallback<T>): void {
        this.cacheUpdates[type] = callback;
    }

    public abstract onConnect(): void;

    protected bindSocket<T>(e: ClassType<T>, response: (data: T) => Promise<void>): void {
        const topic = StringUtils.className(e);
        this.eventBus?.subscribe(topic, response, e); // Use optional chaining

        this.notifications.set(topic, e); // Store topic name, not ClassType directly
    }
}
