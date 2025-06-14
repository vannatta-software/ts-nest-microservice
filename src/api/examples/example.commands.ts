import { Inject } from '@nestjs/common';
import * as Contracts from '@ts-nest-microservice/contracts/index';
import { Example } from '@ts-nest-microservice/domain/Example';
import { CommandHandler } from '@infrastructure/cqrs/handler.registry';
import { DatabaseContext } from '@infrastructure/database/database.context';
import { NotFoundException } from '@infrastructure/filters/exception.filter';
import { ExampleType } from '@ts-nest-microservice/domain/ExampleType';
import { ICommandHandler, UniqueIdentifier } from '@vannatta-software/ts-utils-domain';
import { ExampleMetadata } from '@ts-nest-microservice/domain/ExampleMetadata';
import { EventBus } from '@infrastructure/cqrs/event.bus';
import { IEventBus } from '@vannatta-software/ts-utils-domain';

@CommandHandler(Contracts.CreateExampleCommand)
export class CreateExampleHandler implements ICommandHandler<Contracts.CreateExampleCommand> {
    constructor(
        private readonly db: DatabaseContext,
        @Inject(EventBus) private readonly bus: IEventBus
    ) {}

    async handle(command: Contracts.CreateExampleCommand): Promise<Example> {
        const example = new Example({
            name: new UniqueIdentifier({value: command.name}),
            metadata: new ExampleMetadata({
                description: command.description,
                version: command.version
            }),
            type: new ExampleType().fromName(command.type)
        });

        example.create();
        await this.db.examples.insert(example);
        return example;
    }
}

@CommandHandler(Contracts.UpdateExampleCommand)
export class UpdateExampleHandler implements ICommandHandler<Contracts.UpdateExampleCommand> {
    constructor(private readonly db: DatabaseContext) {}

    async handle(command: Contracts.UpdateExampleCommand): Promise<Example> {
        const example = await this.db.examples.findById(command.id);
        if (!example) throw new NotFoundException(`Example ${command.id} not found`);

        if (command.metadata) {
            example.changeMetadata(command.metadata);
        }

        if (command.type !== undefined) {
            example.changeType(new ExampleType({ id: command.type }));
        }

        await this.db.examples.update(example);
        return example;
    }
}

@CommandHandler(Contracts.DeleteExampleCommand)
export class DeleteExampleHandler implements ICommandHandler<Contracts.DeleteExampleCommand> {
    constructor(private readonly db: DatabaseContext) {}

    async handle(command: Contracts.DeleteExampleCommand): Promise<boolean> {
        const example = await this.db.examples.findById(command.id);
        if (!example) throw new NotFoundException(`Example ${command.id} not found`);

        example.delete();
        await this.db.examples.delete(example);
        return true;
    }
}
