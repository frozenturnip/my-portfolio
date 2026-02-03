"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

type TrackInfo = {
  name: string;
  artist: string;
  album: string;
  imageUrl?: string;
  explicit?: boolean;
};

type PlayerContextType = {
  isReady: boolean;
  isPlaying: boolean;
  volume: number;
  currentTrack?: TrackInfo;
  playPlaylist: (playlistUri: string) => Promise<void>;
  togglePlay: () => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  setPlayerVolume: (vol: number) => Promise<void>;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

declare global {
  interface Window {
    Spotify?: any;
    onSpotifyWebPlaybackSDKReady?: () => void;
  }
}

export function SpotifyPlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [player, setPlayer] = useState<any>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTrack, setCurrentTrack] = useState<TrackInfo | undefined>();

  // --- Helper: call Spotify Web API -----------------------------------------
  const callApi = useCallback(
    async (
      endpoint: string,
      method: "GET" | "POST" | "PUT",
      body?: any,
      searchParams?: Record<string, string>
    ) => {
      if (!accessToken) {
        console.warn("No access token for Spotify Web API call");
        return;
      }

      const url = new URL(`https://api.spotify.com/v1/${endpoint}`);
      if (searchParams) {
        Object.entries(searchParams).forEach(([k, v]) =>
          url.searchParams.set(k, v)
        );
      }

      const res = await fetch(url.toString(), {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!res.ok && res.status !== 204) {
        const text = await res.text();
        console.error("Spotify API error", res.status, text);
      }

      return res;
    },
    [accessToken]
  );

  // --- Init player: can be called when SDK loads OR immediately if already loaded
  const initPlayer = useCallback(async () => {
    if (player) return; // don't double-init

    try {
      const tokenRes = await fetch("/api/spotify/access-token");
if (!tokenRes.ok) {
  if (tokenRes.status === 401) {
    console.warn(
      "Spotify not authenticated. Visit http://127.0.0.1:3000/api/spotify/login to connect your account."
    );
  } else {
    console.error("No Spotify access token, status:", tokenRes.status);
  }
  return;
}

      const data = await tokenRes.json();
      const token: string = data.accessToken;
      setAccessToken(token);

      const spPlayer = new window.Spotify.Player({
        name: "A. Tasso Web Player",
        // Always fetch a fresh token when Spotify asks for one
        getOAuthToken: async (cb: (t: string) => void) => {
          try {
            const res = await fetch("/api/spotify/access-token");
            if (!res.ok) {
              console.error("getOAuthToken failed:", res.status);
              return;
            }
            const { accessToken: fresh } = await res.json();
            setAccessToken(fresh);
            cb(fresh);
          } catch (err) {
            console.error("getOAuthToken error:", err);
          }
        },
        volume: 0.8,
      });

      spPlayer.addListener(
        "ready",
        ({ device_id }: { device_id: string }) => {
          console.log("Spotify player ready on device", device_id);
          setDeviceId(device_id);
          setIsReady(true);
        }
      );

      spPlayer.addListener(
        "not_ready",
        ({ device_id }: { device_id: string }) => {
          console.log("Spotify player not ready", device_id);
          setIsReady(false);
        }
      );

      spPlayer.addListener("player_state_changed", (state: any) => {
  if (!state) return;
  setIsPlaying(!state.paused);

  const track = state.track_window?.current_track;
  if (track) {
    setCurrentTrack({
      name: track.name,
      artist: track.artists.map((a: any) => a.name).join(", "),
      album: track.album?.name ?? "",
      imageUrl: track.album?.images?.[0]?.url,
      explicit: !!track.explicit,
    });
  }
});

      const connected = await spPlayer.connect();
      if (!connected) {
        console.error("Failed to connect Spotify Web Playback SDK");
      }

      setPlayer(spPlayer);
    } catch (err) {
      console.error("Error initializing Spotify Web Playback SDK:", err);
    }
  }, [player]);

  // --- Load SDK script & hook up global callback ----------------------------
  useEffect(() => {
    const scriptSrc = "https://sdk.scdn.co/spotify-player.js";
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${scriptSrc}"]`
    );

    if (!existing) {
      const script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;
      document.body.appendChild(script);
    }

    if (window.Spotify) {
      // SDK already loaded (e.g., from a previous navigation)
      initPlayer();
    } else {
      // Will be called by the SDK when it's ready
      window.onSpotifyWebPlaybackSDKReady = () => {
        initPlayer();
      };
    }

    return () => {
      // avoid stale callbacks if component unmounts
      if (window.onSpotifyWebPlaybackSDKReady === initPlayer) {
        window.onSpotifyWebPlaybackSDKReady = undefined;
      }
    };
  }, [initPlayer]);

  // --- Control helpers ------------------------------------------------------
  const transferPlaybackHere = useCallback(async () => {
    if (!deviceId) {
      console.warn("No Spotify device ID yet");
      return;
    }
    await callApi("me/player", "PUT", {
      device_ids: [deviceId],
      play: true,
    });
  }, [deviceId, callApi]);

  const playPlaylist = useCallback(
    async (playlistUri: string) => {
      if (!deviceId) {
        console.warn("No Spotify device ID yet");
        return;
      }
      await transferPlaybackHere();
      await callApi(
        "me/player/play",
        "PUT",
        { context_uri: playlistUri },
        { device_id: deviceId }
      );
    },
    [deviceId, transferPlaybackHere, callApi]
  );

  const togglePlay = useCallback(async () => {
    if (!deviceId) {
      console.warn("No Spotify device ID yet");
      return;
    }
    if (isPlaying) {
      await callApi("me/player/pause", "PUT", undefined, {
        device_id: deviceId,
      });
    } else {
      await callApi("me/player/play", "PUT", undefined, {
        device_id: deviceId,
      });
    }
  }, [deviceId, isPlaying, callApi]);

  const next = useCallback(async () => {
    if (!deviceId) return;
    await callApi("me/player/next", "POST", undefined, {
      device_id: deviceId,
    });
  }, [deviceId, callApi]);

  const previous = useCallback(async () => {
    if (!deviceId) return;
    await callApi("me/player/previous", "POST", undefined, {
      device_id: deviceId,
    });
  }, [deviceId, callApi]);

  const setPlayerVolume = useCallback(
    async (vol: number) => {
      setVolume(vol);
      try {
        if (player) {
          await player.setVolume(vol);
        }
      } catch (err) {
        console.error("Error setting Spotify volume:", err);
      }
    },
    [player]
  );

  const value: PlayerContextType = {
    isReady,
    isPlaying,
    volume,
    currentTrack,
    playPlaylist,
    togglePlay,
    next,
    previous,
    setPlayerVolume,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

export function useSpotifyPlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error(
      "useSpotifyPlayer must be used within SpotifyPlayerProvider"
    );
  }
  return ctx;
}
