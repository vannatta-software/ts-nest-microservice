import { ExampleMetadata } from '../../../src/domain/ExampleMetadata';

describe('ExampleMetadata', () => {
    it('should create an instance with default values if no partial is provided', () => {
        const metadata = new ExampleMetadata();
        expect(metadata.description).toBe('');
        expect(metadata.version).toBe(0);
    });

    it('should create an instance with provided partial values', () => {
        const partial = { description: 'Test Description', version: 1 };
        const metadata = new ExampleMetadata(partial);
        expect(metadata.description).toBe('Test Description');
        expect(metadata.version).toBe(1);
    });

    it('should update description and version correctly', () => {
        const metadata = new ExampleMetadata({ description: 'Old Description', version: 1 });
        metadata.update({ description: 'New Description', version: 2 });
        expect(metadata.description).toBe('New Description');
        expect(metadata.version).toBe(2);
    });

    it('should update only description if version is not provided in partial', () => {
        const metadata = new ExampleMetadata({ description: 'Old Description', version: 1 });
        metadata.update({ description: 'New Description' });
        expect(metadata.description).toBe('New Description');
        expect(metadata.version).toBe(1); // Version should remain unchanged
    });

    it('should update only version if description is not provided in partial', () => {
        const metadata = new ExampleMetadata({ description: 'Old Description', version: 1 });
        metadata.update({ version: 2 });
        expect(metadata.description).toBe('Old Description'); // Description should remain unchanged
        expect(metadata.version).toBe(2);
    });

    it('should return description as its string representation', () => {
        const metadata = new ExampleMetadata({ description: 'Test Description' });
        expect(metadata.toString()).toBe('Test Description');
    });

    it('should consider two ExampleMetadata objects with the same values as equal', () => {
        const metadata1 = new ExampleMetadata({ description: 'Test', version: 1 });
        const metadata2 = new ExampleMetadata({ description: 'Test', version: 1 });
        expect(metadata1.equals(metadata2)).toBe(true);
    });

    it('should consider two ExampleMetadata objects with different values as not equal', () => {
        const metadata1 = new ExampleMetadata({ description: 'Test1', version: 1 });
        const metadata2 = new ExampleMetadata({ description: 'Test2', version: 1 });
        expect(metadata1.equals(metadata2)).toBe(false);
    });

    it('should consider two ExampleMetadata objects with different versions as not equal', () => {
        const metadata1 = new ExampleMetadata({ description: 'Test', version: 1 });
        const metadata2 = new ExampleMetadata({ description: 'Test', version: 2 });

        expect(metadata1.equals(metadata2)).toBe(false);
    });

    it('should consider an ExampleMetadata object not equal to null or undefined', () => {
        const metadata = new ExampleMetadata({ description: 'Test', version: 1 });
        expect(metadata.equals(null)).toBe(false);
        expect(metadata.equals(undefined)).toBe(false);
    });
});
