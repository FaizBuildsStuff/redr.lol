"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CustomLink {
  id: string;
  title: string;
  url: string;
  icon: string;
  active: boolean;
}

const socials = [
  { id: "twitter", icon: "𝕏" },
  { id: "youtube", icon: "▶" },
  { id: "discord", icon: "◎" },
  { id: "spotify", icon: "◉" },
  { id: "instagram", icon: "◌" },
  { id: "github", icon: "◈" },
  { id: "tiktok", icon: "♪" },
  { id: "telegram", icon: "✈" },
  { id: "paypal", icon: "$" },
  { id: "twitch", icon: "◍" },
];

export default function LinksPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [links, setLinks] = useState<CustomLink[]>([
    {
      id: "1",
      title: "Twitter",
      url: "https://twitter.com",
      icon: "𝕏",
      active: true,
    },
    {
      id: "2",
      title: "Discord",
      url: "https://discord.gg",
      icon: "◎",
      active: true,
    },
    {
      id: "3",
      title: "Github",
      url: "https://github.com",
      icon: "◈",
      active: true,
    },
  ]);

  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newIcon, setNewIcon] = useState("𝕏");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (!data.user) {
          router.push("/signin");
        }
      } catch {
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  const addLink = (e: React.FormEvent) => {
    e.preventDefault();

    const item = {
      id: Date.now().toString(),
      title: newTitle,
      url: newUrl.startsWith("http")
        ? newUrl
        : `https://${newUrl}`,
      icon: newIcon,
      active: true,
    };

    setLinks([...links, item]);

    setNewTitle("");
    setNewUrl("");
    setAdding(false);
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter((x) => x.id !== id));
  };

  const toggleLink = (id: string) => {
    setLinks(
      links.map((x) =>
        x.id === id ? { ...x, active: !x.active } : x
      )
    );
  };

  const saveLinks = async () => {
    try {
      setSaving(true);

      await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          custom_links: links,
        }),
      });
    } catch (e) {
      console.log(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-black px-3 pb-20 pt-8 sm:px-6 lg:px-10">

      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-20 top-20 h-72 w-72 rounded-full bg-white/5 blur-[120px]" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-neutral-700/10 blur-[160px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-white/5 blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* TOP */}
<div className="relative mb-12 overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-3xl sm:p-8">

  {/* BACKGROUND GLOWS */}
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute left-0 top-0 h-[250px] w-[250px] rounded-full bg-red-500/10 blur-[120px]" />
    <div className="absolute right-0 top-0 h-[300px] w-[300px] rounded-full bg-white/5 blur-[140px]" />
    <div className="absolute bottom-0 left-1/2 h-[200px] w-[200px] -translate-x-1/2 rounded-full bg-red-500/10 blur-[100px]" />
  </div>

  <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

    {/* LEFT */}
    <div className="max-w-2xl">

      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-400 backdrop-blur-xl">
        <div className="h-2 w-2 rounded-full bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.8)]" />
        Creator Link Hub
      </div>

      <h1 className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
        Link your social media profiles
      </h1>

      <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/45 sm:text-base">
        Connect all your socials, communities, products and external platforms
        inside one modern creator profile experience.
      </p>

    </div>

    {/* RIGHT BUTTONS */}
    <div className="flex flex-wrap items-center gap-3">

      {/* ADD LINK BUTTON */}
      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogTrigger asChild>
          <Button
            className="
            group
            relative
            h-12
            overflow-hidden
            rounded-2xl
            border
            border-red-500/20
            bg-red-500/10
            px-5
            text-sm
            font-semibold
            text-red-400
            backdrop-blur-xl
            transition-all
            duration-300
            hover:scale-[1.02]
            hover:border-red-500/40
            hover:bg-red-500/20
            hover:text-white
            hover:shadow-[0_0_40px_rgba(239,68,68,0.25)]
          "
          >

            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <span className="relative z-10 flex items-center gap-2">
              +
              Add Link
            </span>

          </Button>
        </DialogTrigger>

        {/* DIALOG */}
        <DialogContent
          className="
          overflow-hidden
          border
          border-white/10
          bg-[#070707]
          text-white
          backdrop-blur-3xl
          sm:max-w-[480px]
        "
        >

          {/* GLOW */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-[250px] w-[250px] -translate-x-1/2 rounded-full bg-white/10 blur-[120px]" />

          <DialogHeader className="relative z-10">
            <DialogTitle className="text-2xl font-semibold tracking-tight">
              Create New Link
            </DialogTitle>

            <DialogDescription className="mt-2 text-sm leading-relaxed text-white/40">
              Connect socials, portfolios, communities and external platforms beautifully.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={addLink}
            className="relative z-10 mt-6 space-y-5"
          >

            {/* TITLE */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
                Link Title
              </label>

              <input
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Twitter"
                className="
                h-12
                w-full
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                px-4
                text-sm
                text-white
                outline-none
                transition-all
                focus:border-red-500/30
                focus:bg-white/[0.05]
              "
              />
            </div>

            {/* URL */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
                Destination URL
              </label>

              <input
                required
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://"
                className="
                h-12
                w-full
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                px-4
                text-sm
                text-white
                outline-none
                transition-all
                focus:border-red-500/30
                focus:bg-white/[0.05]
              "
              />
            </div>

            {/* PLATFORM SELECT */}
<div>
  <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
    Platform Type
  </label>

  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

    {[
      { id: "𝕏", name: "Twitter" },
      { id: "◎", name: "Discord" },
      { id: "◈", name: "Github" },
      { id: "▶", name: "YouTube" },
      { id: "◌", name: "Instagram" },
      { id: "🌐", name: "Custom URL" },
    ].map((platform) => (
      <button
        type="button"
        key={platform.name}
        onClick={() => setNewIcon(platform.id)}
        className={`
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        p-4
        text-left
        transition-all
        duration-300

        ${
          newIcon === platform.id
            ? "border-red-500/40 bg-red-500/10 shadow-[0_0_40px_rgba(239,68,68,0.15)]"
            : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
        }
      `}
      >

        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Content */}
        <div className="relative z-10">

          {/* Icon */}
          <div
            className={`
            mb-4
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            border
            text-2xl
            backdrop-blur-xl
            transition-all
            duration-300

            ${
              newIcon === platform.id
                ? "border-red-500/30 bg-red-500/10 text-red-400"
                : "border-white/10 bg-black/30 text-white"
            }
          `}
          >
            {platform.id}
          </div>

          {/* Text */}
          <h4 className="text-sm font-semibold text-white">
            {platform.name}
          </h4>

          <p className="mt-1 text-xs leading-relaxed text-white/40">
            {platform.name === "Custom URL"
              ? "Use your own website or custom external link."
              : `Connect your ${platform.name} profile.`}
          </p>

        </div>

        {/* Active Dot */}
        <div
          className={`
          absolute
          right-4
          top-4
          h-3
          w-3
          rounded-full
          transition-all
          duration-300

          ${
            newIcon === platform.id
              ? "bg-red-400 shadow-[0_0_20px_rgba(248,113,113,0.9)]"
              : "bg-white/10"
          }
        `}
        />

      </button>
    ))}
  </div>
</div>

            {/* WHITE BUTTON */}
            <Button
              type="submit"
              className="
              h-12
              w-full
              rounded-2xl
              bg-white
              text-sm
              font-semibold
              text-black
              transition-all
              duration-300
              hover:scale-[1.01]
              hover:bg-neutral-200
              shadow-[0_10px_40px_rgba(255,255,255,0.15)]
            "
            >
              Create Link
            </Button>

          </form>
        </DialogContent>
      </Dialog>

      {/* SAVE BUTTON */}
      <Button
        onClick={saveLinks}
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

        <span className="relative z-10">
          {saving ? "Saving..." : "Save Changes"}
        </span>

      </Button>

    </div>
  </div>
</div>

        {/* MAIN GLASS PANEL */}
        <div className="rounded-[36px] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-3xl sm:p-8">

          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Social Links
              </h2>

              <p className="mt-1 text-sm text-white/40">
                Manage all profile connections
              </p>
            </div>

            <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-white/50">
              {links.length} active links
            </div>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">

            <AnimatePresence>
              {links.map((link) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`group relative overflow-hidden rounded-[28px] border p-5 transition-all duration-300 ${
                    link.active
                      ? "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                      : "border-white/5 bg-white/[0.01] opacity-40"
                  }`}
                >

                  {/* Glow */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative z-10">

                    {/* Icon */}
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-2xl text-white backdrop-blur-xl">
                      {link.icon}
                    </div>

                    {/* Text */}
                    <h3 className="text-sm font-semibold text-white">
                      {link.title}
                    </h3>

                    <p className="mt-1 truncate text-xs text-white/40">
                      {link.url}
                    </p>

                    {/* Bottom */}
                    <div className="mt-5 flex items-center justify-between">

                      <button
                        onClick={() =>
                          toggleLink(link.id)
                        }
                        className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider transition-all ${
                          link.active
                            ? "bg-white text-black"
                            : "bg-white/10 text-white/50"
                        }`}
                      >
                        {link.active
                          ? "Active"
                          : "Hidden"}
                      </button>

                      <button
                        onClick={() =>
                          deleteLink(link.id)
                        }
                        className="text-xs text-white/30 transition-all hover:text-red-400"
                      >
                        Delete
                      </button>

                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </section>
  );
}