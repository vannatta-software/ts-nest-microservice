# 06 - API Implementation

In this phase, I will build the API layer of the microservice, which exposes its functionality to external clients. This involves creating controllers, command/query handlers, modules, and event handlers within the `src/api/` package.

## Objective

*   Build API controllers to expose HTTP endpoints.
*   Implement command handlers to process incoming commands.
*   Implement query handlers to retrieve data.
*   Create NestJS modules to organize API components.
*   Implement event handlers for internal domain events or consuming integration events.
*   Document API endpoints in `diagrams/api.md`.
*   Write end-to-end (E2E) tests for API endpoints.

## Process

1.  **Review Contracts and Behaviors**:
    Refer to the `diagrams/behaviors.md`, `diagrams/cqrs.md`, and the implemented contracts in `src/contracts/`. These will inform the design of the API endpoints and handlers.

2.  **Implement API Controllers**:
    Create controllers that expose HTTP endpoints for the service's commands and queries.
    *   Create new files in `src/api/feature/` (e.g., `src/api/users/users.controller.ts`).
    *   Use NestJS decorators (`@Controller`, `@Post`, `@Get`, etc.) to define routes and HTTP methods.
    *   Inject the `MediatorService` to dispatch commands and queries.

    **My Role**: I will understand the desired API endpoints (paths, methods, request/response bodies). I will generate the controller classes, following the patterns in `src/api/examples/example.controller.ts`.

3.  **Implement Command Handlers**:
    Create command handlers that process the commands defined in `src/contracts/Commands.ts`.
    *   Create new files in `src/api/feature/` (e.g., `src/api/users/commands/create-user.handler.ts`).
    *   Implement the `ICommandHandler` interface and use the `@CommandHandler` decorator.
    *   Handlers will interact with the domain aggregates and repositories to perform state changes.

    **My Role**: I will specify which command each handler should process. I will generate the handler classes, following the patterns in `src/api/examples/example.commands.ts`.

4.  **Implement Query Handlers**:
    Create query handlers that retrieve data based on the queries defined in `src/contracts/Queries.ts`.
    *   Create new files in `src/api/feature/` (e.g., `src/api/users/queries/get-user-by-id.handler.ts`).
    *   Implement the `IQueryHandler` interface and use the `@QueryHandler` decorator.
    *   Handlers will typically interact with the repositories to fetch data.

    **My Role**: I will specify which query each handler should process. I will generate the handler classes, following the patterns in `src/api/examples/example.queries.ts`.

5.  **Implement Event Handlers**:
    If the service needs to react to internal domain events or consume integration events from other services, implement event handlers.
    *   Create new files in `src/api/feature/` (e.g., `src/api/users/events/user-created.handler.ts`).
    *   Implement the `IEventHandler` interface and use the `@EventHandler` decorator.
    *   These handlers might trigger new commands, queries, or publish new integration events.
    *   Client notifications should generally be handled as integration events published via the event bus, which the client-side `SocketIOEventBus` can subscribe to.

    **My Role**: I will understand the events the service needs to react to. I will generate the event handler classes, following the patterns in `src/api/examples/example.events.ts`.

6.  **Organize with NestJS Modules**:
    Create a NestJS module for each major feature or bounded context within the API (e.g., `src/api/users/users.module.ts`).
    *   Import necessary modules (e.g., `InfrastructureModule`).
    *   Register controllers, providers (handlers, services), and exports.
    *   Ensure the main `ApiModule` (e.g., `src/api/api.module.ts`) imports these feature modules.

    **My Role**: I will structure the modules and ensure proper registration of components.

7.  **Document API Endpoints**:
    Document API endpoints in `diagrams/api.md`. This can be a simple markdown list of endpoints, or more detailed OpenAPI/Swagger snippets.

    **My Role**: I will understand the API endpoints, and generate the documentation in `diagrams/api.md`.

8.  **Write End-to-End (E2E) Tests**:
    Write E2E tests to verify the complete flow of the API endpoints, from request to response, including database interactions and event publishing.
    *   Create a new directory `test/api/` if it doesn't exist.
    *   Create test files (e.g., `test/api/feature.e2e-spec.ts`).
    *   Use `Supertest` to make HTTP requests to the running NestJS application.

    **My Role**: I will provide guidance on structuring E2E tests and setting up the test environment.

## Next Step

Once the API layer is implemented and E2E tested, proceed to the [Implement Contracts Service Client](07-service-client-implementation.md) phase.
