import { render, screen } from '@testing-library/react';
import {  describe, expect, it, vi } from 'vitest';
import { Footer } from './index';

vi.mock('~/images/2tp-light.png', () => ({ default: '2tp.png' }));

describe('Footer', () => {
    it('renders paragraph and img component correctly', () => {
        render(<Footer />)
        expect(screen.getByText('Desenvolvido por 2tp tecnologia').parentElement)
        expect(screen.getByAltText('2tp tecnologia')).toHaveAttribute('src', '2tp.png')
    })
})