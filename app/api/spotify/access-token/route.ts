import { NextRequest, NextResponse } from "next/server";

const TOKEN_URL = "https://accounts.spotify.com/api/token";

export async function GET(req: NextRequest) {
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const refreshToken = req.cookies.get("spotify_refresh_token")?.value;

  if (!refreshToken) {
    console.warn("No spotify_refresh_token cookie – user not authed");
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = new URLSearchParams();
  body.set("grant_type", "refresh_token");
  body.set("refresh_token", refreshToken);
  body.set("client_id", clientId);
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
    console.error("Spotify refresh error:", tokenRes.status, text);
    // If refresh fails, clear cookie so you can re-auth
    const res = new NextResponse("Unauthorized", { status: 401 });
    res.cookies.set("spotify_refresh_token", "", {
      maxAge: 0,
      path: "/",
    });
    return res;
  }

  const json = await tokenRes.json();
  const accessToken = json.access_token as string;

  return NextResponse.json({ accessToken });
}
