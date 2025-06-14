import { GetAllExamplesQuery, GetExampleByIdQuery, GetExampleByNameQuery } from '@ts-nest-microservice/contracts/Queries';
import { Model } from '@vannatta-software/ts-utils-domain';

// Mock ApiException if it's not globally available or needs specific behavior
class ApiException extends Error {
    constructor(message: string, public errors: any) {
        super(message);
        this.name = 'ApiException';
    }
}

describe('Queries', () => {
    describe('GetAllExamplesQuery', () => {
        it('should create a query with valid properties', () => {
            const query = new GetAllExamplesQuery();
            query.name = 'Test Name';
            expect(query.name).toBe('Test Name');
        });

        it('should have validation decorators applied', () => {
            const query = new GetAllExamplesQuery();
            expect(query.validation).toBeDefined();
            expect(query.validation.name).toBeDefined();
            expect(query.validation.name[0].required).toBe(false);
            expect(query.validation.name[0].type).toBe('string');
            expect(query.validation.name[0].max).toBe(100);
        });

        it('should validate a valid model', () => {
            const query = new GetAllExamplesQuery();
            query.name = 'Valid Name';

            const validation = Model.validate(query);
            expect(validation.isValid).toBe(true);
            expect(Object.keys(validation.errors).length).toBe(0);
        });

        it('should invalidate a model with name exceeding max length', () => {
            const query = new GetAllExamplesQuery();
            query.name = 'a'.repeat(101); // Exceeds max length

            const validation = Model.validate(query);
            expect(validation.isValid).toBe(false);
            expect(validation.errors.name).toBeDefined();
        });
    });

    describe('GetExampleByIdQuery', () => {
        it('should create a query with valid id', () => {
            const query = new GetExampleByIdQuery();
            query.id = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
            expect(query.id).toBe('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d');
        });

        it('should have validation decorators applied', () => {
            const query = new GetExampleByIdQuery();
            expect(query.validation).toBeDefined();
            expect(query.validation.id).toBeDefined();
            expect(query.validation.id[0].required).toBe(true);
            expect(query.validation.id[0].type).toBe('string');
            expect(query.validation.id[0].pattern).toBeDefined();
        });

        it('should validate a valid model', () => {
            const query = new GetExampleByIdQuery();
            query.id = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';

            const validation = Model.validate(query);
            expect(validation.isValid).toBe(true);
            expect(Object.keys(validation.errors).length).toBe(0);
        });

        it('should invalidate a model with missing required id', () => {
            const query = new GetExampleByIdQuery(); // Missing id

            const validation = Model.validate(query);
            expect(validation.isValid).toBe(false);
            expect(validation.errors.id).toBeDefined();
        });

        it('should invalidate a model with invalid id format', () => {
            const query = new GetExampleByIdQuery();
            query.id = 'invalid-uuid'; // Invalid UUID format

            const validation = Model.validate(query);
            expect(validation.isValid).toBe(false);
            expect(validation.errors.id).toBeDefined();
        });
    });

    describe('GetExampleByNameQuery', () => {
        it('should create a query with valid name', () => {
            const query = new GetExampleByNameQuery();
            query.name = 'Example Name';
            expect(query.name).toBe('Example Name');
        });

        it('should have validation decorators applied', () => {
            const query = new GetExampleByNameQuery();
            expect(query.validation).toBeDefined();
            expect(query.validation.name).toBeDefined();
            expect(query.validation.name[0].required).toBe(true);
            expect(query.validation.name[0].type).toBe('string');
            expect(query.validation.name[0].max).toBe(100);
        });

        it('should validate a valid model', () => {
            const query = new GetExampleByNameQuery();
            query.name = 'Valid Name';

            const validation = Model.validate(query);
            expect(validation.isValid).toBe(true);
            expect(Object.keys(validation.errors).length).toBe(0);
        });

        it('should invalidate a model with missing required name', () => {
            const query = new GetExampleByNameQuery(); // Missing name

            const validation = Model.validate(query);
            expect(validation.isValid).toBe(false);
            expect(validation.errors.name).toBeDefined();
        });

        it('should invalidate a model with name exceeding max length', () => {
            const query = new GetExampleByNameQuery();
            query.name = 'a'.repeat(101); // Exceeds max length

            const validation = Model.validate(query);
            expect(validation.isValid).toBe(false);
            expect(validation.errors.name).toBeDefined();
        });
    });
});
