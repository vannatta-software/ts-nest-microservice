# Tech Context

## Technologies Used
- **Backend Framework**: NestJS (TypeScript)
- **Language**: TypeScript
- **Database**: MongoDB (with Mongoose ODM)
- **Messaging/Event Bus**:
    - Kafka (via `kafka.bus.ts`)
    - RabbitMQ (via `rabbitmq.bus.ts`)
    - Redis (via `redis.bus.ts`)
- **WebSockets**: `@nestjs/platform-socket.io`, `socket.io`
- **API Documentation**: Swagger (`@nestjs/swagger`)
- **Testing**: Jest, Supertest
- **Containerization**: Docker, Docker Compose

## Development Setup
- **Node.js**: Version specified in `package.json` (e.g., 18.x, 20.x)
- **npm/yarn**: Package manager
- **MongoDB Instance**: Local or remote MongoDB server. A `docker-compose.yml` is provided for local setup.
- **Message Broker**: Depending on the chosen event bus, a running instance of Kafka, RabbitMQ, or Redis is required. `docker-compose.yml` can be extended for these.
- **Environment Variables**: `.env` file for configuration (e.g., database connection string, message broker URLs).

## Technical Constraints
- **TypeScript Only**: The project is strictly TypeScript-based.
- **NestJS Ecosystem**: Adherence to NestJS conventions and module system.
- **MongoDB as Primary DB**: Current setup is optimized for MongoDB. Switching to other databases would require significant changes to the `database` module.
- **Event Bus Implementation**: While multiple options are provided, only one can be active at a time.

## Dependencies
Refer to `package.json` for a comprehensive list of direct and development dependencies. Key dependencies include:
- `@nestjs/common`
- `@nestjs/core`
- `@nestjs/platform-express`
- `@nestjs/mongoose`
- `mongoose`
- `reflect-metadata`
- `rxjs`
- `class-transformer`
- `class-validator`
- `@nestjs/cqrs`
- `@nestjs/swagger`
- `swagger-ui-express`
- `kafkajs` (if Kafka bus is used)
- `amqplib` (if RabbitMQ bus is used)
- `ioredis` (if Redis bus is used)
- `@nestjs/platform-socket.io`
- `socket.io`

## Tool Usage Patterns
- **`npm install`**: To install dependencies.
- **`npm run start:dev`**: To run the application in development mode.
- **`npm run build`**: To compile the TypeScript code.
- **`npm run test`**: To run unit and E2E tests.
- **`docker-compose up -d`**: To start local MongoDB instance and potentially message brokers.
