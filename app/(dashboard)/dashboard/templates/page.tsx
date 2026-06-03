"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Eye, LayoutTemplate, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLoading, DashboardShell, Panel } from "@/components/DashboardUI";

interface UserProfile {
  id: number;
  username: string;
  email: string;
}

const templates = [
  {
    id: "crimson-dither",
    name: "Crimson Dither",
    desc: "The signature redr profile: dark, crisp, and subtly luminous.",
    style: "Signature",
  },
  {
    id: "void-glass",
    name: "Void Glass",
    desc: "A quiet glass surface with restrained contrast and no visual clutter.",
    style: "Minimal",
  },
  {
    id: "midnight-cyber",
    name: "Midnight Cyber",
    desc: "Grid structure, high contrast controls, and a sharper creator frame.",
    style: "Cyber",
  },
  {
    id: "tactical-terminal",
    name: "Tactical Terminal",
    desc: "A compact technical profile template with denser information rhythm.",
    style: "Terminal",
  },
];

export default function TemplatesPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTemplate, setActiveTemplate] = useState("crimson-dither");

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) setUser(data.user);
        else router.push("/signin");
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  if (loading) return <DashboardLoading label="Loading templates" />;
  if (!user) return null;

  return (
    <DashboardShell
      eyebrow="Templates"
      title="Profile templates"
      description="Minimal, premium layout presets for fast public profile composition."
      action={<div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 text-xs font-semibold text-white/55">4 available</div>}
    >
      <div className="mb-6 flex flex-wrap gap-3">
        {["All", "Minimal", "Creator", "Cyber", "Terminal"].map((filter, index) => (
          <button
            key={filter}
            className={`rounded-2xl border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-all ${
              index === 0
                ? "border-white/40 bg-white text-black"
                : "border-white/[0.08] bg-white/[0.025] text-white/45 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {templates.map((template) => {
          const isActive = activeTemplate === template.id;
          return (
            <Panel key={template.id} className={`overflow-hidden p-5 ${isActive ? "border-white/20" : ""}`}>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
                    <LayoutTemplate className="h-3.5 w-3.5" />
                    {template.style}
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">{template.name}</h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-white/42">{template.desc}</p>
                </div>
                {isActive && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-black">
                    <Check className="h-3.5 w-3.5" />
                    Applied
                  </div>
                )}
              </div>

              <div className="mt-6 rounded-[22px] border border-white/[0.07] bg-black/25 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-white" />
                    <div>
                      <div className="h-2.5 w-28 rounded-full bg-white/20" />
                      <div className="mt-2 h-2 w-16 rounded-full bg-white/10" />
                    </div>
                  </div>
                  <div className="rounded-full border border-white/[0.08] px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/35">Live</div>
                </div>

                <div className="mt-5 grid gap-3">
                  <div className="h-12 rounded-2xl bg-white/[0.08]" />
                  <div className="h-12 rounded-2xl bg-white/[0.055]" />
                  <div className="h-12 rounded-2xl bg-white/[0.035]" />
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 text-sm text-white/45">
                  <Sparkles className="h-4 w-4" />
                  Built by redrLabs
                </div>
                <div className="flex gap-3">
                  <Button className="h-10 rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 text-sm font-semibold text-white hover:bg-white/[0.07]">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  <Button
                    onClick={() => setActiveTemplate(template.id)}
                    disabled={isActive}
                    className={`h-10 rounded-xl px-4 text-sm font-semibold ${
                      isActive ? "bg-white/[0.08] text-white/45" : "bg-white text-black hover:bg-white/85"
                    }`}
                  >
                    {isActive ? "Applied" : "Apply"}
                  </Button>
                </div>
              </div>
            </Panel>
          );
        })}
      </div>
    </DashboardShell>
  );
}
