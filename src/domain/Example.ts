import { AggregateRoot, UniqueIdentifier } from "@vannatta-software/ts-utils-domain";
import { Schema, View, ViewType } from "@vannatta-software/ts-utils-core";
import * as Events from "./Events";
import { ExampleMetadata } from "./ExampleMetadata";
import { ExampleType } from "./ExampleType";

export class Example extends AggregateRoot {
    @Schema({ type: UniqueIdentifier, embedded: true  })
    public name: UniqueIdentifier;

    @Schema({ type: ExampleMetadata, embedded: true  })
    public metadata: ExampleMetadata;

    @Schema({ type: ExampleType, enumeration: true })
    public type: ExampleType;

    constructor(example?: Partial<Example>) {
        super(example);
        this.name = new UniqueIdentifier(example?.name);
        this.type = new ExampleType(example?.type);
        this.metadata = new ExampleMetadata(example?.metadata);
    }

    create() {
        this.addDomainEvent(new Events.ExampleCreatedEvent(this.id.value));
    }

    delete(): void {
        this.addDomainEvent(new Events.ExampleDeletedEvent(this.id.value));
    }

    changeType(newType: ExampleType): void {
        this.type = newType;
        this.addDomainEvent(new Events.ExampleTypeChangedEvent(this.id.value, newType));
    }

    changeMetadata(newMetadata: Partial<ExampleMetadata>): void {
        this.metadata.update(newMetadata);
        this.addDomainEvent(new Events.ExampleMetadataUpdatedEvent(this.id.value, this.metadata));
    }

    toString() {
        return this.name.toString();
    }
}