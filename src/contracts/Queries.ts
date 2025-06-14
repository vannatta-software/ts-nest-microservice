import { Example } from '@ts-nest-microservice/domain';
import { Pattern } from '@vannatta-software/ts-utils-core';
import { Query, Validation } from "@vannatta-software/ts-utils-domain";

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
        pattern: Pattern.UUID,
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
