import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage Hook', () => {
    beforeEach(() => {
        window.localStorage.clear();
        vi.clearAllMocks();
    });

    it('should initialize with default value', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));
        expect(result.current[0]).toBe('default-value');
    });

    it('should update value and localStorage', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

        act(() => {
            result.current[1]('new-value');
        });

        expect(result.current[0]).toBe('new-value');
        expect(window.localStorage.getItem('test-key')).toBe(JSON.stringify('new-value'));
    });

    it('should load initial value from localStorage', () => {
        window.localStorage.setItem('test-key', JSON.stringify('stored-value'));
        const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
        expect(result.current[0]).toBe('stored-value');
    });
});
