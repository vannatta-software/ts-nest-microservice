// import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// import { Integration } from '@contracts/index';
// import { EventBus } from './event.bus';
// import { HandlerRegistry } from './handler.registry';
// import { EventEmitter2 } from '@nestjs/event-emitter';
// import { Redis } from 'ioredis';

// @Injectable()
// export class RedisEventBus extends EventBus implements OnModuleInit, OnModuleDestroy {
//     private readonly redis: Redis;
//     private readonly subscriber: Redis;

//     constructor(
//         private readonly registry: HandlerRegistry,
//         private readonly eventEmitter: EventEmitter2
//     ) {
//         super('Redis Bus');
//         this.redis = new Redis(process.env.REDIS_URL);
//         this.subscriber = new Redis(process.env.REDIS_URL);
//     }

//     async onModuleInit() {
//         const handlers = this.registry.getIntegrationHandlerNames();
        
//         for (const topic of handlers) {
//             await this.subscriber.subscribe(topic);
//         }

//         this.subscriber.on('message', async (topic, message) => {
//             try {
//                 const integration = JSON.parse(message);
//                 await this.handleConsumedEvent(topic, integration);
//             } catch (error) {
//                 this.logger.error(`Failed to process message: ${error}`);
//             }
//         });
//     }

//     protected async handleEvent(integration: Integration<any>): Promise<void> {
//         await this.redis.publish(
//             integration.name, 
//             JSON.stringify(integration)
//         );
//         this.eventEmitter.emit(integration.name, integration.data);
//     }

//     private async handleConsumedEvent(topic: string, integration: Integration) {
//         const handlers = this.registry.getIntegrationHandlers(topic);
//         await Promise.all(handlers.map(h => h.handle(integration.data)));
//     }

//     async onModuleDestroy() {
//         await this.redis.quit();
//         await this.subscriber.quit();
//     }
// } 