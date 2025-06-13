# CQRS Flow Diagram

This file will contain a Mermaid diagram illustrating the flow of commands, queries, and integration events within the new microservice.

During the "Contracts Implementation" phase of the workflow (`workflows/04-contracts-implementation.md`), I will populate this file based on input.

```mermaid
graph TD
    subgraph External
        Client(Client/User)
    end

    subgraph API Layer
        Controller[ExampleController]
    end

    subgraph Application Layer
        Mediator(MediatorService)
        CreateExampleHandler[CreateExampleHandler]
        UpdateExampleHandler[UpdateExampleHandler]
        DeleteExampleHandler[DeleteExampleHandler]
        GetExampleByIdHandler[GetExampleByIdHandler]
        GetAllExamplesHandler[GetAllExamplesHandler]
    end

    subgraph Domain Layer
        ExampleAggregate[Example Aggregate]
        ExampleCreatedEvent[ExampleCreatedEvent]
        ExampleDeletedEvent[ExampleDeletedEvent]
        ExampleMetadataUpdatedEvent[ExampleMetadataUpdatedEvent]
        ExampleTypeChangedEvent[ExampleTypeChangedEvent]
    end

    subgraph Infrastructure Layer
        ExampleRepository[ExampleRepository]
        Database[(Database)]
        EventBus[Event Bus]
    end

    Client -- "HTTP Request (POST /examples)" --> Controller
    Controller -- "sendCommand(CreateExampleCommand)" --> Mediator
    Mediator -- "dispatches" --> CreateExampleHandler
    CreateExampleHandler -- "creates Example" --> ExampleAggregate
    ExampleAggregate -- "publishes ExampleCreatedEvent" --> Mediator
    CreateExampleHandler -- "inserts" --> ExampleRepository
    ExampleRepository -- "saves" --> Database

    Client -- "HTTP Request (PUT /examples)" --> Controller
    Controller -- "sendCommand(UpdateExampleCommand)" --> Mediator
    Mediator -- "dispatches" --> UpdateExampleHandler
    UpdateExampleHandler -- "updates Example" --> ExampleAggregate
    ExampleAggregate -- "publishes ExampleMetadataUpdatedEvent / ExampleTypeChangedEvent" --> Mediator
    UpdateExampleHandler -- "updates" --> ExampleRepository
    ExampleRepository -- "saves" --> Database

    Client -- "HTTP Request (DELETE /examples/:id)" --> Controller
    Controller -- "sendCommand(DeleteExampleCommand)" --> Mediator
    Mediator -- "dispatches" --> DeleteExampleHandler
    DeleteExampleHandler -- "deletes Example" --> ExampleAggregate
    ExampleAggregate -- "publishes ExampleDeletedEvent" --> Mediator
    DeleteExampleHandler -- "deletes" --> ExampleRepository
    ExampleRepository -- "removes" --> Database

    Client -- "HTTP Request (GET /examples/:id)" --> Controller
    Controller -- "sendQuery(GetExampleByIdQuery)" --> Mediator
    Mediator -- "dispatches" --> GetExampleByIdHandler
    GetExampleByIdHandler -- "fetches" --> ExampleRepository
    ExampleRepository -- "reads" --> Database
    GetExampleByIdHandler -- "returns Example" --> Controller
    Controller -- "HTTP Response" --> Client

    Client -- "HTTP Request (GET /examples?name=...)" --> Controller
    Controller -- "sendQuery(GetAllExamplesQuery)" --> Mediator
    Mediator -- "dispatches" --> GetAllExamplesHandler
    GetAllExamplesHandler -- "searches" --> ExampleRepository
    ExampleRepository -- "reads" --> Database
    GetAllExamplesHandler -- "returns Examples" --> Controller
    Controller -- "HTTP Response" --> Client

    Mediator -- "routes Domain Events" --> EventBus
    EventBus -- "publishes" --> Client(via SocketIOEventBus)
