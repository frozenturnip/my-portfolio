"use client";

import { useEffect, useState } from "react";
import { ParticleCard } from "./MagicBentoEffects";

interface StravaStats {
  athlete: {
    id: number;
    name: string;
    profilePicture: string;
    location: string;
  };
  stats: {
    recentRuns: {
      count: number;
      distance: number;
      time: number;
      elevation: number;
    };
    ytdRuns: {
      count: number;
      distance: number;
      time: number;
      elevation: number;
    };
    allTimeRuns: {
      count: number;
      distance: number;
      time: number;
      elevation: number;
    };
  } | null;
  recentActivities: Array<{
    id: number;
    name: string;
    type: string;
    sportType: string;
    distance: number;
    movingTime: number;
    elevation: number;
    date: string;
    avgSpeed: number;
    avgHeartrate?: number;
  }>;
}

function formatDistance(meters: number): string {
  const miles = meters / 1609.34;
  return miles.toFixed(1);
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

function formatPace(metersPerSecond: number): string {
  if (!metersPerSecond || metersPerSecond === 0) return "--";
  const secondsPerMile = 1609.34 / metersPerSecond;
  const mins = Math.floor(secondsPerMile / 60);
  const secs = Math.floor(secondsPerMile % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function ActivityIcon({ type, className = "" }: { type: string; className?: string }) {
  if (type === "Run") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7" />
      </svg>
    );
  }
  if (type === "Ride") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10l2.4-2.4.8.8c1.3 1.3 3 2.1 5 2.1V9c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4c-.4.4-.6.9-.6 1.4 0 .6.2 1.1.6 1.4L11 14v5h2v-6.2l-2.2-2.3zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

function StravaLogo({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
    </svg>
  );
}

interface StravaWidgetProps {
  squareCardBase: string;
  isMobile: boolean;
  glowColor: string;
}

export default function StravaWidget({ squareCardBase, isMobile, glowColor }: StravaWidgetProps) {
  const [data, setData] = useState<StravaStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    async function fetchStravaData() {
      try {
        const res = await fetch("/api/strava/stats");
        console.log("Strava API response status:", res.status);
        if (res.status === 401) {
          setError("not_authenticated");
          setLoading(false);
          return;
        }
        if (!res.ok) {
          const errorText = await res.text();
          console.log("Strava API error:", errorText);
          setError("fetch_error");
          setLoading(false);
          return;
        }
        const json = await res.json();
        console.log("Strava data received:", json);
        setData(json);
      } catch (err) {
        console.log("Strava fetch exception:", err);
        setError("fetch_error");
      } finally {
        setLoading(false);
      }
    }
    fetchStravaData();
  }, []);

  const isActive = isHovered && !loading && !error;
  const textColor = isActive ? "text-white" : "text-zinc-900";
  const mutedTextColor = isActive ? "text-white/80" : "text-zinc-500";

  const CardBody = (
    <ParticleCard
      className={`${squareCardBase} p-4 flex flex-col ${textColor} overflow-hidden relative`}
      disableAnimations={isMobile}
      glowColor={glowColor}
      enableTilt={false}
      enableMagnetism={false}
      clickEffect={false}
      particleCount={0}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
        <div
          className={`absolute inset-0 bg-[#FC4C02] transition-transform duration-500 origin-top-right ${
            isActive ? "scale-150" : "scale-0"
          }`}
        />
      </div>

      <div className="relative z-10 flex items-center justify-between mb-3">
        <p
          className={`text-[0.65rem] font-semibold tracking-[0.2em] uppercase ${
            isActive ? "text-white/80" : "text-zinc-900/70"
          }`}
        >
          Running
        </p>
        <a
          href="https://www.strava.com/athletes/me"
          target="_blank"
          rel="noreferrer"
          className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
            isActive ? "bg-white/20" : "bg-[#FC4C02]"
          }`}
        >
          <StravaLogo className={`w-7 h-7 ${isActive ? "text-white" : "text-white"}`} />
        </a>
      </div>

      {loading && (
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#FC4C02] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error === "not_authenticated" && (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-3 text-center">
          <p className={mutedTextColor}>Connect Strava to see your running stats</p>
          <a
            href="/api/strava/login"
            className="px-4 py-2 rounded-full bg-[#FC4C02] text-white text-sm font-medium hover:bg-[#E34402] transition-colors"
          >
            Connect Strava
          </a>
        </div>
      )}

      {error && error !== "not_authenticated" && (
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <p className={mutedTextColor}>Unable to load stats</p>
        </div>
      )}

      {!loading && !error && data && (
        <div className="relative z-10 flex-1 flex flex-col">
          {data.recentActivities[0] && (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <ActivityIcon
                  type={data.recentActivities[0].type}
                  className={`w-4 h-4 ${isActive ? "text-white" : "text-[#FC4C02]"}`}
                />
                <span className={mutedTextColor}>
                  {formatRelativeDate(data.recentActivities[0].date)}
                </span>
              </div>
              <p className="text-sm font-medium truncate">{data.recentActivities[0].name}</p>
              <div className={`flex items-center gap-3 mt-1 text-xs ${mutedTextColor}`}>
                <span>{formatDistance(data.recentActivities[0].distance)} mi</span>
                <span>{formatTime(data.recentActivities[0].movingTime)}</span>
                <span>{formatPace(data.recentActivities[0].avgSpeed)} /mi</span>
              </div>
            </div>
          )}

          {data.stats?.ytdRuns && (
            <div className={`mt-auto pt-2 border-t ${isActive ? "border-white/30" : "border-zinc-200"}`}>
              <p className={`text-[0.6rem] font-semibold tracking-[0.15em] uppercase ${mutedTextColor} mb-2`}>
                {new Date().getFullYear()} Running
              </p>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className={`text-lg font-semibold ${isActive ? "text-white" : "text-[#FC4C02]"}`}>
                    {formatDistance(data.stats.ytdRuns.distance)}
                  </p>
                  <p className={`text-[0.65rem] ${mutedTextColor}`}>miles</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">{data.stats.ytdRuns.count}</p>
                  <p className={`text-[0.65rem] ${mutedTextColor}`}>runs</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    {Math.round(data.stats.ytdRuns.elevation * 3.28084).toLocaleString()}
                  </p>
                  <p className={`text-[0.65rem] ${mutedTextColor}`}>ft elev</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </ParticleCard>
  );

  return (
    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {CardBody}
    </div>
  );
}
