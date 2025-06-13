# Domain Events

This file will list and describe the domain events for the new microservice.

During the "Domain Discovery" phase of the workflow (`workflows/02-domain-discovery.md`), I will populate this file based on input.

## Events:

### `ExampleCreatedEvent`

*   **Purpose**: Signifies that a new Example aggregate has been successfully created.
*   **Data**:
    *   `exampleId`: Unique identifier of the created Example.

### `ExampleDeletedEvent`

*   **Purpose**: Indicates that an Example aggregate has been successfully deleted.
*   **Data**:
    *   `exampleId`: Unique identifier of the deleted Example.

### `ExampleMetadataUpdatedEvent`

*   **Purpose**: Signifies that the metadata of an Example aggregate has been updated.
*   **Data**:
    *   `exampleId`: Unique identifier of the Example whose metadata was updated.
    *   `metadata`: The updated metadata of the Example.

### `ExampleTypeChangedEvent`

*   **Purpose**: Indicates that the type of an Example aggregate has been changed.
*   **Data**:
    *   `exampleId`: Unique identifier of the Example whose type was changed.
    *   `newType`: The new type of the Example.
