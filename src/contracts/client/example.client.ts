import { Example, Events } from '@ts-nest-microservice/domain';
import { DTO, IEventBus, ServiceClient, Cache } from '@vannatta-software/ts-utils-domain';
import { HttpClient } from '@vannatta-software/ts-utils-core';
import * as Commands from '../Commands';
import * as Queries from '../Queries';

export interface ExampleCache extends Cache {
    examples?: Example[]
}

export class ExampleClient extends ServiceClient<ExampleCache> {
    constructor(url: string, eventBus?: IEventBus) {
        super(new HttpClient({ baseURL: url }), eventBus);
    }

    public onDisconnect() {}

    public onConnect() {
        this.bindEvent(Events.ExampleCreatedEvent, async (event) => {
            await this.setCacheAsync("CREATE", async () => {
                const example = await this.getById({ id: event.exampleId });
                return { examples: [example] };
            });
        });

        this.bindEvent(Events.ExampleMetadataUpdatedEvent, async (event) => {
            await this.setCacheAsync("UPDATE", async () => {
                const example = await this.getById({ id: event.exampleId });
                return { examples: [example] };
            });
        });

        this.bindEvent(Events.ExampleDeletedEvent, async (event) => {
            this.setCache("DELETE", { deletions: [event.exampleId] });
        });
    }

    async create(command: DTO<Commands.CreateExampleCommand>): Promise<Example> {
        return this.http.post<Example>('/examples')
            .execute(command)
            .then(response => new Example(response))
            .then(example => {
                this.setCache("CREATE", { examples: [example] });
                return example;
            });
    }

    async update(command: DTO<Commands.UpdateExampleCommand>): Promise<Example> {
        return this.http.put<Example>('/examples')
            .execute(command)
            .then(response => new Example(response))
            .then(example => {
                this.setCache("UPDATE", { examples: [example] });
                return example;
            });
    }

    async delete(id: string): Promise<void> {
        return this.http.delete<void>('/examples/{id}')
            .execute({ id })
            .then(() => {
                this.setCache("DELETE", { deletions: [id] });
            });
    }

    async getById(query: DTO<Queries.GetExampleByIdQuery>): Promise<Example> {
        return this.http.get<Example>('/examples/{id}')
            .execute({ params: query })
            .then(response => new Example(response));
    }

    async search(query: DTO<Queries.GetAllExamplesQuery>): Promise<Example[]> {
        return this.http.get<Example[]>('/examples')
            .execute({ params: query })
            .then(response => response.map(e => new Example(e)));
    }
}
