import { useLayoutEffect, useState } from "react";
import { db } from "~/indexedDb/db";
import { ArtistResult, SearchResult, SongResult } from "~/models/SearchResult";

export type UsePlaylistReturnType = {
  playlist: SearchResult | null;
  pin: (result: ArtistResult | SongResult) => void;
  unpin: (result: ArtistResult | SongResult) => void;
};

export const usePlaylist = (): UsePlaylistReturnType => {
  const [playlist, setPlaylist] = useState<SearchResult | null>(null);

  useLayoutEffect(() => {
    const fetchPlaylist = async () => {
      const playlist = await db.getPinnedResults();
      setPlaylist(playlist);
    };

    fetchPlaylist();
  }, []);

  const pin = async (result: ArtistResult | SongResult) => {
    const artistsResult = playlist?.artistsResult.slice() || [];
    const songsResult = playlist?.songsResult.slice() || [];

    result.pinned = true;

    if (result.kind === "artist") {
      await db.pinArtist(result);
      artistsResult.push(result);
    }

    if (result.kind === "song") {
      await db.pinSong(result);
      songsResult.push(result);
    }

    setPlaylist({
      artistsResult,
      songsResult,
    });
  };

  const unpin = (result: ArtistResult | SongResult) => {
    if (!playlist) return;
    const newPlaylist = { ...playlist };

    if (result.kind === "artist") {
      newPlaylist.artistsResult = playlist?.artistsResult.filter(
        (a) => a.id !== result.id
      );
    }

    if (result.kind === "song") {
      newPlaylist.songsResult = playlist?.songsResult.filter(
        (a) => a.id !== result.id
      );
    }

    setPlaylist(newPlaylist);
  };

  return {
    playlist,
    pin,
    unpin,
  };
};
