# Service Behaviors

This file will describe the key application-wide functions (behaviors) that the new microservice will provide.

During the "Domain Discovery" phase of the workflow (`workflows/02-domain-discovery.md`), I will populate this file based on input.

## Behaviors:

### Create Example

*   **Purpose**: Creates a new instance of the Example aggregate.
*   **Domain Elements Involved**: `Example` (Aggregate), `UniqueIdentifier` (Value Object), `ExampleMetadata` (Value Object), `ExampleType` (Enumeration).
*   **Events Triggered**: `ExampleCreatedEvent` (Domain Event).
*   **Flow**:
    1.  Receive command/request to create an Example.
    2.  Instantiate `Example` aggregate.
    3.  Call `example.create()`.
    4.  Persist `Example` to database.
    5.  Publish `ExampleCreatedEvent`.

### Delete Example

*   **Purpose**: Deletes an existing instance of the Example aggregate.
*   **Domain Elements Involved**: `Example` (Aggregate).
*   **Events Triggered**: `ExampleDeletedEvent` (Domain Event).
*   **Flow**:
    1.  Receive command/request to delete an Example.
    2.  Retrieve `Example` aggregate from database.
    3.  Call `example.delete()`.
    4.  Persist (mark as deleted) `Example` in database.
    5.  Publish `ExampleDeletedEvent`.

### Change Example Type

*   **Purpose**: Changes the type of an existing Example aggregate.
*   **Domain Elements Involved**: `Example` (Aggregate), `ExampleType` (Enumeration).
*   **Events Triggered**: `ExampleTypeChangedEvent` (Domain Event).
*   **Flow**:
    1.  Receive command/request to change Example type.
    2.  Retrieve `Example` aggregate from database.
    3.  Call `example.changeType(newType)`.
    4.  Persist `Example` to database.
    5.  Publish `ExampleTypeChangedEvent`.

### Update Example Metadata

*   **Purpose**: Updates the metadata of an existing Example aggregate.
*   **Domain Elements Involved**: `Example` (Aggregate), `ExampleMetadata` (Value Object).
*   **Events Triggered**: `ExampleMetadataUpdatedEvent` (Domain Event).
*   **Flow**:
    1.  Receive command/request to update Example metadata.
    2.  Retrieve `Example` aggregate from database.
    3.  Call `example.changeMetadata(newMetadata)`.
    4.  Persist `Example` to database.
    5.  Publish `ExampleMetadataUpdatedEvent`.
