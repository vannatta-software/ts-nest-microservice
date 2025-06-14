# 05 - Infrastructure Implementation

In this phase, I will implement the infrastructure components that support the domain and contracts. This includes database repositories, event bus configurations, and clients for external services. These elements will reside in the `src/infrastructure/` package.

## Objective

*   Implement database repositories (MongoDB).
*   Configure the event bus (RabbitMQ).
*   Define and implement clients for any external services.
*   Write integration tests for infrastructure components.
*   Document infrastructure components and their relationships in `diagrams/infrastructure.md`.

## Process

1.  **Review Domain and Contracts**:
    Refer to the `diagrams/domain.md`, `diagrams/events.md`, `diagrams/behaviors.md`, and `diagrams/cqrs.md` files. These will inform the necessary infrastructure components.

2.  **Implement Database Repositories**:
    Implement repositories for interacting with the MongoDB database.
    *   Create new files in `src/infrastructure/database/mongo/` for each aggregate root or entity that requires persistence (e.g., `src/infrastructure/database/mongo/entity.repository.ts`).
    *   Extend `MongoRepository` and implement methods for saving, retrieving, updating, and deleting the domain entities.
    *   Ensure the repository uses the Mongoose schema generated from the `@Schema` decorated domain entities.

    **My Role**: I will understand the persistence needs for the domain entities. I will generate the repository classes, following the patterns in `src/infrastructure/database/mongo/mongo.repository.ts`.

3.  **Configure Event Bus**:
    The template is pre-configured to use RabbitMQ. Ensure the `.env` file has the correct `RABBITMQ_URL` and `EVENT_BUS_TYPE=rabbitmq`.
    *   Review `src/infrastructure/infrastructure.module.ts` and `src/infrastructure/cqrs/buses/rabbitmq.bus.ts` to understand how the RabbitMQ event bus is integrated.
    *   If integration events require specific topics or routing keys, ensure proper configuration.

    **My Role**: I will verify the event bus configuration and advise on any specific topic/routing key strategies.

4.  **Implement External Service Clients (if needed)**:
    If the service needs to call external APIs or interact with other microservices directly (not via eventing), define clients for these services.
    *   Create new files in `src/infrastructure/external-services/` (or a similar logical grouping).
    *   These clients might implement interfaces defined in the domain layer (Domain Services) to maintain hexagonal architecture.
    *   Use `HttpClient` from `src/contracts/helpers/HttpClient.ts` or other appropriate HTTP clients.

    **My Role**: I will understand the external services the microservice needs to interact with. I will scaffold the client classes and integrate them.

5.  **Write Integration Tests**:
    Write integration tests to verify that the infrastructure components correctly interact with external systems (e.g., database, message broker, external APIs).
    *   Create a new directory `test/infrastructure/` if it doesn't exist.
    *   Create test files (e.g., `test/infrastructure/repository.spec.ts`, `test/infrastructure/external-service.spec.ts`).
    *   These tests should use real dependencies (e.g., a running MongoDB instance, RabbitMQ) or test doubles that closely mimic their behavior.

    **My Role**: I will provide guidance on structuring integration tests and setting up test environments.

6.  **Document Infrastructure**:
    Create a Mermaid diagram in `diagrams/infrastructure.md` that illustrates the infrastructure components and their relationships. This diagram should show:
    *   Database repositories and their connection to MongoDB.
    *   The event bus and its connection to RabbitMQ.
    *   Any external service clients and their interactions.

    **My Role**: I will understand the infrastructure components, and generate the Mermaid diagram in `diagrams/infrastructure.md`.

## Update Progress

Upon completion of this phase, update the `memory-bank/progress.md` file to mark this step as completed and all subsequent steps as "Not Started".

For example, after completing "Infrastructure Implementation", the `Workflow Progress` section in `memory-bank/progress.md` should look like this:

```
## Workflow Progress

- [ ] 01 - Initial Setup
- [ ] 02 - Domain Discovery
- [ ] 03 - Domain Implementation
- [ ] 04 - Contracts Implementation
- [x] 05 - Infrastructure Implementation
- [ ] 06 - API Implementation
- [ ] 07 - Service Client Implementation
```

## Next Step

Once the infrastructure components are implemented and integration-tested, proceed to the [Implement API Package](/api-implementation) phase.
