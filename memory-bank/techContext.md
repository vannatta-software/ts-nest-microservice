# Tech Context

## Technologies Used
- **Backend Framework**: NestJS (TypeScript)
- **Language**: TypeScript
- **Databases**:
    - MongoDB (with Mongoose ODM)
- **Messaging/Event Bus**:
    - Base Event Bus (in-memory for local dev)
    - RabbitMQ (via `amqplib`)
- **WebSockets**: `@nestjs/platform-socket.io`, `socket.io`
- **API Documentation**: Swagger (`@nestjs/swagger`)
- **Testing**: Jest, Supertest
- **Containerization**: Docker, Docker Compose

## Development Setup
- **Node.js**: Version specified in `package.json` (e.g., 18.x, 20.x)
- **npm/yarn**: Package manager
- **Database Instances**: Local or remote instances of MongoDB. `docker-compose.yml` can be extended for local setup of these.
- **Message Brokers**: Running instances of RabbitMQ are required. `docker-compose.yml` can be extended for these.
- **Environment Variables**: `.env` file for configuration (e.g., database connection strings, message broker URLs, `EVENT_BUS_TYPE`).

## Technical Constraints
- **TypeScript Only**: The project is strictly TypeScript-based.
- **NestJS Ecosystem**: Adherence to NestJS conventions and module system.
- **Dynamic Schema Mapping**: While implemented, complex relations might require more advanced configuration or build-time solutions.
- **Event Bus Implementation**: RabbitMQ is the primary server-side event bus.
- **`amqplib` Type Issues**: Current workaround with `any` casts for `amqplib` types in `RabbitMQEventBus` needs a proper resolution in a production context.

## Dependencies
Refer to `package.json` for a comprehensive list of direct and development dependencies. Key new/updated dependencies include:
- `amqplib`
- `socket.io-client` (in `contracts` package)
- `@vannatta-software/ts-utils-core` (for reflection metadata)
- `@vannatta-software/ts-utils-domain` (for `Entity`, `GlobalIdentifier`)

## Template Customization Guide

This template is designed for flexibility.

### Event Bus Implementations

The template defaults to RabbitMQ for the server-side event bus.

1.  **Set `EVENT_BUS_TYPE`**: In your `.env` file, set `EVENT_BUS_TYPE` to `rabbitmq` (or `base` for in-memory local development).

    Example: `EVENT_BUS_TYPE=rabbitmq`

2.  **Configure `infrastructure.module.ts`**: The `EventBus.Provider` in `src/infrastructure/infrastructure.module.ts` already uses this environment variable to select the appropriate event bus. Ensure that the necessary dependencies for your chosen event bus are installed (e.g., `amqplib` for RabbitMQ).

3.  **Environment Variables**: Update your `.env` file with the connection details for RabbitMQ (e.g., `RABBITMQ_URL`).

### Client-Side Event Bus

For client-side applications importing the `contracts` package, the `ServiceClient` no longer defaults to `SocketIOEventBus`. You need to explicitly attach an event bus.

Example of attaching `SocketIOEventBus` to `ExampleClient`:

```typescript
import { ExampleClient, SocketIOEventBus } from '@ts-nest-microservice/contracts';

const httpClientUrl = 'http://localhost:3000/api';
const socketIoUrl = 'http://localhost:3000'; // Your WebSocket server URL

const exampleClient = new ExampleClient(httpClientUrl);
const socketEventBus = new SocketIOEventBus(socketIoUrl);

exampleClient.setEventBus(socketEventBus); // Attach the event bus
exampleClient.connect(new YourWebSocketImplementation(socketIoUrl)); // Connect the socket
```

This modular approach allows you to easily adapt the template to different infrastructure requirements.

## Tool Usage Patterns
- **`npm install`**: To install dependencies.
- **`npm run start:dev`**: To run the application in development mode.
- **`npm run build`**: To compile the TypeScript code.
- **`npm run test`**: To run unit and E2E tests.
