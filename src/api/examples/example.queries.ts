import { Example } from '@ts-nest-microservice/domain/Example';
import { DatabaseContext } from '@infrastructure/database/database.context';
import * as Contracts from '@ts-nest-microservice/contracts/index';
import { QueryHandler } from '@infrastructure/cqrs/handler.registry';
import { NotFoundException } from '@infrastructure/filters/exception.filter';
import { IQueryHandler } from '@vannatta-software/ts-utils-domain';

@QueryHandler(Contracts.GetExampleByIdQuery)
export class GetExampleByIdHandler implements IQueryHandler<Contracts.GetExampleByIdQuery> {
    constructor(private readonly db: DatabaseContext) {}

    async handle(query: Contracts.GetExampleByIdQuery): Promise<Example> {
        const example = await this.db.examples.findById(query.id);
        if (!example) throw new NotFoundException(`Example ${query.id} not found`);
        return example;
    }
}

@QueryHandler(Contracts.GetAllExamplesQuery)
export class GetAllExamplesHandler implements IQueryHandler<Contracts.GetAllExamplesQuery> {
    constructor(private readonly db: DatabaseContext) {}

    async handle(query: Contracts.GetAllExamplesQuery): Promise<Example[]> {
        const filter: any = {};
        
        if (query.name) filter.name = new RegExp(query.name, 'i');
        
        return this.db.examples.search(filter);
    }
}
