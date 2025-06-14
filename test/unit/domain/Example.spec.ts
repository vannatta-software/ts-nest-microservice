import { Example } from '../../../src/domain/Example';
import { ExampleMetadata } from '../../../src/domain/ExampleMetadata';
import { ExampleType } from '../../../src/domain/ExampleType';
import * as Events from '../../../src/domain/Events';
import { GlobalIdentifier, UniqueIdentifier } from '@vannatta-software/ts-utils-domain';

describe('Example', () => {
    let example: Example;
    const exampleId = GlobalIdentifier.newGlobalIdentifier();
    const exampleName = 'Test Example';
    const exampleDescription = 'This is a test example.';
    const exampleVersion = 1;

    beforeEach(() => {
        example = new Example({
            id: exampleId,
            name: new UniqueIdentifier({ value: exampleName }),
            metadata: new ExampleMetadata({ description: exampleDescription, version: exampleVersion }),
            type: ExampleType.Default,
        });
    });

    it('should be created with correct properties', () => {
        expect(example.id.value).toBe(exampleId.value);
        expect(example.name.value).toBe(exampleName);
        expect(example.metadata.description).toBe(exampleDescription);
        expect(example.metadata.version).toBe(exampleVersion);
        expect(example.type).toEqual(ExampleType.Default);
    });

    it('should create an ExampleCreatedEvent when create is called', () => {
        const addDomainEventSpy = jest.spyOn(example as any, 'addDomainEvent');
        example.create();
        expect(addDomainEventSpy).toHaveBeenCalledTimes(1);
        expect(addDomainEventSpy).toHaveBeenCalledWith(expect.any(Events.ExampleCreatedEvent));
        const event = addDomainEventSpy.mock.calls[0][0] as Events.ExampleCreatedEvent;
        expect(event.exampleId).toBe(exampleId.value);
        addDomainEventSpy.mockRestore();
    });

    it('should create an ExampleDeletedEvent when delete is called', () => {
        const addDomainEventSpy = jest.spyOn(example as any, 'addDomainEvent');
        example.delete();
        expect(addDomainEventSpy).toHaveBeenCalledTimes(1);
        expect(addDomainEventSpy).toHaveBeenCalledWith(expect.any(Events.ExampleDeletedEvent));
        const event = addDomainEventSpy.mock.calls[0][0] as Events.ExampleDeletedEvent;
        expect(event.exampleId).toBe(exampleId.value);
        addDomainEventSpy.mockRestore();
    });

    it('should change type and create an ExampleTypeChangedEvent', () => {
        const addDomainEventSpy = jest.spyOn(example as any, 'addDomainEvent');
        const newType = ExampleType.Other;
        example.changeType(newType);
        expect(example.type).toBe(newType);
        expect(addDomainEventSpy).toHaveBeenCalledTimes(1);
        expect(addDomainEventSpy).toHaveBeenCalledWith(expect.any(Events.ExampleTypeChangedEvent));
        const event = addDomainEventSpy.mock.calls[0][0] as Events.ExampleTypeChangedEvent;
        expect(event.exampleId).toBe(exampleId.value);
        expect(event.newType).toEqual(newType);
        addDomainEventSpy.mockRestore();
    });

    it('should change metadata and create an ExampleMetadataUpdatedEvent', () => {
        const addDomainEventSpy = jest.spyOn(example as any, 'addDomainEvent');
        const newMetadataPartial = { description: 'Updated Description', version: 2 };
        example.changeMetadata(newMetadataPartial);
        expect(example.metadata.description).toBe('Updated Description');
        expect(example.metadata.version).toBe(2);
        expect(addDomainEventSpy).toHaveBeenCalledTimes(1);
        expect(addDomainEventSpy).toHaveBeenCalledWith(expect.any(Events.ExampleMetadataUpdatedEvent));
        const event = addDomainEventSpy.mock.calls[0][0] as Events.ExampleMetadataUpdatedEvent;
        expect(event.exampleId).toBe(exampleId.value);
        expect(event.metadata).toEqual(newMetadataPartial);
        addDomainEventSpy.mockRestore();
    });

    it('should return name as its string representation', () => {
        expect(example.toString()).toBe(exampleName);
    });
});
