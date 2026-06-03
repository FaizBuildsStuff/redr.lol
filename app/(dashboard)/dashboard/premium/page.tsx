"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Award, Check, Gem, Globe, Music, ShieldCheck, Sparkles, Star, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLoading, DashboardShell, Panel } from "@/components/DashboardUI";

interface UserProfile {
  id: number;
  username: string;
  email: string;
}

const premiumPerks = [
  { name: "Custom Domain Mapping", desc: "Attach a branded profile URL when you are ready.", icon: Globe },
  { name: "HD Audio Profiles", desc: "Add richer profile audio and playback controls.", icon: Music },
  { name: "Premium Badge", desc: "A clean visual signal on your public identity.", icon: Award },
  { name: "Advanced Visual Themes", desc: "More profile surfaces, motion, and dashboard polish.", icon: Wand2 },
];

export default function PremiumPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <DashboardLoading label="Loading premium" />;
  if (!user) return null;

  return (
    <DashboardShell
      eyebrow="Premium"
      title="Upgrade the identity layer"
      description="A restrained premium plan for creators who want a sharper public profile and more room to customize."
    >
      <Panel className="overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
              <Gem className="h-3.5 w-3.5 text-white" />
              redr premium
            </div>
            <h2 className="mt-6 max-w-3xl text-4xl font-semibold leading-[0.95] tracking-[-0.06em] text-white sm:text-6xl">
              Minimal profile power, without visual noise.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/45">
              Premium keeps the redr.lol aesthetic clean: better identity signals, more media control, richer profile options, and future visual releases.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {["Verified premium badge", "Animated premium templates", "Custom domain support", "Future premium releases"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-black/20 p-4 text-sm text-white">
                  <Check className="h-4 w-4 text-white/70" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/[0.08] bg-black/25 p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
                Lifetime
              </div>
              <Star className="h-5 w-5 text-white/70" />
            </div>

            <div className="mt-8">
              <div className="flex items-end gap-2">
                <p className="text-6xl font-semibold tracking-[-0.07em] text-white">$4.99</p>
                <p className="pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/35">one-time</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/45">Simple access. No complicated plan matrix.</p>
            </div>

            <Button className="mt-8 h-12 w-full rounded-2xl bg-white text-sm font-semibold text-black hover:bg-white/85">
              Purchase premium
            </Button>
          </div>
        </div>
      </Panel>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {premiumPerks.map((perk) => {
          const Icon = perk.icon;
          return (
            <Panel key={perk.name} className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-white">{perk.name}</h3>
              <p className="mt-2 text-sm leading-6 text-white/42">{perk.desc}</p>
            </Panel>
          );
        })}
      </div>

      <Panel className="mt-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-white/70" />
            <div>
              <p className="text-sm font-semibold text-white">Premium is account scoped</p>
              <p className="mt-1 text-xs text-white/42">Purchases attach to your redr.lol account and profile identity.</p>
            </div>
          </div>
          <Sparkles className="hidden h-5 w-5 text-white/40 sm:block" />
        </div>
      </Panel>
    </DashboardShell>
  );
}
