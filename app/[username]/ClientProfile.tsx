"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
const Volume2 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

const VolumeX = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="22" y1="9" x2="16" y2="15" />
    <line x1="16" y1="9" x2="22" y2="15" />
  </svg>
);

const ExternalLink = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const Twitter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Award = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

const Check = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const Disc3 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 12a0 0 0 1 0 0" />
    <path d="M12 2a10 10 0 0 1 10 10" />
  </svg>
);

const Calendar = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const LockOpen = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </svg>
);

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface ClientProfileProps {
  user: {
    id: number;
    username: string;
    email: string;
    created_at: string;
  };
}

export default function ClientProfile({ user }: ClientProfileProps) {
  const [entered, setEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio
  useEffect(() => {
    audioRef.current = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleEnterChamber = () => {
    setEntered(true);
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log("Audio autoplay prevented by user settings:", err));
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error(err));
    }
  };

  const formattedUid = `UID ${String(user.id).padStart(3, "0")},${String(100 + (user.id % 900))}`;

  return (
    <div className="relative min-h-screen bg-[#030303] text-[#F5F1E8] font-['Satoshi'] flex items-center justify-center overflow-hidden">
      
      {/* Ambient background particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-red-600/[0.03] blur-[150px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-red-500/[0.02] blur-[130px]" />
        
        {/* Sparkle background dots */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(239, 68, 68, 0.15) 1px, transparent 1px)`,
            backgroundSize: "24px 24px"
          }}
        />
      </div>

      {/* AUDIO CONTROLS (Floating in top right after entering) */}
      <AnimatePresence>
        {entered && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-6 right-6 z-40 flex items-center gap-3 bg-black/40 border border-white/5 p-2 rounded-2xl backdrop-blur-md"
          >
            <button
              onClick={togglePlayback}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] text-red-400 hover:text-red-300 transition-all duration-200"
            >
              {isPlaying ? <Volume2 className="h-4.5 w-4.5" /> : <VolumeX className="h-4.5 w-4.5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-red-500"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* INTRO SCREEN (TAP TO ENTER GATES) */}
        {!entered ? (
          <motion.div
            key="intro-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.08 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            onClick={handleEnterChamber}
            className="absolute inset-0 z-50 bg-[#030303] flex flex-col items-center justify-center cursor-pointer p-6"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-[100px] animate-pulse" />
            </div>

            <div className="relative z-10 text-center space-y-8 flex flex-col items-center">
              
              {/* Pulsating Chamber Logo */}
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  borderColor: ["rgba(239,68,68,0.2)", "rgba(239,68,68,0.5)", "rgba(239,68,68,0.2)"]
                }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="flex h-24 w-24 items-center justify-center rounded-full border border-red-500/20 bg-[#0A0303] shadow-[0_0_40px_rgba(239,68,68,0.1)] relative"
              >
                <Disc3 className="h-10 w-10 text-red-500 animate-spin" style={{ animationDuration: "8s" }} />
                
                {/* Tech rings decoration */}
                <div className="absolute -inset-2 rounded-full border border-dashed border-red-500/5 animate-spin" style={{ animationDuration: "12s" }} />
              </motion.div>

              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#666666]">
                  Chamber Security Active
                </p>
                <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-white">
                  Unlock @{user.username}
                </h1>
                <p className="text-xs text-[#8C8C8C] max-w-[280px] leading-relaxed mx-auto">
                  Tapping the chamber de-crypts visual styles and streams background wave frequencies.
                </p>
              </div>

              {/* Enter Trigger indicator */}
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center gap-2 rounded-full border border-red-500/10 bg-red-500/5 px-6 py-2.5"
              >
                <LockOpen className="h-3.5 w-3.5 text-red-400" />
                <span className="text-[10px] uppercase font-bold tracking-[0.18em] text-red-400">
                  Tap to Decipher
                </span>
              </motion.div>

            </div>
          </motion.div>
        ) : (
          /* PROFILE DETAILS INTERFACE */
          <motion.div
            key="profile-card"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 120, delay: 0.15 }}
            className="w-full max-w-[380px] relative z-10 px-4"
          >
            {/* Holographic Glowing border */}
            <div className="absolute -inset-px rounded-[32px] bg-gradient-to-b from-red-600/20 via-transparent to-transparent opacity-40 blur-sm pointer-events-none" />

            <div className="relative rounded-[30px] border border-white/5 bg-[#090909]/80 p-8 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col items-center text-center">
              
              {/* Decorative verified tick banner */}
              <div className="absolute top-6 left-6 flex items-center gap-1 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-lg">
                <Award className="h-3.5 w-3.5 text-red-500" />
                <span className="text-[8px] font-bold uppercase tracking-wider text-red-400">Supporter</span>
              </div>

              {/* AVATAR SPHERE WITH GLOW */}
              <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-gradient-to-br from-red-600 to-[#120303] border border-red-500/30 flex items-center justify-center shadow-lg group">
                <span className="text-2xl font-black text-white tracking-widest uppercase">
                  {user.username.slice(0, 2)}
                </span>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
              </div>

              {/* USER META */}
              <div className="mt-5 space-y-1">
                <div className="flex items-center justify-center gap-1.5">
                  <h2 className="text-xl font-bold tracking-tight text-white">@{user.username}</h2>
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                    <Check className="h-2.5 w-2.5 stroke-[4px]" />
                  </div>
                </div>
                
                <p className="text-[10px] text-[#555] font-mono tracking-widest uppercase leading-none">
                  {formattedUid}
                </p>
              </div>

              {/* BIO DESCRIPTION */}
              <p className="mt-4 text-xs text-[#8C8C8C] leading-relaxed max-w-[280px]">
                Welcome to my digital profile! I customize creative styles, layouts, and interactive media arrays.
              </p>

              {/* MEMBER TIMELINE */}
              <div className="mt-4 flex items-center gap-1.5 justify-center text-[10px] text-[#444] uppercase tracking-wider font-semibold">
                <Calendar className="h-3.5 w-3.5 text-red-500/80" />
                <span>Member since {user.created_at}</span>
              </div>

              {/* SOCIAL BUTTON LINKS */}
              <div className="mt-8 w-full space-y-3">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl bg-white/[0.02] border border-white/5 hover:border-red-500/20 hover:bg-red-950/10 px-4 py-3 text-xs font-medium text-white transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <Twitter className="h-4 w-4 text-sky-400 group-hover:scale-110 transition-transform" />
                    <span>Official Twitter</span>
                  </div>
                  <ExternalLink className="h-3 w-3 text-[#444] group-hover:text-white" />
                </a>

                <a
                  href="https://discord.gg"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl bg-white/[0.02] border border-white/5 hover:border-red-500/20 hover:bg-red-950/10 px-4 py-3 text-xs font-medium text-white transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <svg className="h-4 w-4 fill-indigo-400 group-hover:scale-110 transition-transform" viewBox="0 0 127.14 96.36">
                      <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c1-.73,2-1.51,2.94-2.31A75.52,75.52,0,0,0,96,78.2c1,.8,1.94,1.58,2.94,2.31a68.17,68.17,0,0,1-10.5,5A77.7,77.7,0,0,0,95.12,96.36a105.73,105.73,0,0,0,31.06-18.83C129.87,50.7,123.36,27.83,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/>
                    </svg>
                    <span>Community Discord</span>
                  </div>
                  <ExternalLink className="h-3 w-3 text-[#444] group-hover:text-white" />
                </a>

                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl bg-white/[0.02] border border-white/5 hover:border-red-500/20 hover:bg-red-950/10 px-4 py-3 text-xs font-medium text-white transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <Github className="h-4 w-4 text-white group-hover:scale-110 transition-transform" />
                    <span>Personal GitHub</span>
                  </div>
                  <ExternalLink className="h-3 w-3 text-[#444] group-hover:text-white" />
                </a>
              </div>

              {/* MUSIC EQUALIZER BARS (Visual animation when isPlaying) */}
              <div className="mt-8 flex items-center justify-center gap-1.5 h-6">
                <AnimatePresence>
                  {isPlaying ? (
                    <>
                      <div className="w-1 bg-red-500 rounded-full animate-bounce h-3.5" style={{ animationDelay: "0.1s" }} />
                      <div className="w-1 bg-red-500 rounded-full animate-bounce h-5" style={{ animationDelay: "0.3s" }} />
                      <div className="w-1 bg-red-500 rounded-full animate-bounce h-2" style={{ animationDelay: "0.5s" }} />
                      <div className="w-1 bg-red-500 rounded-full animate-bounce h-4" style={{ animationDelay: "0.2s" }} />
                      <div className="w-1 bg-red-500 rounded-full animate-bounce h-5.5" style={{ animationDelay: "0.4s" }} />
                      <div className="w-1 bg-red-500 rounded-full animate-bounce h-2.5" style={{ animationDelay: "0.1s" }} />
                    </>
                  ) : (
                    <span className="text-[9px] uppercase font-bold tracking-widest text-[#444]">
                      FREQ CORE IDLE
                    </span>
                  )}
                </AnimatePresence>
              </div>

              {/* Brand Footer Sign */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest text-[#333]">
                <span>Designed by redr.lol</span>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
