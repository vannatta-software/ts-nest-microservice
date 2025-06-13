# Domain Diagram

This file will contain a Mermaid diagram illustrating the domain entities, aggregates, value objects, and their relationships for the new microservice.

During the "Domain Discovery" phase of the workflow (`workflows/02-domain-discovery.md`), I will populate this file based on input.

```mermaid
classDiagram
    direction LR
    class Example {
        +UniqueIdentifier name
        +ExampleMetadata metadata
        +ExampleType type
        +create()
        +delete()
        +changeType(newType: ExampleType)
        +changeMetadata(newMetadata: Partial<ExampleMetadata>)
    }

    class ExampleMetadata {
        +string description
        +number version
    }

    class ExampleType {
        <<Enumeration>>
        +Default
        +Other
    }

    class ExampleCreatedEvent {
        <<Domain Event>>
        +Date dateTimeOccurred
        +string exampleId
    }

    class ExampleDeletedEvent {
        <<Domain Event>>
        +Date dateTimeOccurred
        +string exampleId
    }

    class ExampleMetadataUpdatedEvent {
        <<Domain Event>>
        +Date dateTimeOccurred
        +string exampleId
        +DTO<ExampleMetadata> metadata
    }

    class ExampleTypeChangedEvent {
        <<Domain Event>>
        +Date dateTimeOccurred
        +string exampleId
        +ExampleType newType
    }

    Example "1" *-- "1" ExampleMetadata : contains
    Example "1" *-- "1" ExampleType : has
    Example ..> ExampleCreatedEvent : publishes
    Example ..> ExampleDeletedEvent : publishes
    Example ..> ExampleMetadataUpdatedEvent : publishes
    Example ..> ExampleTypeChangedEvent : publishes
