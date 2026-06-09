"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Disc3,
  Palette,
  CheckCircle2,
  Type,
  Upload,
  X,
  Music,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";

const { useUploadThing } =
  generateReactHelpers<OurFileRouter>();

interface UserProfile {
  id: number;
  username: string;
  email: string;
  discord_id?: string;
  typewriter_heading?: string;
  typewriter_quotes?: string[];
  background_url?: string;
  background_type?: string;
  audios?: Array<{ id: string; url: string; name: string }>;
  audio_shuffle?: boolean;
  audio_player_enabled?: boolean;
  background_audio_enabled?: boolean;
  location?: string;
  discord_profile_transparency?: number;
}

interface Audio {
  id: string;
  url: string;
  name: string;
}

export default function CustomizePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [typewriterHeading, setTypewriterHeading] = useState("");
  const [typewriterQuotes, setTypewriterQuotes] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Background states
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const [backgroundType, setBackgroundType] = useState<string | null>(null);
  const [uploadingBackground, setUploadingBackground] = useState(false);

  // Audio states
  const [audios, setAudios] = useState<Audio[]>([]);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [audioShuffle, setAudioShuffle] = useState(false);
  const [audioPlayerEnabled, setAudioPlayerEnabled] = useState(false);
  const [backgroundAudioEnabled, setBackgroundAudioEnabled] = useState(false);

  // Location states
  const [location, setLocation] = useState("");

  // Discord states
  const [isDiscordDialogOpen, setIsDiscordDialogOpen] = useState(false);
  const [inputDiscordId, setInputDiscordId] = useState("");
  const [savingDiscord, setSavingDiscord] = useState(false);
  
  const [discordProfileTransparency, setDiscordProfileTransparency] = useState(0.40);

  const { startUpload: startAudioUpload } = useUploadThing("audioUploader");
  const { startUpload: startBackgroundUpload } = useUploadThing("backgroundUploader");

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          if (data.user.discord_id) setInputDiscordId(data.user.discord_id);
          if (data.user.typewriter_heading) setTypewriterHeading(data.user.typewriter_heading);
          if (data.user.typewriter_quotes && data.user.typewriter_quotes.length > 0) {
            setTypewriterQuotes(data.user.typewriter_quotes);
          }
          if (data.user.background_url) {
            setBackgroundUrl(data.user.background_url);
            setBackgroundType(data.user.background_type);
          }
          if (data.user.audios && data.user.audios.length > 0) {
            setAudios(data.user.audios);
          }
          if (data.user.audio_shuffle !== undefined) {
            setAudioShuffle(data.user.audio_shuffle);
          }
          if (data.user.audio_player_enabled !== undefined) {
            setAudioPlayerEnabled(data.user.audio_player_enabled);
          }
          if (data.user.background_audio_enabled !== undefined) {
            setBackgroundAudioEnabled(data.user.background_audio_enabled);
          }
          if (data.user.location) {
            setLocation(data.user.location);
          }
          if (data.user.discord_profile_transparency !== undefined) {
            setDiscordProfileTransparency(Number(data.user.discord_profile_transparency));
          }
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

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          typewriter_heading: typewriterHeading,
          typewriter_quotes: typewriterQuotes,
          discord_profile_transparency: discordProfileTransparency,
        }),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2000);
      }
    } catch (e) {
      console.error("Save error:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingBackground(true);
    try {
      const uploadedFiles = await startBackgroundUpload(Array.from(files));
      if (uploadedFiles && uploadedFiles.length > 0) {
        const file = uploadedFiles[0];
        const type = files[0].type.startsWith("video") ? "video" : "image";

        const res = await fetch("/api/user/background", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            background_url: file.url,
            background_type: type,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setBackgroundUrl(data.user.background_url);
          setBackgroundType(data.user.background_type);
          setBackgroundAudioEnabled(data.user.background_audio_enabled ?? false);
        }
      }
    } catch (error) {
      console.error("Background upload error:", error);
    } finally {
      setUploadingBackground(false);
    }
  };

  const handleRemoveBackground = async () => {
    try {
      const res = await fetch("/api/user/background", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setBackgroundUrl(null);
        setBackgroundType(null);
        setBackgroundAudioEnabled(false);
      }
    } catch (error) {
      console.error("Background delete error:", error);
    }
  };

  const handleBackgroundAudioToggle = async () => {
    const nextEnabled = !backgroundAudioEnabled;
    const previousEnabled = backgroundAudioEnabled;
    setBackgroundAudioEnabled(nextEnabled);

    try {
      const res = await fetch("/api/user/background", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ background_audio_enabled: nextEnabled }),
      });

      if (!res.ok) {
        console.error("Failed to update background audio state");
        setBackgroundAudioEnabled(previousEnabled);
      }
    } catch (error) {
      console.error("Background audio toggle error:", error);
      setBackgroundAudioEnabled(previousEnabled);
    }
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (audios.length >= 4) {
      alert("Maximum 4 audios allowed");
      return;
    }

    setUploadingAudio(true);
    try {
      const uploadedFiles = await startAudioUpload(Array.from(files));
      if (uploadedFiles && uploadedFiles.length > 0) {
        const file = uploadedFiles[0];

        const res = await fetch("/api/user/audio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            audio_url: file.url,
            audio_name: files[0].name.split(".")[0],
            shuffle: audioShuffle,
            player_enabled: audioPlayerEnabled,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setAudios(data.user.audios || []);
        }
      }
    } catch (error) {
      console.error("Audio upload error:", error);
    } finally {
      setUploadingAudio(false);
    }
  };

  const handleRemoveAudio = async (audioId: string) => {
    try {
      const res = await fetch("/api/user/audio", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioId }),
      });

      if (res.ok) {
        const data = await res.json();
        setAudios(data.user.audios || []);
      }
    } catch (error) {
      console.error("Audio delete error:", error);
    }
  };

  const handleAudioSettings = async (shuffle: boolean, playerEnabled: boolean) => {
    setAudioShuffle(shuffle);
    setAudioPlayerEnabled(playerEnabled);

    try {
      const res = await fetch("/api/user/audio", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shuffle,
          player_enabled: playerEnabled,
        }),
      });

      if (!res.ok) {
        console.error("Failed to update audio settings");
      }
    } catch (error) {
      console.error("Audio settings error:", error);
    }
  };

  const handleLocationSave = async () => {
    try {
      const res = await fetch("/api/user/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2000);
      }
    } catch (error) {
      console.error("Location save error:", error);
    }
  };

  const handleSaveDiscord = async () => {
    try {
      setSavingDiscord(true);
      const res = await fetch("/api/user/discord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discord_id: inputDiscordId }),
      });
      if (res.ok) {
        setUser((prev) => (prev ? { ...prev, discord_id: inputDiscordId } : prev));
        setIsDiscordDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to save discord id:", error);
    } finally {
      setSavingDiscord(false);
    }
  };

  const handleDisconnectDiscord = async () => {
    try {
      setSavingDiscord(true);

      const res = await fetch("/api/user/discord", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to disconnect Discord");
      }

      setUser((prev) =>
        prev
          ? {
            ...prev,
            discord_id: undefined,
          }
          : prev
      );

      setInputDiscordId("");
      router.refresh();
    } catch (error) {
      console.error("Failed to disconnect discord:", error);
    } finally {
      setSavingDiscord(false);
    }
  };

  const audioControlsDisabled =
    backgroundType === "video" && backgroundAudioEnabled;

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-[#0A0A0A] text-[#F5F1E8]">
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
            Loading customizer...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <section className="relative min-h-screen overflow-hidden bg-black px-3 pb-20 pt-6 sm:px-6 lg:px-10">

      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Glow Orbs */}
        <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-red-500/10 blur-[140px]" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-white/[0.03] blur-[180px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-red-500/10 blur-[150px]" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative z-10 w-full">

        {/* HERO */}
        <div className="relative mb-20 overflow-visible">

          {/* HUGE CINEMATIC GLOWS */}
          <div className="pointer-events-none absolute -left-[240px] top-[-220px] h-[620px] w-[620px] rounded-full bg-red-500/[0.14] blur-[220px]" />

          <div className="pointer-events-none absolute right-[-180px] top-[-120px] h-[520px] w-[520px] rounded-full bg-fuchsia-500/[0.12] blur-[220px]" />

          <div className="pointer-events-none absolute bottom-[-180px] left-[25%] h-[360px] w-[360px] rounded-full bg-orange-500/[0.10] blur-[180px]" />

          <div className="pointer-events-none absolute right-[20%] top-[30%] h-[260px] w-[260px] rounded-full bg-cyan-500/[0.08] blur-[160px]" />

          {/* GRID */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
            }}
          />

          {/* MAIN LAYOUT */}
          <div className="relative z-10 grid gap-16 xl:grid-cols-[1.2fr_0.8fr] xl:items-end">

            {/* ====================================== */}
            {/* LEFT SIDE */}
            {/* ====================================== */}

            <div className="relative">

              {/* MINI BADGE */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 backdrop-blur-2xl"
              >

                {/* LIVE DOT */}
                <div className="relative flex h-2.5 w-2.5 items-center justify-center">

                  <div className="absolute h-full w-full rounded-full bg-red-500 opacity-40 animate-ping" />

                  <div className="relative h-2.5 w-2.5 rounded-full bg-red-400 shadow-[0_0_18px_rgba(248,113,113,0.95)]" />

                </div>

                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">
                  CUSTOMIZE
                </span>

              </motion.div>

              {/* MAIN HEADING */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9 }}
              >

                <h1 className="max-w-6xl text-[3.1rem] font-semibold leading-[0.88] tracking-[-0.09em] text-white sm:text-[5rem] xl:text-[6.8rem]">

                  Design a profile
                  <br />

                  <span className="relative inline-block">

                    <span className="bg-gradient-to-r from-white via-red-200 to-red-500 bg-clip-text text-transparent">
                      people remember
                    </span>

                    {/* Glow Underline */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{
                        duration: 1,
                        delay: 0.4,
                      }}
                      className="absolute -bottom-2 left-0 h-[2px] rounded-full bg-gradient-to-r from-red-500 via-orange-400 to-transparent"
                    />

                  </span>

                </h1>

              </motion.div>

              {/* DESCRIPTION */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.9,
                  delay: 0.1,
                }}
                className="mt-8 max-w-2xl text-[15px] leading-relaxed text-white/45 sm:text-base"
              >

                Create a cinematic digital identity with immersive backgrounds,
                animated typography, audio experiences, live integrations,
                and modern personalization tools built for creators.

              </motion.p>

              {/* STATS */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.15,
                }}
                className="mt-12 flex flex-wrap gap-4"
              >

                {/* CARD */}
                <div className="group relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.03] px-7 py-5 backdrop-blur-3xl transition-all duration-500 hover:-translate-y-[3px] hover:border-red-500/20">

                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.10] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative z-10">

                    <p className="text-[2.2rem] font-semibold leading-none tracking-tight text-white">
                      4
                    </p>

                    <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/35">
                      Audio Slots
                    </p>

                  </div>

                </div>

                {/* CARD */}
                <div className="group relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.03] px-7 py-5 backdrop-blur-3xl transition-all duration-500 hover:-translate-y-[3px] hover:border-fuchsia-500/20">

                  <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/[0.10] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative z-10">

                    <p className="text-[2.2rem] font-semibold leading-none tracking-tight text-white">
                      Live
                    </p>

                    <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/35">
                      Discord Sync
                    </p>

                  </div>

                </div>

                {/* CARD */}
                <div className="group relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.03] px-7 py-5 backdrop-blur-3xl transition-all duration-500 hover:-translate-y-[3px] hover:border-orange-500/20">

                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.10] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative z-10">

                    <p className="text-[2.2rem] font-semibold leading-none tracking-tight text-white">
                      HD
                    </p>

                    <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/35">
                      Backgrounds
                    </p>

                  </div>

                </div>

              </motion.div>

            </div>

            {/* ====================================== */}
            {/* RIGHT SIDE */}
            {/* ====================================== */}

            <motion.div
              initial={{ opacity: 0, x: 35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9 }}
              className="flex w-full flex-col items-start gap-5 xl:items-end"
            >

              {/* STATUS PANEL */}
              <div className="relative w-full max-w-[390px] overflow-hidden rounded-[36px] border border-white/[0.08] bg-white/[0.04] p-8 backdrop-blur-3xl shadow-[0_20px_120px_rgba(0,0,0,0.45)]">

                {/* PANEL GLOW */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.08] via-transparent to-transparent" />

                <div className="relative z-10">

                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/35">
                    Profile Status
                  </p>

                  <div className="mt-5 flex items-center gap-3">

                    <div className="relative flex h-3 w-3 items-center justify-center">

                      <div className="absolute h-full w-full rounded-full bg-green-500 opacity-40 animate-ping" />

                      <div className="relative h-3 w-3 rounded-full bg-green-400 shadow-[0_0_18px_rgba(74,222,128,0.9)]" />

                    </div>

                    <p className="text-2xl font-semibold tracking-tight text-white">
                      Live & Synced
                    </p>

                  </div>

                  <p className="mt-5 text-sm leading-relaxed text-white/40">
                    Your profile updates instantly and syncs across your public creator identity page.
                  </p>

                </div>

              </div>

              {/* BUTTON */}
              <Button
                onClick={handleSave}
                disabled={saving}
                className="group relative h-14 overflow-hidden rounded-[22px] border border-red-500/20 bg-gradient-to-b from-red-500 to-red-600 px-8 text-sm font-semibold text-white shadow-[0_10px_50px_rgba(239,68,68,0.25)] transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_15px_80px_rgba(239,68,68,0.5)] active:scale-[0.98]"
              >

                {/* BUTTON GLOW */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* SHINE */}
                <div className="absolute inset-0 overflow-hidden rounded-[22px]">
                  <div className="absolute left-[-120%] top-0 h-full w-[60%] rotate-[20deg] bg-white/20 blur-xl transition-all duration-1000 group-hover:left-[140%]" />
                </div>

                {/* CONTENT */}
                <span className="relative z-10 flex items-center gap-2">

                  {saving ? (
                    <Disc3 className="h-4 w-4 animate-spin" />
                  ) : savedSuccess ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Palette className="h-4 w-4" />
                  )}

                  {savedSuccess ? "Changes Saved" : "Apply Changes"}

                </span>

              </Button>

            </motion.div>

          </div>

        </div>

        {/* SECTIONS */}
        <div className="flex flex-col gap-10 max-w-5xl">

          {/* ASSETS UPLOADER */}
          <div>
            <h2 className="mb-4 text-xl font-bold tracking-tight text-white/90">Assets Uploader</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              
              {/* BACKGROUND (Compact) */}
              <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-xl">
                <div className="absolute right-0 bottom-0 h-32 w-32 rounded-full bg-orange-500/10 blur-[80px]" />
                <div className="relative z-10 flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10">
                    <Upload className="h-4 w-4 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-white">Background</h3>
                    <p className="text-xs text-white/40 mb-3">Upload PNG, Video, or GIF</p>
                    
                    {backgroundUrl ? (
                      <div className="space-y-3">
                        <div className="relative h-24 w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
                          {backgroundType === "video" ? (
                            <video src={backgroundUrl} className="h-full w-full object-cover" autoPlay muted loop />
                          ) : (
                            <img src={backgroundUrl} alt="Preview" className="h-full w-full object-cover" />
                          )}
                        </div>
                        {backgroundType === "video" && (
                          <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3">
                            <p className="text-xs font-medium text-white/70">Video Audio</p>
                            <button
                              onClick={handleBackgroundAudioToggle}
                              className={`h-7 px-3 rounded-lg text-xs font-semibold transition-all ${
                                backgroundAudioEnabled 
                                  ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                                  : "bg-white/5 text-white/50 hover:bg-white/10"
                              }`}
                            >
                              {backgroundAudioEnabled ? "ON" : "OFF"}
                            </button>
                          </div>
                        )}
                        <button
                          onClick={handleRemoveBackground}
                          className="h-8 w-full rounded-lg bg-red-500/10 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] hover:border-orange-500/20 hover:bg-orange-500/5 transition-all">
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleBackgroundUpload}
                          disabled={uploadingBackground}
                          className="hidden"
                        />
                        <Upload className="h-5 w-5 text-orange-400 mb-1" />
                        <span className="text-xs font-medium text-white/40">
                          {uploadingBackground ? "Uploading..." : "Click to upload"}
                        </span>
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* AUDIO (Compact) */}
              <div className={`relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-xl ${audioControlsDisabled ? "opacity-60 pointer-events-none" : ""}`}>
                <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-purple-500/10 blur-[80px]" />
                <div className="relative z-10 flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10">
                    <Music className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-white">Audio Tracks ({audios.length}/4)</h3>
                    <p className="text-xs text-white/40 mb-3">Manage profile music</p>
                    
                    <div className="space-y-2 mb-3">
                      {audios.map((audio) => (
                        <div key={audio.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-black/20 p-2">
                          <p className="text-xs font-medium text-white/80 truncate w-[180px]">{audio.name}</p>
                          <button
                            onClick={() => handleRemoveAudio(audio.id)}
                            className="h-6 w-6 rounded border border-red-500/20 bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {audios.length < 4 && (
                      <label className="flex h-8 w-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-purple-500/20 bg-purple-500/5 text-xs font-semibold text-purple-400 hover:bg-purple-500/10 transition-all">
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={handleAudioUpload}
                          disabled={uploadingAudio || audioControlsDisabled}
                          className="hidden"
                        />
                        {uploadingAudio ? "Uploading..." : "+ Add Audio"}
                      </label>
                    )}

                    {audios.length > 0 && (
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => handleAudioSettings(!audioShuffle, audioPlayerEnabled)}
                          className={`flex-1 h-8 rounded-lg text-xs font-semibold transition-all border ${
                            audioShuffle ? "border-green-500/20 bg-green-500/10 text-green-400" : "border-white/5 bg-white/5 text-white/50"
                          }`}
                        >
                          Shuffle {audioShuffle ? "ON" : "OFF"}
                        </button>
                        <button
                          onClick={() => handleAudioSettings(audioShuffle, !audioPlayerEnabled)}
                          className={`flex-1 h-8 rounded-lg text-xs font-semibold transition-all border ${
                            audioPlayerEnabled ? "border-green-500/20 bg-green-500/10 text-green-400" : "border-white/5 bg-white/5 text-white/50"
                          }`}
                        >
                          Player {audioPlayerEnabled ? "ON" : "OFF"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* GENERAL CUSTOMIZATION */}
          <div>
            <h2 className="mb-4 text-xl font-bold tracking-tight text-white/90">General Customization</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              
              {/* TYPEWRITER */}
              <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-xl">
                <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-red-500/10 blur-[80px]" />
                <div className="relative z-10">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
                      <Type className="h-4 w-4 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">Typewriter</h3>
                      <p className="text-xs text-white/40">Headings and quotes</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-white/40 mb-1 block">Heading</label>
                      <Input
                        type="text"
                        value={typewriterHeading}
                        onChange={(e) => setTypewriterHeading(e.target.value)}
                        className="h-9 rounded-lg border-white/10 bg-black/40 text-xs text-white focus:border-red-500/30"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] uppercase font-bold text-white/40">Quotes</label>
                        <span className="text-[10px] text-white/30">{typewriterQuotes.length} active</span>
                      </div>
                      <div className="space-y-2">
                        {typewriterQuotes.map((quote, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              type="text"
                              value={quote}
                              onChange={(e) => {
                                const updated = [...typewriterQuotes];
                                updated[index] = e.target.value;
                                setTypewriterQuotes(updated);
                              }}
                              className="h-9 rounded-lg border-white/10 bg-black/40 text-xs text-white focus:border-red-500/30"
                            />
                            <button
                              onClick={() => {
                                if (typewriterQuotes.length > 1) {
                                  setTypewriterQuotes(typewriterQuotes.filter((_, i) => i !== index));
                                }
                              }}
                              className="h-9 w-9 shrink-0 rounded-lg border border-white/10 bg-white/5 text-white/40 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all flex items-center justify-center"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => setTypewriterQuotes([...typewriterQuotes, ""])}
                          className="h-8 w-full rounded-lg border border-dashed border-white/10 bg-white/5 text-xs text-white/40 hover:bg-white/10 hover:text-white/70 transition-all"
                        >
                          + Add Quote
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* LOCATION */}
              <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-xl h-fit">
                <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-cyan-500/10 blur-[80px]" />
                <div className="relative z-10">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10">
                      <MapPin className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">Location</h3>
                      <p className="text-xs text-white/40">Display your city/country</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Tokyo, Japan"
                      className="h-9 flex-1 rounded-lg border-white/10 bg-black/40 text-xs text-white focus:border-cyan-500/30"
                    />
                    <button
                      onClick={handleLocationSave}
                      className="h-9 px-4 rounded-lg border border-cyan-500/20 bg-cyan-500/10 text-xs font-semibold text-cyan-400 hover:bg-cyan-500/20 transition-all"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* COLOR CUSTOMIZATION */}
          <div>
            <h2 className="mb-4 text-xl font-bold tracking-tight text-white/90">Color Customization</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              
              {/* DISCORD CARD TRANSPARENCY */}
              <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-xl h-fit">
                <div className="absolute right-0 bottom-0 h-32 w-32 rounded-full bg-indigo-500/10 blur-[80px]" />
                <div className="relative z-10 flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10">
                    <Palette className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-white">Profile Card Glass Effect</h3>
                    <p className="text-xs text-white/40 mb-4">Control the background opacity of the profile card on your main page.</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-white/50 w-8">0%</span>
                        <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.05"
                          value={discordProfileTransparency}
                          onChange={(e) => setDiscordProfileTransparency(parseFloat(e.target.value))}
                          className="flex-1 h-1.5 rounded-lg bg-white/10 appearance-none cursor-pointer accent-indigo-500"
                        />
                        <span className="text-xs font-medium text-white/50 w-10 text-right">
                          {Math.round(discordProfileTransparency * 100)}%
                        </span>
                      </div>
                      
                      <div className="relative p-4 rounded-xl border border-white/10 overflow-hidden">
                        <div 
                          className="absolute inset-0 z-0" 
                          style={{
                            background: `linear-gradient(45deg, #1a1a2e, #16213e, #0f3460)`
                          }}
                        />
                        <div 
                          className="relative z-10 rounded-lg border border-white/10 p-3"
                          style={{
                            background: `rgba(12, 12, 12, ${discordProfileTransparency})`,
                            backdropFilter: "blur(12px)"
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-indigo-500/30 animate-pulse" />
                            <div>
                              <div className="h-2 w-16 bg-white/20 rounded-full mb-1" />
                              <div className="h-1.5 w-10 bg-white/10 rounded-full" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
