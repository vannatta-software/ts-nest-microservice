# Active Context

## Current Work Focus
Enhancing the TS Nest Microservice Template with new database repository types, event bus definitions, and improved client integration.

## Recent Changes
- Configured `infrastructure.module.ts` to exclusively use MongoDB for database operations and RabbitMQ for event bus communication.
- Previously implemented Neo4j and Postgres repositories, Google Pub/Sub, Redis, and Socket.IO event buses have been removed from the module's configuration.
- Updated `DatabaseContext` to directly expose concrete repository instances (Mongo).
- Updated `IEventBus` interface and refactored `EventBus.Provider` to default to RabbitMQ.
- Updated `ServiceClient` and `ExampleClient` for event bus injection and client-side eventing.
- **File Structure Refactoring:** Repository implementations moved to `src/infrastructure/database/{db_type}/` and event bus implementations moved to `src/infrastructure/cqrs/buses/`. All affected imports have been updated.

## Next Steps
- Update remaining memory bank files (`progress.md`, `systemPatterns.md`, `techContext.md`) to reflect the completed work and new architectural patterns.
- Verify the overall functionality of the updated microservice template.

## Active Decisions and Considerations
- Direct integration of domain entities with database repositories using reflection metadata from `@Schema` decorators.
- Removal of generic repository interfaces for a more direct database context.
- Fixed selection of RabbitMQ as the event bus implementation.
- Client-side eventing via `SocketIOEventBus` injected into `ServiceClient`.
- Workaround applied for `amqplib` TypeScript type issues using `any` casts (requires further investigation in a production setup).

## Important Patterns and Preferences
- Continued adherence to CQRS and event-driven architecture.
- Modular design with clear separation of concerns.
- Leveraging TypeScript for strong typing and maintainability.
- Emphasis on extensibility and configurability for different environments (local dev, production).

## Learnings and Project Insights
- The template is now streamlined to focus on MongoDB and RabbitMQ as default infrastructure choices, simplifying initial setup for users who prefer these technologies.
- Dynamic schema mapping for TypeORM and Neo4j using reflection is feasible but requires careful implementation due to framework-specific decorator behaviors.
- Managing external library type definitions can sometimes be challenging, requiring workarounds.
