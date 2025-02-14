import { Injectable } from '@nestjs/common';
import { Events } from '@domain/index';
import { IEventHandler } from '@contracts/index';
import { NotificationService } from 'src/infrastructure/websockets/notification.service';
import { EventHandler } from 'src/infrastructure/cqrs/handler.registry';

// ExampleCreatedEvent

@EventHandler(Events.ExampleCreatedEvent)
export class ExampleCreatedHandler implements IEventHandler<Events.ExampleCreatedEvent> {
    constructor(private readonly notifications: NotificationService) {}

    async handle(event: Events.ExampleCreatedEvent) {
        this.notifications.notify(event);
    }
}

@EventHandler(Events.ExampleDeletedEvent)
export class ExampleDeletedHandler implements IEventHandler<Events.ExampleDeletedEvent> {
    constructor(
        private readonly notifications: NotificationService,
    ) {}

    async handle(event: Events.ExampleDeletedEvent) {
        this.notifications.notify(event);
    }
}

@EventHandler(Events.ExampleMetadataUpdatedEvent)
@Injectable()
export class ExampleMetadataUpdatedHandler implements IEventHandler<Events.ExampleMetadataUpdatedEvent> {
    constructor(
        private readonly notifications: NotificationService,
    ) {}

    async handle(event: Events.ExampleMetadataUpdatedEvent) {
        this.notifications.notify(event);
    }
}