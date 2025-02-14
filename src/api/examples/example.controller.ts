import {
    Body, Controller, Delete,
    Get, NotFoundException, Param, Post,
    Put, Query
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import * as Contracts from '@contracts/index';
import { Example } from '@domain/Example';
import { CommandModel, QueryModel } from '@infrastructure/swagger/swagger.utils';
import { Mediator } from '@infrastructure/cqrs/mediator.service';

@Controller('examples')
export class ExampleController {
    constructor(private readonly mediator: Mediator) {}

    @ApiOperation({ summary: 'Create a new example' })
    @CommandModel(Contracts.CreateExampleCommand)
    @Post()
    async createExample(@Body() command): Promise<Example> {
        return await this.mediator.sendCommand(command, Contracts.CreateExampleCommand);
    }

    @ApiOperation({ summary: 'Update an existing example' })
    @CommandModel(Contracts.UpdateExampleCommand)
    @Put()
    async updateExample(@Body() command): Promise<Example> {
        return await this.mediator.sendCommand(command, Contracts.UpdateExampleCommand);
    }

    @ApiOperation({ summary: 'Delete an existing example' })
    @Delete(':id')
    async deleteExample(@Param('id') id: string): Promise<void> {
        await this.mediator.sendCommand({ id }, Contracts.DeleteExampleCommand);
    }

    @ApiOperation({ summary: 'Get example by ID' })
    @Get(':id')
    async getExampleById(@Param('id') id: string): Promise<Example> {
        return await this.mediator.sendQuery({ id }, Contracts.GetExampleByIdQuery);
    }

    @ApiOperation({ summary: 'Search for examples' })
    @QueryModel(new Contracts.GetAllExamplesQuery())
    @Get('')
    async searchExamples(@Query() query): Promise<Example[]> {
        return await this.mediator.sendQuery(query, Contracts.GetAllExamplesQuery);
    }
}
