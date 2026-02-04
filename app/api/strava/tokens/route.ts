import { NextRequest, NextResponse } from "next/server";

/**
 * Returns the current Strava tokens from cookies (set after OAuth callback).
 * Use this once after re-authorizing to copy STRAVA_ACCESS_TOKEN and STRAVA_REFRESH_TOKEN into Vercel env.
 */
export async function GET(req: NextRequest) {
  const access = req.cookies.get("strava_access_token")?.value ?? null;
  const refresh = req.cookies.get("strava_refresh_token")?.value ?? null;
  if (!access || !refresh) {
    return NextResponse.json({
      error: "No Strava tokens in cookies. Visit /api/strava/login first, then open this URL again.",
    });
  }
  return NextResponse.json({
    STRAVA_ACCESS_TOKEN: access,
    STRAVA_REFRESH_TOKEN: refresh,
  });
}
