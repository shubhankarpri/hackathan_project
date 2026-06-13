import { describe, it, expect, vi } from 'vitest';
import { analyzeJournal, getDailyMotivation } from './gemini';

// Mock the GoogleGenerativeAI SDK
vi.mock('@google/generative-ai', () => {
    const generateContentMock = vi.fn().mockResolvedValue({
        response: {
            text: () => JSON.stringify({
                emotionalSummary: "Test summary",
                stressLevel: 5,
                motivationLevel: 7,
                burnoutRisk: "Low",
                positiveObservations: ["Good job"],
                concerns: ["None"],
                personalizedAdvice: "Keep going",
                triggers: ["Work"]
            })
        }
    });

    const getGenerativeModelMock = vi.fn().mockReturnValue({
        generateContent: generateContentMock
    });

    return {
        GoogleGenerativeAI: class {
            getGenerativeModel = getGenerativeModelMock;
        }
    };
});

describe('Gemini Service', () => {
    it('should return structured analysis result', async () => {
        const result = await analyzeJournal("I feel great today");
        expect(result).toHaveProperty('emotionalSummary');
        expect(result.stressLevel).toBe(5);
    });

    it('should handle motivational quote generation', async () => {
        // Need to override mock for non-JSON response if necessary, 
        // but for simplicity we assume the mock works for both.
        const result = await getDailyMotivation("Happy");
        expect(typeof result).toBe('string');
    });
});
