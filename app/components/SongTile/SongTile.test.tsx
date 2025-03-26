import { fireEvent, render, screen } from '@testing-library/react';
import {  afterEach, describe, expect, it, vi } from 'vitest';
import { SongTile } from '.';

vi.mock('~/images/heart-filled.png', () => ({ default: 'heart-filled.png'}))
vi.mock('~/images/heart-blank.svg', () => ({ default: 'heart-blank.svg' }))

describe('SongTile', () => {
    const mockArtist = {
        id: '1',
        name: 'Test Artist',
        image_url: 'test-image.jpg',
        country: 'Nacional' as const,
        pinned: false,
    }
    const mockSongs = {
        id: '1',
        code: '19681',
        title: 'ArtistTitle',
        artist: mockArtist,
        lyricsSnippet: 'ArtistDescription',
        country: 'Nacional' as const,
    }
    const mockOnPin = vi.fn();
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders song title and code', () => {
        render(<SongTile song={mockSongs} onPin={mockOnPin} variant='result' />)
        expect(screen.getByText('ArtistTitle')).toBeInTheDocument();
        expect(screen.getByText('19681')).toBeInTheDocument();
    })
    it('renders description artist is valid', () => {
        render(<SongTile song={mockSongs} onPin={mockOnPin} variant='result' />)
        expect(screen.getByText('Test Artist')).toBeInTheDocument();
        render(<SongTile song={mockSongs} onPin={mockOnPin} variant='artistList' />)
        expect(screen.getByText('ArtistDescription')).toBeInTheDocument();
    })
    it('renders heart icon pinned by state', () => {
        render(<SongTile song={mockSongs} onPin={mockOnPin} variant="result" />);
        expect(screen.getByAltText('Clique para favoritar')).toHaveAttribute('src', 'heart-blank.svg')
        const pinnedSong = { ...mockSongs, pinned: true };
        render(<SongTile song={pinnedSong} onPin={mockOnPin} variant="result" />);
        expect(screen.getByAltText('Clique para desfavoritar')).toHaveAttribute('src', 'heart-filled.png')
    })
    it('calls onPin when heart button is clicked', () => {
        render(<SongTile song={mockSongs} onPin={mockOnPin} variant='result' />)
        const btn = screen.getByAltText('Clique para favoritar')
        fireEvent.click(btn)
        expect(mockOnPin).toHaveBeenCalledWith(mockSongs)
    })
})