import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,
  WebSocketGateway,
  WebSocketServer, SubscribeMessage
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ClientMap, NotificationService } from 'src/infrastructure/websockets/notification.service';

@WebSocketGateway({
  cors: { 
    origin: true, // Allow all origins
    methods: ['GET', 'POST'],
    credentials: true
  },
  path: '/api/notifications'
 })
export class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  logger: Logger = new Logger("ChatGateway");
  clients: ClientMap = NotificationService._clients;

  @WebSocketServer()
  server: Server = new Server();

  constructor(private readonly notificationService: NotificationService) {}

  afterInit(_: any) {
    this.logger.log('Initialized');
    this.notificationService.initialize(this.server);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.clients.connect(client);
    client.on("disconnect", () => this.handleDisconnect(client, args));
    this.logger.debug(this.clients.toString());
  }

  handleDisconnect(client: Socket, ...args: any[]) {
    this.clients.disconnect(client);
    this.logger.debug(this.clients.toString());
  }

  @SubscribeMessage('remember')
  async onRemember(client: Socket, app: string) {
    this.clients.remember(client, app);
    this.logger.debug(this.clients.toString());
  }

  @SubscribeMessage('forget')
  async onForget(client: Socket, app: string) {
    this.clients.forget(app);
    this.clients.disconnect(client);
    this.logger.debug(this.clients.toString());
  }

  @SubscribeMessage('login')
  async onLogin(client: Socket, userId: string) {
    this.clients.login(client, userId);
    this.logger.debug(this.clients.toString());
  }

  @SubscribeMessage('logout')
  async onLogout(client: Socket, userId: string) {
    this.clients.logout(userId);
    this.logger.debug(this.clients.toString());
  }
}
