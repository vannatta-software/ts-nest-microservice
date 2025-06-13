# API Endpoints Documentation

This file will document the API endpoints exposed by the new microservice.

During the "API Implementation" phase of the workflow (`workflows/06-api-implementation.md`), I will populate this file based on input.

## Endpoints:

### Example Management API

#### `POST /examples`

*   **Description**: Creates a new example.
*   **Request Body**: `CreateExampleCommand` (from `src/contracts/Commands.ts`)
    ```json
    {
        "name": "string",
        "description": "string",
        "version": "number",
        "type?": "string"
    }
    ```
*   **Responses**:
    *   `201 Created`: Example successfully created.
        ```json
        {
            "id": "string",
            "name": "string",
            "metadata": {
                "description": "string",
                "version": "number"
            },
            "type": {
                "id": "number",
                "name": "string"
            }
        }
        ```
    *   `400 Bad Request`: Invalid input.

#### `PUT /examples`

*   **Description**: Updates an existing example.
*   **Request Body**: `UpdateExampleCommand` (from `src/contracts/Commands.ts`)
    ```json
    {
        "id": "string",
        "name?": "string",
        "metadata?": {
            "description": "string",
            "version": "number"
        },
        "type?": "number"
    }
    ```
*   **Responses**:
    *   `200 OK`: Example successfully updated.
        ```json
        {
            "id": "string",
            "name": "string",
            "metadata": {
                "description": "string",
                "version": "number"
            },
            "type": {
                "id": "number",
                "name": "string"
            }
        }
        ```
    *   `400 Bad Request`: Invalid input.
    *   `404 Not Found`: Example not found.

#### `DELETE /examples/{id}`

*   **Description**: Deletes an existing example by ID.
*   **Path Parameters**:
    *   `id`: Unique identifier of the example.
*   **Responses**:
    *   `200 OK`: Example successfully deleted.
    *   `404 Not Found`: Example not found.

#### `GET /examples/{id}`

*   **Description**: Retrieves example details by ID.
*   **Path Parameters**:
    *   `id`: Unique identifier of the example.
*   **Responses**:
    *   `200 OK`: Returns example details.
        ```json
        {
            "id": "string",
            "name": "string",
            "metadata": {
                "description": "string",
                "version": "number"
            },
            "type": {
                "id": "number",
                "name": "string"
            }
        }
        ```
    *   `404 Not Found`: Example not found.

#### `GET /examples`

*   **Description**: Searches for examples.
*   **Query Parameters**: `GetAllExamplesQuery` (from `src/contracts/Queries.ts`)
    *   `name?`: Optional name to filter examples by.
*   **Responses**:
    *   `200 OK`: Returns a list of examples.
        ```json
        [
            {
                "id": "string",
                "name": "string",
                "metadata": {
                    "description": "string",
                    "version": "number"
                },
                "type": {
                    "id": "number",
                    "name": "string"
                }
            }
        ]
