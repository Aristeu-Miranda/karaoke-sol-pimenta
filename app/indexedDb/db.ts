import Dexie, { type EntityTable } from "dexie";
import { Artist } from "~/models/Artist";
import { Country } from "~/models/Country";
import { ArtistResult, SearchResult, SongResult } from "~/models/SearchResult";
import { Song } from "~/models/Song";
import { ArtistWithSongs } from "~/models/ArtistWithSongs";

export type DBSong = Song & {
  artistId: string;
};

class DB {
  #db: Dexie & {
    songs: EntityTable<DBSong, "id">;
    artists: EntityTable<Artist, "id">;
  };

  constructor() {
    this.#db = new Dexie("karaokeDB") as Dexie & {
      songs: EntityTable<DBSong, "id">;
      artists: EntityTable<Artist, "id">;
    };
    this.#db.version(1).stores({
      songs: "id, artistId, title, country",
      artists: "id, name, country, pinned",
    });
  }

  #storeSongs = async (songs: DBSong[]) => {
    const songsToStore = songs.map((song) => ({
      ...song,
    }));
    await this.#db.songs.bulkPut(songsToStore);
  };

  #storeArtists = async (artists: Artist[]) => {
    await this.#db.artists.bulkPut(artists);
  };

  fetchAndStoreData = async () => {
    const [hasSongs, hasArtists] = await Promise.all([
      this.#db.songs.count(),
      this.#db.artists.count(),
    ]);

    if (hasSongs && hasArtists) return;

    const response = await fetch("/api/data");
    const data: { songs: DBSong[]; artists: Artist[] } = await response.json();
    await this.#storeArtists(data.artists);
    await this.#storeSongs(data.songs);
  };

  getArtists = async (country?: Country) => {
    if (country) {
      return this.#db.artists.where("country").equals(country).sortBy("name");
    }

    return this.#db.artists.orderBy("name").toArray();
  };

  getArtist = async (artistId: string): Promise<ArtistWithSongs | null> => {
    const artist = await this.#db.artists.get(artistId);
    if (!artist) {
      return null;
    }

    const songs = await this.#db.songs
      .where("artistId")
      .equals(artistId)
      .sortBy("title");

    return {
      ...artist,
      songs,
    };
  };

  #removeDiacritics = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  getResults = async (search: string): Promise<SearchResult> => {
    const artists = await this.#db.artists
      .filter((artist) =>
        this.#removeDiacritics(artist.name).includes(
          this.#removeDiacritics(search)
        )
      )
      .toArray();

    const songs = await this.#db.songs
      .filter((song) =>
        this.#removeDiacritics(song.title).includes(
          this.#removeDiacritics(search)
        )
      )
      .toArray();

    const artistResults: ArtistResult[] = artists.map((artist) => ({
      ...artist,
      kind: "artist",
    }));

    const songResults: SongResult[] = songs.map((song) => ({
      ...song,
      kind: "song",
    }));

    const results = { artistsResult: artistResults, songsResult: songResults };
    return results;
  };

  togglePinArtist = async (artist: Artist) => {
    artist.pinned = !artist.pinned;
    await this.#db.artists.put(artist);
  };

  togglePinSong = async (song: Song) => {
    song.pinned = !song.pinned;
    await this.#db.songs.put({
      ...song,
      artistId: song.artist.id,
    });
  };

  getPinnedResults = async (): Promise<SearchResult> => {
    const songs = await this.#db.songs
      .filter((song) => Boolean(song.pinned))
      .sortBy("title");
    const artists = await this.#db.artists
      .filter((artist) => Boolean(artist.pinned))
      .sortBy("name");

    return {
      artistsResult: artists.map((artist) => ({ ...artist, kind: "artist" })),
      songsResult: songs.map((song) => ({ ...song, kind: "song" })),
    };
  };
}

const db = new DB();
export { db };
