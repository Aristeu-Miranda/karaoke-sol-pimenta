import { render, screen } from '@testing-library/react';
import {  describe, expect, it } from 'vitest';
import { CodeBadge } from './index';

describe('CodeBagde', () => {
    it('Check if children element is valid', () => {
        render(<CodeBadge children="Test" />)
        expect(screen.getByText('Test')).toBeInTheDocument()
    })
})