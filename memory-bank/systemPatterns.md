# System Patterns

## System Architecture
The project follows a microservice architecture, with each service designed to be independently deployable and scalable. Communication between services is primarily event-driven, leveraging various message brokers and client-side eventing.

## Key Technical Decisions
- **NestJS Framework**: Chosen for its modularity, strong TypeScript support, and enterprise-grade features.
- **CQRS (Command Query Responsibility Segregation)**: Separates read and write operations, improving scalability, maintainability, and performance.
- **Event-Driven Architecture**: Uses domain events to communicate changes between aggregates and services, promoting loose coupling. Integration events are published via a configurable event bus.
- **Domain-Driven Design (DDD)**: Focuses on modeling the business domain, with clear boundaries for aggregates, entities, and value objects, and leveraging decorators for seamless database mapping.
- **Direct Repository Access**: Instead of generic repository interfaces, `DatabaseContext` directly exposes `MongoRepository` instances, providing tailored access methods for MongoDB.

## Design Patterns in Use
- **Mediator Pattern**: Implemented via `MediatorService` to dispatch commands and queries to their respective handlers, and publish domain events.
- **Strategy Pattern**: Used for different event bus implementations (Base, RabbitMQ), allowing easy switching based on environment configuration.
- **Factory Pattern**: Used in `EventBus.Provider` to instantiate the correct event bus implementation.
- **Dependency Injection**: Leveraged heavily by NestJS for managing dependencies and promoting testability.
- **Reflection-based Schema Mapping**: Utilized to dynamically map domain entities (decorated with `@Schema`) to MongoDB-specific schemas.

## Component Relationships
- **API Layer**: Exposes HTTP/WebSocket endpoints, receives commands/queries, and interacts with the Mediator.
- **Domain Layer**: Contains the core business logic, aggregates, entities, value objects, and domain events. Entities are decorated with schema metadata for database mapping.
- **Infrastructure Layer**: Provides implementations for persistence (MongoDB), messaging (event buses), and other cross-cutting concerns (filters, Swagger, WebSockets).
    - **Database Sub-layers**: Repositories are organized into `src/infrastructure/database/mongo/`.
    - **Event Bus Sub-layers**: Event bus implementations are organized into `src/infrastructure/cqrs/buses/`.
- **Contracts Layer**: Defines shared DTOs, commands, queries, and events for inter-service communication. Includes `ServiceClient` which is now event-bus agnostic and can be injected with a client-side event bus (e.g., `SocketIOEventBus`).

## Critical Implementation Paths
- **Command Flow**: API Controller -> MediatorService -> Command Handler -> Domain Aggregate -> MongoRepository -> Database -> Mediator (publishes domain events) -> Event Bus (publishes integration events).
- **Query Flow**: API Controller -> MediatorService -> Query Handler -> MongoRepository -> Data.
- **Event Flow (Internal)**: Domain Aggregate -> Mediator -> Event Handler (within the same service).
- **Event Flow (External/Integration)**: Domain Aggregate -> Mediator -> Event Bus (e.g., RabbitMQ) -> External Consumers/Other Services.
- **Client-side Event Flow**: Client (e.g., `ExampleClient`) -> Injected `SocketIOEventBus` -> WebSocket Gateway (server-side) -> Event Bus (server-side) -> Event Handlers.

## Data Flow
```mermaid
graph TD
    A[Client/Other Service] --> B(API Controller);
    B --> C{Mediator Service};
    C --> D[Command Handler];
    C --> E[Query Handler];
    D --> F[Domain Aggregate];
    F --> G[MongoRepository];
    G --> J[MongoDB];
    F --> M[Event Bus (Internal/Domain Events)];
    M --> N[Event Handler];
    N --> O[Other Services/Consumers];
    M --> P[Event Bus (External/Integration Events)];
    P --> Q[RabbitMQ];
    E --> G;
    Q --> O;
    R[Client-side Application] --> S[SocketIOEventBus (Client)];
    S --> T[WebSocket Gateway];
    T --> P;
    P --> S;
