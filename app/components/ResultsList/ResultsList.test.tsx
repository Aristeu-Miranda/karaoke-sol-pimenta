import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ResultList } from "./index";
import { MemoryRouter } from "react-router-dom";

describe("ResultsList", () => {
  const mockArtistPin = vi.fn();
  const mockSongPin = vi.fn();
  
  const mockArtist = {
    id: "1",
    name: "Test Artist",
    image_url: "test-image.jpg",
    country: "Nacional" as const,
    pinned: false,
    kind: "artist" as const,
  };
  
  const mockSong = {
    id: "1",
    code: "19681",
    title: "ArtistTitle",
    artist: mockArtist,
    lyricsSnippet: "ArtistDescription",
    country: "Nacional" as const,
    kind: "song" as const,
    pinned: false,
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows message when empty", () => {
    render(
      <MemoryRouter>
        <ResultList
          loading={false}
          results={{ artistsResult: [], songsResult: [] }}
          onArtistPin={mockArtistPin}
          onSongPin={mockSongPin}
        />
      </MemoryRouter>
    );
    expect(screen.getByText("Nenhum resultado encontrado")).toBeInTheDocument();
  });

  it("renders artists and songs when results exist", () => {
    render(
      <MemoryRouter>
        <ResultList
          loading={false}
          results={{ 
            artistsResult: [mockArtist],
            songsResult: [mockSong]
          }}
          onArtistPin={mockArtistPin}
          onSongPin={mockSongPin}
        />
      </MemoryRouter>
    );
    expect(screen.getByText("Artistas")).toBeInTheDocument();
    const artistNames = screen.getAllByText("Test Artist");
    expect(artistNames[0]).toBeInTheDocument();
    expect(screen.getByText("Músicas")).toBeInTheDocument();
    expect(screen.getByText("ArtistTitle")).toBeInTheDocument();
  });
});