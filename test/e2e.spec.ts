import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/main';
import { ChatClient } from '../src/contracts/client/ChatClient';

describe('Chat Service E2E Tests', () => {
    let client: ChatClient;

    beforeAll(async () => {
        // Initialize client
        client = new ChatClient('http://localhost:3001');
    });

    describe('Assistants', () => {
        let assistantId: string;

        it('should create an assistant', async () => {
            const assistant = await client.createAssistant({
                type: 'chat',
                name: 'TestBot',
                instructions: 'You are a test assistant',
                responses: []
            });

            expect(assistant).toBeDefined();
            expect(assistant.id).toBeDefined();
            expect(assistant.name).toBe('TestBot');
            
            assistantId = assistant.id.value;
        });

        it('should get assistant by id', async () => {
            const assistant = await client.getAssistantById({ id: assistantId});
            expect(assistant).toBeDefined();
            expect(assistant.id).toBe(assistantId);
        });

        it('should update assistant', async () => {
            const updated = await client.updateAssistant({
                id: assistantId,
                name: 'UpdatedBot'
            });

            expect(updated.name).toBe('UpdatedBot');
        });

        it('should search assistants', async () => {
            const results = await client.searchAssistants({
                name: 'Updated'
            });

            expect(results).toBeInstanceOf(Array);
            expect(results.length).toBeGreaterThan(0);
            expect(results[0].name).toContain('Updated');
        });

        it('should delete assistant', async () => {
            await client.deleteAssistant(assistantId);
            
            // Verify deletion
            await expect(
                client.getAssistantById({ id:assistantId})
            ).rejects.toThrow();
        });
    });

    describe('Validation', () => {
        it('should fail with invalid assistant name', async () => {
            await expect(
                client.createAssistant({
                    type: 'chat',
                    name: '', // Invalid - required
                    instructions: 'Test instructions',
                    responses: []
                })
            ).rejects.toThrow();
        });

        it('should accept empty name in search', async () => {
            const results = await client.searchAssistants({
                name: ''
            });
            expect(results).toBeInstanceOf(Array);
        });
    });
});
