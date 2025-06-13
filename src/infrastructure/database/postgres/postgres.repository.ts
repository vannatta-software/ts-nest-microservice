import { Injectable, Logger } from '@nestjs/common';
import { Entity } from '@vannatta-software/ts-utils-domain';
import { DataSource, Repository, ObjectLiteral } from 'typeorm';
import { Mediator } from '../../cqrs/mediator.service';
import { PostgresSchema } from './postgres.schema';

@Injectable()
export class PostgresRepository<T extends Entity> {
    protected readonly logger: Logger;
    private typeOrmRepository: Repository<ObjectLiteral>;
    private hydrate: (document: any) => T = () => {
        return {} as T;
    };

    constructor(
        private readonly mediator: Mediator,
        private readonly dataSource: DataSource,
        private readonly entityClass: new (...args: any[]) => T,
    ) {
        this.logger = new Logger(`PostgresRepository<${entityClass.name}>`);
        const typeOrmEntity = PostgresSchema.getTypeOrmEntity(entityClass);
        this.typeOrmRepository = this.dataSource.getRepository(typeOrmEntity);
    }

    public onHydrate(hydrate: (document: any) => T) {
        this.hydrate = hydrate;
    }

    async findAll(): Promise<T[]> {
        const docs = await this.typeOrmRepository.find();
        return docs.map(doc => this.hydrate(doc));
    }

    async findById(id: string): Promise<T | null> {
        const doc = await this.typeOrmRepository.findOneBy({ id });
        return doc ? this.hydrate(doc) : null;
    }

    async insert(entity: T): Promise<void> {
        entity.create();
        await this.typeOrmRepository.save(entity.document);
        this.mediator.publishEvents(entity);
    }

    async update(entity: T): Promise<void> {
        await this.typeOrmRepository.save(entity.document);
        this.mediator.publishEvents(entity);
    }

    async delete(entity: T): Promise<void> {
        await this.typeOrmRepository.delete(entity.id.value);
        entity.delete();
        this.mediator.publishEvents(entity);
    }
}
