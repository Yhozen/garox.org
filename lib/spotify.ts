/**
 * Reads what Garox is listening to from the Spotify Web API.
 *
 * Needs a Spotify app's SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET, plus a
 * SPOTIFY_REFRESH_TOKEN granted the `user-read-currently-playing` and
 * `user-read-recently-played` scopes (`node scripts/spotify-token.ts`).
 */

export type NowPlaying = {
  /** False when this is the last track played rather than the current one. */
  isPlaying: boolean;
  track: string;
  artist: string;
  album: string;
  /** Smallest cover at least 300px wide; it gets dithered down anyway. */
  cover: string | null;
  url: string;
  progressMs: number;
  durationMs: number;
  /** When the track finished playing, for the "last played" state. */
  playedAt: string | null;
};

type Image = { url: string; width: number | null };
type Track = {
  name: string;
  duration_ms: number;
  artists: { name: string }[];
  album: { name: string; images: Image[] };
  external_urls: { spotify: string };
};

let token: { value: string; expiresAt: number } | null = null;

async function accessToken(): Promise<string | null> {
  const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret } = process.env;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!id || !secret || !refreshToken) return null;
  if (token && token.expiresAt > Date.now()) return token.value;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { Authorization: `Basic ${btoa(`${id}:${secret}`)}` },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Spotify token refresh failed: ${response.status}`);
  const data = (await response.json()) as { access_token: string; expires_in: number };
  // Refresh a minute early so a token never expires mid-request.
  token = { value: data.access_token, expiresAt: Date.now() + (data.expires_in - 60) * 1000 };
  return token.value;
}

async function get<T>(path: string, auth: string): Promise<T | null> {
  const response = await fetch(`https://api.spotify.com/v1${path}`, {
    headers: { Authorization: `Bearer ${auth}` },
    cache: "no-store",
  });
  // 204 means nothing is playing.
  if (response.status === 204) return null;
  if (!response.ok) throw new Error(`Spotify ${path} failed: ${response.status}`);
  return (await response.json()) as T;
}

function describe(track: Track): Omit<NowPlaying, "isPlaying" | "progressMs" | "playedAt"> {
  const images = track.album.images.toSorted((a, b) => (a.width ?? 0) - (b.width ?? 0));
  const cover = images.find((image) => (image.width ?? 0) >= 300) ?? images.at(-1);
  return {
    track: track.name,
    artist: track.artists.map((artist) => artist.name).join(", "),
    album: track.album.name,
    cover: cover?.url ?? null,
    url: track.external_urls.spotify,
    durationMs: track.duration_ms,
  };
}

/** The current track, else the last one played, else null (or not configured). */
export async function getNowPlaying(): Promise<NowPlaying | null> {
  const auth = await accessToken();
  if (!auth) return null;

  const current = await get<{
    is_playing: boolean;
    progress_ms: number | null;
    item: Track | null;
  }>("/me/player/currently-playing", auth);
  // `item` is null for podcasts and ads; fall through to the last track.
  if (current?.item) {
    return {
      ...describe(current.item),
      isPlaying: current.is_playing,
      progressMs: current.progress_ms ?? 0,
      playedAt: null,
    };
  }

  const recent = await get<{ items: { track: Track; played_at: string }[] }>(
    "/me/player/recently-played?limit=1",
    auth,
  );
  const last = recent?.items[0];
  if (!last) return null;
  return { ...describe(last.track), isPlaying: false, progressMs: 0, playedAt: last.played_at };
}
