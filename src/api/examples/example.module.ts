import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { ExampleController } from './example.controller';
import * as Commands from "./example.commands";
import * as Events from "./example.events";
import * as Queries from "./example.queries";

@Module({
    imports: [ InfrastructureModule ],
    controllers: [ExampleController],
    providers: [
        ...Object.values(Commands),
        ...Object.values(Queries),
        ...Object.values(Events),
    ]
})
export class ExampleModule {}