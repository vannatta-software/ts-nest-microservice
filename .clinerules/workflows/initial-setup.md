# 01 - Initial Setup

This is the first step in setting up the new microservice. It involves transforming the generic template into the specific service and configuring its environment variables.
 
## Objective

*   Run the `npm run transform` script to customize the template.
*   Understand the changes made to the `.env` file.

## Process

1.  **Run the Transformation Script**:
    Execute the following command in the terminal:

    ```bash
    npm run transform
    ```

    This script will guide through a series of prompts to name the new microservice and configure initial settings. It will automatically update relevant files, including the `.env` file.

2.  **Review `.env` Changes**:
    After the script completes, open the `.env` file in the root of the project. Review the variables that have been updated or added based on input during the transformation process. These variables typically include:
    *   `SERVICE_NAME`: The name of your microservice.
    *   `PORT`: The port on which your microservice will run.
    *   `MONGO_URI`: Your MongoDB connection string.
    *   `RABBITMQ_URL`: Your RabbitMQ connection string.
    *   `EVENT_BUS_TYPE`: Set to `rabbitmq` (or `base` for in-memory local development).

    Ensure these values are correct for the development environment.

## Next Step

Once the `npm run transform` script has been successfully run and the `.env` file reviewed, proceed to the [Domain Discovery](02-domain-discovery.md) phase.
