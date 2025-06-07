import { Example } from '@ts-nest-microservice/domain';
import { Validation } from "@vannatta-software/ts-domain";
import { Query, UUID_VALIDATION } from "./helpers/CqrsTypes";

export class GetAllExamplesQuery extends Query<Example[]> {
    @Validation({ 
        required: false,
        type: 'string',
        max: 100
    })
    public name?: string = "";
}

export class GetExampleByIdQuery extends Query<Example> {
    @Validation({ 
        required: true,
        type: 'string',
        pattern: UUID_VALIDATION
    })
    public id: string = "";
}

export class GetExampleByNameQuery extends Query<Example> {
    @Validation({ 
        required: true,
        type: 'string',
        max: 100
    })
    public name: string = "";
}
