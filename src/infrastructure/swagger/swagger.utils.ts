import { applyDecorators, Type } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function QueryModel<T>(query: T): MethodDecorator {
    const decorators = Object.keys(query).map((key) =>
        ApiQuery({
            name: key,
            required: false,
            type: String, // Assume string for simplicity; customize as needed
            description: `Query parameter for ${key}`,
        })
    );
    
    return applyDecorators(...decorators);
}

import { ApiBody } from '@nestjs/swagger';

export function CommandModel<T>(constructor: new () => T): MethodDecorator {
    const instance = new constructor();
    const properties = Object.keys(instance);
    const schema = {
        type: 'object',
        properties: properties.reduce((acc, key) => {
            const type = typeof instance[key];
            acc[key] = { type: mapToSwaggerType(type) };
            return acc;
        }, {} as Record<string, any>),
    };

    return applyDecorators(
        ApiBody({
            schema,
            description: `Dynamic input based on ${constructor.name}`,
        })
    );
}

export function ApiBodyObj(instance: object): MethodDecorator {
    const properties = Object.keys(instance);
    const schema = {
        type: 'object',
        properties: properties.reduce((acc, key) => {
            const type = typeof instance[key];
            acc[key] = { type: mapToSwaggerType(type) };
            return acc;
        }, {} as Record<string, any>),
    };

    return applyDecorators(
        ApiBody({
            schema,
            description: `Dynamic input based on`,
        })
    );
}

function mapToSwaggerType(type: string): string {
    switch (type) {
        case 'string':
            return 'string';
        case 'number':
            return 'number';
        case 'boolean':
            return 'boolean';
        default:
            return 'string'; // Default fallback
    }
}
