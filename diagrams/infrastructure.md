# Infrastructure Diagram

This file will contain a Mermaid diagram illustrating the infrastructure components of the new microservice and their relationships.

During the "Infrastructure Implementation" phase of the workflow (`workflows/05-infrastructure-implementation.md`), I will populate this file based on input.

```mermaid
graph TD
    subgraph Microservice Layers
        Domain[Domain Layer]
        Contracts[Contracts Layer]
        API[API Layer]
        Infrastructure[Infrastructure Layer]
    end

    subgraph Infrastructure Components
        MongoRepo[MongoRepository (for Example)]
        RabbitMQBus[RabbitMQ Event Bus]
        HttpClient[HttpClient]
        ServiceClient[ServiceClient]
        NotificationGateway[NotificationGateway]
        SocketClient[SocketClient]
    end

    subgraph External Systems
        MongoDB[(MongoDB Database)]
        RabbitMQBroker(RabbitMQ Broker)
        ExternalAPI(External API/Service)
        WebSocketClient(WebSocket Client)
    end

    Domain -- "Persists via" --> MongoRepo
    MongoRepo -- "Connects to" --> MongoDB

    Infrastructure -- "Uses" --> RabbitMQBus
    RabbitMQBus -- "Connects to" --> RabbitMQBroker

    Contracts -- "Uses" --> HttpClient
    HttpClient -- "Calls" --> ExternalAPI

    Contracts -- "Uses" --> ServiceClient
    ServiceClient -- "Uses" --> HttpClient
    ServiceClient -- "Uses" --> NotificationGateway
    NotificationGateway -- "Communicates via" --> SocketClient
    SocketClient -- "Connects to" --> WebSocketClient

    API -- "Uses" --> Infrastructure
    API -- "Dispatches Events to" --> RabbitMQBus
