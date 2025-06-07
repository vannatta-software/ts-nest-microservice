import { Example, ExampleType} from '@ts-nest-microservice/domain';
import { Enumeration, Validation } from "@vannatta-software/ts-domain";
import { Command, UUID_VALIDATION } from './helpers/CqrsTypes';

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
        enum: ExampleType.Types
    })
    public type?: string = "";
}

export class UpdateExampleCommand extends Command<Example> {
    @Validation({ 
        required: true,
        type: 'string',
        pattern: UUID_VALIDATION
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
        enum: ExampleType.Types
    })
    public type?: number;
}

export class DeleteExampleCommand extends Command<boolean> {
    @Validation({ 
        required: true,
        type: 'string',
        pattern: UUID_VALIDATION
    })
    public id: string = "";
}

export class UpdateVersionCommand extends Command<boolean> {
    @Validation({ 
        required: true,
        type: 'string',
        pattern: UUID_VALIDATION
    })
    public id: string;

    @Validation({ 
        required: true,
        type: 'number',
        min: 0
    })
    public newVersion: number;
}