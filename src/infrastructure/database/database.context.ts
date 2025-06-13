import { Injectable, Logger } from "@nestjs/common";
import { Mediator } from "../cqrs/mediator.service";
import { MongoRepository } from "./mongo/mongo.repository";
import { Example } from "@domain/Example";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class DatabaseContext {
    private readonly logger = new Logger("DatabaseContext");
    public readonly examplesMongo: MongoRepository<Example>;

    constructor(
        mediator: Mediator,
        @InjectModel(Example.name) exampleMongoModel: Model<Example>,
    ) {
        this.examplesMongo = new MongoRepository(exampleMongoModel, mediator);
        this.examplesMongo.onHydrate(doc => new Example(doc));

        this.logger.log("Initialized repositories");
    }
}
