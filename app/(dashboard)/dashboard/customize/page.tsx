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
  discord_avatar?: string;
  discord_username?: string;
  typewriter_heading?: string;
  typewriter_quotes?: string[];
  background_url?: string;
  background_type?: string;
  audios?: Array<{ id: string; url: string; name: string }>;
  audio_shuffle?: boolean;
  audio_player_enabled?: boolean;
  background_audio_enabled?: boolean;
  active_audio_id?: string;
  custom_cursor_url?: string;
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
  activeAudioId: string | null;
  customCursorUrl: string | null;
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
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);

  // Cursor states
  const [customCursorUrl, setCustomCursorUrl] = useState<string | null>(null);
  const [uploadingCursor, setUploadingCursor] = useState(false);
  const [isCursorModalOpen, setIsCursorModalOpen] = useState(false);

  // Location states
  const [location, setLocation] = useState("");

  // Discord states
  const [isDiscordDialogOpen, setIsDiscordDialogOpen] = useState(false);
  const [inputDiscordId, setInputDiscordId] = useState("");
  const [savingDiscord, setSavingDiscord] = useState(false);

  const [discordProfileTransparency, setDiscordProfileTransparency] = useState(0.40);

  const { startUpload: startAudioUpload } = useUploadThing("audioUploader");
  const { startUpload: startBackgroundUpload } = useUploadThing("backgroundUploader");
  const { startUpload: startCursorUpload } = useUploadThing("backgroundUploader");

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
      backgroundAudioEnabled !== snapshot.backgroundAudioEnabled ||
      activeAudioId !== snapshot.activeAudioId ||
      customCursorUrl !== snapshot.customCursorUrl
    );
  }, [alias, audioPlayerEnabled, audioShuffle, audios, backgroundAudioEnabled, backgroundType, backgroundUrl, discordProfileTransparency, enterScreenText, location, snapshot, typewriterHeading, typewriterQuotes, activeAudioId, customCursorUrl]);

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
          if (data.user.active_audio_id !== undefined) {
            setActiveAudioId(data.user.active_audio_id);
          }
          if (data.user.custom_cursor_url !== undefined) {
            setCustomCursorUrl(data.user.custom_cursor_url);
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
            activeAudioId: data.user.active_audio_id ?? null,
            customCursorUrl: data.user.custom_cursor_url ?? null,
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
          custom_cursor_url: customCursorUrl,
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
          activeAudioId,
          customCursorUrl,
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

  const handleAudioSettings = async (
    shuffle: boolean,
    playerEnabled: boolean,
    activeId: string | null = activeAudioId,
    bgAudioEnabled: boolean = backgroundAudioEnabled
  ) => {
    setAudioShuffle(shuffle);
    setAudioPlayerEnabled(playerEnabled);
    setActiveAudioId(activeId);
    setBackgroundAudioEnabled(bgAudioEnabled);

    try {
      const res = await fetch("/api/user/audio", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shuffle,
          player_enabled: playerEnabled,
          active_audio_id: activeId,
        }),
      });

      if (!res.ok) {
        console.error("Failed to update audio settings");
      }

      if (bgAudioEnabled !== backgroundAudioEnabled) {
        await fetch("/api/user/background", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ background_audio_enabled: bgAudioEnabled }),
        });
      }
    } catch (error) {
      console.error("Audio settings error:", error);
    }
  };

  const handleCursorUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingCursor(true);
    try {
      const uploadedFiles = await startCursorUpload(Array.from(files));
      if (uploadedFiles && uploadedFiles.length > 0) {
        const file = uploadedFiles[0];
        setCustomCursorUrl(file.url);
        // Save immediately
        await fetch("/api/user/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ custom_cursor_url: file.url }),
        });
      }
    } catch (error) {
      console.error("Cursor upload error:", error);
    } finally {
      setUploadingCursor(false);
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
    setActiveAudioId(snapshot.activeAudioId);
    setCustomCursorUrl(snapshot.customCursorUrl);
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

      <div className="relative z-10 flex w-full max-w-[85rem] flex-col gap-10">

        {/* ASSETS UPLOADER */}
        <section>
          <h2 className="text-base font-semibold text-white/90 mb-6">Assets Uploader</h2>
          <div className="grid gap-6 md:grid-cols-3">
            
            {/* Background Card */}
            <div className="rounded-xl bg-[#0c0c0c] border border-white/[0.03] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white">Background</h3>
                {backgroundType === "video" && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-[10px] text-white/50">Enable Audio</span>
                    <input
                      type="checkbox"
                      checked={backgroundAudioEnabled}
                      onChange={handleBackgroundAudioToggle}
                      className="accent-red-500"
                    />
                  </label>
                )}
              </div>
              <div className="flex h-40 w-full items-center justify-center rounded-lg bg-[#050505] border border-transparent hover:border-white/5 transition-all">
                {backgroundUrl ? (
                  <div className="relative h-full w-full overflow-hidden rounded-lg group">
                    {backgroundType === "video" ? (
                      <video src={backgroundUrl} className="h-full w-full object-cover opacity-60" autoPlay muted loop />
                    ) : (
                      <img src={backgroundUrl} alt="Preview" className="h-full w-full object-cover opacity-60" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <button onClick={handleRemoveBackground} className="text-sm text-red-400 font-medium">Remove</button>
                    </div>
                  </div>
                ) : (
                  <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center">
                    <input type="file" accept="image/*,video/*" onChange={handleBackgroundUpload} disabled={uploadingBackground} className="hidden" />
                    <Upload className="h-6 w-6 text-white/30 mb-3" />
                    <span className="text-xs text-white/40">{uploadingBackground ? "Uploading..." : "Click to upload a file"}</span>
                  </label>
                )}
              </div>
            </div>

            {/* Audio Card */}
            <div className="rounded-xl bg-[#0c0c0c] border border-white/[0.03] p-6">
              <h3 className="text-sm font-medium text-white mb-4">Audio</h3>
              <div className="flex h-40 w-full items-center justify-center rounded-lg bg-[#050505] border border-transparent hover:border-white/5 transition-all">
                <button
                  onClick={() => setIsAudioModalOpen(true)}
                  disabled={audioControlsDisabled}
                  className={`flex h-full w-full flex-col items-center justify-center ${audioControlsDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <Music className="h-6 w-6 text-white/30 mb-3" />
                  <span className="text-xs text-white/40">
                    {audioControlsDisabled ? "Disabled by Background Audio" : audios.length > 0 ? `${audios.length} Track${audios.length !== 1 ? 's' : ''} Uploaded` : "Click to open audio manager"}
                  </span>
                </button>
              </div>
            </div>

            {/* Custom Cursor Card */}
            <div className="rounded-xl bg-[#0c0c0c] border border-white/[0.03] p-6">
              <h3 className="text-sm font-medium text-white mb-4">Custom Cursor</h3>
              <div className="flex h-40 w-full items-center justify-center rounded-lg bg-[#050505] border border-transparent hover:border-white/5 transition-all overflow-hidden relative">
                {customCursorUrl ? (
                  <div className="relative h-full w-full flex flex-col items-center justify-center group cursor-pointer" onClick={() => setIsCursorModalOpen(true)}>
                    <img src={customCursorUrl} alt="Cursor Preview" className="max-h-24 max-w-24 object-contain drop-shadow-md" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm">
                      <span className="text-xs text-white font-medium">Change Cursor</span>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setIsCursorModalOpen(true)} className="flex h-full w-full flex-col items-center justify-center cursor-pointer">
                    <Upload className="h-6 w-6 text-white/30 mb-3" />
                    <span className="text-xs text-white/40">Click to set custom cursor</span>
                  </button>
                )}
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
          <h2 className="text-base font-semibold text-white/90 mb-6">General Customization</h2>
          <div className="rounded-xl bg-[#0c0c0c] border border-white/[0.03] p-8">
            <div className="grid gap-x-12 gap-y-8 md:grid-cols-2">
              
              {/* Column 1 */}
              <div className="space-y-8">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-2.5">Description</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 text-xs font-bold">A</div>
                    <Input
                      type="text"
                      value={enterScreenText}
                      onChange={(e) => setEnterScreenText(e.target.value)}
                      placeholder="this is my description"
                      className="h-9 w-full rounded-lg bg-[#050505] border-transparent pl-10 text-sm text-white/80 focus:border-white/10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-2.5">Alias</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <Input
                      type="text"
                      value={alias}
                      onChange={(e) => setAlias(e.target.value)}
                      placeholder="Choose an option"
                      className="h-9 w-full rounded-lg bg-[#050505] border-transparent pl-10 text-sm text-white/80 focus:border-white/10"
                    />
                  </div>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-8">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-2.5">Discord Presence</label>
                  {!user?.discord_id ? (
                    <a
                      href="/api/auth/discord/login?from=customize"
                      className="group flex w-full items-center gap-3 rounded-xl bg-[#5865F2]/10 border border-[#5865F2]/20 px-4 py-3 text-left hover:bg-[#5865F2]/15 hover:border-[#5865F2]/35 transition-all duration-200"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5865F2]/20 shrink-0">
                        <svg className="h-4 w-4 fill-[#5865F2]" viewBox="0 0 127.14 96.36"><path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c1-.73,2-1.51,2.94-2.31A75.52,75.52,0,0,0,96,78.2c1,.8,1.94,1.58,2.94,2.31a68.17,68.17,0,0,1-10.5,5A77.7,77.7,0,0,0,95.12,96.36a105.73,105.73,0,0,0,31.06-18.83C129.87,50.7,123.36,27.83,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" /></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white/90">Connect Discord</p>
                        <p className="text-[10px] text-white/40 mt-0.5">Link your account to show live presence</p>
                      </div>
                      <svg className="h-3.5 w-3.5 text-white/30 group-hover:text-white/60 transition-colors shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" /></svg>
                    </a>
                  ) : (
                    <div className="flex w-full items-center gap-3 rounded-xl bg-[#5865F2]/10 border border-[#5865F2]/20 px-4 py-3">
                      {user.discord_avatar ? (
                        <img
                          src={`https://cdn.discordapp.com/avatars/${user.discord_id}/${user.discord_avatar}.png?size=64`}
                          alt="Discord avatar"
                          className="h-8 w-8 rounded-full shrink-0 ring-1 ring-[#5865F2]/40"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5865F2]/30 shrink-0">
                          <svg className="h-4 w-4 fill-[#5865F2]" viewBox="0 0 127.14 96.36"><path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c1-.73,2-1.51,2.94-2.31A75.52,75.52,0,0,0,96,78.2c1,.8,1.94,1.58,2.94,2.31a68.17,68.17,0,0,1-10.5,5A77.7,77.7,0,0,0,95.12,96.36a105.73,105.73,0,0,0,31.06-18.83C129.87,50.7,123.36,27.83,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" /></svg>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-semibold text-white truncate">{user.username}</p>
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-400 border border-emerald-500/20">
                            <span className="h-1 w-1 rounded-full bg-emerald-400 inline-block"></span>
                            Connected
                          </span>
                        </div>
                        <p className="text-[10px] text-white/40 mt-0.5">ID: {user.discord_id}</p>
                      </div>
                      <button
                        onClick={handleDisconnectDiscord}
                        disabled={savingDiscord}
                        className="shrink-0 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold text-red-400/80 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                      >
                        Disconnect
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-2.5">Typewriter Heading</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <Input
                      type="text"
                      value={typewriterHeading}
                      onChange={(e) => setTypewriterHeading(e.target.value)}
                      placeholder="Username Effects"
                      className="h-9 w-full rounded-lg bg-[#050505] border-transparent pl-10 text-sm text-white/80 focus:border-white/10"
                    />
                  </div>
                </div>
              </div>

              {/* Column 3 */}
              <div className="space-y-8">
                <div>
                  <label className="flex items-center justify-between text-xs font-medium text-white/60 mb-4">
                    <span className="flex items-center gap-1.5">Cards Opacity <div className="flex h-4 w-4 items-center justify-center rounded-full border border-white/30 text-[9px]">?</div></span>
                    <span className="text-[10px] font-mono text-white/40">{Math.round(discordProfileTransparency * 100)}%</span>
                  </label>
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
                      <span className="text-[9px] text-white/40">Glass</span>
                      <span className="text-[9px] text-white/40">Solid</span>
                    </div>
                  </div>
                  
                  {/* Live preview */}
                  <div className="relative p-3 rounded-xl border border-white/10 overflow-hidden">
                    <div
                      className="absolute inset-0 z-0"
                      style={{ background: `linear-gradient(45deg, #1a1a2e, #16213e, #0f3460)` }}
                    />
                    {/* Widget card preview */}
                    <div className="relative z-10 space-y-2">
                      <div
                        className="rounded-lg border border-white/10 p-3"
                        style={{
                          background: `rgba(15, 15, 15, ${discordProfileTransparency})`,
                          backdropFilter: "blur(28px)",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-white/20 animate-pulse shrink-0" />
                          <div className="flex-1">
                            <div className="h-1.5 w-16 bg-white/25 rounded-full mb-1" />
                            <div className="h-1 w-10 bg-white/10 rounded-full" />
                          </div>
                        </div>
                      </div>
                      <div
                        className="rounded-lg border border-white/10 p-2.5"
                        style={{
                          background: `rgba(15, 15, 15, ${discordProfileTransparency})`,
                          backdropFilter: "blur(28px)",
                        }}
                      >
                        <div className="flex gap-1.5">
                          <div className="h-1 flex-1 bg-white/15 rounded-full" />
                          <div className="h-1 w-6 bg-red-500/30 rounded-full" />
                        </div>
                      </div>
                    </div>
                    {discordProfileTransparency === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                        <span className="text-[9px] font-semibold text-white/50 bg-black/40 rounded px-1.5 py-0.5">Fully transparent</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-2.5">Location</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <Input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="My Location"
                      className="h-9 w-full rounded-lg bg-[#050505] border-transparent pl-10 text-sm text-white/80 focus:border-white/10"
                    />
                  </div>
                </div>
              </div>

              {/* Column 4 */}
              <div className="space-y-8">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-white/60 mb-2.5">Typewriter Quotes <div className="flex h-4 w-4 items-center justify-center rounded-full border border-white/30 text-[9px]">?</div></label>
                  <div className="space-y-2.5">
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
                          className="h-9 rounded-lg bg-[#050505] border-transparent text-sm text-white/80 focus:border-white/10"
                        />
                        <button
                          onClick={() => {
                            if (typewriterQuotes.length > 1) {
                              setTypewriterQuotes(typewriterQuotes.filter((_, i) => i !== index));
                            }
                          }}
                          className="h-9 w-11 shrink-0 flex items-center justify-center rounded-lg bg-[#050505] text-white/40 hover:text-red-400"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setTypewriterQuotes([...typewriterQuotes, ""])}
                      className="h-9 w-full rounded-lg bg-[#050505] text-xs font-medium text-white/40 hover:text-white/80 transition-all border border-transparent hover:border-white/5"
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
      <AnimatePresence>
        {isAudioModalOpen && (
          <Dialog open={isAudioModalOpen} onOpenChange={setIsAudioModalOpen}>
            <DialogContent className="border-white/10 bg-[#0A0A0A] max-w-md w-full">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-white">Audio Manager</DialogTitle>
                <DialogDescription className="text-white/50 text-xs">
                  To set an audio as active, please select your desired audio by clicking on it.
                  Add up to 4 audios with <span className="text-[#b58deb] font-bold inline-flex items-center"><Sparkles className="h-3 w-3 mr-0.5" /> Premium</span>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-2">
                <div className="flex flex-col gap-1 text-xs">
                  <div className="flex justify-between items-center text-white/60">
                    <span>Audios ({audios.length}/4)</span>
                  </div>
                  
                  <div className="space-y-2 mt-2 max-h-[200px] overflow-y-auto pr-1">
                    {audios.map((audio) => (
                      <div
                        key={audio.id}
                        onClick={() => handleAudioSettings(audioShuffle, audioPlayerEnabled, audio.id, false)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${activeAudioId === audio.id ? 'border-red-500/40 bg-red-500/10' : 'border-white/5 bg-[#0f0f0f] hover:border-white/20'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${activeAudioId === audio.id ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-white/40'}`}>
                            <Music className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-white">{audio.name}</p>
                            {activeAudioId === audio.id && <p className="text-[10px] text-red-400">Active</p>}
                          </div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRemoveAudio(audio.id); }}
                          className="h-8 w-8 flex items-center justify-center text-white/30 hover:text-red-400 rounded-lg hover:bg-white/5"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-white/5 bg-[#0f0f0f] p-4 flex flex-col items-center justify-center relative overflow-hidden group">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    disabled={uploadingAudio || audios.length >= 4}
                    className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                  />
                  {uploadingAudio ? (
                    <div className="flex flex-col items-center gap-3 w-full px-4">
                      <span className="text-xs text-white/60">Uploading...</span>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
                        <motion.div
                          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-red-600 via-red-400 to-red-600 w-full"
                          initial={{ x: "-100%" }}
                          animate={{ x: "100%" }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                        <Upload className="h-4 w-4 text-white/50" />
                      </div>
                      <span className="text-xs text-white/60">Click to upload custom audio</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl border border-white/5 bg-[#0f0f0f] hover:border-white/10">
                    <div>
                      <p className="text-xs font-medium text-white">Shuffle Audios</p>
                      <p className="text-[10px] text-white/40">Play a random audio from your list</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={audioShuffle}
                      onChange={(e) => handleAudioSettings(e.target.checked, audioPlayerEnabled, activeAudioId, backgroundAudioEnabled)}
                      className="accent-red-500 w-4 h-4"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl border border-white/5 bg-[#0f0f0f] hover:border-white/10">
                    <div>
                      <p className="text-xs font-medium text-white">Audio Player</p>
                      <p className="text-[10px] text-white/40">Show a mini player on your profile</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={audioPlayerEnabled}
                      onChange={(e) => handleAudioSettings(audioShuffle, e.target.checked, activeAudioId, backgroundAudioEnabled)}
                      className="accent-red-500 w-4 h-4"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl border border-white/5 bg-[#0f0f0f] hover:border-white/10">
                    <div>
                      <p className="text-xs font-medium text-white">Disable Custom Audio</p>
                      <p className="text-[10px] text-white/40">Automatically enables video background audio if available</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={activeAudioId === null}
                      onChange={(e) => {
                        const disabled = e.target.checked;
                        handleAudioSettings(audioShuffle, audioPlayerEnabled, disabled ? null : (audios[0]?.id || null), disabled && backgroundType === 'video');
                      }}
                      className="accent-red-500 w-4 h-4"
                    />
                  </label>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCursorModalOpen && (
          <Dialog open={isCursorModalOpen} onOpenChange={setIsCursorModalOpen}>
            <DialogContent className="border-white/10 bg-[#0A0A0A] max-w-sm w-full">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-white">Custom Cursor</DialogTitle>
                <DialogDescription className="text-white/50 text-xs">
                  Upload an image to replace the default mouse cursor on your profile.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {customCursorUrl && (
                  <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border border-white/5 bg-[#0f0f0f]">
                    <img src={customCursorUrl} alt="Cursor" className="max-h-24 max-w-24 object-contain" />
                    <button
                      onClick={async () => {
                        setCustomCursorUrl(null);
                        await fetch("/api/user/profile", {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ custom_cursor_url: null }),
                        });
                      }}
                      className="text-xs text-red-400 font-medium"
                    >
                      Remove Cursor
                    </button>
                  </div>
                )}

                <div className="rounded-xl border border-white/5 bg-[#0f0f0f] p-6 flex flex-col items-center justify-center relative overflow-hidden group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCursorUpload}
                    disabled={uploadingCursor}
                    className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                  />
                  {uploadingCursor ? (
                    <div className="flex flex-col items-center gap-3 w-full px-4">
                      <span className="text-xs text-white/60">Uploading...</span>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
                        <motion.div
                          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-red-600 via-red-400 to-red-600 w-full"
                          initial={{ x: "-100%" }}
                          animate={{ x: "100%" }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                        <Upload className="h-4 w-4 text-white/50" />
                      </div>
                      <span className="text-xs text-white/60">Click to upload an image</span>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

    </section>
  );
}
