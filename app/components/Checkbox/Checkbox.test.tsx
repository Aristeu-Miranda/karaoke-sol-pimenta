import { render, screen, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Checkbox } from './index';

vi.mock('~/images/check.png', () => ({ default: 'check.png' }));
vi.mock('Nacionais', () => ({ default: 'Nacionais' }))
vi.mock('react', () => ({ useId: () => 'mock-id' }))

describe('Checkbox', () => {

    afterEach(() => {
        vi.clearAllMocks();
    });
    it('renders default checkbox unchecked', () => {
        render(<Checkbox label="Nacionais" />)
        const checkbox = screen.getByRole('checkbox')
        expect(checkbox).toHaveAttribute('data-state', 'unchecked')
    })
    it('renders checkbox with image and useId correctly', () => {
        render(<Checkbox label={"Nacionais"} />);
        const checkbox = screen.getByRole('checkbox')
        fireEvent.click(checkbox)
        expect(screen.getByAltText('Check')).toHaveAttribute('src', 'check.png')
        expect(checkbox).toHaveAttribute('id', 'mock-id')
    })
    it('renders the label and useId correctly', () => {
        render(<Checkbox label={"Nacionais"} />);
        const label = screen.getByText('Nacionais')
        expect(label).toBeInTheDocument();
        expect(label).toHaveAttribute('for', 'mock-id')
    })
    it('toggles state on click', () => {
        render(<Checkbox label={"Nacionais"} />);
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(checkbox).toHaveAttribute('data-state', 'checked');
        fireEvent.click(checkbox);
        expect(checkbox).toHaveAttribute('data-state', 'unchecked')
    })
    it('applie props', () => {
        render(<Checkbox label={"Nacionais"} disabled={true} />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeDisabled();
    });
})