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
    <section className="relative min-h-screen overflow-hidden bg-[#0A0A0A] px-4 md:px-10 pb-20 pt-8 md:pt-12">
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
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="space-y-6">

            {/* DISCORD INTEGRATION */}
            <div className="rounded-[24px] border border-white/5 bg-[#0A0A0A]/80 p-6 backdrop-blur-3xl flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-[#7A7A7A]">Discord Integration</h3>
                <p className="mt-1 text-xs text-[#8C8C8C]">Connect your Discord to show live status on your profile.</p>
              </div>
              <div className="flex items-center gap-4">
                {user.discord_id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-green-400">Connected</span>
                    <Button 
                      onClick={() => window.location.href = '/api/auth/discord/login'}
                      variant="outline" 
                      className="border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-xs font-semibold uppercase tracking-wider"
                    >
                      Reconnect
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => window.location.href = '/api/auth/discord/login'}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold uppercase tracking-wider"
                  >
                    Connect Discord
                  </Button>
                )}
              </div>
            </div>

            {/* TYPEWRITER WIDGET CONTROLS */}
            <div className="rounded-[24px] border border-white/5 bg-[#0A0A0A]/80 p-6 backdrop-blur-3xl">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-[#7A7A7A] mb-4 flex items-center gap-2">
                <Type className="h-4 w-4" /> Typewriter Settings
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#666] mb-1.5 font-semibold">Heading</label>
                  <Input
                    type="text"
                    value={typewriterHeading}
                    onChange={(e) => setTypewriterHeading(e.target.value)}
                    placeholder="e.g. Web Designer & Developer"
                    className="h-11 w-full rounded-xl border-white/10 bg-[#0A0A0A] text-xs text-white placeholder-[#333] transition-all focus:border-red-500/30"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#666] mb-1.5 font-semibold">Animated Quotes</label>
                  <div className="space-y-3">
                    {typewriterQuotes.map((quote, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          type="text"
                          value={quote}
                          onChange={(e) => {
                            const newQuotes = [...typewriterQuotes];
                            newQuotes[index] = e.target.value;
                            setTypewriterQuotes(newQuotes);
                          }}
                          placeholder="Quote..."
                          className="h-11 w-full rounded-xl border-white/10 bg-[#0A0A0A] text-xs text-white placeholder-[#333] transition-all focus:border-red-500/30"
                        />
                        <Button
                          variant="outline"
                          onClick={() => {
                            if (typewriterQuotes.length > 1) {
                              setTypewriterQuotes(typewriterQuotes.filter((_, i) => i !== index));
                            }
                          }}
                          className="h-11 w-11 shrink-0 rounded-xl border-white/10 bg-white/[0.02] text-[#8C8C8C] hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
                        >
                          &times;
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => setTypewriterQuotes([...typewriterQuotes, ""])}
                      className="w-full h-9 rounded-lg border-white/5 bg-white/[0.01] text-[10px] uppercase tracking-wider font-semibold text-[#8C8C8C] hover:text-white"
                    >
                      + Add Quote
                    </Button>
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
