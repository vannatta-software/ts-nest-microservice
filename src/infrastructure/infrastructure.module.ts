import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { BaseEventBus, EventBus } from './cqrs/event.bus';
import { HandlerRegistry } from './cqrs/handler.registry';
import { Mediator } from './cqrs/mediator.service';
import { DatabaseContext } from './database/database.context';
import { NotificationGateway } from './websockets/notification.gateway';
import { NotificationService } from './websockets/notification.service';
import { Example } from '@domain/Example';
import { Mongo } from './database/mongo.schema';
import { AllExceptionsFilter, ApiException, NotFoundException } from './filters/exception.filter';

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGO_CONNECTION, {
          user: process.env.MONGO_INITDB_ROOT_USERNAME,
          pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
          dbName: process.env.MONGO_INITDB_DATABASE,
        }),
        MongooseModule.forFeature([
            { name: Example.name, schema: Mongo.Schema(Example) },
        ]),
        EventEmitterModule.forRoot()
    ],
    providers: [
        DatabaseContext,
        Mediator,
        HandlerRegistry,
        NotificationService,
        NotificationGateway,
        AllExceptionsFilter.Provider,
        EventBus.Provider(BaseEventBus)
    ],
    exports: [
        MongooseModule,
        DatabaseContext,
        Mediator,
        HandlerRegistry,
        NotificationService,
        EventBus.Name
    ]
})
export class InfrastructureModule {} 