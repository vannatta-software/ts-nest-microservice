import { Example } from '@domain/Example';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { EventBus, EventBusType } from './cqrs/event.bus';
import { HandlerRegistry } from './cqrs/handler.registry';
import { Mediator } from './cqrs/mediator.service';
import { DatabaseContext } from './database/database.context';
import { Mongo } from './database/mongo/mongo.schema';
import { AllExceptionsFilter } from './filters/exception.filter';
import { NotificationGateway } from './websockets/notification.gateway';
import { NotificationService } from './websockets/notification.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
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
        EventBus.Provider(EventBusType.RabbitMQ),
    ],
    exports: [
        MongooseModule,
        DatabaseContext,
        Mediator,
        HandlerRegistry,
        NotificationService,
        EventBus.Name,
    ]
})
export class InfrastructureModule {}
