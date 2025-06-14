import {
    ExampleCreatedEvent,
    ExampleDeletedEvent,
    ExampleMetadataUpdatedEvent,
    ExampleTypeChangedEvent,
} from '../../../src/domain/Events';
import { ExampleMetadata } from '../../../src/domain/ExampleMetadata';
import { ExampleType } from '../../../src/domain/ExampleType';

describe('Domain Events', () => {
    const exampleId = 'test-example-id';

    it('ExampleCreatedEvent should be created correctly', () => {
        const event = new ExampleCreatedEvent(exampleId);
        expect(event.exampleId).toBe(exampleId);
        expect(event.dateTimeOccurred).toBeInstanceOf(Date);
    });

    it('ExampleDeletedEvent should be created correctly', () => {
        const event = new ExampleDeletedEvent(exampleId);
        expect(event.exampleId).toBe(exampleId);
        expect(event.dateTimeOccurred).toBeInstanceOf(Date);
    });

    it('ExampleMetadataUpdatedEvent should be created correctly', () => {
        const metadata = new ExampleMetadata({ description: 'New Desc', version: 2 });
        const event = new ExampleMetadataUpdatedEvent(exampleId, metadata);
        expect(event.exampleId).toBe(exampleId);
        expect(event.metadata).toEqual({ description: 'New Desc', version: 2 });
        expect(event.dateTimeOccurred).toBeInstanceOf(Date);
    });

    it('ExampleTypeChangedEvent should be created correctly', () => {
        const newType = ExampleType.Other;
        const event = new ExampleTypeChangedEvent(exampleId, newType);
        expect(event.exampleId).toBe(exampleId);
        expect(event.newType).toBe(newType);
        expect(event.dateTimeOccurred).toBeInstanceOf(Date);
    });
});
