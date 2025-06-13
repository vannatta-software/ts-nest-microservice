# 07 - Service Client Implementation

This is the final phase of building the new microservice. I will define service clients that allow other applications or services to easily interact with the API just built. These clients will reside in the `src/contracts/client/` package.

## Objective

*   Define service clients for each controller in the API.
*   Ensure clients use the `ServiceClient` pattern and are event-bus agnostic.

## Process

1.  **Review API Endpoints**:
    Refer to your `diagrams/api.md` and the controllers implemented in `src/api/`. Each controller typically corresponds to a service client.

2.  **Implement Service Clients**:
    Create service client classes for each of the API controllers.
    *   Create new files in `src/contracts/client/` (e.g., `src/contracts/client/ServiceClient.ts`).
    *   Each client should extend the `ServiceClient` class from `src/contracts/helpers/ServiceClient.ts`.
    *   Implement methods that correspond to the API endpoints, dispatching commands and queries via the injected `IEventBus` (for client-side eventing) or `HttpClient` (for direct HTTP calls).
    *   Ensure the client is event-bus agnostic, meaning it can be injected with any `IEventBus` implementation (e.g., `SocketIOEventBus` for real-time communication, or a mock for testing).

    **My Role**: I will understand the API endpoints and the desired methods for each client. I will generate the service client classes, following the patterns in `src/contracts/client/ExampleClient.ts`.

## Next Step

Once the service clients are implemented, the core implementation of the new microservice is complete. I can now proceed to update the [Service Implementation Progress](progress.md) file and then consider deploying and integrating the service.
