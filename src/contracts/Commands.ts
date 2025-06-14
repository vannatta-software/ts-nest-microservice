import { Example, ExampleType} from '@ts-nest-microservice/domain';
import { Pattern } from '@vannatta-software/ts-utils-core';
import { Command, Validation } from "@vannatta-software/ts-utils-domain";

export class CreateExampleCommand extends Command<Example> {
    @Validation({ 
        required: true,
        type: 'string',
        min: 1,
        max: 100
    })
    public name: string = "";

    @Validation({ 
        required: true,
        type: 'string',
        min: 1
    })
    public description: string = "";

    @Validation({ 
        required: true,
        type: 'number',
        min: 0
    })
    public version: number = 0;

    @Validation({ 
        required: false,
        type: 'string',
        enum: new ExampleType().getNames(),
    })
    public type?: string = "";
}

export class UpdateExampleCommand extends Command<Example> {
    @Validation({ 
        required: true,
        type: 'string',
        pattern: Pattern.UUID,
    })
    public id: string = "";

    @Validation({ 
        required: false,
        type: 'string',
        min: 1,
        max: 100
    })
    public name?: string = "";

    @Validation({ 
        type: 'object',
        required: false
    })
    public metadata?: {
        description: string,
        version: number,
    };

    @Validation({ 
        type: 'number',
        required: false,
        enum: new ExampleType().getNames(),
    })
    public type?: number;
}

export class DeleteExampleCommand extends Command<boolean> {
    @Validation({ 
        required: true,
        type: 'string',
        pattern: Pattern.UUID
    })
    public id: string = "";
}

export class UpdateVersionCommand extends Command<boolean> {
    @Validation({ 
        required: true,
        type: 'string',
        pattern: Pattern.UUID
    })
    public id: string;

    @Validation({ 
        required: true,
        type: 'number',
        min: 0
    })
    public newVersion: number;
}