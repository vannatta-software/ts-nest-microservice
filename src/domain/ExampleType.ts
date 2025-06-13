import { Enumeration } from "@vannatta-software/ts-utils-domain";

export class ExampleType extends Enumeration {
    public static Default = new ExampleType({id: 0, name: "Default"});
    public static Other = new ExampleType({id: 1, name: "Other"});

    constructor(partial?: Partial<ExampleType>) {
        super(partial)
    }

    public static get Types() {
        return new ExampleType().getAllInstances().map(t => t.name)
    }
}