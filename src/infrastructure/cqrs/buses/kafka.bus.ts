// import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// import { Kafka, Producer, Consumer } from 'kafkajs';
// import { Integration } from '@contracts/index';
// import { EventBus } from './event.bus';
// import { HandlerRegistry } from './handler.registry';
// import { EventEmitter2 } from 'eventemitter2';

// @Injectable()
// export class KafkaEventBus extends EventBus implements OnModuleInit, OnModuleDestroy {
//     private producer: Producer;
//     private consumer: Consumer;
//     private readonly kafka: Kafka;

//     constructor(
//         private readonly registry: HandlerRegistry,
//         private readonly eventEmitter: EventEmitter2
//     ) {
//         super('Kafka Bus');
//         this.kafka = new Kafka({
//             clientId: 'chat-service',
//             brokers: [process.env.KAFKA_BROKER]
//         });
//     }

//     async onModuleInit() {
//         // Setup producer
//         this.producer = this.kafka.producer();
//         await this.producer.connect();

//         // Setup consumer
//         await this.setupConsumer();
//     }

//     private async setupConsumer() {
//         this.consumer = this.kafka.consumer({ 
//             groupId: 'chat-service',
//             retry: { retries: 3 }
//         });
//         await this.consumer.connect();

//         // Get all topics we have handlers for
//         const handlers = this.registry.getIntegrationHandlerNames();
        
//         // Subscribe to each topic
//         for (const topic of handlers) {
//             await this.consumer.subscribe({ topic });
//             this.logger.log(`Subscribed to topic: ${topic}`);
//         }

//         // Start consuming
//         await this.consumer.run({
//             eachMessage: async ({ topic, message }) => {
//                 try {
//                     const integration = JSON.parse(message.value.toString());
//                     await this.handleConsumedEvent(topic, integration);
//                 } catch (error) {
//                     this.logger.error(`Failed to process message: ${error}`);
//                 }
//             }
//         });
//     }

//     protected async handleEvent(integration: Integration<any>): Promise<void> {
//         await this.producer.send({
//             topic: integration.name,
//             messages: [{
//                 key: this.generateKey(integration),
//                 value: JSON.stringify(integration)
//             }]
//         });

//         // Also emit locally for websocket notifications
//         this.eventEmitter.emit(integration.name, integration.data);
//     }

//     private async handleConsumedEvent(topic: string, integration: Integration) {
//         const handlers = this.registry.getIntegrationHandlers(topic);
//         await Promise.all(handlers.map(h => h.handle(integration.data)));
//     }

//     async onModuleDestroy() {
//         await this.producer?.disconnect();
//         await this.consumer?.disconnect();
//     }
// }