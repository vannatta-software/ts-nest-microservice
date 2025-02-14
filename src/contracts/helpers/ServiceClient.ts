import { ClassType, StringUtils } from "@vannatta-software/ts-core";
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
    connect(socket: IWebSocket, eventBus?: IEventBus) 
    disconnect() 
    bindCache(type: string, handler: CacheCallback<T>)
    unbindCache(type: string)
}

export abstract class ServiceClient<T> implements IServiceClient<T> {
    protected socket?: IWebSocket;
    protected http: IHttpClient;
    protected eventBus?: IEventBus;
    private notifications: Map<string, ClassType<any>>;
    private cacheUpdates: Record<string, CacheCallback<T>>;x

    constructor(httpClient: IHttpClient, eventBus?: IEventBus) {
        this.http = httpClient;
        this.eventBus = eventBus;
        this.notifications = new Map<string, ClassType<any>>();
        this.cacheUpdates = {};
    }

    public get hasCache() {
        return Object.keys(this.cacheUpdates).length >0;
    }

    public bindEventBus(eventBus: IEventBus) {
        this.eventBus = eventBus;
    }

    protected publishEvent<TData>(
        event: TData, 
        type: ClassType<TData>
    ): Promise<void> {
        return this.eventBus?.publish(new Integration(event, type));
    }

    protected async setCacheAsync(action: CacheAction, callback: () => Promise<T>) {
        if (!this.hasCache) 
            return;
        const cacheUpdate = await callback();
        Object.values(this.cacheUpdates).forEach(update => update(action, cacheUpdate))
    }

    protected setCache: CacheCallback<T> = (action, cache) => {
        if (!this.hasCache)
            return;

        Object.values(this.cacheUpdates).forEach(update => update(action, cache))
    }

    public get connected() {
        return this.socket?.connected
    }

    public connect(socket: IWebSocket, eventBus?: IEventBus) {
        this.socket = socket;
        this.eventBus = eventBus;
        this.onConnect();
    }

    public disconnect()  {
        for (const notification of this.notifications) {
            this.socket?.off(notification[1]);
        }
        
        this.eventBus = undefined;
        this.socket = undefined;
    }

    public unbindCache(type: string) {
        delete this.cacheUpdates[type]
    }

    public bindCache(type: string, callback: CacheCallback<T>) {
        this.cacheUpdates[type] = callback;
    }

    public abstract onConnect();

    protected bindSocket<T>(e: ClassType<T>, response: (data: T) => void) {
        this.socket?.on(e, response);

        if (this.socket)
            this.notifications.set(StringUtils.className(e), e);
    }
}