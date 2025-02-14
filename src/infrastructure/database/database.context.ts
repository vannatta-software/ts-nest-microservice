import { Injectable, Logger } from "@nestjs/common";
import { Mediator } from "../cqrs/mediator.service";
import { MongoRepository } from "./mongo.repository";
import { Example } from "@domain/Example";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class DatabaseContext {
    private readonly logger = new Logger("DatabaseContext");
    public readonly examples: MongoRepository<Example>;

    constructor(
        mediator: Mediator,
        @InjectModel(Example.name) example: Model<Example>,
    ) {
        this.examples = new MongoRepository(example, mediator);
        this.examples.onHydrate(doc => new Example(doc));
        this.logger.log("Initialized repositories")
    }
}