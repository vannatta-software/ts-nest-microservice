import { ValueObject } from "@vannatta-software/ts-utils-domain";
import { Schema, View } from "@vannatta-software/ts-utils-core";

export class ExampleMetadata extends ValueObject {
    @Schema({ type: String })
    public description: string

    @Schema({ type: Number })
    public version: number

    constructor (partial?: Partial<ExampleMetadata>) {
        super();
        this.description = partial?.description ?? "";
        this.version = partial?.version ?? 0;
    }

    update(meta: Partial<ExampleMetadata>) {
        this.description = meta.description ?? this.description;
        this.version = meta.version ?? this.version;
    }

    toString() {
        return this.description;
    }
 
    protected *getAtomicValues(): IterableIterator<any> {
        yield this.description;
        yield this.version;
    }
}