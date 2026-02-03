import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;
  const redirectUri =
    process.env.STRAVA_REDIRECT_URI ?? "http://127.0.0.1:3000/api/strava/callback";

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "Missing Strava credentials" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/about?strava=denied", req.url));
  }

  if (!code || !state) {
    return NextResponse.json({ error: "Missing code or state" }, { status: 400 });
  }

  const expectedState = req.cookies.get("strava_auth_state")?.value;
  if (!expectedState || expectedState !== state) {
    return NextResponse.json({ error: "Invalid state" }, { status: 400 });
  }

  const tokenRes = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.json({ error: "Failed to exchange code" }, { status: 500 });
  }

  const tokenJson = await tokenRes.json();

  const res = NextResponse.redirect(new URL("/about?strava=connected", req.url));
  res.cookies.set("strava_access_token", tokenJson.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  res.cookies.set("strava_refresh_token", tokenJson.refresh_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  res.cookies.set("strava_token_expires_at", String(tokenJson.expires_at ?? 0), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  res.cookies.delete("strava_auth_state");
  return res;
}
