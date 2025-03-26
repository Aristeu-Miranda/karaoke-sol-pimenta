import { render, screen } from '@testing-library/react';
import {  describe, expect, it } from 'vitest';
import { SectionTitle } from './index';

describe('SectionTitle', () => {
    it('Check if children element is valid', () => {
        render(<SectionTitle children='Test' />)
        expect(screen.getByText('Test')).toBeInTheDocument()
    })
})