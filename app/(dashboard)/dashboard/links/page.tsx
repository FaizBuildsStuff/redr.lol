"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
const Disc3 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 12a0 0 0 1 0 0" />
    <path d="M12 2a10 10 0 0 1 10 10" />
  </svg>
);

const Link2 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 17H7A5 5 0 0 1 7 7h2" />
    <path d="M15 7h2a5 5 0 0 1 0 10h-2" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const Plus = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const Trash2 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const Globe = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const Youtube = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.54a29 29 0 0 0 .46 5.12 2.78 2.78 0 0 0 1.95 1.96c1.71.46 8.59.46 8.59.46s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.12 29 29 0 0 0-.46-5.12z" />
    <polygon points="9.75 15.02 15.5 11.54 9.75 8.07 9.75 15.02" />
  </svg>
);

const CheckCircle2 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const EyeOff = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

const Eye = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

const Twitter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Steam = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.54 3.03 8.375 7.153 9.605l.937-2.612a2.385 2.385 0 0 1-.09-.597 2.395 2.395 0 1 1 4.79 0c0 .416-.107.807-.294 1.15l.904 2.523C18.847 20.672 22 16.71 22 12c0-5.523-4.477-10-10-10zm0 1.25c4.832 0 8.75 3.918 8.75 8.75 0 3.826-2.454 7.08-5.883 8.243l-.936-2.61a2.393 2.393 0 0 1 .069-.533 2.395 2.395 0 0 1-4.79 0c0-.184.02-.363.059-.536l-.968-2.702A4.79 4.79 0 0 0 12 3.25zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 1.25a2.75 2.75 0 1 1 0 5.5 2.75 2.75 0 0 1 0-5.5zm0 .75a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 .75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z" />
  </svg>
);

interface UserProfile {
  id: number;
  username: string;
  email: string;
  custom_links?: CustomLink[];
}

interface CustomLink {
  id: string;
  title: string;
  url: string;
  iconType: string;
  active: boolean;
}

export default function LinksPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Links List
  const [links, setLinks] = useState<CustomLink[]>([
    { id: "1", title: "Official Twitter", url: "https://twitter.com", iconType: "twitter", active: true },
    { id: "2", title: "Community Discord", url: "https://discord.gg", iconType: "discord", active: true },
    { id: "3", title: "Ecosystem Source Code", url: "https://github.com", iconType: "github", active: false }
  ]);

  // Form inputs
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newIconType, setNewIconType] = useState("globe");
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          if (data.user.custom_links && data.user.custom_links.length > 0) {
            setLinks(data.user.custom_links);
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

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;

    const newLink: CustomLink = {
      id: Date.now().toString(),
      title: newTitle,
      url: newUrl.startsWith("http") ? newUrl : `https://${newUrl}`,
      iconType: newIconType,
      active: true
    };

    setLinks([...links, newLink]);
    setNewTitle("");
    setNewUrl("");
    setNewIconType("globe");
    setAdding(false);
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
  };

  const handleToggleActive = (id: string) => {
    setLinks(
      links.map((l) => (l.id === id ? { ...l, active: !l.active } : l))
    );
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ custom_links: links })
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
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
            Configuring link arrays...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const renderIcon = (type: string) => {
    switch (type) {
      case "twitter":
        return <Twitter className="h-4.5 w-4.5 text-sky-400" />;
      case "github":
        return <Github className="h-4.5 w-4.5 text-white" />;
      case "discord":
        return (
          <svg className="h-4.5 w-4.5 fill-indigo-400" viewBox="0 0 127.14 96.36">
            <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c1-.73,2-1.51,2.94-2.31A75.52,75.52,0,0,0,96,78.2c1,.8,1.94,1.58,2.94,2.31a68.17,68.17,0,0,1-10.5,5A77.7,77.7,0,0,0,95.12,96.36a105.73,105.73,0,0,0,31.06-18.83C129.87,50.7,123.36,27.83,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/>
          </svg>
        );
      case "youtube":
        return <Youtube className="h-4.5 w-4.5 text-red-500" />;
      case "instagram":
        return <Instagram className="h-4.5 w-4.5 text-pink-500" />;
      case "steam":
        return <Steam className="h-4.5 w-4.5 text-white" />;
      default:
        return <Globe className="h-4.5 w-4.5 text-neutral-400" />;
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0A0A0A] px-4 md:px-10 pb-20 pt-8 md:pt-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-red-600/5 blur-[150px]" />
      </div>

      <div className="mx-auto max-w-4xl relative z-10">
        
        {/* Header */}
        <div className="border-b border-white/5 pb-8 mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-red-400 text-xs font-semibold uppercase tracking-[0.2em]">
              <Link2 className="h-4 w-4" /> Link router
            </div>
            <h1 className="mt-2 text-4xl font-medium tracking-tight text-white">
              Buttons & Social Links
            </h1>
            <p className="mt-2 text-sm text-[#8C8C8C]">
              Configure interactive buttons that sit inside your bio canvas cards.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Dialog open={adding} onOpenChange={setAdding}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 px-5 rounded-xl border-white/10 bg-white/[0.02] text-xs text-white hover:bg-white/[0.06] transition-all duration-300"
                >
                  <Plus className="h-4 w-4 mr-1.5 text-red-500" /> Add New Button
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0A0A0A] border-white/10 text-white sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-sm font-semibold text-red-400 uppercase tracking-widest">New Social Button</DialogTitle>
                  <DialogDescription className="text-[#8C8C8C] text-xs">
                    Create a custom social button or web link.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddLink} className="space-y-4 pt-2">
                  <div className="space-y-4">
                    {/* Button Title */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#666] mb-1.5 font-semibold">Title</label>
                      <input
                        type="text"
                        placeholder="e.g. My Website"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        required
                        className="h-11 w-full rounded-xl border border-white/5 bg-[#0A0A0A] px-3.5 text-xs text-white placeholder-[#333] transition-all focus:border-red-500/30 focus:outline-none"
                      />
                    </div>

                    {/* Destination URL */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#666] mb-1.5 font-semibold">URL Destination</label>
                      <input
                        type="text"
                        placeholder="e.g. mysite.com"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        required
                        className="h-11 w-full rounded-xl border border-white/5 bg-[#0A0A0A] px-3.5 text-xs text-white placeholder-[#333] transition-all focus:border-red-500/30 focus:outline-none"
                      />
                    </div>

                    {/* Icon Selector */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#666] mb-1.5 font-semibold">Icon Style</label>
                      <select
                        value={newIconType}
                        onChange={(e) => setNewIconType(e.target.value)}
                        className="h-11 w-full rounded-xl border border-white/5 bg-[#0A0A0A] px-3.5 text-xs text-[#8C8C8C] transition-all focus:border-red-500/30 focus:outline-none"
                      >
                        <option value="globe">Globe (Custom URL)</option>
                        <option value="twitter">Twitter</option>
                        <option value="discord">Discord</option>
                        <option value="github">GitHub</option>
                        <option value="youtube">YouTube</option>
                        <option value="instagram">Instagram</option>
                        <option value="steam">Steam</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      className="h-9 px-4 rounded-lg bg-red-600 hover:bg-red-500 text-[10px] uppercase font-bold text-white shadow-[0_4px_15px_rgba(239,68,68,0.2)]"
                    >
                      Add Button
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Button
              onClick={handleSaveChanges}
              disabled={saving}
              className="h-11 px-5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold uppercase tracking-wider text-white shadow-[0_4px_15px_rgba(239,68,68,0.2)] transition-all duration-300 flex items-center gap-2"
            >
              {saving ? (
                <Disc3 className="h-4 w-4 animate-spin" />
              ) : saveSuccess ? (
                <CheckCircle2 className="h-4 w-4 text-green-300" />
              ) : (
                <Link2 className="h-4 w-4" />
              )}
              {saveSuccess ? "Saved Successfully" : "Save Configuration"}
            </Button>
          </div>
        </div>

        {/* LINKS LISTING */}
        <div className="rounded-[26px] border border-white/5 bg-[#0A0A0A]/80 p-6 backdrop-blur-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-sm font-semibold text-white">Public Links</h3>
            <span className="text-[10px] text-[#555] font-semibold">{links.length} configure items active</span>
          </div>

          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {links.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-xs text-[#555] uppercase font-bold tracking-wider">No active link buttons</p>
                  <p className="text-xs text-[#8C8C8C] mt-1">Click "Add New Button" to construct profile layout links.</p>
                </div>
              ) : (
                links.map((link) => (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                      link.active
                        ? "bg-[#0D0D0D] border-white/5"
                        : "bg-[#0A0A0A] border-white/[0.02] opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Brand Icon Container */}
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.03] border border-white/5">
                        {renderIcon(link.iconType)}
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-white">{link.title}</h4>
                        <p className="text-[10px] text-[#666] font-mono mt-0.5 truncate max-w-[250px] sm:max-w-xs">{link.url}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Active Toggle */}
                      <button
                        onClick={() => handleToggleActive(link.id)}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 ${
                          link.active
                            ? "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                            : "bg-white/[0.01] border-white/5 text-[#444] hover:text-[#888]"
                        }`}
                      >
                        {link.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>

                      {/* Delete link */}
                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-white/[0.01] text-[#444] hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}
