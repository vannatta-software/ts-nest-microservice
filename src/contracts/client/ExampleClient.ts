import { Example, Events } from '@connect-the-dots/issue-domain';
import * as Commands from '../Commands';
import * as Queries from '../Queries';
import { DTO } from '../helpers/CqrsTypes';
import { Cache, ServiceClient } from '../helpers/ServiceClient';
import { HttpClient } from '../helpers/HttpClient';

export interface ExampleCache extends Cache {
    examples?: Example[]
}

export class ExampleClient extends ServiceClient<ExampleCache> {
    constructor(url: string) {
        super(new HttpClient({ baseURL: url }))
    }

    public onConnect() {
        this.bindSocket(Events.ExampleCreatedEvent, async (event) => {
            await this.publishEvent(event, Events.ExampleCreatedEvent);
            await this.setCacheAsync("CREATE", async () => {
                const example = await this.getById({ id: event.exampleId });
                return { examples: [example] };
            });
        });

        this.bindSocket(Events.ExampleMetadataUpdatedEvent, async (event) => {
            await this.publishEvent(event, Events.ExampleMetadataUpdatedEvent);
            await this.setCacheAsync("UPDATE", async () => {
                const example = await this.getById({ id: event.exampleId });
                return { examples: [example] };
            });
        });

        this.bindSocket(Events.ExampleDeletedEvent, async (event) => {
            await this.publishEvent(event, Events.ExampleDeletedEvent);
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

    async delete(exampleId: string): Promise<void> {
        return this.http.delete<void>('/examples/{id}')
            .execute({ id: exampleId })
            .then(() => {
                this.setCache("DELETE", { deletions: [exampleId] });
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
