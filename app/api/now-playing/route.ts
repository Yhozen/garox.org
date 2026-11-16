import { getNowPlaying } from "@/lib/spotify";

/**
 * Every open Now Playing window polls this, so let the CDN answer for a few
 * seconds and keep Spotify API calls flat no matter how many visitors there are.
 */
const CACHE = "public, s-maxage=15, stale-while-revalidate=45";

export async function GET() {
  try {
    return Response.json(await getNowPlaying(), { headers: { "Cache-Control": CACHE } });
  } catch (error) {
    console.error(error);
    return Response.json(null, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
