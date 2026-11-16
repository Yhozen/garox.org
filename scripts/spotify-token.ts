import { createServer } from "node:http";

/**
 * Prints a Spotify refresh token for the Now Playing app.
 *
 * 1. Create an app at https://developer.spotify.com/dashboard with the
 *    redirect URI http://127.0.0.1:8888/callback.
 * 2. SPOTIFY_CLIENT_ID=… SPOTIFY_CLIENT_SECRET=… node scripts/spotify-token.ts
 * 3. Open the printed URL, approve, and copy the token into
 *    SPOTIFY_REFRESH_TOKEN (locally in .env.local, and in Vercel).
 */

const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret } = process.env;
if (!id || !secret) throw new Error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET");

const redirectUri = "http://127.0.0.1:8888/callback";
const state = crypto.randomUUID();

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", redirectUri);
  if (url.pathname !== "/callback" || url.searchParams.get("state") !== state) {
    response.writeHead(400).end("Unexpected request");
    return;
  }

  const token = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { Authorization: `Basic ${btoa(`${id}:${secret}`)}` },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: url.searchParams.get("code") ?? "",
      redirect_uri: redirectUri,
    }),
  });
  const data = (await token.json()) as { refresh_token?: string };
  console.log(data.refresh_token ? `\nSPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n` : data);
  response.end("Done. The refresh token is in your terminal; you can close this tab.");
  server.close();
});
server.listen(8888, "127.0.0.1");

const authorize = new URL("https://accounts.spotify.com/authorize");
authorize.search = new URLSearchParams({
  client_id: id,
  response_type: "code",
  redirect_uri: redirectUri,
  scope: "user-read-currently-playing user-read-recently-played",
  state,
}).toString();
console.log(`Open this URL and approve access:\n\n${authorize}\n`);
