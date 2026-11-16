import { connection } from "next/server";
import { getNowPlaying } from "@/lib/spotify";

/**
 * Every open Now Playing window polls this, so let the CDN answer for a few
 * seconds and keep Spotify API calls flat no matter how many visitors there are.
 */
const CACHE = "public, s-maxage=15, stale-while-revalidate=45";

export async function GET() {
  // Always ask Spotify at request time; never prerender a "nothing playing" answer.
  await connection();
  try {
    return Response.json(await getNowPlaying(), { headers: { "Cache-Control": CACHE } });
  } catch (error) {
    console.error(error);
    return Response.json(null, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
