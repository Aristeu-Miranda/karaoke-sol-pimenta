import { render, screen } from '@testing-library/react';
import {  describe, expect, it } from 'vitest';
import { Container } from './index';

describe('CodeBagde', () => {
    it('Check if children element is valid', () => {
        render(<Container children='Test' />)
        expect(screen.getByText('Test')).toBeInTheDocument()
    })
})