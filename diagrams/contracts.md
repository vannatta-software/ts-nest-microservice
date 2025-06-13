# Contracts Diagram

This file will contain a Mermaid diagram illustrating the Commands and Queries defined for the new microservice.

During the "Contracts Implementation" phase of the workflow (`workflows/04-contracts-implementation.md`), I will populate this file based on input.

```mermaid
classDiagram
    direction LR
    class Command {
        <<Abstract>>
    }
    class Query {
        <<Abstract>>
    }

    class CreateExampleCommand {
        +string name
        +string description
        +number version
        +string type?
    }

    class UpdateExampleCommand {
        +string id
        +string name?
        +object metadata?
        +number type?
    }

    class DeleteExampleCommand {
        +string id
    }

    class UpdateVersionCommand {
        +string id
        +number newVersion
    }

    class GetAllExamplesQuery {
        +string name?
    }

    class GetExampleByIdQuery {
        +string id
    }

    class GetExampleByNameQuery {
        +string name
    }

    Command <|-- CreateExampleCommand
    Command <|-- UpdateExampleCommand
    Command <|-- DeleteExampleCommand
    Command <|-- UpdateVersionCommand

    Query <|-- GetAllExamplesQuery
    Query <|-- GetExampleByIdQuery
    Query <|-- GetExampleByNameQuery
