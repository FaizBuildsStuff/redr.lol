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
    <section className="relative min-h-screen overflow-hidden bg-[#050505] px-4 md:px-10 pb-20 pt-8 md:pt-12">
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

        {/* TEMPLATES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map((template) => {
            const isActive = activeTemplate === template.id;
            
            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`relative overflow-hidden rounded-[26px] border p-6 backdrop-blur-3xl transition-all duration-300 flex flex-col justify-between ${
                  isActive
                    ? "border-red-500/30 bg-[#0F0404]/50 shadow-[0_15px_30px_rgba(239,68,68,0.06)]"
                    : "border-white/5 bg-[#0A0A0A] hover:border-white/10 hover:bg-[#0C0C0C]"
                }`}
              >
                {/* Backdrop design decoration */}
                <div
                  className="absolute right-0 top-0 h-40 w-40 rounded-full opacity-10 blur-[50px] pointer-events-none"
                  style={{ backgroundColor: template.accent }}
                />

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#555] bg-white/[0.02] border border-white/5 px-3 py-1 rounded-full">
                      {template.style}
                    </span>
                    {isActive && (
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
                        <Check className="h-3 w-3" /> Applied Theme
                      </span>
                    )}
                  </div>

                  <h3 className="mt-6 text-xl font-medium text-white tracking-tight">{template.name}</h3>
                  <p className="mt-2.5 text-xs leading-relaxed text-[#8C8C8C]">
                    {template.desc}
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-white/5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1 text-[10px] text-[#555] uppercase font-bold tracking-wider">
                    Accent Color:
                    <div className="h-3.5 w-3.5 rounded-full border border-white/15" style={{ backgroundColor: template.accent }} />
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Select theme button */}
                    <Button
                      onClick={() => setActiveTemplate(template.id)}
                      disabled={isActive}
                      className={`h-9 px-4 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all duration-300 ${
                        isActive
                          ? "bg-red-500/10 border border-red-500/20 text-red-400"
                          : "bg-red-600 hover:bg-red-500 text-white shadow-md hover:shadow-lg"
                      }`}
                    >
                      {isActive ? "Currently Applied" : "Apply Template"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
