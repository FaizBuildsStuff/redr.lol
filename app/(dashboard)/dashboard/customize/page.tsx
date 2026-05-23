"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Disc3,
  Palette,
  CheckCircle2,
  Type,
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

interface UserProfile {
  id: number;
  username: string;
  email: string;
  discord_id?: string;
  typewriter_heading?: string;
  typewriter_quotes?: string[];
}

export default function CustomizePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [typewriterHeading, setTypewriterHeading] = useState("Web Designer & Developer");
  const [typewriterQuotes, setTypewriterQuotes] = useState<string[]>([
    "The world doesn't need heroes, it needs someone to pull the strings from the shadows.",
  ]);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Discord states
  const [isDiscordDialogOpen, setIsDiscordDialogOpen] = useState(false);
  const [inputDiscordId, setInputDiscordId] = useState("");
  const [savingDiscord, setSavingDiscord] = useState(false);

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
      throw new Error(
        data?.error || "Failed to disconnect Discord"
      );
    }

    /* INSTANT UI UPDATE */
    setUser((prev) =>
      prev
        ? {
            ...prev,
            discord_id: undefined,
          }
        : prev
    );

    setInputDiscordId("");

    /* OPTIONAL REFRESH */
    router.refresh();

  } catch (error) {

    console.error(
      "Failed to disconnect discord:",
      error
    );

  } finally {

    setSavingDiscord(false);

  }
};

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

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* HERO */}
        <div className="relative mb-10 overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-3xl sm:p-8">

          {/* HERO GLOW */}
          <div className="pointer-events-none absolute left-0 top-0 h-[240px] w-[240px] rounded-full bg-red-500/10 blur-[120px]" />

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            {/* LEFT */}
            <div className="max-w-2xl">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-400 backdrop-blur-xl">
                <div className="h-2 w-2 rounded-full bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.8)]" />
                Creator Dashboard
              </div>

              <h1 className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
                Customize your profile experience
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/45 sm:text-base">
                Build a futuristic profile with animated typography, live integrations and modern creator aesthetics.
              </p>

            </div>

            {/* BUTTON */}
            <Button
              onClick={handleSave}
              disabled={saving}
              className="
            group
            relative
            h-12
            overflow-hidden
            rounded-2xl
            border
            border-red-500/20
            bg-red-500
            px-6
            text-sm
            font-semibold
            text-white
            transition-all
            duration-300
            hover:scale-[1.02]
            hover:bg-red-400
            hover:shadow-[0_0_50px_rgba(239,68,68,0.45)]
          "
            >

              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <span className="relative z-10 flex items-center gap-2">
                {saving ? (
                  <Disc3 className="h-4 w-4 animate-spin" />
                ) : savedSuccess ? (
                  <CheckCircle2 className="h-4 w-4 text-white" />
                ) : (
                  <Palette className="h-4 w-4" />
                )}

                {savedSuccess
                  ? "Saved"
                  : "Apply Changes"}
              </span>

            </Button>

          </div>
        </div>

        {/* GRID */}
        <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">

          {/* LEFT SIDE */}
          <div className="space-y-6">

            {/* TYPEWRITER */}
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-3xl">

              {/* Glow */}
              <div className="absolute right-0 top-0 h-[200px] w-[200px] rounded-full bg-red-500/10 blur-[120px]" />

              <div className="relative z-10">

                <div className="mb-6 flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                    <Type className="h-5 w-5 text-red-400" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Typewriter Settings
                    </h3>

                    <p className="text-sm text-white/40">
                      Configure animated heading content
                    </p>
                  </div>

                </div>

                {/* Heading */}
                <div className="mb-5">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
                    Main Heading
                  </label>

                  <Input
                    type="text"
                    value={typewriterHeading}
                    onChange={(e) =>
                      setTypewriterHeading(e.target.value)
                    }
                    placeholder="Web Designer & Developer"
                    className="
                  h-14
                  rounded-2xl
                  border-white/10
                  bg-black/30
                  px-4
                  text-sm
                  text-white
                  placeholder:text-white/20
                  focus:border-red-500/30
                  focus:ring-0
                "
                  />
                </div>

                {/* Quotes */}
                <div>

                  <div className="mb-3 flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
                      Animated Quotes
                    </label>

                    <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                      {typewriterQuotes.length} Active
                    </div>
                  </div>

                  <div className="space-y-3">

                    {typewriterQuotes.map((quote, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group flex items-center gap-3"
                      >

                        <Input
                          type="text"
                          value={quote}
                          onChange={(e) => {
                            const updated = [...typewriterQuotes];
                            updated[index] = e.target.value;
                            setTypewriterQuotes(updated);
                          }}
                          placeholder="Enter quote..."
                          className="
                        h-14
                        rounded-2xl
                        border-white/10
                        bg-black/30
                        px-4
                        text-sm
                        text-white
                        placeholder:text-white/20
                        focus:border-red-500/30
                        focus:ring-0
                      "
                        />

                        <button
                          onClick={() => {
                            if (typewriterQuotes.length > 1) {
                              setTypewriterQuotes(
                                typewriterQuotes.filter(
                                  (_, i) => i !== index
                                )
                              );
                            }
                          }}
                          className="
                        flex
                        h-14
                        w-14
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/[0.03]
                        text-white/30
                        transition-all
                        duration-300
                        hover:border-red-500/20
                        hover:bg-red-500/10
                        hover:text-red-400
                      "
                        >
                          ×
                        </button>

                      </motion.div>
                    ))}

                    {/* ADD BUTTON */}
                    <button
                      onClick={() =>
                        setTypewriterQuotes([
                          ...typewriterQuotes,
                          "",
                        ])
                      }
                      className="
                    mt-2
                    flex
                    h-14
                    w-full
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-dashed
                    border-white/10
                    bg-white/[0.02]
                    text-sm
                    font-semibold
                    text-white/40
                    transition-all
                    duration-300
                    hover:border-red-500/20
                    hover:bg-red-500/10
                    hover:text-red-400
                  "
                    >
                      + Add New Quote
                    </button>

                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">

            {/* DISCORD */}
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-3xl">

              <div className="absolute bottom-0 right-0 h-[220px] w-[220px] rounded-full bg-indigo-500/10 blur-[120px]" />

              <div className="relative z-10">

                <div className="mb-6 flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10">
                    <Disc3 className="h-5 w-5 text-indigo-400" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Discord Integration
                    </h3>

                    <p className="text-sm text-white/40">
                      Sync your live Discord presence
                    </p>
                  </div>

                </div>

                {user.discord_id ? (
                  <div className="space-y-4">

                    <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
                      <div className="flex items-center gap-3">

                        <div className="h-3 w-3 rounded-full bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]" />

                        <div>
                          <p className="text-sm font-semibold text-white">
                            Discord Connected
                          </p>

                          <p className="text-xs text-white/40">
                            Live profile presence enabled
                          </p>
                        </div>

                      </div>
                    </div>

                    <div className="flex gap-3">

                      <Button
                        onClick={() =>
                        (window.location.href =
                          "/api/auth/discord/login")
                        }
                        className="
                      h-12
                      flex-1
                      rounded-2xl
                      bg-indigo-500
                      text-sm
                      font-semibold
                      text-white
                      transition-all
                      hover:bg-indigo-400
                    "
                      >
                        Reconnect
                      </Button>

                      <Button
                        onClick={handleDisconnectDiscord}
                        disabled={savingDiscord}
                        className="
                      h-12
                      flex-1
                      rounded-2xl
                      border
                      border-red-500/20
                      bg-red-500/10
                      text-sm
                      font-semibold
                      text-red-400
                      transition-all
                      hover:bg-red-500/20
                    "
                      >
                        Disconnect
                      </Button>

                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() =>
                    (window.location.href =
                      "/api/auth/discord/login")
                    }
                    className="
                  h-14
                  w-full
                  rounded-2xl
                  bg-indigo-500
                  text-sm
                  font-semibold
                  text-white
                  transition-all
                  duration-300
                  hover:scale-[1.01]
                  hover:bg-indigo-400
                  hover:shadow-[0_0_40px_rgba(99,102,241,0.45)]
                "
                  >
                    Connect Discord
                  </Button>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
