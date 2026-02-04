import { NextRequest, NextResponse } from "next/server";

type StravaTokenCache = {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number; // epoch seconds
};

// Module-scope cache (works well for low-traffic portfolios)
let tokenCache: StravaTokenCache = {
  accessToken: null,
  refreshToken: null,
  expiresAt: 0,
};

async function refreshToken(refreshToken: string) {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const res = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function GET(req: NextRequest) {
  // Owner tokens (shared view for all visitors)
  const envAccessToken = process.env.STRAVA_ACCESS_TOKEN ?? null;
  const envRefreshToken = process.env.STRAVA_REFRESH_TOKEN ?? null;

  // Prefer cached tokens, fall back to env
  let accessToken = tokenCache.accessToken ?? envAccessToken;
  let refreshTokenValue = tokenCache.refreshToken ?? envRefreshToken;
  let expiresAt = tokenCache.expiresAt || 0;

  if (!accessToken) {
    return NextResponse.json(
      { error: "Missing STRAVA_ACCESS_TOKEN/STRAVA_REFRESH_TOKEN" },
      { status: 500 },
    );
  }

  // Refresh if expired (or if we only have a refresh token)
  const now = Math.floor(Date.now() / 1000);
  const isExpired = expiresAt ? now > expiresAt : false;
  if ((isExpired || !accessToken) && refreshTokenValue) {
    const refreshed = await refreshToken(refreshTokenValue);
    if (refreshed?.access_token) {
      accessToken = refreshed.access_token;
      // Strava rotates refresh tokens — keep the newest in memory
      refreshTokenValue = refreshed.refresh_token ?? refreshTokenValue;
      expiresAt = Number(refreshed.expires_at ?? 0);

      tokenCache = {
        accessToken,
        refreshToken: refreshTokenValue,
        expiresAt,
      };
    }
  }

  const athleteRes = await fetch("https://www.strava.com/api/v3/athlete", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!athleteRes.ok) {
    return NextResponse.json({ error: "Strava auth failed" }, { status: 401 });
  }

  const athlete = await athleteRes.json();

  const [statsRes, activitiesRes] = await Promise.all([
    fetch(`https://www.strava.com/api/v3/athletes/${athlete.id}/stats`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
    fetch("https://www.strava.com/api/v3/athlete/activities?per_page=5", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
  ]);

  const stats = statsRes.ok ? await statsRes.json() : null;
  const activities = activitiesRes.ok ? await activitiesRes.json() : [];

  const response = {
    athlete: {
      id: athlete.id,
      name: `${athlete.firstname ?? ""} ${athlete.lastname ?? ""}`.trim(),
      profilePicture: athlete.profile ?? "",
      location: [athlete.city, athlete.state].filter(Boolean).join(", "),
    },
    stats: stats
      ? {
          recentRuns: {
            count: stats.recent_run_totals?.count ?? 0,
            distance: stats.recent_run_totals?.distance ?? 0,
            time: stats.recent_run_totals?.moving_time ?? 0,
            elevation: stats.recent_run_totals?.elevation_gain ?? 0,
          },
          ytdRuns: {
            count: stats.ytd_run_totals?.count ?? 0,
            distance: stats.ytd_run_totals?.distance ?? 0,
            time: stats.ytd_run_totals?.moving_time ?? 0,
            elevation: stats.ytd_run_totals?.elevation_gain ?? 0,
          },
          allTimeRuns: {
            count: stats.all_run_totals?.count ?? 0,
            distance: stats.all_run_totals?.distance ?? 0,
            time: stats.all_run_totals?.moving_time ?? 0,
            elevation: stats.all_run_totals?.elevation_gain ?? 0,
          },
        }
      : null,
    recentActivities: (activities ?? []).map((activity: any) => ({
      id: activity.id,
      name: activity.name,
      type: activity.type,
      sportType: activity.sport_type,
      distance: activity.distance,
      movingTime: activity.moving_time,
      elevation: activity.total_elevation_gain,
      date: activity.start_date,
      avgSpeed: activity.average_speed,
      avgHeartrate: activity.average_heartrate ?? undefined,
    })),
  };

  return NextResponse.json(response);
}
