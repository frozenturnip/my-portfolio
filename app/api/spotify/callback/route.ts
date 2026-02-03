import { NextRequest, NextResponse } from "next/server";

const TOKEN_URL = "https://accounts.spotify.com/api/token";

export async function GET(req: NextRequest) {
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI!;

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = req.cookies.get("spotify_auth_state")?.value;

  if (!code || !state || !storedState || state !== storedState) {
    return new NextResponse("State mismatch", { status: 400 });
  }

  const body = new URLSearchParams();
  body.set("grant_type", "authorization_code");
  body.set("code", code);
  body.set("redirect_uri", redirectUri);
  body.set(
    "client_id",
    clientId,
  );
  body.set("client_secret", clientSecret);

  const tokenRes = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    console.error("Spotify token error:", tokenRes.status, text);
    return new NextResponse("Token exchange failed", { status: 500 });
  }

  const tokenJson = (await tokenRes.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  };

  const refreshToken = tokenJson.refresh_token;
  if (!refreshToken) {
    return new NextResponse("No refresh token from Spotify", { status: 500 });
  }

  // Set refresh token cookie for future /access-token calls
  const res = NextResponse.redirect("http://127.0.0.1:3000/about");

  res.cookies.set("spotify_refresh_token", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  // we don't need the auth_state cookie anymore
  res.cookies.set("spotify_auth_state", "", {
    maxAge: 0,
    path: "/",
  });

  return res;
}
