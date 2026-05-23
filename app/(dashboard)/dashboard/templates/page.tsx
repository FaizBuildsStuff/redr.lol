"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Disc3,
  LayoutTemplate,
  Check,
  Eye,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserProfile {
  id: number;
  username: string;
  email: string;
}

export default function TemplatesPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Selected theme template state
  const [activeTemplate, setActiveTemplate] = useState("crimson-dither");

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
            Syncing visual presets...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const templates = [
    {
      id: "crimson-dither",
      name: "Crimson Dither",
      desc: "Our signature layout featuring deep red grain, glowing borders, and high contrast accents.",
      style: "Cyber / Grainy",
      accent: "#EF4444",
      activeText: "Applied"
    },
    {
      id: "void-glass",
      name: "Void Glassmorphism",
      desc: "An ultra-premium minimal layout prioritizing high-transparency panels, backdrops, and soft ambient glows.",
      style: "Minimalist / Glass",
      accent: "#A855F7",
      activeText: "Activate Theme"
    },
    {
      id: "midnight-cyber",
      name: "Midnight Cyber",
      desc: "Dark mode synthwave inspired design with grid patterns, deep navy and fuchsia glowing gradients.",
      style: "Synthwave / Dark",
      accent: "#EC4899",
      activeText: "Activate Theme"
    },
    {
      id: "tactical-terminal",
      name: "Tactical Terminal",
      desc: "Monospace tactical terminal layout containing retro green text fields and clean retro console grids.",
      style: "Retro / Tech",
      accent: "#22C55E",
      activeText: "Activate Theme"
    }
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0A0A0A] px-4 md:px-10 pb-20 pt-8 md:pt-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-red-600/5 blur-[150px]" />
      </div>

      <div className="mx-auto max-w-5xl relative z-10">
        
        {/* Header */}
        <div className="border-b border-white/5 pb-8 mb-10">
          <div className="flex items-center gap-2 text-red-400 text-xs font-semibold uppercase tracking-[0.2em]">
            <LayoutTemplate className="h-4 w-4" /> Layout Presets
          </div>
          <h1 className="mt-2 text-4xl font-medium tracking-tight text-white">
            Ecosystem Templates
          </h1>
          <p className="mt-2 text-sm text-[#8C8C8C]">
            Select from our state-of-the-art layout presets to build a premium public page instantly.
          </p>
        </div>

        {/* TEMPLATE SHOWCASE */}
<div className="space-y-8">

  {/* TOP FILTERS */}
  <div className="flex flex-wrap items-center justify-between gap-4">

    <div className="flex flex-wrap gap-3">

      {[
        "All Templates",
        "Creator",
        "Minimal",
        "Cyberpunk",
        "Glassmorphism",
      ].map((item, i) => (
        <button
          key={i}
          className={`
          rounded-2xl
          border
          px-5
          py-3
          text-xs
          font-semibold
          uppercase
          tracking-[0.15em]
          transition-all
          duration-300

          ${
            i === 0
              ? "border-red-500/20 bg-red-500/10 text-red-400"
              : "border-white/10 bg-white/[0.03] text-white/45 hover:bg-white/[0.06] hover:text-white"
          }
        `}
        >
          {item}
        </button>
      ))}

    </div>

    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-white/45 backdrop-blur-xl">
      24 Premium Templates
    </div>

  </div>

  {/* GRID */}
  <div className="grid gap-6 lg:grid-cols-2">

    {templates.map((template, index) => {
      const isActive = activeTemplate === template.id;

      return (
        <motion.div
          key={template.id}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * 0.08,
          }}
          whileHover={{
            y: -6,
            scale: 1.01,
          }}
          className={`
          group
          relative
          overflow-hidden
          rounded-[34px]
          border
          backdrop-blur-3xl
          transition-all
          duration-500

          ${
            isActive
              ? "border-red-500/20 bg-red-500/[0.05] shadow-[0_0_50px_rgba(239,68,68,0.12)]"
              : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
          }
        `}
        >

          {/* Animated Background */}
          <div
            className="absolute inset-0 opacity-70"
            style={{
              background: `
                radial-gradient(circle at top right, ${template.accent}20, transparent 30%),
                radial-gradient(circle at bottom left, ${template.accent}15, transparent 30%)
              `,
            }}
          />

          {/* Glow */}
          <div
            className="absolute right-0 top-0 h-[220px] w-[220px] rounded-full opacity-20 blur-[100px]"
            style={{
              background: template.accent,
            }}
          />

          {/* Grid Overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />

          <div className="relative z-10 p-6 sm:p-7">

            {/* TOP */}
            <div className="flex items-start justify-between gap-4">

              <div>

                {/* STYLE BADGE */}
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 backdrop-blur-xl">

                  <div
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: template.accent,
                      boxShadow: `0 0 12px ${template.accent}`,
                    }}
                  />

                  {template.style}

                </div>

                {/* NAME */}
                <h3 className="mt-5 text-2xl font-semibold tracking-tight text-white">
                  {template.name}
                </h3>

                {/* DESCRIPTION */}
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/45">
                  {template.desc}
                </p>

              </div>

              {/* ACTIVE */}
              {isActive && (
                <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-green-400">

                  <Check className="h-3.5 w-3.5" />

                  Applied

                </div>
              )}

            </div>

            {/* TEMPLATE PREVIEW */}
            <div className="relative mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-black/40 p-5 backdrop-blur-3xl">

              {/* Preview Glow */}
              <div
                className="absolute left-1/2 top-1/2 h-[160px] w-[160px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[80px]"
                style={{
                  background: template.accent,
                }}
              />

              {/* Preview UI */}
              <div className="relative z-10">

                {/* Fake Header */}
                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div
                      className="h-12 w-12 rounded-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${template.accent}, #ffffff20)`,
                      }}
                    />

                    <div>
                      <div className="h-3 w-24 rounded-full bg-white/10" />
                      <div className="mt-2 h-2 w-16 rounded-full bg-white/5" />
                    </div>

                  </div>

                  <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-white/40">
                    Live
                  </div>

                </div>

                {/* Fake Content */}
                <div className="mt-6 space-y-3">

                  <div className="h-14 rounded-2xl bg-white/[0.04]" />
                  <div className="h-14 rounded-2xl bg-white/[0.03]" />
                  <div className="h-14 rounded-2xl bg-white/[0.02]" />

                </div>

                {/* Fake Footer */}
                <div className="mt-6 flex items-center justify-between">

                  <div className="flex gap-2">

                    <div className="h-9 w-9 rounded-xl bg-white/[0.05]" />
                    <div className="h-9 w-9 rounded-xl bg-white/[0.05]" />
                    <div className="h-9 w-9 rounded-xl bg-white/[0.05]" />

                  </div>

                  <div
                    className="h-10 w-28 rounded-2xl"
                    style={{
                      background: `linear-gradient(90deg, ${template.accent}, #ffffff20)`,
                    }}
                  />

                </div>

              </div>
            </div>

            {/* BOTTOM */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              {/* CREATOR */}
              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-white backdrop-blur-xl">
                  <Sparkles className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/35">
                    Creator
                  </p>

                  <p className="mt-1 text-sm font-medium text-white">
                    @redrLabs
                  </p>
                </div>

              </div>

              {/* BUTTONS */}
              <div className="flex gap-3">

                {/* PREVIEW */}
                <Button
                  className="
                  h-12
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.03]
                  px-5
                  text-sm
                  font-semibold
                  text-white
                  transition-all
                  duration-300
                  hover:bg-white/[0.06]
                "
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>

                {/* APPLY */}
                <Button
                  onClick={() =>
                    setActiveTemplate(template.id)
                  }
                  disabled={isActive}
                  className={`
                  h-12
                  rounded-2xl
                  px-6
                  text-sm
                  font-semibold
                  text-white
                  transition-all
                  duration-300

                  ${
                    isActive
                      ? "border border-red-500/20 bg-red-500/10 text-red-400"
                      : "bg-gradient-to-r from-red-500 to-purple-600 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(239,68,68,0.35)]"
                  }
                `}
                >

                  {isActive
                    ? "Currently Applied"
                    : "Apply Template"}

                </Button>

              </div>

            </div>
          </div>
        </motion.div>
      );
    })}
  </div>
</div>

      </div>
    </section>
  );
}
