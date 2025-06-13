import { IEventBus } from './EventBus';
import { Integration } from './CqrsTypes';
import { io, Socket } from 'socket.io-client';
import { ClassType } from '@vannatta-software/ts-utils-core';

export class SocketIOEventBus implements IEventBus {
    private socket: Socket;
    private handlers: Map<string, ((data: any) => Promise<void>)[]> = new Map();

    constructor(url: string) {
        this.socket = io(url);

        this.socket.on('connect', () => {
            console.log('Socket.IO Event Bus connected.');
        });

        this.socket.on('disconnect', () => {
            console.log('Socket.IO Event Bus disconnected.');
        });

        this.socket.on('error', (error: any) => {
            console.error('Socket.IO Event Bus error:', error);
        });

        // Generic listener for all events from the server
        this.socket.onAny((eventName: string, data: any) => {
            const eventHandlers = this.handlers.get(eventName);
            if (eventHandlers) {
                eventHandlers.forEach(handler => {
                    try {
                        handler(data);
                    } catch (error) {
                        console.error(`Error handling Socket.IO event ${eventName}:`, error);
                    }
                });
            }
        });
    }

    async publish(event: Integration, topic?: string): Promise<void> {
        const eventName = topic || event.name;
        this.socket.emit(eventName, event.data);
        console.log(`Published event "${eventName}" via Socket.IO.`);
    }

    subscribe<TData>(topic: string, handler: (data: TData) => Promise<void>, eventType?: ClassType<TData>): void {
        if (!this.handlers.has(topic)) {
            this.handlers.set(topic, []);
        }
        this.handlers.get(topic)?.push(handler);
        console.log(`Subscribed to topic "${topic}" via Socket.IO.`);
    }

    // Optional: Method to disconnect the socket
    disconnect(): void {
        this.socket.disconnect();
        console.log('Socket.IO Event Bus disconnected manually.');
    }
}
