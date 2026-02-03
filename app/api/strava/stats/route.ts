import { NextRequest, NextResponse } from "next/server";

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
  let accessToken = req.cookies.get("strava_access_token")?.value ?? process.env.STRAVA_ACCESS_TOKEN;
  const refreshTokenValue = req.cookies.get("strava_refresh_token")?.value ?? process.env.STRAVA_REFRESH_TOKEN;
  const expiresAt = Number(req.cookies.get("strava_token_expires_at")?.value ?? 0);

  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (expiresAt && Date.now() / 1000 > expiresAt && refreshTokenValue) {
    const refreshed = await refreshToken(refreshTokenValue);
    if (refreshed?.access_token) {
      accessToken = refreshed.access_token;
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

  const res = NextResponse.json(response);

  if (refreshTokenValue && Date.now() / 1000 > expiresAt) {
    const refreshed = await refreshToken(refreshTokenValue);
    if (refreshed?.access_token) {
      res.cookies.set("strava_access_token", refreshed.access_token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
      res.cookies.set("strava_refresh_token", refreshed.refresh_token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
      res.cookies.set("strava_token_expires_at", String(refreshed.expires_at ?? 0), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
    }
  }

  return res;
}
