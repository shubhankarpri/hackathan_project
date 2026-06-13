import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MotivationCard } from './MotivationCard';
import { BrowserRouter } from 'react-router-dom';

describe('MotivationCard Component', () => {
    it('renders the motivation card', () => {
        render(
            <BrowserRouter>
                <MotivationCard />
            </BrowserRouter>
        );
        expect(screen.getByText(/Personalized for your journey/i)).toBeDefined();
    });

    it('displays a quote', () => {
        render(
            <BrowserRouter>
                <MotivationCard />
            </BrowserRouter>
        );
        // Checking if a quote or author is rendered (since they are random)
        const quoteElement = screen.getByTestId('motivation-quote');
        expect(quoteElement).toBeDefined();
    });
});
