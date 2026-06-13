"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Disc3,
  Palette,
  CheckCircle2,
  Type,
  Upload,
  X,
  Music,
  MapPin,
  DoorOpen,
  Sparkles,
  SlidersHorizontal,
  Save,
  RotateCcw,
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
  alias?: string;
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
  enter_screen_text?: string;
}

interface Audio {
  id: string;
  url: string;
  name: string;
}

interface ProfileSnapshot {
  alias: string;
  typewriterHeading: string;
  typewriterQuotes: string[];
  enterScreenText: string;
  location: string;
  discordProfileTransparency: number;
  backgroundUrl: string | null;
  backgroundType: string | null;
  audios: Audio[];
  audioShuffle: boolean;
  audioPlayerEnabled: boolean;
  backgroundAudioEnabled: boolean;
}

export default function CustomizePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [typewriterHeading, setTypewriterHeading] = useState("");
  const [typewriterQuotes, setTypewriterQuotes] = useState<string[]>([]);
  const [enterScreenText, setEnterScreenText] = useState("");
  const [alias, setAlias] = useState("");

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState("identity");
  const [snapshot, setSnapshot] = useState<ProfileSnapshot | null>(null);

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

  const sectionItems = [
    { id: "identity", label: "Identity", icon: Type },
    { id: "media", label: "Media", icon: Upload },
    { id: "style", label: "Style", icon: SlidersHorizontal },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const hasChanges = useMemo(() => {
    if (!snapshot) return false;
    return (
      alias !== snapshot.alias ||
      typewriterHeading !== snapshot.typewriterHeading ||
      JSON.stringify(typewriterQuotes) !== JSON.stringify(snapshot.typewriterQuotes) ||
      enterScreenText !== snapshot.enterScreenText ||
      location !== snapshot.location ||
      discordProfileTransparency !== snapshot.discordProfileTransparency ||
      backgroundUrl !== snapshot.backgroundUrl ||
      backgroundType !== snapshot.backgroundType ||
      JSON.stringify(audios) !== JSON.stringify(snapshot.audios) ||
      audioShuffle !== snapshot.audioShuffle ||
      audioPlayerEnabled !== snapshot.audioPlayerEnabled ||
      backgroundAudioEnabled !== snapshot.backgroundAudioEnabled
    );
  }, [alias, audioPlayerEnabled, audioShuffle, audios, backgroundAudioEnabled, backgroundType, backgroundUrl, discordProfileTransparency, enterScreenText, location, snapshot, typewriterHeading, typewriterQuotes]);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          if (data.user.discord_id) setInputDiscordId(data.user.discord_id);
          if (data.user.typewriter_heading) setTypewriterHeading(data.user.typewriter_heading);
          if (data.user.enter_screen_text) setEnterScreenText(data.user.enter_screen_text);
          if (data.user.alias !== undefined) setAlias(data.user.alias ?? "");
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

          setSnapshot({
            alias: data.user.alias ?? "",
            typewriterHeading: data.user.typewriter_heading ?? "",
            typewriterQuotes: data.user.typewriter_quotes ?? [],
            enterScreenText: data.user.enter_screen_text ?? "",
            location: data.user.location ?? "",
            discordProfileTransparency: Number(data.user.discord_profile_transparency ?? 0.4),
            backgroundUrl: data.user.background_url ?? null,
            backgroundType: data.user.background_type ?? null,
            audios: data.user.audios ?? [],
            audioShuffle: data.user.audio_shuffle ?? false,
            audioPlayerEnabled: data.user.audio_player_enabled ?? false,
            backgroundAudioEnabled: data.user.background_audio_enabled ?? false,
          });
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
          alias,
          typewriter_heading: typewriterHeading,
          typewriter_quotes: typewriterQuotes,
          discord_profile_transparency: discordProfileTransparency,
          enter_screen_text: enterScreenText,
        }),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setSnapshot({
          alias,
          typewriterHeading,
          typewriterQuotes,
          enterScreenText,
          location,
          discordProfileTransparency,
          backgroundUrl,
          backgroundType,
          audios,
          audioShuffle,
          audioPlayerEnabled,
          backgroundAudioEnabled,
        });
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

  const handleDiscard = () => {
    if (!snapshot) return;
    setAlias(snapshot.alias);
    setTypewriterHeading(snapshot.typewriterHeading);
    setTypewriterQuotes(snapshot.typewriterQuotes);
    setEnterScreenText(snapshot.enterScreenText);
    setLocation(snapshot.location);
    setDiscordProfileTransparency(snapshot.discordProfileTransparency);
    setBackgroundUrl(snapshot.backgroundUrl);
    setBackgroundType(snapshot.backgroundType);
    setAudios(snapshot.audios);
    setAudioShuffle(snapshot.audioShuffle);
    setAudioPlayerEnabled(snapshot.audioPlayerEnabled);
    setBackgroundAudioEnabled(snapshot.backgroundAudioEnabled);
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
        setSnapshot((prev) =>
          prev
            ? {
              ...prev,
              location,
            }
            : prev
        );
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
    <section className="relative min-h-[125vh] overflow-hidden bg-black px-3 pb-28 pt-6 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-[320px] w-[320px] rounded-full bg-red-500/10 blur-[140px]" />
        <div className="absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-white/[0.03] blur-[180px]" />
        <div className="absolute bottom-0 left-1/3 h-[340px] w-[340px] rounded-full bg-red-500/10 blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-red-300">
        <Sparkles className="h-3.5 w-3.5" />
        Premium Customizer
      </div>

      <div className="relative z-10 flex w-full max-w-6xl flex-col gap-10">

        {/* ASSETS UPLOADER */}
        <section>
          <h2 className="text-sm font-medium text-white/80 mb-5">Assets Uploader</h2>
          <div className="grid gap-4 md:grid-cols-3">
            
            {/* Background Card */}
            <div className="rounded-xl bg-[#0c0c0c] border border-white/[0.03] p-5">
              <h3 className="text-xs font-medium text-white mb-3">Background</h3>
              <div className="flex h-28 w-full items-center justify-center rounded-lg bg-[#050505] border border-transparent hover:border-white/5 transition-all">
                {backgroundUrl ? (
                  <div className="relative h-full w-full overflow-hidden rounded-lg group">
                    {backgroundType === "video" ? (
                      <video src={backgroundUrl} className="h-full w-full object-cover opacity-60" autoPlay muted loop />
                    ) : (
                      <img src={backgroundUrl} alt="Preview" className="h-full w-full object-cover opacity-60" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <button onClick={handleRemoveBackground} className="text-xs text-red-400 font-medium">Remove</button>
                    </div>
                  </div>
                ) : (
                  <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center">
                    <input type="file" accept="image/*,video/*" onChange={handleBackgroundUpload} disabled={uploadingBackground} className="hidden" />
                    <Upload className="h-5 w-5 text-white/30 mb-2" />
                    <span className="text-[11px] text-white/40">{uploadingBackground ? "Uploading..." : "Click to upload a file"}</span>
                  </label>
                )}
              </div>
            </div>

            {/* Audio Card */}
            <div className="rounded-xl bg-[#0c0c0c] border border-white/[0.03] p-5">
              <h3 className="text-xs font-medium text-white mb-3">Audio</h3>
              <div className="flex h-28 w-full items-center justify-center rounded-lg bg-[#050505] border border-transparent hover:border-white/5 transition-all">
                <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center">
                  <input type="file" accept="audio/*" onChange={handleAudioUpload} disabled={uploadingAudio || audioControlsDisabled} className="hidden" />
                  <Music className="h-5 w-5 text-white/30 mb-2" />
                  <span className="text-[11px] text-white/40">{uploadingAudio ? "Uploading..." : "Click to open audio manager"}</span>
                </label>
              </div>
            </div>

            {/* Custom Cursor Card */}
            <div className="rounded-xl bg-[#0c0c0c] border border-white/[0.03] p-5">
              <h3 className="text-xs font-medium text-white mb-3">Custom Cursor</h3>
              <div className="flex h-28 w-full items-center justify-center rounded-lg bg-[#050505] border border-transparent hover:border-white/5 transition-all">
                <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center">
                  <input type="file" accept="image/*" disabled className="hidden" />
                  <Upload className="h-5 w-5 text-white/30 mb-2" />
                  <span className="text-[11px] text-white/40">Click to upload a file</span>
                </label>
              </div>
            </div>

          </div>
        </section>

        {/* PREMIUM BANNER */}
        <div className="relative overflow-hidden rounded-full bg-[#1e1329] border border-[#3b2354] py-3.5 px-6 flex items-center justify-center mt-2">
          <div className="absolute inset-0 opacity-20 pointer-events-none flex justify-between items-center px-10">
            <DoorOpen className="h-24 w-24 text-white -rotate-12 opacity-50" />
            <DoorOpen className="h-24 w-24 text-white rotate-12 opacity-50" />
          </div>
          <p className="relative z-10 text-[13px] font-medium text-[#e2d5ec]">
            Want exclusive features? Unlock more with <span className="font-bold text-[#b58deb] inline-flex items-center"><Sparkles className="h-3 w-3 mr-1" /> Premium</span>
          </p>
        </div>

        {/* GENERAL CUSTOMIZATION */}
        <section>
          <h2 className="text-sm font-medium text-white/80 mb-5">General Customization</h2>
          <div className="rounded-xl bg-[#0c0c0c] border border-white/[0.03] p-6">
            <div className="grid gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-4">
              
              {/* Column 1 */}
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] text-white/50 mb-2">Description</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 text-[10px] font-bold">A</div>
                    <Input
                      type="text"
                      value={enterScreenText}
                      onChange={(e) => setEnterScreenText(e.target.value)}
                      placeholder="this is my description"
                      className="h-9 w-full rounded-lg bg-[#050505] border-transparent pl-8 text-xs text-white/80 focus:border-white/10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-white/50 mb-2">Alias</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <Input
                      type="text"
                      value={alias}
                      onChange={(e) => setAlias(e.target.value)}
                      placeholder="Choose an option"
                      className="h-9 w-full rounded-lg bg-[#050505] border-transparent pl-8 text-xs text-white/80 focus:border-white/10"
                    />
                  </div>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] text-white/50 mb-2">Discord Presence</label>
                  {!user?.discord_id ? (
                    <Dialog open={isDiscordDialogOpen} onOpenChange={setIsDiscordDialogOpen}>
                      <DialogTrigger asChild>
                        <button className="flex min-h-9 w-full items-center justify-start rounded-lg bg-[#050505] px-3 py-2 text-left text-[11px] text-white/60 hover:bg-[#080808] transition-colors border border-transparent">
                          <span className="flex items-center gap-1.5"><DoorOpen className="h-3 w-3" /> Click here</span> to connect your Discord and unlock this feature.
                        </button>
                      </DialogTrigger>
                      <DialogContent className="border-white/10 bg-[#0A0A0A]">
                        <DialogHeader>
                          <DialogTitle>Connect Discord</DialogTitle>
                          <DialogDescription>Enter your Discord User ID.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <Input
                            placeholder="e.g. 123456789012345678"
                            value={inputDiscordId}
                            onChange={(e) => setInputDiscordId(e.target.value)}
                            className="bg-black/50"
                          />
                          <Button onClick={handleSaveDiscord} disabled={savingDiscord} className="w-full">
                            {savingDiscord ? "Connecting..." : "Connect"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <div className="flex h-9 w-full items-center justify-between rounded-lg bg-[#050505] px-3 border border-transparent">
                      <span className="text-xs text-white/80">{user.discord_id}</span>
                      <button onClick={handleDisconnectDiscord} disabled={savingDiscord} className="text-[10px] text-red-400 font-medium hover:underline">Disconnect</button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-[11px] text-white/50 mb-2">Typewriter Heading</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <Input
                      type="text"
                      value={typewriterHeading}
                      onChange={(e) => setTypewriterHeading(e.target.value)}
                      placeholder="Username Effects"
                      className="h-9 w-full rounded-lg bg-[#050505] border-transparent pl-8 text-xs text-white/80 focus:border-white/10"
                    />
                  </div>
                </div>
              </div>

              {/* Column 3 */}
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-1 text-[11px] text-white/50 mb-4">Profile Opacity <div className="flex h-3 w-3 items-center justify-center rounded-full border border-white/30 text-[8px]">?</div></label>
                  <div className="relative px-1 mb-4">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={discordProfileTransparency}
                      onChange={(e) => setDiscordProfileTransparency(parseFloat(e.target.value))}
                      className="w-full h-1 bg-[#222] rounded-full appearance-none outline-none accent-[#555] cursor-pointer"
                    />
                    <div className="flex justify-between mt-2 px-1">
                      <span className="text-[9px] text-white/40">0%</span>
                      <span className="text-[9px] text-white/40">50%</span>
                      <span className="text-[9px] text-white/40">100%</span>
                    </div>
                  </div>
                  
                  <div className="relative p-3 rounded-xl border border-white/10 overflow-hidden">
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
                        <div className="h-6 w-6 rounded-full bg-white/20 animate-pulse" />
                        <div>
                          <div className="h-1.5 w-12 bg-white/20 rounded-full mb-1" />
                          <div className="h-1 w-8 bg-white/10 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-white/50 mb-2">Location</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20">
                      <MapPin className="h-3.5 w-3.5" />
                    </div>
                    <Input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="My Location"
                      className="h-9 w-full rounded-lg bg-[#050505] border-transparent pl-8 text-xs text-white/80 focus:border-white/10"
                    />
                  </div>
                </div>
              </div>

              {/* Column 4 */}
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-1 text-[11px] text-white/50 mb-2">Typewriter Quotes <div className="flex h-3 w-3 items-center justify-center rounded-full border border-white/30 text-[8px]">?</div></label>
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
                          className="h-8 rounded-lg bg-[#050505] border-transparent text-[11px] text-white/80 focus:border-white/10"
                        />
                        <button
                          onClick={() => {
                            if (typewriterQuotes.length > 1) {
                              setTypewriterQuotes(typewriterQuotes.filter((_, i) => i !== index));
                            }
                          }}
                          className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-[#050505] text-white/40 hover:text-red-400"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setTypewriterQuotes([...typewriterQuotes, ""])}
                      className="h-8 w-full rounded-lg bg-[#050505] text-[11px] text-white/40 hover:text-white/80 transition-all border border-transparent hover:border-white/5"
                    >
                      + Add Quote
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </div>

      <AnimatePresence>
        {hasChanges && !saving && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-x-0 bottom-4 z-50 mx-auto flex w-[calc(100%-1.5rem)] max-w-xl items-center justify-between rounded-[28px] border border-red-500/20 bg-[#090909]/95 px-4 py-3 shadow-[0_20px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:px-5"
          >
            <div>
              <p className="text-sm font-semibold text-white">Unsaved changes</p>
              <p className="text-sm text-white/55">Save this update or discard it before you leave.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDiscard}
                className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm font-medium text-white/70 transition-all hover:border-white/[0.12] hover:text-white"
              >
                Discard
              </button>
              <Button
                onClick={handleSave}
                className="rounded-full border border-red-500/20 bg-red-500/90 px-3 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(239,68,68,0.2)]"
              >
                Save
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
