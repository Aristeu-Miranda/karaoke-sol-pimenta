import { render, screen, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ArtistTile } from './index';

vi.mock('~/images/not-found.png', () => ({ default: 'not-found.png' }));
vi.mock('~/images/heart-filled.png', () => ({ default: 'heart-filled.png' }));
vi.mock('~/images/heart-blank.svg', () => ({ default: 'heart-blank.svg' }));

vi.mock('~/utils', () => ({
  cn: (...args: string[]) => args.filter(Boolean).join(' '),
}));

describe('ArtistTile', () => {
  const mockArtist = {
    id: '1',
    name: 'Test Artist',
    image_url: 'test-image.jpg',
    country: 'Nacional' as const,
    pinned: false,
  };

  const mockOnTileClick = vi.fn();
  const mockOnPinClick = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders artist name and image correctly', () => {
    render(<ArtistTile artist={mockArtist} />);
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    expect(screen.getByAltText('Test Artist')).toHaveAttribute('src', 'test-image.jpg');
  });

  it('renders not-found image when no image_url is provided', () => {
    const artistNoImage = { ...mockArtist, image_url: '' };
    render(<ArtistTile artist={artistNoImage} />);
    expect(screen.getByAltText('Test Artist')).toHaveAttribute('src', 'not-found.png');
  });

  it('handles tile click correctly', () => {
    render(<ArtistTile artist={mockArtist} onTileClick={mockOnTileClick} />);
    const tileButton = screen.getByText('Test Artist').parentElement!;
    fireEvent.click(tileButton);
    expect(mockOnTileClick).toHaveBeenCalledWith('1');
  });

  it('handles pin click correctly', () => {
    render(<ArtistTile artist={mockArtist} onPinClick={mockOnPinClick} />);
    const pinButton = screen.getByAltText('Clique para favoritar');
    fireEvent.click(pinButton);
    expect(mockOnPinClick).toHaveBeenCalledWith(mockArtist);
  });

  it('shows correct heart icon based on pinned status', () => {
    const pinnedArtist = { ...mockArtist, pinned: true };
    render(<ArtistTile artist={pinnedArtist} />);
    expect(screen.getByAltText('Clique para desfavoritar')).toHaveAttribute('src', 'heart-filled.png');
    render(<ArtistTile artist={mockArtist} />);
    expect(screen.getByAltText('Clique para favoritar')).toHaveAttribute('src', 'heart-blank.svg');
  });

  it('applies correct size variants', () => {
    const { rerender } = render(<ArtistTile artist={mockArtist} variant="small" />);
    const smallImage = screen.getByAltText('Test Artist');
    const smallText = screen.getByText('Test Artist');
    expect(smallImage).toHaveClass('w-12 h-12');
    expect(smallText).toHaveClass('text-sm');

    rerender(<ArtistTile artist={mockArtist} variant="medium" />);
    const mediumImage = screen.getByAltText('Test Artist');
    const mediumText = screen.getByText('Test Artist');
    expect(mediumImage).toHaveClass('w-16 h-16');
    expect(mediumText).toHaveClass('text-xl');
  });

  it('hides pin button when variant is medium', () => {
    render(<ArtistTile artist={mockArtist} variant="medium" />);
    expect(screen.queryByAltText(/Clique para/)).not.toBeInTheDocument();
  });
});