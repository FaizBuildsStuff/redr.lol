"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { Music, ExternalLink, Gamepad2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export interface LyricLine {
  time: number;
  text: string;
}

export interface Activity {
  name: string;
  id?: string;
  sync_id?: string;
  details?: string;
  state?: string;
  type?: number;
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  timestamps?: {
    start?: number;
    end?: number;
  };
  application_id?: string;
}

export default function FloatingActivity({ activities = [] }: { activities?: Activity[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSwitching, setIsSwitching] = useState(false);

  const [showLyrics, setShowLyrics] = useState(false);
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [lyricsLoading, setLyricsLoading] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [totalDuration, setTotalDuration] = useState("0:00");
  const [percentage, setPercentage] = useState(0);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const [lastTrackId, setLastTrackId] = useState<string | null>(null);

  // Normalize index if activities change
  useEffect(() => {
    if (activities.length === 0 || currentIndex >= activities.length) {
      setCurrentIndex(0);
    }
  }, [activities, currentIndex]);

  const activity = activities[currentIndex] || null;
  const isSpotify = activity && (activity.name === "Spotify" || activity.id === "spotify:1");

  const cycleActivity = () => {
    if (activities.length < 2 || isSwitching) return;
    setIsSwitching(true);
    setTimeout(() => {
      setCurrentIndex((idx) => (idx + 1) % activities.length);
      setIsSwitching(false);
    }, 300);
  };

  useEffect(() => {
    if (!activity) return;

    if (isSpotify) {
      const trackId = activity.sync_id || activity.details || "";
      if (lastTrackId !== trackId) {
        setLastTrackId(trackId);
        setLyrics([]);
        setCurrentLineIndex(-1);
        setLyricsLoading(true);

        const durationSeconds = activity.timestamps?.end && activity.timestamps?.start
          ? Math.floor((activity.timestamps.end - activity.timestamps.start) / 1000)
          : 0;

        const url = new URL("https://lrclib.net/api/get");
        url.searchParams.append("track_name", activity.details || "");
        url.searchParams.append("artist_name", activity.state || "");
        if (activity.assets?.large_text) {
          url.searchParams.append("album_name", activity.assets.large_text);
        }
        if (durationSeconds > 0) {
          url.searchParams.append("duration", durationSeconds.toString());
        }

        fetch(url.toString())
          .then((res) => res.json())
          .then((data) => {
            if (data.syncedLyrics) {
              setLyrics(parseSyncedLyrics(data.syncedLyrics));
            } else if (data.plainLyrics) {
              setLyrics(data.plainLyrics.split('\n').map((line: string) => ({ time: 0, text: line })));
            } else {
              setLyrics([]);
            }
            setLyricsLoading(false);
          })
          .catch(() => {
            setLyrics([]);
            setLyricsLoading(false);
          });
      }
    } else {
      if (lastTrackId) {
        setLastTrackId(null);
        setLyrics([]);
        setCurrentLineIndex(-1);
        setShowLyrics(false);
      }
    }
  }, [activity, isSpotify, lastTrackId]);

  function parseSyncedLyrics(lrc: string): LyricLine[] {
    const lines = lrc.split('\n');
    const parsed: LyricLine[] = [];
    const timeRegex = /^\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;

    for (const line of lines) {
      const match = line.match(timeRegex);
      if (match) {
        const minutes = parseInt(match[1], 10);
        const seconds = parseInt(match[2], 10);
        const milliseconds = parseInt(match[3].padEnd(3, '0'), 10);
        const totalTimeMs = (minutes * 60 * 1000) + (seconds * 1000) + milliseconds;
        const text = match[4].trim();

        if (text) {
            parsed.push({ time: totalTimeMs, text });
        }
      }
    }
    return parsed;
  }

  useEffect(() => {
    if (!activity?.timestamps?.start) {
        setCurrentTime("0:00");
        setTotalDuration("");
        setPercentage(0);
        return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedMs = now - activity.timestamps!.start!;
      
      const elapsedSec = Math.floor(elapsedMs / 1000);
      const m = Math.floor(elapsedSec / 60);
      const s = elapsedSec % 60;
      setCurrentTime(`${m}:${s.toString().padStart(2, '0')}`);

      if (activity.timestamps!.end) {
        const totalMs = activity.timestamps!.end - activity.timestamps!.start!;
        const totalSec = Math.floor(totalMs / 1000);
        const tm = Math.floor(totalSec / 60);
        const ts = totalSec % 60;
        setTotalDuration(`${tm}:${ts.toString().padStart(2, '0')}`);
        
        const perc = Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100));
        setPercentage(perc);
      } else {
        setTotalDuration("");
        setPercentage(0);
      }

      if (isSpotify && lyrics.length > 0) {
        let activeIdx = -1;
        for (let i = 0; i < lyrics.length; i++) {
          if (elapsedMs >= lyrics[i].time) {
            activeIdx = i;
          } else {
            break;
          }
        }
        if (activeIdx !== currentLineIndex) {
          setCurrentLineIndex(activeIdx);
        }
      }

    }, 200);

    return () => clearInterval(interval);
  }, [activity, isSpotify, lyrics, currentLineIndex]);

  useEffect(() => {
    if (showLyrics && lyricsContainerRef.current && currentLineIndex !== -1) {
      const container = lyricsContainerRef.current;
      const activeEl = container.children[currentLineIndex] as HTMLElement;
      if (activeEl) {
        const containerHeight = container.clientHeight;
        const lineTop = activeEl.offsetTop;
        const lineHeight = activeEl.clientHeight;
        const scrollTarget = lineTop - (containerHeight / 2) + (lineHeight / 2);
        container.scrollTo({ top: scrollTarget, behavior: "smooth" });
      }
    }
  }, [currentLineIndex, showLyrics]);

  const getActivityImage = (act: Activity | null) => {
    if (!act?.assets?.large_image) return "";
    const img = act.assets.large_image;
    if (img.startsWith("spotify:")) return `https://i.scdn.co/image/${img.split(":")[1]}`;
    if (img.startsWith("mp:external/")) return img.replace("mp:external/", "https://media.discordapp.net/external/");
    return `https://cdn.discordapp.com/app-assets/${act.application_id}/${img}.png`;
  };

  const getSmallActivityImage = (act: Activity | null) => {
    if (!act?.assets?.small_image) return "";
    const img = act.assets.small_image;
    if (img.startsWith("spotify:")) return `https://i.scdn.co/image/${img.split(":")[1]}`;
    if (img.startsWith("mp:external/")) return img.replace("mp:external/", "https://media.discordapp.net/external/");
    return `https://cdn.discordapp.com/app-assets/${act.application_id}/${img}.png`;
  };

  const getServiceIcon = (act: Activity | null) => {
    if (!act?.name) return "";
    const lowerName = act.name.toLowerCase();
    const iconMap: Record<string, string> = {
      'spotify': 'spotify',
      'visual studio code': 'github',
      'code': 'github',
      'battle.net': 'battlenet',
      'epic games': 'epicgames',
      'league of legends': 'leagueoflegends'
    };
    if (iconMap[lowerName]) return `/assets/images/connections/${iconMap[lowerName]}.svg`;
    const normalizedName = lowerName.replace(/\s+/g, '');
    return `/assets/images/connections/${normalizedName}.svg`;
  };

  if (!activity) return null;

  const imageUrl = getActivityImage(activity);
  const smallImageUrl = getSmallActivityImage(activity);
  const serviceIcon = getServiceIcon(activity);

  const themeColor = isSpotify ? "#1db954" : "#7289da";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-[90vw] max-w-[400px] select-none"
      >
        <motion.div 
          className="relative w-full rounded-2xl bg-black/60 p-4 backdrop-blur-xl overflow-hidden cursor-pointer"
          style={{ 
              borderColor: `${themeColor}4d`, 
              borderWidth: 1, 
              boxShadow: `0 8px 32px ${themeColor}26` 
          }}
          onClick={cycleActivity}
          animate={isSwitching ? { scale: 0.95, y: 15, opacity: 0 } : { scale: 1, y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          
          {/* Audio Visualizer Background (Only Spotify) */}
          {isSpotify && (
              <div className="absolute inset-0 z-0 flex items-end justify-center overflow-hidden opacity-20 pointer-events-none mix-blend-screen">
                <div className="flex items-end gap-1.5 h-full w-[120%] justify-center filter drop-shadow-[0_0_8px_rgba(29,185,84,0.5)]">
                  {[...Array(16)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 rounded-t-sm bg-gradient-to-t from-[#1db954] to-[#1ed760] opacity-80 origin-bottom"
                      animate={{ height: ["15%", "60%", "100%", "40%", "15%"] }}
                      transition={{ duration: 1.2 + Math.random(), repeat: Infinity, ease: "easeInOut", delay: -Math.random() * 2 }}
                    />
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
              </div>
          )}

          <div className="relative z-10 flex flex-col gap-3 pointer-events-auto">
            {/* Header */}
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/10 shrink-0">
                 {isSpotify ? (
                     <img src="/assets/images/connections/spotify.svg" alt="Spotify" className="w-3.5 h-3.5" onError={(e) => (e.currentTarget.style.display = 'none')} />
                 ) : (
                     <img src={serviceIcon} alt={activity.name} className="w-3.5 h-3.5" onError={(e) => {
                         e.currentTarget.style.display = 'none';
                         e.currentTarget.parentElement?.classList.add('icon-error');
                     }} />
                 )}
                 {!isSpotify && <Gamepad2 className="w-3.5 h-3.5 hidden [[class*='icon-error']_&]:block text-white/70" />}
              </div>
              <span 
                className="text-[10px] font-bold uppercase tracking-widest truncate"
                style={{ color: themeColor, textShadow: `0 0 10px ${themeColor}4d` }}
              >
                {isSpotify ? "Listening on Spotify" : `Playing ${activity.name}`}
              </span>

              <div className="ml-auto flex items-center gap-2">
                {isSpotify && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowLyrics(!showLyrics); }}
                      className={`flex items-center justify-center p-1.5 rounded-md transition-all ${showLyrics ? 'text-[#1db954] bg-[#1db954]/10 shadow-[0_0_8px_rgba(29,185,84,0.3)]' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
                      title="Toggle Lyrics"
                    >
                      <Music className="w-4 h-4" />
                    </button>
                )}
                {isSpotify && activity.sync_id && (
                  <a
                    href={`https://open.spotify.com/track/${activity.sync_id}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center p-1.5 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-all"
                    title="Open in Spotify"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Main Content */}
            <AnimatePresence mode="wait">
              {!showLyrics ? (
                <motion.div
                  key="track-info"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-4"
                >
                  {/* Album Art / Generic Image */}
                  <div className="relative w-14 h-14 rounded-lg overflow-visible shrink-0 shadow-lg bg-[#121212]">
                    {imageUrl ? (
                      <img src={imageUrl} alt="Activity Art" className="w-full h-full object-cover rounded-lg" crossOrigin="anonymous" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center rounded-lg bg-white/5 border border-white/10">
                          <Gamepad2 className="w-6 h-6 text-white/30" />
                      </div>
                    )}
                    {!isSpotify && smallImageUrl && (
                        <img src={smallImageUrl} className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-black bg-[#121212] object-cover" alt="Small Icon" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-col justify-center flex-grow min-w-0">
                    <span className="text-[15px] font-semibold text-white truncate drop-shadow-md">
                      {activity.details || activity.name}
                    </span>
                    <div className="flex items-center text-[13px] text-white/70 truncate">
                      <span className="truncate">{activity.state}</span>
                      {activity.assets?.large_text && (
                        <>
                          <span className="mx-1.5 text-white/30">•</span>
                          <span className="truncate opacity-80">{activity.assets.large_text}</span>
                        </>
                      )}
                    </div>

                    {/* Progress Bar / Time */}
                    {activity.timestamps?.end ? (
                      <div className="flex items-center gap-2 mt-1.5 w-full">
                        <span className="text-[10px] font-mono text-white/50 w-8 text-left">{currentTime}</span>
                        <div className="flex-grow h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300 ease-linear"
                            style={{ width: `${percentage}%`, backgroundColor: themeColor, boxShadow: `0 0 8px ${themeColor}66` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-white/50 w-8 text-right">{totalDuration}</span>
                      </div>
                    ) : activity.timestamps?.start ? (
                        <div className="flex items-center gap-2 mt-1 w-full">
                            <span className="text-[10px] font-mono font-medium text-white/60 bg-white/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                {currentTime} elapsed
                            </span>
                        </div>
                    ) : null}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="lyrics-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-[90px] w-full flex flex-col items-center justify-center relative"
                >
                  {lyricsLoading ? (
                    <div className="flex flex-col items-center gap-2 text-white/50 text-sm">
                      <div className="w-5 h-5 border-2 border-white/10 border-t-[#1db954] rounded-full animate-spin" />
                      <span>Loading lyrics...</span>
                    </div>
                  ) : lyrics.length === 0 ? (
                    <div className="text-white/50 text-sm">No lyrics found</div>
                  ) : (
                    <div
                      ref={lyricsContainerRef}
                      className="h-full w-full overflow-y-hidden flex flex-col items-center [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] scroll-smooth"
                    >
                      <div className="h-[35%] shrink-0" />
                      {lyrics.map((line, idx) => {
                        const isActive = idx === currentLineIndex;
                        const isPast = idx < currentLineIndex;
                        return (
                          <p
                            key={idx}
                            className={`my-1 text-center transition-all duration-300 max-w-[90%] leading-relaxed ${
                              isActive
                                ? "text-white text-[1.1rem] font-bold drop-shadow-[0_0_10px_rgba(29,185,84,0.6)] scale-105"
                                : isPast
                                ? "text-white/30 text-[0.9rem] font-medium"
                                : "text-white/50 text-[0.9rem] font-medium"
                            }`}
                          >
                            {line.text}
                          </p>
                        );
                      })}
                      <div className="h-[50%] shrink-0" />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination Dots */}
            {activities.length > 1 && !showLyrics && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-none">
                    {activities.map((_, idx) => (
                        <div 
                            key={idx} 
                            className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-3 bg-white' : 'w-1 bg-white/30'}`}
                        />
                    ))}
                </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
