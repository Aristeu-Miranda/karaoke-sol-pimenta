import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Header } from './index';
import { MemoryRouter } from 'react-router-dom'

vi.mock('~/images/logo-small.png', () => ({ default: 'logo.png' }));
vi.mock('~/images/back.png', () => ({ default: 'bg.png' }));

describe('Header', () => {
    it('renders logo and back images correctly', () => {
        render(
          <MemoryRouter>
            <Header />
          </MemoryRouter>
        );
        expect(screen.getByAltText('Sol & Pimenta')).toHaveAttribute('src', 'logo.png');
        expect(screen.getByAltText('Voltar')).toHaveAttribute('src', 'bg.png');
      });
    
      it('renders Link with content and correct href', () => {
        render(
          <MemoryRouter>
            <Header />
          </MemoryRouter>
        );
        const link = screen.getByRole('link');
        expect(screen.getByText('Voltar')).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/');
      });

})