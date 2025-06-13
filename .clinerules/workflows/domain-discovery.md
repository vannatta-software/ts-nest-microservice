# 02 - Domain Discovery

This phase is crucial for defining the core business logic and elements of the new microservice. I will work interactively to extract and document the domain.

## Objective

*   Identify and define domain elements (Entities, Aggregates, Value Objects, Enumerations, Events).
*   Define the key behaviors of the service.
*   Document the discovered domain in `diagrams/domain.md`, `diagrams/events.md`, and `diagrams/behaviors.md`.

## Process

1.  **Initiate Domain Discovery**:
    Start by understanding the purpose and key behaviors of the service. Focus on:
    *   What problems does the service solve?
    *   What are its main responsibilities?
    *   What are the core concepts or "things" it manages?

    I will guide through a process similar to **Event Storming** and **Conceptual Analysis/Validation** to help extract the following:

    *   **Entities**: Objects with a distinct identity that can change over time (e.g., `User`, `Order`).
    *   **Aggregates**: Clusters of associated entities and value objects treated as a single unit for data changes. They have a root entity (Aggregate Root) that controls access to the aggregate's internal objects (e.g., `Order` as an aggregate root for `OrderItems`).
    *   **Value Objects**: Objects that describe a characteristic or attribute but have no conceptual identity (e.g., `Address`, `Money`).
    *   **Enumerations**: Fixed sets of values (e.g., `OrderStatus`, `ProductType`).
    *   **Domain Events**: Something significant that happened in the domain. These are immutable facts that describe a change in state (e.g., `OrderPlaced`, `PaymentProcessed`).
    *   **Behaviors**: Application-wide functions that your service will provide. These should include the domain elements and events that describe larger scope elements.

2.  **Define Domain Services and Anti-Corruption Layers (if applicable)**:
    *   Consider how the domain might interact with other domains or external services.
    *   If there are interactions, define **Domain Services** that can enable external services.
    *   If the domain interacts with other domains, ensure that there is a **Context Boundary** that acts as an **Anti-Corruption Layer** to prevent external models from polluting the domain.

3.  **Generate Diagrams and Documentation**:
    Based on input, I will generate and update the following markdown files:

    *   **`diagrams/domain.md`**: This file will contain a Mermaid diagram illustrating the identified domain entities, aggregates, value objects, and their relationships.
    *   **`diagrams/events.md`**: This file will list and describe the domain events, including their purpose and key data.
    *   **`diagrams/behaviors.md`**: This file will describe the key behaviors of the service, linking them to the relevant domain elements and events.

## Next Step

Once the Domain Discovery phase is complete and the necessary diagrams and documentation have been generated, proceed to the [Domain Implementation](03-domain-implementation.md) phase.
