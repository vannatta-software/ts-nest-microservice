import { Injectable, OnModuleInit } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { IWebSocket } from '@connect-the-dots/chat-contracts';
import { ClassType, StringUtils } from '@vannatta-software/ts-core';

@Injectable()
export class SocketClient implements IWebSocket, OnModuleInit {
    private socket: Socket;
    
    constructor(private serviceAddress) {
        this.socket = io(serviceAddress, {
            transports: ['websocket'],
            autoConnect: false
        });
    }

    get address() {
        return this.serviceAddress;
    }

    get connected() {
        return this.socket.connected;
    }

    async onModuleInit() {
        await this.connect();
    }

    private async connect() {
        return new Promise<void>((resolve) => {
            this.socket.connect();
            this.socket.on('connect', () => resolve());
        });
    }

    on<T>(event: ClassType<T>, callback: (data: T) => void): void {
        const topic = typeof event == "string" ? event : new event().constructor.name
        this.socket.on(topic, callback);
    }

    off<T>(event: ClassType<T>): void {
        const topic = typeof event == "string" ? event : new event().constructor.name
        this.socket.off(topic);
    }

    retry(): void {
        this.socket.connect();
    }
}