# 04 - Contracts Implementation

In this phase, I will define the communication contracts for the new microservice. This includes Commands (actions that change state), Queries (requests for data), and Integration Events (for cross-service communication). These elements will reside in the `src/contracts/` package.

## Objective

*   Define Commands, Queries, and Integration Events in `src/contracts/`.
*   Document the CQRS flow in `diagrams/cqrs.md`.

## Process

1.  **Review Domain and Behaviors**:
    Refer to the `diagrams/domain.md`, `diagrams/events.md`, and `diagrams/behaviors.md` files. These will inform the necessary commands, queries, and integration events. Consider:
    *   What actions can external systems or users initiate that change the state of the domain? (Commands)
    *   What data can external systems or users request from the service? (Queries)
    *   What significant events in the domain need to be communicated to other services? (Integration Events)

2.  **Implement Commands**:
    Define commands in `src/contracts/Commands.ts`.
    *   Each command should be a class that extends `Command` from `@vannatta-software/ts-utils-domain`.
    *   Commands should be named to reflect their intent (e.g., `CreateUserCommand`, `UpdateOrderCommand`).
    *   Include necessary data as properties.

    **My Role**: I will understand the purpose and data of each command. I will then generate the command class definitions, following the patterns in `src/contracts/Commands.ts`.

3.  **Implement Queries**:
    Define queries in `src/contracts/Queries.ts`.
    *   Each query should be a class that extends `Query` from `@vannatta-software/ts-utils-domain`.
    *   Queries should be named to reflect the data they retrieve (e.g., `GetUserByIdQuery`, `ListOrdersQuery`).
    *   Include necessary parameters as properties.

    **My Role**: I will understand the data needed and the expected return for each query. I will generate the query class definitions, following the patterns in `src/contracts/Queries.ts`.</replace_in_file>

4.  **Implement Integration Events**:
    Define integration events. It is advisable to create a new file, e.g., `src/contracts/IntegrationEvents.ts`, for these.
    *   Each integration event should be a class that extends `IntegrationEvent` from `@vannatta-software/ts-utils-domain`.
    *   Integration events are facts about something that happened that other services might be interested in (e.g., `UserCreatedIntegrationEvent`, `OrderShippedIntegrationEvent`).
    *   Include relevant data that other services would need to react to the event.

    **My Role**: I will understand the significant domain events that need to be published externally. I will create the new `src/contracts/IntegrationEvents.ts` file and define the event classes within it.

5.  **Document CQRS Flow**:
    Create a Mermaid diagram in `diagrams/cqrs.md` that illustrates the flow of commands, queries, and integration events. This diagram should show:
    *   How commands are initiated and processed by command handlers.
    *   How queries are initiated and processed by query handlers.
    *   How domain events lead to integration events, and how these are published.

    **My Role**: I will understand the high-level flow, and generate the Mermaid diagram in `diagrams/cqrs.md`.

## Next Step

Once the commands, queries, and integration events are defined and the CQRS flow is documented, proceed to the [Implement Infrastructure Package](05-infrastructure-implementation.md) phase.
