"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Disc3,
  Award,
  ShieldAlert,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock
} from "lucide-react";

interface UserProfile {
  id: number;
  username: string;
  email: string;
}

export default function BadgesPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

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
            Configuring trophy cases...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const badges = [
    {
      id: "early",
      name: "Early Adopter",
      desc: "Granted to users who joined redr.lol during the alpha registration phase.",
      status: "unlocked",
      tier: "Legendary",
      color: "from-amber-500 to-yellow-600",
      glowColor: "rgba(245, 158, 11, 0.25)",
      icon: Award
    },
    {
      id: "verified",
      name: "Verified Profile",
      desc: "Proof of verified identity. Ensures account authenticity.",
      status: "locked",
      tier: "Elite",
      color: "from-blue-500 to-indigo-600",
      glowColor: "rgba(59, 130, 246, 0.15)",
      icon: ShieldCheck
    },
    {
      id: "developer",
      name: "Quantum Contributor",
      desc: "Granted to core ecosystem engineers and contributors.",
      status: "locked",
      tier: "Developer",
      color: "from-red-500 to-rose-600",
      glowColor: "rgba(239, 68, 68, 0.2)",
      icon: CheckCircle2
    },
    {
      id: "premium",
      name: "Elite Supporter",
      desc: "Active premium subscriber badge. Displayed proudly on your public links page.",
      status: "locked",
      tier: "Premium Only",
      color: "from-purple-500 to-fuchsia-600",
      glowColor: "rgba(168, 85, 247, 0.15)",
      icon: Sparkles
    }
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050505] px-4 md:px-10 pb-20 pt-8 md:pt-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/3 top-0 h-[500px] w-[500px] rounded-full bg-red-600/5 blur-[150px]" />
      </div>

      <div className="mx-auto max-w-5xl relative z-10">
        
        {/* Header */}
        <div className="border-b border-white/5 pb-8 mb-10">
          <div className="flex items-center gap-2 text-red-400 text-xs font-semibold uppercase tracking-[0.2em]">
            <Award className="h-4 w-4" /> Identity achievements
          </div>
          <h1 className="mt-2 text-4xl font-medium tracking-tight text-white">
            Badges Inventory
          </h1>
          <p className="mt-2 text-sm text-[#8C8C8C]">
            Unlock special cosmetic badges to personalize your public profile.
          </p>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {badges.map((badge) => {
            const Icon = badge.icon;
            const isUnlocked = badge.status === "unlocked";
            
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`relative overflow-hidden rounded-[24px] border p-6 backdrop-blur-3xl transition-all duration-300 flex flex-col justify-between ${
                  isUnlocked
                    ? "border-white/10 bg-[#0A0A0A] hover:border-white/20"
                    : "border-white/[0.03] bg-[#070707] opacity-60"
                }`}
                style={{
                  boxShadow: isUnlocked ? `0 10px 30px -10px ${badge.glowColor}` : "none"
                }}
              >
                <div className="relative flex items-start gap-5">
                  {/* Glowing Icon holder */}
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${
                    isUnlocked
                      ? "bg-gradient-to-br " + badge.color + " text-white border-white/10 shadow-lg"
                      : "bg-[#101010] text-[#444] border-white/5"
                  }`}>
                    <Icon className="h-7 w-7" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-white tracking-tight">{badge.name}</h3>
                      <span className={`text-[8px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-full border ${
                        isUnlocked
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-white/5 text-[#555] border-white/5"
                      }`}>
                        {badge.tier}
                      </span>
                    </div>
                    <p className="text-xs text-[#8C8C8C] leading-relaxed">
                      {badge.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="text-[10px] uppercase tracking-wider text-[#555]">
                    Status: <span className={isUnlocked ? "text-green-400 font-semibold" : "text-[#777]"}>
                      {isUnlocked ? "Active & Unlocked" : "Locked"}
                    </span>
                  </div>

                  {!isUnlocked ? (
                    <div className="flex items-center gap-1 text-[10px] text-[#777] uppercase font-bold tracking-wider">
                      <Lock className="h-3 w-3" /> Requires Upgrade
                    </div>
                  ) : (
                    <div className="text-[10px] text-green-400 uppercase font-bold tracking-wider">
                      Applied to Bio
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
