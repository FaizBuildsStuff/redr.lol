"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Disc3,
  Palette,
  Sparkles,
  Music,
  CheckCircle2,
  Undo2,
  Tv,
  Type
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserProfile {
  id: number;
  username: string;
  email: string;
}

export default function CustomizePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Customization States
  const [selectedTheme, setSelectedTheme] = useState("crimson-dither");
  const [musicActive, setMusicActive] = useState(false);
  const [sparklesActive, setSparklesActive] = useState(true);
  const [customFont, setCustomFont] = useState("Satoshi");
  
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        } else {
          router.push("/signin");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  const handleSave = () => {
    setSaving(true);
    setSavedSuccess(false);
    setTimeout(() => {
      setSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }, 800);
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-[#050505] text-[#F5F1E8]">
        <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-[120px]" />
        <div className="flex flex-col items-center gap-4 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10"
          >
            <Disc3 className="h-7 w-7 text-red-500" />
          </motion.div>
          <p className="text-sm font-medium tracking-[0.15em] uppercase text-[#8A8A8A] animate-pulse">
            Powering creative shaders...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const themes = [
    { id: "crimson-dither", name: "Crimson Dither", desc: "Aggressive cyber red with heavy noise", bg: "bg-red-950/20 border-red-500/30" },
    { id: "quantum-purple", name: "Quantum Violet", desc: "Smooth futuristic deep violet and space glow", bg: "bg-purple-950/20 border-purple-500/20" },
    { id: "neon-emerald", name: "Neon Emerald", desc: "Dystopian tactical green console layout", bg: "bg-green-950/20 border-green-500/20" },
    { id: "void-mono", name: "Void Monochrome", desc: "Stealth charcoal grid without accents", bg: "bg-neutral-900/40 border-neutral-700/20" }
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050505] px-4 md:px-10 pb-20 pt-8 md:pt-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/3 top-0 h-[650px] w-[650px] rounded-full bg-red-600/5 blur-[160px]" />
      </div>

      <div className="mx-auto max-w-6xl relative z-10">
        
        {/* Header */}
        <div className="border-b border-white/5 pb-8 mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-red-400 text-xs font-semibold uppercase tracking-[0.2em]">
              <Palette className="h-4 w-4" /> Aesthetics Chamber
            </div>
            <h1 className="mt-2 text-4xl font-medium tracking-tight text-white">
              Profile Customizer
            </h1>
            <p className="mt-2 text-sm text-[#8C8C8C]">
              Design and craft your custom landing profile with our dithered styles.
            </p>
          </div>

          <div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="h-11 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold uppercase tracking-wider text-white shadow-[0_4px_15px_rgba(239,68,68,0.2)] transition-all duration-300 flex items-center gap-2"
            >
              {saving ? (
                <Disc3 className="h-4 w-4 animate-spin" />
              ) : savedSuccess ? (
                <CheckCircle2 className="h-4 w-4 text-green-300" />
              ) : (
                <Palette className="h-4 w-4" />
              )}
              {savedSuccess ? "Saved Successfully" : "Apply Design"}
            </Button>
          </div>
        </div>

        {/* WORKSPACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* CONTROL SUITE (LEFT) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* THEME SELECTION */}
            <div className="rounded-[24px] border border-white/5 bg-[#0A0A0A]/80 p-6 backdrop-blur-3xl">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-[#7A7A7A] mb-4">Choose Theme</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {themes.map((t) => {
                  const isSelected = selectedTheme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTheme(t.id)}
                      className={`text-left p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                        isSelected
                          ? "bg-red-500/10 border-red-500/40 shadow-inner"
                          : "bg-white/[0.01] border-white/5 hover:border-white/10"
                      }`}
                    >
                      <div>
                        <h4 className="text-sm font-medium text-white">{t.name}</h4>
                        <p className="mt-1 text-[11px] leading-relaxed text-[#8C8C8C]">{t.desc}</p>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${
                          isSelected ? "border-red-500 bg-red-600 text-white" : "border-[#333]"
                        }`}>
                          {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* EFFECT ACCENTS */}
            <div className="rounded-[24px] border border-white/5 bg-[#0A0A0A]/80 p-6 backdrop-blur-3xl">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-[#7A7A7A] mb-4">Cosmetic Shaders</h3>
              <div className="space-y-4">
                
                {/* Background music toggle */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.01] border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                      <Music className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Autoplay Background Audio</h4>
                      <p className="text-[10px] text-[#7A7A7A]">Loads custom MP3 music instantly upon entry.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMusicActive(!musicActive)}
                    className={`relative h-6 w-11 rounded-full transition-all duration-300 ${
                      musicActive ? "bg-red-600" : "bg-neutral-800"
                    }`}
                  >
                    <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all duration-300 ${
                      musicActive ? "left-5.5" : "left-0.5"
                    }`} />
                  </button>
                </div>

                {/* Cursor sparkles */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.01] border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                      <Sparkles className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Sparkle Tail Effect</h4>
                      <p className="text-[10px] text-[#7A7A7A]">Interactive particles following user cursor sweeps.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSparklesActive(!sparklesActive)}
                    className={`relative h-6 w-11 rounded-full transition-all duration-300 ${
                      sparklesActive ? "bg-red-600" : "bg-neutral-800"
                    }`}
                  >
                    <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all duration-300 ${
                      sparklesActive ? "left-5.5" : "left-0.5"
                    }`} />
                  </button>
                </div>

              </div>
            </div>

            {/* FONT SELECTOR */}
            <div className="rounded-[24px] border border-white/5 bg-[#0A0A0A]/80 p-6 backdrop-blur-3xl">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-[#7A7A7A] mb-4">Typography Core</h3>
              <div className="grid grid-cols-3 gap-3">
                {["Satoshi", "Outfit", "Space Mono"].map((font) => (
                  <button
                    key={font}
                    onClick={() => setCustomFont(font)}
                    className={`py-3 rounded-xl border text-center font-medium text-xs transition-all duration-300 ${
                      customFont === font
                        ? "bg-red-500/10 border-red-500/40 text-white font-bold"
                        : "bg-white/[0.01] border-white/5 text-[#8C8C8C] hover:text-white"
                    }`}
                  >
                    <span style={{ fontFamily: font === "Satoshi" ? "Satoshi" : font === "Outfit" ? "Outfit" : "monospace" }}>
                      {font}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* ACTIVE PREVIEW CANVAS (RIGHT) */}
          <div className="lg:col-span-2">
            <div className="sticky top-12 rounded-[28px] border border-white/5 bg-[#070707] p-4 flex flex-col justify-between shadow-2xl relative overflow-hidden h-[540px]">
              
              {/* Subtle grid accent inside preview container */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.015)_1px,_transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
              
              <div className="relative z-10 flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-[10px] uppercase font-bold tracking-[0.18em] text-[#555] flex items-center gap-1.5">
                  <Tv className="h-3.5 w-3.5" /> Live Render Preview
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 font-semibold tracking-wider uppercase">
                  Connected
                </span>
              </div>

              {/* CARD PREVIEW WINDOW */}
              <div className="flex-1 flex items-center justify-center p-6 relative z-10">
                
                {/* Dynamically styled preview card */}
                <div
                  className={`w-full max-w-[280px] p-6 rounded-3xl border transition-all duration-500 flex flex-col items-center text-center ${
                    selectedTheme === "crimson-dither"
                      ? "bg-gradient-to-br from-red-950/20 to-neutral-950 border-red-500/30 shadow-[0_15px_30px_rgba(239,68,68,0.08)]"
                      : selectedTheme === "quantum-purple"
                      ? "bg-gradient-to-br from-purple-950/20 to-neutral-950 border-purple-500/20 shadow-[0_15px_30px_rgba(168,85,247,0.06)]"
                      : selectedTheme === "neon-emerald"
                      ? "bg-gradient-to-br from-green-950/20 to-neutral-950 border-green-500/20 shadow-[0_15px_30px_rgba(34,197,94,0.06)]"
                      : "bg-neutral-950 border-neutral-800 shadow-[0_15px_30px_rgba(0,0,0,0.4)]"
                  }`}
                  style={{
                    fontFamily: customFont === "Satoshi" ? "Satoshi" : customFont === "Outfit" ? "Outfit" : "monospace"
                  }}
                >
                  {/* Dynamic mock avatar */}
                  <div className={`h-16 w-16 rounded-2xl border flex items-center justify-center relative overflow-hidden transition-all duration-500 ${
                    selectedTheme === "crimson-dither" ? "bg-gradient-to-br from-red-600 to-black border-red-500/20" :
                    selectedTheme === "quantum-purple" ? "bg-gradient-to-br from-purple-600 to-black border-purple-500/20" :
                    selectedTheme === "neon-emerald" ? "bg-gradient-to-br from-green-600 to-black border-green-500/20" :
                    "bg-neutral-900 border-neutral-800"
                  }`}>
                    <span className="text-lg font-black text-white tracking-widest uppercase">{user.username.slice(0, 2)}</span>
                  </div>

                  <h4 className="mt-4 text-base font-semibold text-white tracking-tight">@{user.username}</h4>
                  <p className="mt-1.5 text-xs text-[#8C8C8C] max-w-[200px] leading-relaxed">
                    Check out my custom bio-identity links and aesthetics.
                  </p>

                  {/* Dummy links */}
                  <div className="mt-6 w-full space-y-2">
                    <div className="h-8.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-center text-[10px] font-semibold text-[#8C8C8C]">
                      Discord Server
                    </div>
                    <div className="h-8.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-center text-[10px] font-semibold text-[#8C8C8C]">
                      My Portfolio
                    </div>
                  </div>

                  {/* Audio visualization mock if audio is on */}
                  {musicActive && (
                    <div className="mt-6 flex items-center justify-center gap-1">
                      <div className="h-3 w-0.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="h-4.5 w-0.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                      <div className="h-2.5 w-0.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0.5s" }} />
                      <div className="h-3.5 w-0.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  )}

                </div>

              </div>

              {/* Bottom reset actions */}
              <div className="relative z-10 border-t border-white/5 pt-3.5 flex justify-between text-[#555] text-[10px] font-semibold uppercase tracking-wider">
                <span>Accents: {musicActive ? "Music Player, " : ""}{sparklesActive ? "Cursor Sparkles" : "None"}</span>
                <button
                  onClick={() => {
                    setSelectedTheme("crimson-dither");
                    setMusicActive(false);
                    setSparklesActive(true);
                    setCustomFont("Satoshi");
                  }}
                  className="flex items-center gap-1 text-[#8C8C8C] hover:text-white transition-colors duration-200"
                >
                  <Undo2 className="h-3 w-3" /> Reset
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
