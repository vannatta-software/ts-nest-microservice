import { ExampleType } from '../../../src/domain/ExampleType';

describe('ExampleType', () => {
    it('should have Default and Other types', () => {
        expect(ExampleType.Default).toBeInstanceOf(ExampleType);
        expect(ExampleType.Other).toBeInstanceOf(ExampleType);
        expect(ExampleType.Default.name).toBe('Default');
        expect(ExampleType.Other.name).toBe('Other');
    });

    it('should return all type names', () => {
        const types = new ExampleType().getNames();
        expect(types).toEqual(expect.arrayContaining(['Default', 'Other']));
        expect(types.length).toBe(2);
    });

    it('should be able to create a new ExampleType instance', () => {
        const customType = new ExampleType({ id: 2, name: 'Custom' });
        expect(customType).toBeInstanceOf(ExampleType);
        expect(customType.name).toBe('Custom');
        expect(customType.id).toBe(2);
    });
});
