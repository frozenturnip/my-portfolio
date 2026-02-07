"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { ParticleCard, GlobalSpotlight, MagicBentoStyles } from "../components/MagicBentoEffects";
import StravaWidget from "../components/StravaWidget";

// Dynamic import for 3D viewer to avoid SSR issues
const Model3DViewer = dynamic(() => import("../components/Model3DViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

const PLAYLIST_URL = "https://open.spotify.com/user/savsandi";

// Hardcoded podcast episodes - using direct simplecast URLs
const PODCAST_EPISODES = [
  {
    title: "Replaceable You",
    audioUrl: "https://stitcher.simplecastaudio.com/3bb687b0-04af-4257-90f1-39eef4e631b6/episodes/293d671a-7cc9-465e-b467-1734e9e844ca/audio/128/default.mp3",
  },
];

const MUSIC_TRACKS = [
  {
    title: "Right Here, For Now",
    artist: "Bakar",
    url: "https://cdn.jsdelivr.net/gh/frozenturnip/website-music-player@main/tracks/Bakar%20-%20Right%20Here,%20For%20Now.mp3",
    cover: "https://cdn.jsdelivr.net/gh/frozenturnip/website-music-player@main/covers/Right%20Here,%20For%20Now.jpg",
  },
  {
    title: "Delete Ya",
    artist: "Djo",
    url: "https://cdn.jsdelivr.net/gh/frozenturnip/website-music-player@main/tracks/Djo%20-%20Delete%20Ya.mp3",
    cover: "https://cdn.jsdelivr.net/gh/frozenturnip/website-music-player@main/covers/Delete%20Ya.jpg",
  },
  {
    title: "Casita",
    artist: "Goth Babe",
    url: "https://cdn.jsdelivr.net/gh/frozenturnip/website-music-player@main/tracks/Goth%20Babe%20-%20Casita.mp3",
    cover: "https://cdn.jsdelivr.net/gh/frozenturnip/website-music-player@main/covers/Casita.jpg",
  },
  {
    title: "What Once Was",
    artist: "Her's",
    url: "https://cdn.jsdelivr.net/gh/frozenturnip/website-music-player@main/tracks/Her%27s%20-%20What%20Once%20Was.mp3",
    cover: "https://cdn.jsdelivr.net/gh/frozenturnip/website-music-player@main/covers/What%20Once%20Was.jpg",
  },
  {
    title: "Salad Days",
    artist: "Mac DeMarco",
    url: "https://cdn.jsdelivr.net/gh/frozenturnip/website-music-player@main/tracks/Mac%20Demarco%20-%20Salad%20Days.mp3",
    cover: "https://cdn.jsdelivr.net/gh/frozenturnip/website-music-player@main/covers/Salad%20Days.jpg",
  },
  {
    title: "What's Going On",
    artist: "Marvin Gaye",
    url: "https://cdn.jsdelivr.net/gh/frozenturnip/website-music-player@main/tracks/Marvin%20Gaye%20-%20What%27s%20Going%20On.mp3",
    cover: "https://cdn.jsdelivr.net/gh/frozenturnip/website-music-player@main/covers/What%27s%20Goin%20On.jpg",
  },
  {
    title: "Am I Dreaming",
    artist: "Metro Boomin, A$AP Rocky, Roisee",
    url: "https://cdn.jsdelivr.net/gh/frozenturnip/website-music-player@main/tracks/Metro%20Boomin,%20A$AP%20Rocky,%20Roisee%20-%20Am%20I%20Dreaming.mp3",
    cover: "https://cdn.jsdelivr.net/gh/frozenturnip/website-music-player@main/covers/Am%20I%20Dreaming.jpg",
  },
  {
    title: "Baby Come Back",
    artist: "Player",
    url: "https://cdn.jsdelivr.net/gh/frozenturnip/website-music-player@main/tracks/Player%20-%20Baby%20Come%20Back.mp3",
    cover: "https://cdn.jsdelivr.net/gh/frozenturnip/website-music-player@main/covers/Baby%20Come%20Back.jpg",
  },
  {
    title: "Who's Your Boyfriend",
    artist: "Royel Otis",
    url: "https://cdn.jsdelivr.net/gh/frozenturnip/website-music-player@main/tracks/Royel%20Otis%20-%20Who%27s%20your%20Boyfriend.mp3",
    cover: "https://cdn.jsdelivr.net/gh/frozenturnip/website-music-player@main/covers/Who%27s%20Your%20Boyfriend.jpg",
  },
  {
    title: "Remember When",
    artist: "Wallows",
    url: "https://cdn.jsdelivr.net/gh/frozenturnip/website-music-player@main/tracks/Wallows%20-%20Remember%20When.mp3",
    cover: "https://cdn.jsdelivr.net/gh/frozenturnip/website-music-player@main/covers/Remember%20When.jpg",
  },
];

/* ---------- Tiny SVG ICONS ---------- */

const ExternalIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 5h10v10" />
    <path d="M9 15L19 5" />
    <path d="M5 9v10h10" />
  </svg>
);

const PrevIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 5v14" />
    <path d="M18 6l-8 6 8 6V6z" />
  </svg>
);

const NextIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 5v14" />
    <path d="M6 6l8 6-8 6V6z" />
  </svg>
);

const PlayIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    aria-hidden="true"
    fill="currentColor"
  >
    <path d="M9 7v10l8-5-8-5z" />
  </svg>
);

const PauseIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    aria-hidden="true"
    fill="currentColor"
  >
    <rect x="7" y="6" width="3.2" height="12" rx="1" />
    <rect x="13.8" y="6" width="3.2" height="12" rx="1" />
  </svg>
);

const VolumeOnIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 9v6h4l5 4V5L8 9H4z" />
    <path d="M16 9a3 3 0 010 6" />
    <path d="M18.5 7a5.5 5.5 0 010 10" />
  </svg>
);

const VolumeOffIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 9v6h4l5 4V5L8 9H4z" />
    <path d="M20 9l-4 4m0-4l4 4" />
  </svg>
);

/* ---------- PAGE COMPONENT ---------- */

// Blue glow color for magic effects
const MAGIC_GLOW_COLOR = '59, 130, 246';

export default function AboutPage() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [lastVolumeBeforeMute, setLastVolumeBeforeMute] = useState(0.5);
  const [currentMusicIndex, setCurrentMusicIndex] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.8);
  const [lastMusicVolume, setLastMusicVolume] = useState(0.8);
  
  // Grid ref for spotlight effect
  const gridRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile for disabling animations
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Podcast state
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPodcastPlaying, setIsPodcastPlaying] = useState(false);
  const [podcastVolume, setPodcastVolume] = useState(0.5);
  const [lastPodcastVolume, setLastPodcastVolume] = useState(0.5);
  
  // Photo carousel state
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const PHOTOS = [
    "/images/carousel/about-photo.JPG",
    "/images/carousel/carousel-hiking.jpg",
    "/images/carousel/carousel-halloween.jpg",
    "/images/carousel/carousel-scuba.jpg",
  ];
  
  // Auto-scroll photos every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % PHOTOS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [PHOTOS.length]);
  
  // Single audio ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);

  const currentEpisode = PODCAST_EPISODES[currentEpisodeIndex];

  // Sync audio element volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = podcastVolume;
    }
  }, [podcastVolume]);

  // Podcast controls - pause music widget when starting podcast
  const handlePodcastPlayPause = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPodcastPlaying) {
      audio.pause();
    } else {
      // Pause music widget if it's playing so only one plays at a time
      if (musicAudioRef.current && !musicAudioRef.current.paused) {
        musicAudioRef.current.pause();
        setIsMusicPlaying(false);
      }
      audio.play().catch((err) => {
        if ((err as any)?.name !== "AbortError") {
          console.error(err);
        }
      });
    }
  }, [isPodcastPlaying]);

  const handlePodcastMuteToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (podcastVolume > 0.001) {
      setLastPodcastVolume(podcastVolume);
      setPodcastVolume(0);
    } else {
      setPodcastVolume(lastPodcastVolume || 0.5);
    }
  }, [podcastVolume, lastPodcastVolume]);

  // Since we only have one episode now, these just restart
  const handlePodcastNextWithAutoPlay = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      if (isPodcastPlaying) {
        audioRef.current.play().catch((err) => {
          if ((err as any)?.name !== "AbortError") {
            console.error(err);
          }
        });
      }
    }
  }, [isPodcastPlaying]);

  const handlePodcastPreviousWithAutoPlay = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      if (isPodcastPlaying) {
        audioRef.current.play().catch((err) => {
          if ((err as any)?.name !== "AbortError") {
            console.error(err);
          }
        });
      }
    }
  }, [isPodcastPlaying]);

  const currentMusic = MUSIC_TRACKS[currentMusicIndex];

  // Sync music element volume
  useEffect(() => {
    if (musicAudioRef.current) {
      musicAudioRef.current.volume = musicVolume;
    }
  }, [musicVolume]);

  const handleMusicPlayPause = useCallback(() => {
    const audio = musicAudioRef.current;
    if (!audio) return;

    // Pause podcast if music starts
    if (audio.paused) {
      if (isPodcastPlaying && audioRef.current) {
        audioRef.current.pause();
      }
      audio
        .play()
        .then(() => setIsMusicPlaying(true))
        .catch(console.error);
    } else {
      audio.pause();
      setIsMusicPlaying(false);
    }
  }, [isPodcastPlaying]);

  const handleMusicNext = useCallback(() => {
    setCurrentMusicIndex((prev) => (prev + 1) % MUSIC_TRACKS.length);
  }, []);

  const handleMusicPrevious = useCallback(() => {
    setCurrentMusicIndex((prev) =>
      prev === 0 ? MUSIC_TRACKS.length - 1 : prev - 1
    );
  }, []);

  const handleMusicEnded = useCallback(() => {
    setCurrentMusicIndex((prev) => (prev + 1) % MUSIC_TRACKS.length);
  }, []);

  const handleMusicMuteToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (musicVolume > 0.001) {
        setLastMusicVolume(musicVolume);
        setMusicVolume(0);
      } else {
        setMusicVolume(lastMusicVolume || 0.8);
      }
    },
    [musicVolume, lastMusicVolume]
  );

  // If track index changes while playing, continue playback on new track
  useEffect(() => {
    const audio = musicAudioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    if (isMusicPlaying) {
      audio.play().catch((err) => {
        if ((err as any)?.name !== "AbortError") {
          console.error(err);
        }
      });
    }
  }, [currentMusicIndex, isMusicPlaying]);

  // Prefetch all album covers on the client to reduce image swap lag
  useEffect(() => {
    if (typeof window === "undefined") return;
    MUSIC_TRACKS.forEach((track) => {
      if (!track.cover) return;
      const img = new window.Image();
      img.src = track.cover;
    });
  }, []);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  const squareCardBase = `
    relative col-span-1
    rounded-3xl border shadow-md
    sm:aspect-square
    bg-white border-zinc-200
    magic-card
  `;

  return (
<>
<MagicBentoStyles glowColor={MAGIC_GLOW_COLOR} />
<GlobalSpotlight 
  gridRef={gridRef} 
  glowColor={MAGIC_GLOW_COLOR}
  disableAnimations={isMobile}
  spotlightRadius={300}
/>
<main className="min-h-screen flex justify-center px-4 sm:px-8 lg:px-10 pt-8 pb-6 text-text dark:text-darktext transition-colors duration-500">
      <div
        ref={gridRef}
        className="
          w-full max-w-[1500px]
          grid grid-cols-1 
          lg:grid-cols-2
          gap-6
          items-stretch
        "
      >
        {/* ========= LEFT COLUMN ========= */}
        <ParticleCard
          className={`
            @container
            rounded-3xl border shadow-md 
            px-4 @sm:px-6 @md:px-8 py-3 @sm:py-4 @md:py-5 pb-8 @sm:pb-10 @md:pb-14
            flex flex-col
            h-full
            bg-white/90 border-zinc-200
            magic-card
          `}
          disableAnimations={isMobile}
          glowColor={MAGIC_GLOW_COLOR}
          enableTilt={false}
          enableMagnetism={false}
          clickEffect={false}
          particleCount={0}
        >
          <h1 className="text-2xl @sm:text-3xl @md:text-4xl @lg:text-5xl font-semibold leading-tight text-zinc-900!">
            What I&apos;m about.
          </h1>

          <hr
            className={`border-zinc-200/80 mt-2 @sm:mt-3 @md:mt-4 mb-3 @sm:mb-4 @md:mb-6`}
          />

          <div className="flex flex-col justify-between flex-1 gap-1 @xs:gap-2 @sm:gap-3 @md:gap-4 @lg:gap-5">
            {/* where i'm from */}
            <article className="space-y-0.5 @sm:space-y-1 @md:space-y-2">
              <h2 className="text-[0.65rem] @sm:text-[0.7rem] @md:text-xs @lg:text-sm font-semibold tracking-[0.25em] uppercase text-zinc-900! opacity-70">
                Where I&apos;m from
              </h2>
              <p className="text-[0.7rem] @sm:text-xs @md:text-sm @lg:text-base @xl:text-lg leading-relaxed text-zinc-900!">
                I was born and raised in Berkeley, CA. Growing up my parents 
                always told me to get off the computer and go outside, and I'm still 
                trying to listen to them. 
              </p>
            </article>

            {/* what i do now */}
            <article className="space-y-0.5 @sm:space-y-1 @md:space-y-2">
              <h2 className="text-[0.65rem] @sm:text-[0.7rem] @md:text-xs @lg:text-sm font-semibold tracking-[0.25em] uppercase text-zinc-900! opacity-70">
                What I do now
              </h2>
              <p className="text-[0.7rem] @sm:text-xs @md:text-sm @lg:text-base @xl:text-lg leading-relaxed text-zinc-900!">
                I work across medical device development, robotics, composites,
                and healthcare systems. I like taking vague, messy problems and turning them
                into systems we can prototype, measure, and iterate on. I'm also pursuing my Master's degree in Mechanical Engineering at USC.
              </p>
            </article>

            {/* what i care about */}
            <article className="space-y-0.5 @sm:space-y-1 @md:space-y-2">
              <h2 className="text-[0.65rem] @sm:text-[0.7rem] @md:text-xs @lg:text-sm font-semibold tracking-[0.25em] uppercase text-zinc-900! opacity-70">
                What I care about
              </h2>
              <p className="text-[0.7rem] @sm:text-xs @md:text-sm @lg:text-base @xl:text-lg leading-relaxed text-zinc-900!">
                I care a lot about access — to good care, to education, and to
                opportunities in STEM. I try to design with empathy and
                precision, but my goal is always the same: make complex systems feel
                a little more human.
              </p>
            </article>

            {/* where i'm at now */}
            <article className="space-y-0.5 @sm:space-y-1 @md:space-y-2">
              <h2 className="text-[0.65rem] @sm:text-[0.7rem] @md:text-xs @lg:text-sm font-semibold tracking-[0.25em] uppercase text-zinc-900! opacity-70">
                Where I&apos;m at now
              </h2>
              <p className="text-[0.7rem] @sm:text-xs @md:text-sm @lg:text-base @xl:text-lg leading-relaxed text-zinc-900!">
                Right now, I&apos;m in Los Angeles, studying mechanical
                engineering and working on projects that blend robotics, medical
                devices, and patient-experience work. When I&apos;m not in the
                lab, you can usually find me on a run, practicing my tennis service, or out shooting photos.
              </p>
            </article>

            {/* what i'm looking for */}
            <article className="space-y-0.5 @sm:space-y-1 @md:space-y-2">
              <h2 className="text-[0.65rem] @sm:text-[0.7rem] @md:text-xs @lg:text-sm font-semibold tracking-[0.25em] uppercase text-zinc-900! opacity-70">
                What I&apos;m looking for
              </h2>
              <p className="text-[0.7rem] @sm:text-xs @md:text-sm @lg:text-base @xl:text-lg leading-relaxed text-zinc-900!">
                I&apos;m excited by teams that sit at the intersection of
                engineering, design, and care delivery — places where we can build things that actually
                make patients&apos; lives better. If that sounds like you,
                I&apos;d love to connect.
              </p>
            </article>
          </div>
        </ParticleCard>

        {/* ========= RIGHT COLUMN ========= */}
        <section className="flex flex-col gap-6 h-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {/* ------- MUSIC WIDGET ------- */}
    <ParticleCard
      className={`${squareCardBase} overflow-hidden cursor-pointer`}
      onClick={handleMusicPlayPause}
      disableAnimations={isMobile}
      glowColor={MAGIC_GLOW_COLOR}
      enableTilt={false}
      enableMagnetism={false}
      clickEffect={false}
      particleCount={0}
    >
            {/* Hidden audio element for music queue */}
            <audio
              ref={musicAudioRef}
              src={currentMusic.url}
              preload="auto"
              onEnded={handleMusicEnded}
              className="hidden"
            />

            {/* overlay */}
            <div
              className={`
                pointer-events-none absolute inset-0 bg-[#1DB954]
                origin-top-right scale-0 transition-transform duration-500
                ${isMusicPlaying ? "scale-150" : ""}
              `}
            />

            <div className="relative h-full p-4 flex flex-col text-zinc-900">
              {/* header */}
              <div className="flex items-center justify-between mb-3">
                <p className={`text-[0.65rem] font-semibold tracking-[0.2em] uppercase transition-colors duration-500 ${isMusicPlaying ? "text-white opacity-90" : "text-zinc-900 opacity-70"}`}>
                  Listening to
                </p>

                <div
                  className="
                    flex items-center justify-center
                    w-12 h-12
                    border border-black
                    rounded-lg
                    bg-black
                    overflow-hidden
                  "
                >
                  <div className="relative w-10 h-10">
                    <Image
                      src="/images/spotify-logo.jpg"
                      alt="Spotify"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* cover + text */}
              <div className="flex flex-col items-start gap-1 flex-1">
                <a
                  href={PLAYLIST_URL}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="group relative flex-1 flex items-start"
                >
                  <div
                    className="
                      rounded-xl bg-white 
                      p-[5px] 
                      shadow-sm 
                      transition-shadow 
                      group-hover:shadow-md
                      aspect-square
                      h-full max-h-[120px] sm:max-h-[140px] md:max-h-40
                      min-h-[120px]
                    "
                  >
                    <div className="relative w-full h-full rounded-lg overflow-hidden">
                      <Image
                        src={currentMusic.cover ?? "/images/spotify-logo.jpg"}
                        alt={`${currentMusic.title} cover art`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </a>

                <div className="flex flex-col items-start min-w-0 mt-auto">
                  <p className={`text-sm font-semibold flex items-center gap-1 leading-tight transition-colors duration-500 ${isMusicPlaying ? "text-white" : "text-zinc-900"}`}>
                    <span className="truncate max-w-[200px] sm:max-w-60">
                      {currentMusic.title}
                    </span>
                  </p>

                  <p className={`text-xs truncate max-w-[230px] sm:max-w-[260px] transition-colors duration-500 ${isMusicPlaying ? "text-white opacity-90" : "text-zinc-900 opacity-80"}`}>
                    {currentMusic.artist}
                  </p>

                  {/* Public display: no user connect flow */}
                </div>
              </div>

              {/* controls */}
              <div
                className="w-full px-4 mt-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className={`
                    mt-2
                    w-full max-w-[260px] mx-auto
                    rounded-full 
                    px-1 py-1 sm:py-1.5
                    flex items-center justify-between
                    transition-colors duration-500
                    ${isMusicPlaying ? "bg-[#1DB954] border-transparent" : "bg-white border border-zinc-300"}
                  `}
                >
                  <a
                    href={PLAYLIST_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="group/btn w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-colors duration-500"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Open in Spotify"
                    title="Open in Spotify"
                  >
                    <ExternalIcon
                      className={`w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2] transition-colors duration-200 ${
                        isMusicPlaying ? "stroke-white" : "stroke-zinc-700"
                      }`}
                    />
                  </a>

                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleMusicPrevious(); }}
                    className="group/btn w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-colors duration-500"
                    aria-label="Previous"
                    title="Previous"
                  >
                    <PrevIcon
                      className={`w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2] transition-colors duration-200 ${
                        isMusicPlaying ? "stroke-white" : "stroke-zinc-700"
                      }`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleMusicPlayPause(); }}
                    className={`
                      group/btn w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center 
                      rounded-full
                      transition-all duration-150
                      ${isMusicPlaying ? "bg-[#1AA34A] text-white ring-2 ring-white/30" : "bg-white text-zinc-700"}
                    `}
                    aria-label={isMusicPlaying ? "Pause" : "Play"}
                    title={isMusicPlaying ? "Pause" : "Play"}
                  >
                    {isMusicPlaying ? (
                      <PauseIcon className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
                    ) : (
                      <PlayIcon className="w-5 h-5 sm:w-6 sm:h-6 translate-x-px fill-zinc-700" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleMusicNext(); }}
                    className="group/btn w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-colors duration-500"
                    aria-label="Next"
                    title="Next"
                  >
                    <NextIcon
                      className={`w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2] transition-colors duration-200 ${
                        isMusicPlaying ? "stroke-white" : "stroke-zinc-700"
                      }`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={handleMusicMuteToggle}
                    className="group/btn w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-colors duration-500"
                    aria-label={musicVolume > 0.001 ? "Mute" : "Unmute"}
                    title={musicVolume > 0.001 ? "Mute" : "Unmute"}
                  >
                    {musicVolume <= 0.001 ? (
                      <VolumeOffIcon
                        className={`w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2] transition-colors duration-200 ${
                          isMusicPlaying ? "stroke-white" : "stroke-zinc-700"
                        }`}
                      />
                    ) : (
                      <VolumeOnIcon
                        className={`w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2] transition-colors duration-200 ${
                          isMusicPlaying ? "stroke-white" : "stroke-zinc-700"
                        }`}
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </ParticleCard>

{/* PODCAST CARD */}
    <ParticleCard
      className={`${squareCardBase} overflow-hidden cursor-pointer group`}
      onClick={handlePodcastPlayPause}
      disableAnimations={isMobile}
      glowColor={MAGIC_GLOW_COLOR}
      enableTilt={false}
      enableMagnetism={false}
      clickEffect={false}
      particleCount={0}
    >
            {/* Hidden audio element */}
            <audio
              ref={audioRef}
              src={currentEpisode.audioUrl}
              onPlay={() => setIsPodcastPlaying(true)}
              onPause={() => setIsPodcastPlaying(false)}
              onError={() => {/* Silently handle audio load errors */}}
              preload="none"
            />

            {/* overlay - only shows when playing */}
            <div
              className={`
                pointer-events-none absolute inset-0 bg-linear-to-b from-[#F452FF] via-[#BC5FD3] to-[#8B3FA9]
                origin-top-right transition-transform duration-500
                ${isPodcastPlaying ? "scale-150" : "scale-0"}
              `}
            />

            <div className="relative h-full p-4 flex flex-col text-zinc-900">
              {/* header */}
              <div className="flex items-center justify-between mb-3">
                <p className={`text-[0.65rem] font-semibold tracking-[0.2em] uppercase transition-colors duration-500 ${isPodcastPlaying ? "text-white opacity-90" : "text-zinc-900 opacity-70"}`}>
                  Podcast queue
                </p>

                <div
                  className="
                    flex items-center justify-center
                    w-12 h-12
                    rounded-lg
                    overflow-hidden
                  "
                >
                  <div className="relative w-12 h-12">
                    <Image
                      src="/images/podcast-logo.png"
                      alt="Podcast"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* cover + text */}
              <div className="flex flex-col items-start gap-1 flex-1">
                <a
                  href="https://podcasts.apple.com/us/podcast/99-invisible/id394775318"
                  target="_blank"
                  rel="noreferrer"
                  className="relative flex-1 flex items-start"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className="
                      rounded-xl bg-white 
                      p-[5px] 
                      shadow-sm 
                      transition-shadow 
                      hover:shadow-md
                      aspect-square
                      h-full max-h-[120px] sm:max-h-[140px] md:max-h-40
                      min-h-[120px]
                    "
                  >
                    <div className="relative w-full h-full rounded-lg overflow-hidden">
                      <Image
                        src="/images/99-invisible-cover.jpg"
                        alt="99% Invisible cover"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </a>

                <div className="flex flex-col items-start min-w-0 mt-auto">
                  <p className={`text-sm font-semibold flex items-center gap-1 leading-tight transition-colors duration-500 ${isPodcastPlaying ? "text-white" : "text-zinc-900"}`}>
                    <span className="truncate max-w-[200px] sm:max-w-60">
                      {currentEpisode?.title || "99% Invisible"}
                    </span>
                  </p>

                  <p className={`text-xs truncate max-w-[230px] sm:max-w-[260px] transition-colors duration-500 ${isPodcastPlaying ? "text-white opacity-90" : "text-zinc-900 opacity-80"}`}>
                    Roman Mars
                  </p>
                </div>
              </div>

              {/* controls */}
              <div className="w-full px-4 mt-auto">
                <div
                  className={`
                    mt-2
                    w-full max-w-[260px] mx-auto
                    rounded-full 
                    px-1 py-1 sm:py-1.5
                    flex items-center justify-between
                    transition-colors duration-500
                    ${isPodcastPlaying 
                      ? "bg-linear-to-r from-[#D94FE8] to-[#9B4ABF] border-transparent" 
                      : "bg-white border border-zinc-300"}
                  `}
                >
                  <a
                    href="https://podcasts.apple.com/us/podcast/99-invisible/id394775318"
                    target="_blank"
                    rel="noreferrer"
                    className="group/btn w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-colors duration-500"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalIcon className={`w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2] transition-colors duration-200 ${isPodcastPlaying ? "stroke-white" : "stroke-zinc-700"}`} />
                  </a>

                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handlePodcastPreviousWithAutoPlay(); }}
                    className="group/btn w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-colors duration-500"
                  >
                    <PrevIcon className={`w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2] transition-colors duration-200 ${isPodcastPlaying ? "stroke-white" : "stroke-zinc-700"}`} />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handlePodcastPlayPause(); }}
                    className={`
                      group/btn w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center 
                      rounded-full
                      transition-all duration-150
                      ${isPodcastPlaying 
                        ? "bg-[#9B4ABF] text-white ring-2 ring-white/30" 
                        : "bg-white text-zinc-700"}
                    `}
                  >
                    {isPodcastPlaying ? (
                      <PauseIcon className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
                    ) : (
                      <PlayIcon className="w-5 h-5 sm:w-6 sm:h-6 translate-x-px fill-zinc-700" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handlePodcastNextWithAutoPlay(); }}
                    className="group/btn w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-colors duration-500"
                  >
                    <NextIcon className={`w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2] transition-colors duration-200 ${isPodcastPlaying ? "stroke-white" : "stroke-zinc-700"}`} />
                  </button>

                  <button
                    type="button"
                    onClick={handlePodcastMuteToggle}
                    className="group/btn w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-colors duration-500"
                  >
                    {podcastVolume > 0.001 ? (
                      <VolumeOnIcon className={`w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2] transition-colors duration-200 ${isPodcastPlaying ? "stroke-white" : "stroke-zinc-700"}`} />
                    ) : (
                      <VolumeOffIcon className={`w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2] transition-colors duration-200 ${isPodcastPlaying ? "stroke-white" : "stroke-zinc-700"}`} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </ParticleCard>

 {/* PHOTO / VIBES CARD */}
    <ParticleCard 
      className={`${squareCardBase} p-4 flex flex-col group text-zinc-900`}
      disableAnimations={isMobile}
      glowColor={MAGIC_GLOW_COLOR}
      enableTilt={false}
      enableMagnetism={false}
      clickEffect={false}
      particleCount={0}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-zinc-900 opacity-70">
          Yours truly
        </p>
      </div>

      <div className="relative flex-1 min-h-[380px] sm:min-h-[320px] lg:min-h-[260px] rounded-2xl overflow-hidden">
        {PHOTOS.map((photo, idx) => (
          <div
            key={photo}
            className={`absolute inset-0 transition-opacity duration-700 ${
              idx === currentPhotoIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={photo}
              alt={`Photo ${idx + 1}`}
              fill
              className="object-cover object-[center_70%]"
            />
          </div>
        ))}
        
        {/* Left click zone - go back */}
        <button
          onClick={() => setCurrentPhotoIndex((prev) => (prev - 1 + PHOTOS.length) % PHOTOS.length)}
          className="absolute left-0 top-0 w-1/2 h-full z-10 cursor-pointer"
          aria-label="Previous photo"
        />
        
        {/* Right click zone - go forward */}
        <button
          onClick={() => setCurrentPhotoIndex((prev) => (prev + 1) % PHOTOS.length)}
          className="absolute right-0 top-0 w-1/2 h-full z-10 cursor-pointer"
          aria-label="Next photo"
        />
        
        {/* Dot indicators at bottom */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {PHOTOS.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); setCurrentPhotoIndex(idx); }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentPhotoIndex 
                  ? "bg-white w-4" 
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to photo ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </ParticleCard>

          {/* Strava widget */}
          <StravaWidget
            squareCardBase={squareCardBase}
            isMobile={isMobile}
            glowColor={MAGIC_GLOW_COLOR}
          />
        </div>


          {/* ===== BOTTOM CONTACT WIDGET ===== */}
          <ParticleCard
            className={`
              flex-1
              rounded-3xl border shadow-md
              px-6 py-8
              flex flex-col items-center gap-2
              bg-white/90 border-zinc-200
              text-zinc-900
              magic-card
            `}
            disableAnimations={isMobile}
            glowColor={MAGIC_GLOW_COLOR}
            enableTilt={false}
            enableMagnetism={false}
            clickEffect={false}
            particleCount={0}
          >
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-zinc-900 opacity-70 mb-2 text-center">
              Get in contact
            </p>

            <div className="flex justify-center gap-6">
              {/* Email */}
              <a
                href="mailto:alessandrotasso2021@gmail.com"
                className="relative group"
                aria-label="Email"
              >
                <div
                  className="
                    w-12 h-12 rounded-full border border-zinc-300
                    flex items-center justify-center
                    bg-white
                    transition
                  "
                >
                  <svg
                    className="w-6 h-6 text-black"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 4h16v16H4z" />
                    <path d="M4 4l8 8 8-8" />
                  </svg>
                </div>

                <span
                  className="
                    absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 
                    text-xs rounded-md
                    bg-black text-white opacity-0 group-hover:opacity-100 
                    transition pointer-events-none whitespace-nowrap
                  "
                >
                  Email
                </span>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/alessandro-tasso"
                target="_blank"
                rel="noreferrer"
                className="relative group"
                aria-label="LinkedIn"
              >
                <div
                  className="
                    w-12 h-12 rounded-full border border-zinc-300
                    flex items-center justify-center
                    bg-white
                    transition
                  "
                >
                  <svg
                    className="w-6 h-6 text-black"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5ZM3 9h4v12H3V9Zm7 0h3.6v1.71h.05c.5-.95 1.72-1.96 3.54-1.96C21.35 8.75 22 11.2 22 14.26V21H18v-6.14c0-1.46-.03-3.34-2.1-3.34-2.1 0-2.42 1.6-2.42 3.24V21H10V9Z" />
                  </svg>
                </div>

                <span
                  className="
                    absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 
                    text-xs rounded-md
                    bg-black text-white opacity-0 group-hover:opacity-100 
                    transition pointer-events-none whitespace-nowrap
                  "
                >
                  LinkedIn
                </span>
              </a>

              {/* Resume */}
              <a
                href="/cv_resume/Alessandro_Tasso_BME(BS)_ME(MS)_Resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="relative group"
                aria-label="Resume"
              >
                <div
                  className="
                    w-12 h-12 rounded-full border border-zinc-300
                    flex items-center justify-center
                    bg-white
                    transition
                  "
                >
                  <svg
                    className="w-6 h-6 text-black"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                    <path d="M14 2v6h6" />
                  </svg>
                </div>

                <span
                  className="
                    absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 
                    text-xs rounded-md
                    bg-black text-white opacity-0 group-hover:opacity-100 
                    transition pointer-events-none whitespace-nowrap
                  "
                >
                  Resume
                </span>
              </a>

              {/* CV */}
              <a
                href="/cv_resume/Alessandro_Tasso_CV.pdf"
                target="_blank"
                rel="noreferrer"
                className="relative group"
                aria-label="CV"
              >
                <div
                  className="
                    w-12 h-12 rounded-full border border-zinc-300
                    flex items-center justify-center
                    bg-white
                    transition
                  "
                >
                  <svg
                    className="w-6 h-6 text-black"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 4h16v16H4z" />
                    <path d="M4 10h16" />
                    <path d="M10 4v16" />
                  </svg>
                </div>

                <span
                  className="
                    absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 
                    text-xs rounded-md
                    bg-black text-white opacity-0 group-hover:opacity-100 
                    transition pointer-events-none whitespace-nowrap
                  "
                >
                  CV
                </span>
              </a>
            </div>
          </ParticleCard>
        </section>
      </div>
    </main>
</>
  );
}
