# 03 - Domain Implementation

In this phase, I will translate the domain elements identified during the Domain Discovery phase into code within the `src/domain/` package. I will create the necessary files and ensure they adhere to the template's established patterns.

## Objective

*   Implement Entities, Aggregates, Value Objects, Enumerations, and Domain Events in `src/domain/`.
*   Ensure proper use of `@vannatta-software/ts-utils-domain` decorators (e.g., `@Entity`, `@Schema`).
*   Write unit tests for the domain elements.

## Process

1.  **Review Discovered Domain**:
    Refer to the `diagrams/domain.md`, `diagrams/events.md`, and `diagrams/behaviors.md` files that were generated during the Domain Discovery phase. These documents are the blueprint for implementation.

2.  **Implement Domain Elements**:
    For each identified Entity, Aggregate, Value Object, and Enumeration, I will create corresponding TypeScript files in `src/domain/`.

    *   **Entities and Aggregates**:
        *   Create a new file for each (e.g., `src/domain/YourEntity.ts`, `src/domain/YourAggregate.ts`).
        *   Extend the `Entity` class from `@vannatta-software/ts-utils-domain`.
        *   Use the `@Schema` decorator to define the structure for database mapping.
        *   Implement properties, constructors, and domain logic.
        *   Ensure Aggregate Roots manage their internal consistency and publish domain events.
    *   **Value Objects**:
        *   Create a new file for each (e.g., `src/domain/YourValueObject.ts`).
        *   Implement properties and methods, ensuring immutability.
    *   **Enumerations**:
        *   Create a new file for each (e.g., `src/domain/YourEnum.ts`).
        *   Define your enumeration using TypeScript `enum` or a union of string literals.
    *   **Domain Events**:
        *   Create a new file for each (e.g., `src/domain/YourEvent.ts`).
        *   Ensure events are immutable and represent facts about something that happened.
        *   Extend `DomainEvent` from `@vannatta-software/ts-utils-domain`.

    **My Role**: I will understand the structure and properties of each domain element. I will then generate the initial file content, including decorators and basic class structures, following the patterns established in the `src/domain/Example.ts` and `src/domain/Events.ts` files.

3.  **Write Unit Tests**:
    For each significant domain element (especially Aggregates and Entities with complex logic), write unit tests to ensure their behavior is correct and consistent.

    *   Create a new directory `test/domain/` if it doesn't exist.
    *   Create test files (e.g., `test/domain/entity.spec.ts`, `test/domain/aggregate.spec.ts`).
    *   Focus on testing the domain logic in isolation, without external dependencies.

    **My Role**: I will structure unit tests and use examples based on the existing `test/` directory.

## Update Progress

Upon completion of this phase, update the `memory-bank/progress.md` file to mark this step as completed and all subsequent steps as "Not Started".

For example, after completing "Domain Implementation", the `Workflow Progress` section in `memory-bank/progress.md` should look like this:

```
## Workflow Progress

- [ ] 01 - Initial Setup
- [ ] 02 - Domain Discovery
- [x] 03 - Domain Implementation
- [ ] 04 - Contracts Implementation
- [ ] 05 - Infrastructure Implementation
- [ ] 06 - API Implementation
- [ ] 07 - Service Client Implementation
```

## Next Step

Once the domain elements are implemented and unit-tested, proceed to the [Implement Commands, Queries, Integration Events](/contract-implementation) phase.
