"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Disc3, Award, ShieldAlert, ShieldCheck, CheckCircle2, Lock, Eye, EyeOff, Gem,
  Crown, Heart, HeartHandshake, Gift, Image as ImageIcon, Globe, Rocket, Bug, 
  Snowflake, Trophy, Medal, Shield, Code, Palette, TestTube, Star, Sparkles,
  ArrowRight, PenTool
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  active_badges?: string[];
  owned_badges?: string[];
}

const BADGE_REGISTRY = [
  { id: "owner", name: "Owner", desc: "Creator and Owner of redr.lol.", icon: Crown, color: "from-yellow-400 to-yellow-600", glow: "rgba(250, 204, 21, 0.3)" },
  { id: "admin", name: "Admin", desc: "System Administrator.", icon: Shield, color: "from-red-500 to-red-700", glow: "rgba(239, 68, 68, 0.3)" },
  { id: "staff", name: "Staff", desc: "Be a part of the redr.lol staff team.", icon: ShieldAlert, color: "from-blue-500 to-blue-700", glow: "rgba(59, 130, 246, 0.3)", action: "Join Discord" },
  { id: "moderator", name: "Moderator", desc: "Community Moderator.", icon: ShieldCheck, color: "from-green-500 to-green-700", glow: "rgba(34, 197, 94, 0.3)" },
  { id: "developer", name: "Developer", desc: "Core contributor to the redr.lol codebase.", icon: Code, color: "from-indigo-500 to-indigo-700", glow: "rgba(99, 102, 241, 0.3)" },
  { id: "designer", name: "Designer", desc: "Creator of redr.lol aesthetics.", icon: Palette, color: "from-pink-500 to-pink-700", glow: "rgba(236, 72, 153, 0.3)" },
  { id: "helper", name: "Helper", desc: "Be active and help users in the community.", icon: Heart, color: "from-rose-400 to-rose-600", glow: "rgba(244, 63, 94, 0.3)", action: "Join Discord" },
  { id: "premium", name: "Premium", desc: "Purchase the premium package.", icon: Gem, color: "from-purple-500 to-fuchsia-600", glow: "rgba(168, 85, 247, 0.3)", action: "Purchase" },
  { id: "verified", name: "Verified", desc: "Purchase or be a known content creator.", icon: CheckCircle2, color: "from-sky-400 to-blue-600", glow: "rgba(56, 189, 248, 0.3)", action: "Unlock" },
  { id: "donor", name: "Donor", desc: "Donate at least 10€ to redr.lol.", icon: HeartHandshake, color: "from-emerald-400 to-emerald-600", glow: "rgba(52, 211, 153, 0.3)", action: "Donate" },
  { id: "gifter", name: "Gifter", desc: "Gift a redr.lol product to another user.", icon: Gift, color: "from-fuchsia-400 to-fuchsia-600", glow: "rgba(232, 121, 249, 0.3)", action: "Gift" },
  { id: "image_host", name: "Image Host", desc: "Purchase the Image Host.", icon: ImageIcon, color: "from-cyan-400 to-cyan-600", glow: "rgba(34, 211, 238, 0.3)", action: "Purchase" },
  { id: "domain_legend", name: "Domain Legend", desc: "Add a public custom domain to redr.lol Image Host.", icon: Globe, color: "from-blue-400 to-indigo-600", glow: "rgba(96, 165, 250, 0.3)", action: "Add Domain" },
  { id: "og", name: "OG", desc: "Be an early supporter of redr.lol.", icon: Award, color: "from-amber-500 to-yellow-600", glow: "rgba(245, 158, 11, 0.3)" },
  { id: "server_booster", name: "Server Booster", desc: "Boost the redr.lol discord server.", icon: Rocket, color: "from-violet-400 to-violet-600", glow: "rgba(167, 139, 250, 0.3)", action: "Boost" },
  { id: "bug_hunter", name: "Bug Hunter", desc: "Report a bug to the redr.lol team.", icon: Bug, color: "from-red-400 to-red-600", glow: "rgba(248, 113, 113, 0.3)", action: "Report" },
  { id: "easter_2026", name: "Easter 2026", desc: "Exclusive badge from the 2026 easter sale.", icon: Sparkles, color: "from-pink-300 to-pink-500", glow: "rgba(249, 168, 212, 0.3)" },
  { id: "christmas_2025", name: "Christmas 2025", desc: "Exclusive badge from the 2025 winter sale.", icon: Snowflake, color: "from-cyan-200 to-cyan-400", glow: "rgba(165, 243, 252, 0.3)" },
  { id: "easter_2025", name: "Easter 2025", desc: "Exclusive badge from the 2025 easter sale.", icon: Sparkles, color: "from-pink-400 to-pink-600", glow: "rgba(244, 114, 182, 0.3)" },
  { id: "christmas_2024", name: "Christmas 2024", desc: "Exclusive badge from the 2024 winter sale.", icon: Snowflake, color: "from-blue-200 to-blue-400", glow: "rgba(191, 219, 254, 0.3)" },
  { id: "the_million", name: "The Million", desc: "Celebration badge for 1M users.", icon: Crown, color: "from-yellow-300 to-yellow-500", glow: "rgba(253, 224, 71, 0.3)" },
  { id: "winner", name: "Winner", desc: "Win a guns.lol event.", icon: Trophy, color: "from-yellow-400 to-yellow-600", glow: "rgba(250, 204, 21, 0.3)" },
  { id: "second_place", name: "Second Place", desc: "Get second place in a redr.lol event.", icon: Medal, color: "from-slate-300 to-slate-500", glow: "rgba(203, 213, 225, 0.3)" },
  { id: "third_place", name: "Third Place", desc: "Get third place in a redr.lol event.", icon: Medal, color: "from-orange-400 to-orange-600", glow: "rgba(251, 146, 60, 0.3)" },
  { id: "beta_tester", name: "Beta Tester", desc: "Helped test unreleased features.", icon: TestTube, color: "from-teal-400 to-teal-600", glow: "rgba(45, 212, 191, 0.3)" },
  { id: "vip", name: "VIP", desc: "Very Important Person.", icon: Star, color: "from-yellow-400 to-amber-600", glow: "rgba(251, 191, 36, 0.3)" },
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
          setOwnedBadges(data.user.owned_badges || []);
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
    if (!ownedBadges.includes(badgeId)) return; // Only toggle owned badges

    let newBadges = [];
    if (activeBadges.includes(badgeId)) {
      newBadges = activeBadges.filter(id => id !== badgeId);
    } else {
      newBadges = [...activeBadges, badgeId];
    }
    
    setActiveBadges(newBadges);
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active_badges: newBadges })
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2000);
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
            Loading database...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Filter owned badges from the registry
  const myBadges = BADGE_REGISTRY.filter(b => ownedBadges.includes(b.id));

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0A0A0A] px-4 md:px-10 pb-20 pt-8 md:pt-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/3 top-0 h-[500px] w-[500px] rounded-full bg-red-600/5 blur-[150px]" />
      </div>

      <div className="mx-auto max-w-5xl relative z-10 space-y-12">
        
        {/* Header */}
        <div className="border-b border-white/5 pb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-red-400 text-xs font-semibold uppercase tracking-[0.2em]">
              <Award className="h-4 w-4" /> Identity achievements
            </div>
            <h1 className="mt-2 text-4xl font-medium tracking-tight text-white">
              Badges Inventory
            </h1>
            <p className="mt-2 text-sm text-[#8C8C8C]">
              Discover, earn, and manage your profile badges. Badges are granted by admins or through purchases.
            </p>
          </div>
        </div>

        {/* Custom Badges Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0F0F0F] p-8 shadow-2xl"
        >
          <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-red-500/10 to-transparent pointer-events-none" />
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-red-600/20 blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-white/5 border border-white/10 text-white">
                  <PenTool className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold text-white tracking-tight flex items-center gap-3">
                  Custom Badges
                  <span className="bg-red-500/20 text-red-400 text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full border border-red-500/30">
                    New
                  </span>
                </h2>
              </div>
              <p className="text-[#8C8C8C] text-sm leading-relaxed">
                Custom badges allow you to create your own badges with a custom icon and name. You can edit your custom badges by using edit credits to perfectly match your brand.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Button variant="outline" className="h-11 px-5 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10">
                Preview Badge
              </Button>
              <Button className="h-11 px-6 rounded-xl bg-white text-black hover:bg-stone-200 flex items-center gap-2">
                Purchase <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* My Badges Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-xl font-medium text-white flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" /> My Badges
            </h2>
            <div className="flex items-center gap-3">
              {saving ? (
                <span className="text-xs text-[#8C8C8C] flex items-center gap-2">
                  <Disc3 className="h-3 w-3 animate-spin" /> Saving...
                </span>
              ) : savedSuccess ? (
                <span className="text-xs text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Saved
                </span>
              ) : null}
            </div>
          </div>

          {myBadges.length === 0 ? (
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] border-dashed p-10 flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-4 text-[#555]">
                <Award className="h-6 w-6" />
              </div>
              <p className="text-white font-medium">You don't own any badges yet.</p>
              <p className="text-[#666] text-sm mt-1">Explore the available badges below to see how to earn them.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myBadges.map((badge) => {
                const Icon = badge.icon;
                const isActive = activeBadges.includes(badge.id);
                
                return (
                  <div key={`my-${badge.id}`} className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0F0F0F] p-5 shadow-lg flex items-center justify-between group transition-all hover:border-white/20">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${badge.color} text-white shadow-lg`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-white">{badge.name}</h3>
                        <p className="text-[10px] uppercase tracking-wider text-[#666] mt-0.5">
                          {isActive ? "Visible on profile" : "Hidden"}
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => toggleBadge(badge.id)}
                      variant="ghost"
                      size="icon"
                      className={`h-9 w-9 rounded-lg border transition-all ${
                        isActive 
                          ? "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300" 
                          : "bg-white/5 border-white/10 text-[#888] hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Available Badges Library */}
        <div className="space-y-6 pt-6">
          <div className="border-b border-white/5 pb-4">
            <h2 className="text-xl font-medium text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-400" /> Available Badges
            </h2>
            <p className="text-sm text-[#888] mt-1">Browse all official badges you can earn or purchase on redr.lol.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {BADGE_REGISTRY.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={`all-${badge.id}`}
                  className="relative overflow-hidden rounded-[20px] border border-white/5 bg-[#0A0A0A] p-5 transition-all duration-300 hover:bg-[#0D0D0D] hover:border-white/10 group flex flex-col justify-between h-full min-h-[160px]"
                >
                  {/* Subtle Background Glow */}
                  <div 
                    className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-[40px]"
                    style={{ background: badge.glow }}
                  />

                  <div className="relative z-10 flex items-start gap-4">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${badge.color} text-white shadow-lg`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-medium text-white tracking-tight leading-tight">{badge.name}</h3>
                      <p className="text-xs text-[#8C8C8C] leading-relaxed line-clamp-2">
                        {badge.desc}
                      </p>
                    </div>
                  </div>

                  {badge.action && (
                    <div className="mt-5 pt-4 border-t border-white/5 relative z-10">
                      <Button variant="outline" className="w-full h-8 text-[10px] uppercase tracking-widest font-bold border-white/5 bg-white/[0.02] text-[#AAA] hover:bg-white/10 hover:text-white">
                        {badge.action}
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
