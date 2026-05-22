"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Disc3,
  Gem,
  Check,
  Sparkles,
  Award,
  Music,
  Globe,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserProfile {
  id: number;
  username: string;
  email: string;
}

export default function PremiumPage() {
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
            Loading quantum packages...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const premiumPerks = [
    { name: "Custom Domain Mapping", desc: "Use your own custom URL like links.yourname.com directly.", icon: Globe },
    { name: "HD Background Audio Uploads", desc: "Upload and stream background tracks in high-fidelity MP3 formats.", icon: Music },
    { name: "Verified Premium Profile Badge", desc: "Gain instant visual authority with a unique glowing badge beside your name.", icon: Award },
    { name: "Elite Animated Canvas Themes", desc: "Access high-performance dithered shaders and animated particle flows.", icon: Sparkles }
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0A0A0A] px-4 md:px-10 pb-20 pt-8 md:pt-12">
      {/* Dynamic backdrop glows for Premium */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/3 top-0 h-[600px] w-[600px] rounded-full bg-red-600/5 blur-[160px]" />
        <div className="absolute right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-purple-600/5 blur-[150px]" />
      </div>

      <div className="mx-auto max-w-5xl relative z-10">
        
        {/* Header */}
        <div className="border-b border-white/5 pb-8 mb-10">
          <div className="flex items-center gap-2 text-red-400 text-xs font-semibold uppercase tracking-[0.2em]">
            <Gem className="h-4 w-4" /> Elite Upgrade
          </div>
          <h1 className="mt-2 text-4xl font-medium tracking-tight text-white">
            redr<span className="text-red-500 font-bold">.lol</span> Premium
          </h1>
          <p className="mt-2 text-sm text-[#8C8C8C]">
            Unlock creative freedom with premium styling options, audio uplinks, and custom domains.
          </p>
        </div>

        {/* PRICING GRID */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
          
          {/* PERKS DESCRIPTION (LEFT) */}
          <div className="md:col-span-3 space-y-6">
            <h3 className="text-lg font-medium text-white tracking-tight">Unlock Premium Perks</h3>
            
            <div className="space-y-4">
              {premiumPerks.map((perk, i) => {
                const Icon = perk.icon;
                return (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl border border-white/5 bg-[#0A0A0A]/50 backdrop-blur-md">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{perk.name}</h4>
                      <p className="mt-1 text-xs text-[#8C8C8C] leading-relaxed">{perk.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CHECKOUT CARD (RIGHT) */}
          <div className="md:col-span-2 relative group">
            {/* Glowing border glow */}
            <div className="absolute -inset-px rounded-[30px] bg-gradient-to-r from-red-600 to-purple-600 opacity-20 blur-lg transition-all group-hover:opacity-35" />
            
            <div className="relative rounded-[28px] border border-white/10 bg-[#080808]/90 p-8 backdrop-blur-2xl">
              <div className="flex justify-between items-start">
                <span className="rounded-full bg-red-500/10 border border-red-500/20 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-red-400">
                  LIFETIME ACCESS
                </span>
                <Star className="h-5 w-5 text-red-400 fill-red-400/25" />
              </div>

              <div className="mt-6">
                <h3 className="text-2xl font-semibold text-white tracking-tight">Supporter Tier</h3>
                <p className="mt-1.5 text-xs text-[#8C8C8C]">Single one-time charge. No subscription loops.</p>
              </div>

              <div className="mt-6 border-y border-white/5 py-5 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white tracking-tight">$4.99</span>
                <span className="text-xs text-[#555] uppercase font-bold tracking-wider">one-time charge</span>
              </div>

              <ul className="mt-6 space-y-3.5">
                {["1x Verified Profile Badge", "Uncapped custom links", "1x Audio Stream Upload", "Lifetime core updates"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-xs text-[#8C8C8C]">
                    <Check className="h-4 w-4 text-green-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Button className="mt-8 w-full h-12 rounded-xl bg-gradient-to-r from-red-600 to-purple-600 text-xs font-bold uppercase tracking-wider text-white shadow-[0_4px_25px_rgba(239,68,68,0.25)] hover:shadow-[0_4px_30px_rgba(239,68,68,0.45)] hover:scale-[1.01] transition-all duration-300">
                Purchase Lifetime Support
              </Button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
