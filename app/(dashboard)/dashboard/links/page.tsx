"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Globe2, Link2, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DashboardLoading, DashboardShell, Panel } from "@/components/DashboardUI";

interface CustomLink {
  id: string;
  title: string;
  url: string;
  icon: string;
  active: boolean;
}

interface UserResponse {
  user?: {
    custom_links?: CustomLink[];
  };
}

const defaultLinks: CustomLink[] = [
  { id: "1", title: "Website", url: "https://redr.lol", icon: "web", active: true },
];

const platforms = [
  "Website",
  "Twitter / X",
  "Discord",
  "YouTube",
  "Instagram",
  "GitHub",
  "Spotify",
  "Twitch",
  "TikTok",
];

export default function LinksPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState<CustomLink[]>(defaultLinks);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data: UserResponse = await res.json();
        if (!data.user) {
          router.push("/signin");
          return;
        }
        if (Array.isArray(data.user.custom_links) && data.user.custom_links.length > 0) {
          setLinks(data.user.custom_links);
        }
      } catch {
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  const addLink = (event: React.FormEvent) => {
    event.preventDefault();
    const title = newTitle.trim();
    const url = newUrl.trim();
    if (!title || !url) return;

    const item: CustomLink = {
      id: Date.now().toString(),
      title,
      url: url.startsWith("http") ? url : `https://${url}`,
      icon: "web",
      active: true,
    };

    setLinks((current) => [...current, item]);
    setNewTitle("");
    setNewUrl("");
    setAdding(false);
    setSaved(false);
  };

  const deleteLink = (id: string) => {
    setLinks((current) => current.filter((item) => item.id !== id));
    setSaved(false);
  };

  const toggleLink = (id: string) => {
    setLinks((current) => current.map((item) => (item.id === id ? { ...item, active: !item.active } : item)));
    setSaved(false);
  };

  const saveLinks = async () => {
    try {
      setSaving(true);
      setSaved(false);
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ custom_links: links }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <DashboardLoading label="Loading links" />;

  return (
    <DashboardShell
      eyebrow="Links"
      title="Social link hub"
      description="A minimalist connection manager for social media, websites, communities, and external profile destinations."
      action={
        <div className="flex flex-wrap gap-3">
          <Dialog open={adding} onOpenChange={setAdding}>
            <DialogTrigger asChild>
              <Button className="h-11 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-5 text-sm font-semibold text-white hover:bg-white/[0.07]">
                <Plus className="mr-2 h-4 w-4" />
                Add link
              </Button>
            </DialogTrigger>
            <DialogContent className="border-white/[0.08] bg-[#070707] text-white sm:max-w-[520px]">
              <DialogHeader>
                <DialogTitle>Create social link</DialogTitle>
                <DialogDescription className="text-white/45">
                  Use the web icon for social media and external destinations.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={addLink} className="mt-4 space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/38">Platform</label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {platforms.map((name) => (
                      <button
                        type="button"
                        key={name}
                        onClick={() => setNewTitle(name)}
                        className={`rounded-2xl border p-3 text-left text-xs font-semibold transition-all ${
                          newTitle === name
                            ? "border-white/40 bg-white text-black"
                            : "border-white/[0.08] bg-white/[0.025] text-white/60 hover:bg-white/[0.06] hover:text-white"
                        }`}
                      >
                        <Globe2 className="mb-2 h-4 w-4" />
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/38">Title</label>
                  <input
                    required
                    value={newTitle}
                    onChange={(event) => setNewTitle(event.target.value)}
                    placeholder="Website"
                    className="h-12 w-full rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 text-sm text-white outline-none focus:border-white/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/38">URL</label>
                  <input
                    required
                    value={newUrl}
                    onChange={(event) => setNewUrl(event.target.value)}
                    placeholder="https://example.com"
                    className="h-12 w-full rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 text-sm text-white outline-none focus:border-white/20"
                  />
                </div>
                <Button type="submit" className="h-12 w-full rounded-2xl bg-white text-sm font-semibold text-black hover:bg-white/85">
                  Create link
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Button onClick={saveLinks} disabled={saving} className="h-11 rounded-2xl bg-white px-5 text-sm font-semibold text-black hover:bg-white/85">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : saved ? <Check className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
            {saving ? "Saving" : saved ? "Saved" : "Save"}
          </Button>
        </div>
      }
    >
      <Panel className="p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Connections</h2>
            <p className="mt-1 text-sm text-white/42">{links.filter((item) => item.active).length} active of {links.length} links</p>
          </div>
          <div className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1 text-xs text-white/50">Web icon mode</div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
            {links.map((link) => (
              <motion.div
                key={link.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className={`rounded-[24px] border p-5 transition-all ${
                  link.active
                    ? "border-white/[0.08] bg-white/[0.025]"
                    : "border-white/[0.05] bg-black/20 opacity-55"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-black">
                      <Globe2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-white">{link.title}</h3>
                      <p className="mt-1 truncate text-xs text-white/42">{link.url}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteLink(link.id)} className="text-white/32 transition-colors hover:text-white">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <button
                    onClick={() => toggleLink(link.id)}
                    className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                      link.active ? "bg-white text-black" : "bg-white/[0.08] text-white/50"
                    }`}
                  >
                    {link.active ? "Active" : "Hidden"}
                  </button>
                  <a href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-semibold text-white/55 hover:text-white">
                    <Link2 className="h-3.5 w-3.5" />
                    Open
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Panel>
    </DashboardShell>
  );
}
