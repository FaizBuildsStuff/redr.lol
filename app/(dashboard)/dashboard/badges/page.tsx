"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  BadgeCheck,
  Bug,
  CheckCircle2,
  Code,
  Crown,
  Eye,
  EyeOff,
  Gem,
  Gift,
  Globe,
  Heart,
  HeartHandshake,
  Image as ImageIcon,
  Loader2,
  Medal,
  Palette,
  Rocket,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Star,
  TestTube,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLoading, DashboardShell, Panel } from "@/components/DashboardUI";
import Link from "next/link";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  active_badges?: string[];
  owned_badges?: string[];
}

const BADGE_REGISTRY = [
  { id: "owner", name: "Owner", desc: "Creator and owner of redr.lol.", icon: Crown },
  { id: "admin", name: "Admin", desc: "System administrator access.", icon: Shield },
  { id: "staff", name: "Staff", desc: "Member of the redr.lol staff team.", icon: ShieldAlert, action: "Join Discord" },
  { id: "moderator", name: "Moderator", desc: "Community moderation badge.", icon: ShieldCheck },
  { id: "developer", name: "Developer", desc: "Core contributor to the codebase.", icon: Code },
  { id: "designer", name: "Designer", desc: "Creator of redr visual systems.", icon: Palette },
  { id: "helper", name: "Helper", desc: "Active community support member.", icon: Heart, action: "Join Discord" },
  { id: "premium", name: "Premium", desc: "Unlocked the premium package.", icon: Gem, action: "Purchase" },
  { id: "verified", name: "Verified", desc: "Verified identity or creator status.", icon: BadgeCheck, action: "Unlock" },
  { id: "donor", name: "Donor", desc: "Supported redr.lol directly.", icon: HeartHandshake, action: "Donate" },
  { id: "gifter", name: "Gifter", desc: "Gifted a redr.lol product.", icon: Gift, action: "Gift" },
  { id: "image_host", name: "Image Host", desc: "Unlocked image hosting access.", icon: ImageIcon, action: "Purchase" },
  { id: "domain_legend", name: "Domain Legend", desc: "Added a custom public domain.", icon: Globe, action: "Add Domain" },
  { id: "og", name: "OG", desc: "Early redr.lol supporter.", icon: Award },
  { id: "server_booster", name: "Server Booster", desc: "Boosted the community server.", icon: Rocket, action: "Boost" },
  { id: "bug_hunter", name: "Bug Hunter", desc: "Reported a verified platform bug.", icon: Bug, action: "Report" },
  { id: "easter_2026", name: "Easter 2026", desc: "Seasonal 2026 badge.", icon: Sparkles },
  { id: "christmas_2025", name: "Christmas 2025", desc: "Winter 2025 badge.", icon: Snowflake },
  { id: "easter_2025", name: "Easter 2025", desc: "Seasonal 2025 badge.", icon: Sparkles },
  { id: "christmas_2024", name: "Christmas 2024", desc: "Winter 2024 badge.", icon: Snowflake },
  { id: "the_million", name: "The Million", desc: "Celebration badge for major growth.", icon: Crown },
  { id: "winner", name: "Winner", desc: "Won a redr.lol event.", icon: Trophy },
  { id: "second_place", name: "Second Place", desc: "Placed second in an event.", icon: Medal },
  { id: "third_place", name: "Third Place", desc: "Placed third in an event.", icon: Medal },
  { id: "beta_tester", name: "Beta Tester", desc: "Helped test unreleased features.", icon: TestTube },
  { id: "vip", name: "VIP", desc: "Very important person.", icon: Star },
];

export default function BadgesPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeBadges, setActiveBadges] = useState<string[]>([]);
  const [ownedBadges, setOwnedBadges] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setActiveBadges(data.user.active_badges || []);

          // Ensure that any active badges are also treated as owned badges,
          // in case they were added directly to active_badges but not owned_badges in the DB.
          const active = data.user.active_badges || [];
          const owned = data.user.owned_badges || [];
          const combinedOwned = Array.from(new Set([...owned, ...active]));
          setOwnedBadges(combinedOwned);
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

  const toggleBadge = async (badgeId: string) => {
    if (!ownedBadges.includes(badgeId)) return;

    const newBadges = activeBadges.includes(badgeId)
      ? activeBadges.filter((id) => id !== badgeId)
      : [...activeBadges, badgeId];

    setActiveBadges(newBadges);
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active_badges: newBadges }),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <DashboardLoading label="Loading badges" />;
  if (!user) return null;

  const myBadges = BADGE_REGISTRY.filter((badge) => ownedBadges.includes(badge.id));

  return (
    <DashboardShell
      eyebrow="Badges"
      title="Identity badges"
      description="Manage the badges shown on your public profile and browse the official badge library."
      action={
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 text-xs font-semibold text-white/60">
          {saving ? "Saving..." : savedSuccess ? "Saved" : `${activeBadges.length} active`}
        </div>
      }
    >
      <Panel className="mb-6 overflow-hidden p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
              <Award className="h-5 w-5 text-white" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-white">Custom badge layer</h2>
            <p className="mt-2 text-sm leading-6 text-white/45">
              Badges are treated as small signals, not decoration overload. Keep your active set intentional and premium.
            </p>
          </div>
          <Link
            href="https://discord.gg/ECvnDYQQFx"
            target="_blank"
          >
            <Button className="h-11 rounded-2xl bg-white px-5 text-sm font-semibold text-black hover:bg-white/85">
              Request custom badge
            </Button>
          </Link>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Panel className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">My badges</h2>
              <p className="mt-1 text-sm text-white/42">Toggle visibility on your public profile.</p>
            </div>
            <div className="flex items-center gap-3">
              {activeBadges.length > 0 && (
                <div className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-2">
                  {BADGE_REGISTRY.filter((b) => activeBadges.includes(b.id)).map((badge) => {
                    const Icon = badge.icon;
                    return (
                      <div
                        key={`active-${badge.id}`}
                        title={badge.name}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black"
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                    );
                  })}
                </div>
              )}
              {saving ? <Loader2 className="h-4 w-4 animate-spin text-white/50" /> : savedSuccess ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : null}
            </div>
          </div>

          {myBadges.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/[0.08] bg-black/20 p-8 text-center">
              <Award className="mx-auto h-7 w-7 text-white/30" />
              <p className="mt-4 text-sm font-semibold text-white">No owned badges yet</p>
              <p className="mt-1 text-xs text-white/40">Browse the library to see what can be earned or purchased.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {myBadges.map((badge) => {
                const Icon = badge.icon;
                const isActive = activeBadges.includes(badge.id);
                return (
                  <div key={badge.id} className="flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-black">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{badge.name}</p>
                        <p className="text-xs text-white/40">{isActive ? "Visible" : "Hidden"}</p>
                      </div>
                    </div>
                    <Button onClick={() => toggleBadge(badge.id)} size="icon" className="h-9 w-9 rounded-xl border border-white/[0.08] bg-white/[0.035] text-white hover:bg-white/[0.07]">
                      {isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>

        <Panel className="p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-white">Available library</h2>
            <p className="mt-1 text-sm text-white/42">Official redr.lol badge catalog.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {BADGE_REGISTRY.map((badge) => {
              const Icon = badge.icon;
              const owned = ownedBadges.includes(badge.id);
              return (
                <div key={badge.id} className="rounded-2xl border border-white/[0.07] bg-black/20 p-4">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${owned ? "bg-white text-black" : "bg-white/[0.05] text-white/55"}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-white">{badge.name}</p>
                        {owned && <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-200">owned</span>}
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/40">{badge.desc}</p>
                      {badge.action && <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">{badge.action}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}
