import { NextRequest, NextResponse } from "next/server";

const SPOTIFY_AUTHORIZE_URL = "https://accounts.spotify.com/authorize";

export async function GET(req: NextRequest) {
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI!; // http://127.0.0.1:3000/api/spotify/callback
  const scopes =
    process.env.SPOTIFY_SCOPES ??
    "streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state";

  const state = crypto.randomUUID();

  const url = new URL(SPOTIFY_AUTHORIZE_URL);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", scopes);
  url.searchParams.set("state", state);

  // store state in a short-lived cookie for CSRF protection
  const res = NextResponse.redirect(url.toString());
  const requestUrl = new URL(req.url);
  const isSecure = requestUrl.protocol === "https:";
  // SameSite=None + Secure so cookie is sent when Spotify redirects back (cross-site)
  res.cookies.set("spotify_auth_state", state, {
    httpOnly: true,
    sameSite: isSecure ? "none" : "lax",
    secure: isSecure,
    path: "/",
    maxAge: 10 * 60, // 10 minutes
  });

  return res;
}
