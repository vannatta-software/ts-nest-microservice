// import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// import { Integration } from '@contracts/index';
// import { EventBus } from './event.bus';
// import { HandlerRegistry } from './handler.registry';
// import { EventEmitter2 } from '@nestjs/event-emitter';
// import { connect, Connection, Channel } from 'amqplib';

// @Injectable()
// export class RabbitMQEventBus extends EventBus implements OnModuleInit, OnModuleDestroy {
//     private connection: Connection;
//     private channel: Channel;

//     constructor(
//         private readonly registry: HandlerRegistry,
//         private readonly eventEmitter: EventEmitter2
//     ) {
//         super('RabbitMQ Bus');
//     }

//     async onModuleInit() {
//         this.connection = await connect(process.env.RABBITMQ_URL);
//         this.channel = await this.connection.createChannel();
        
//         const handlers = this.registry.getIntegrationHandlerNames();
        
//         for (const topic of handlers) {
//             await this.channel.assertQueue(topic);
//             await this.channel.consume(topic, async (msg) => {
//                 if (!msg) return;
                
//                 try {
//                     const integration = JSON.parse(msg.content.toString());
//                     await this.handleConsumedEvent(topic, integration);
//                     this.channel.ack(msg);
//                 } catch (error) {
//                     this.logger.error(`Failed to process message: ${error}`);
//                     this.channel.nack(msg);
//                 }
//             });
//         }
//     }

//     protected async handleEvent(integration: Integration<any>): Promise<void> {
//         await this.channel.sendToQueue(
//             integration.name,
//             Buffer.from(JSON.stringify(integration))
//         );
//         this.eventEmitter.emit(integration.name, integration.data);
//     }

//     private async handleConsumedEvent(topic: string, integration: Integration) {
//         const handlers = this.registry.getIntegrationHandlers(topic);
//         await Promise.all(handlers.map(h => h.handle(integration.data)));
//     }

//     async onModuleDestroy() {
//         await this.channel?.close();
//         await this.connection?.close();
//     }
// } 