import { describe, it, expect } from 'vitest';
import { calculateWellnessScore, getMoodScore, getWellnessCategory } from './wellness';

describe('Wellness Logic', () => {
    it('should calculate correct wellness score', () => {
        const log = {
            id: '1',
            date: new Date().toISOString(),
            mood: 'Excellent' as const,
            studyHours: 6,
            sleepHours: 8,
            energyLevel: 8,
            focusLevel: 8
        };
        const score = calculateWellnessScore(log);
        expect(score).toBeGreaterThan(80);
    });

    it('should penalize low sleep', () => {
        const log = {
            id: '2',
            date: new Date().toISOString(),
            mood: 'Good' as const,
            studyHours: 6,
            sleepHours: 3, // Very low sleep
            energyLevel: 5,
            focusLevel: 5
        };
        const score = calculateWellnessScore(log);
        expect(score).toBeLessThan(70);
    });

    it('should correctly score different moods', () => {
        expect(getMoodScore('Excellent')).toBe(100);
        expect(getMoodScore('Exhausted')).toBe(20);
        expect(getMoodScore('Stressed')).toBe(40);
    });

    it('should return correct categories', () => {
        expect(getWellnessCategory(95).label).toBe('Excellent');
        expect(getWellnessCategory(75).label).toBe('Good');
        expect(getWellnessCategory(30).label).toBe('Needs Attention');
    });
});
