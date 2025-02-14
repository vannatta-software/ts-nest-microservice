import { Server } from 'socket.io';
import { Global, Injectable, Logger } from '@nestjs/common';
import { Socket } from "socket.io";
import { IDomainEvent } from '@vannatta-software/ts-domain';

export class ClientMap {
    public users: Record<string, Socket[]>;
    public applications: Record<string, Socket>;
    public sockets: Record<string, Socket>;

    constructor( ) {
        this.sockets = {}
        this.applications = {}
        this.users = {}
    }

    public connect(socket: Socket) {
        this.sockets[socket.id ?? ""] = socket;
    }

    public disconnect(socket: Socket) {
        try {
            delete this.sockets[socket.id ?? ""];

            Object.keys(this.applications).forEach(app => {
                if (this.applications[app].id == socket.id)
                    delete this.applications[app]
            })
            
            Object.keys(this.users).forEach(user => {
                this.users[user] = this.users[user].filter(s => s.id != socket.id)
            })
        } catch {
        }
    }

    public remember(socket: Socket, app: string) {
        this.applications[app] = socket;
    }   

    public forget(app: string) {
        delete this.applications[app];
    }

    public login(socket: Socket, userId: string) {  
        this.users[userId] = this.users[userId]?.filter(s => s.id != socket.id);
        this.getSockets(userId).push(socket);
    }   

    public logout(userId: string) {
        delete this.users[userId];
    }

    public all() {
        return Object.values(this.sockets)
    }

    public getSocket(appId: string) {
        try {
            return this.applications[appId]
        } catch {
            return undefined;
        }
    }

    public getSockets(userId: string): Socket[] {
        try {
            if (!this.users[userId])
                this.users[userId] = [];
                
            return this.users[userId]
        } catch {
            return [];
        }
    }

    public toString(): string {
        let result = 'WebSockets:\n';

        result += `Sockets: ${Object.keys(this.sockets).length} \n`;
        Object.keys(this.sockets).forEach((socket) => {
            result += `  ${socket}\n`;
        });

        result += `Applications: ${Object.keys(this.applications).length} \n`;
        Object.keys(this.applications).forEach((app) => {
            result += `  ${app}: ${this.applications[app].id}\n`;
        });

        result += `Users: ${Object.keys(this.users).length} \n`;
        Object.keys(this.users).forEach((user) => {
            result += `  ${user}: [${this.users[user].map(s => s.id).join(', ')}]\n`;
        });

        return result;
    }
}

type EventMapper<T> = {
    [K in keyof T]?: string | boolean;
}

@Global()
@Injectable()
export class NotificationService  {
    private logger: Logger = new Logger("NotificationService");

    private static _server: Server;
    public static _clients: ClientMap = new ClientMap();
    
    constructor() {}

    public get clients(): ClientMap {
        return NotificationService._clients;
    }

    public get server(): Server {
        return NotificationService._server;
    }

    public initialize(server: Server) {
        NotificationService._server = NotificationService._server ?? server;
        this.logger.log("initialized");
    }

    public notify<T extends IDomainEvent>(
        event: T, 
        mapping?: EventMapper<T>
    ) {
        const topic = event.constructor.name;
        const payload = mapping ? this.mapEvent(event, mapping) : event;

        this.clients.all().forEach(client => 
            client.emit(topic, payload)
        );

        this.logger.debug(`Domain event notification sent: ${topic}`);
    }

    private mapEvent<T extends IDomainEvent>(
        event: T, 
        mapping: EventMapper<T>
    ): Partial<T> {
        const result: Partial<T> = {};

        Object.entries(mapping).forEach(([key, value]) => {
            if (value === true) {
                // Keep original field name and value
                result[key as keyof T] = event[key as keyof T];
            } else if (typeof value === 'string') {
                // Map to new field name
                result[value as keyof T] = event[key as keyof T];
            }
        });

        return result;
    }

    public notifyUser(userId: string, event: string, body: any) {
        const sockets = this.clients.getSockets(userId);

        sockets.forEach(socket => socket.emit(event, body));
    }

    public notifyApp(appID: string, event: string, body: any) {
        const socket = this.clients.getSocket(appID);

        socket.emit(event, body);
    }
}