import { Entity as TypeOrmEntityDecorator, PrimaryColumn, Column, ObjectType } from 'typeorm';
import { ReflectionUtils, SchemaMetadataKey } from '@vannatta-software/ts-utils-core';
import { GlobalIdentifier, Entity } from '@vannatta-software/ts-utils-domain';
import 'reflect-metadata';

interface IMetaprop {
    propertyKey: string,
    type: any,
    ignore?: boolean,
    embedded: boolean,
    enumeration: boolean,
    items: any,
    enum: string[]
}

export class PostgresSchema {
    public static getTypeOrmEntity<T extends Entity>(entityClass: new (...args: any[]) => T): ObjectType<any> {
        // Dynamically create a TypeORM entity class based on the domain entity's schema metadata.
        // This approach allows TypeORM to work with entities defined using @Schema decorators.
        // Note: TypeORM decorators are typically compile-time. This runtime generation
        // is a workaround and might have limitations for complex scenarios (e.g., relations).

        const props = ReflectionUtils.getOwnMetadata(SchemaMetadataKey, entityClass);
        const columns: { propertyKey: string, type: any, options?: any }[] = [];

        props.forEach((options: IMetaprop) => {
            const key = options.propertyKey;
            if (options.ignore) return;

            let columnType: any;
            let columnOptions: any = {};

            if (options.type === GlobalIdentifier) {
                columnType = String;
                columnOptions = { primary: true }; // Map GlobalIdentifier to primary column
            } else if (options.enumeration) {
                columnType = String; // Enums stored as strings
                columnOptions = { enum: options.enum };
            } else if (options.embedded) {
                // For embedded objects, TypeORM typically uses JSONB or a separate table.
                // For simplicity, we'll store as JSON.
                columnType = 'jsonb';
            } else {
                // Map common types
                switch (options.type) {
                    case String: columnType = String; break;
                    case Number: columnType = Number; break;
                    case Boolean: columnType = Boolean; break;
                    case Date: columnType = Date; break;
                    default: columnType = String; // Default to string for unknown types
                }
            }
            columns.push({ propertyKey: key, type: columnType, options: columnOptions });
        });

        // Define a dynamic class that TypeORM can recognize
        const DynamicTypeOrmEntity = class {
            constructor(data?: Partial<T>) {
                if (data) {
                    for (const col of columns) {
                        if (col.propertyKey === 'id' && (data as any).id?.value) {
                            (this as any)[col.propertyKey] = (data as any).id.value;
                        } else if (data[col.propertyKey as keyof T]) {
                            (this as any)[col.propertyKey] = data[col.propertyKey as keyof T];
                        }
                    }
                }
            }
        };

        // Apply TypeORM decorators dynamically (this is the tricky part, usually done at compile time)
        // This part is illustrative and might require a custom TypeORM extension or build step
        // to fully work as expected with all TypeORM features.
        // For now, we'll rely on TypeORM's ability to work with plain objects if `synchronize: true` is used.
        // The primary column 'id' is handled by `PostgresRepository`'s `findOneBy({ id })` and `delete(id.value)`.

        // Set the entity name for TypeORM
        Object.defineProperty(DynamicTypeOrmEntity, 'name', { value: entityClass.name });
        TypeOrmEntityDecorator({ name: entityClass.name })(DynamicTypeOrmEntity);

        // Apply columns dynamically (this is a conceptual representation, not direct decorator application)
        columns.forEach(col => {
            if (col.propertyKey === 'id') {
                PrimaryColumn()(DynamicTypeOrmEntity.prototype, col.propertyKey);
            } else {
                Column(col.options)(DynamicTypeOrmEntity.prototype, col.propertyKey);
            }
        });

        return DynamicTypeOrmEntity;
    }
}
