"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Disc3,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Globe,
  Smartphone,
  Laptop,
  Tablet,
  MousePointerClick,
  Sparkles
} from "lucide-react";

interface UserProfile {
  id: number;
  username: string;
  email: string;
}

export default function AnalyticsPage() {
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
            Retrieving data cores...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0A0A0A] px-4 md:px-10 pb-20 pt-8 md:pt-12">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-red-600/5 blur-[150px]" />
      </div>

      <div className="mx-auto max-w-5xl relative z-10">
        
        {/* Header */}
        <div className="border-b border-white/5 pb-8 mb-10">
          <div className="flex items-center gap-2 text-red-400 text-xs font-semibold uppercase tracking-[0.2em]">
            <Sparkles className="h-4 w-4" /> Real-time telemetry
          </div>
          <h1 className="mt-2 text-4xl font-medium tracking-tight text-white">
            Analytics Overview
          </h1>
          <p className="mt-2 text-sm text-[#8C8C8C]">
            Monitor traffic peaks, geographic reach, and click metrics for your profile.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="rounded-2xl border border-white/5 bg-[#0A0A0A] p-6 backdrop-blur-3xl">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#666]">Total Views</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-semibold text-white tracking-tight">4,892</p>
            <span className="mt-1 block text-xs text-green-400 font-medium">+15.4% from last week</span>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#0A0A0A] p-6 backdrop-blur-3xl">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#666]">Unique Clicks</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                <MousePointerClick className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-semibold text-white tracking-tight">2,084</p>
            <span className="mt-1 block text-xs text-red-400 font-medium">+8.2% from last week</span>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#0A0A0A] p-6 backdrop-blur-3xl">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#666]">Bounce Rate</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-500/10 text-[#8C8C8C]">
                <Activity className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-semibold text-white tracking-tight">31.4%</p>
            <span className="mt-1 block text-xs text-green-400 font-medium">-2.1% lower than average</span>
          </div>
        </div>

        {/* Custom SVG Sparkline Graph */}
        <div className="rounded-2xl border border-white/5 bg-[#0A0A0A] p-6 mb-10 backdrop-blur-3xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-medium text-white">Traffic Fluctuations</h3>
              <p className="text-xs text-[#7A7A7A]">Views measured in 4-hour quantum increments</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-red-400 bg-red-500/5 border border-red-500/10 px-2.5 py-1 rounded-lg">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Trending High</span>
            </div>
          </div>

          {/* SVG Graph */}
          <div className="h-64 w-full relative">
            <svg viewBox="0 0 1000 300" className="h-full w-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="glowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(239, 68, 68, 0.2)" />
                  <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="1000" y2="50" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
              <line x1="0" y1="150" x2="1000" y2="150" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
              <line x1="0" y1="250" x2="1000" y2="250" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />

              {/* Gradient Fill */}
              <path
                d="M0,300 L0,230 Q150,120 300,180 T600,80 T900,120 L1000,100 L1000,300 Z"
                fill="url(#glowGrad)"
              />

              {/* Glowing Line */}
              <path
                d="M0,230 Q150,120 300,180 T600,80 T900,120 L1000,100"
                fill="none"
                stroke="rgba(239, 68, 68, 0.8)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              <circle cx="300" cy="180" r="5" fill="#EF4444" stroke="#0A0A0A" strokeWidth="2" />
              <circle cx="600" cy="80" r="5" fill="#EF4444" stroke="#0A0A0A" strokeWidth="2" />
              <circle cx="900" cy="120" r="5" fill="#EF4444" stroke="#0A0A0A" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Device & Referrals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Device Type */}
          <div className="rounded-2xl border border-white/5 bg-[#0A0A0A] p-6 backdrop-blur-3xl">
            <h4 className="text-sm font-medium text-white mb-6">Device Share</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5 text-[#8C8C8C]">
                  <span className="flex items-center gap-2 text-white">
                    <Laptop className="h-4 w-4 text-red-500" /> Desktop
                  </span>
                  <span>62.4%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 rounded-full" style={{ width: "62.4%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5 text-[#8C8C8C]">
                  <span className="flex items-center gap-2 text-white">
                    <Smartphone className="h-4 w-4 text-red-500" /> Mobile
                  </span>
                  <span>31.8%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 rounded-full" style={{ width: "31.8%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5 text-[#8C8C8C]">
                  <span className="flex items-center gap-2 text-white">
                    <Tablet className="h-4 w-4 text-red-500" /> Tablet
                  </span>
                  <span>5.8%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 rounded-full" style={{ width: "5.8%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Referrals */}
          <div className="rounded-2xl border border-white/5 bg-[#0A0A0A] p-6 backdrop-blur-3xl">
            <h4 className="text-sm font-medium text-white mb-6">Top Referral Channels</h4>
            <div className="divide-y divide-white/5">
              <div className="flex items-center justify-between py-3">
                <span className="text-xs text-[#8C8C8C] flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-red-500/80" /> twitter.com
                </span>
                <span className="text-xs font-semibold text-white">1,489 views</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-xs text-[#8C8C8C] flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-red-500/80" /> discord.gg
                </span>
                <span className="text-xs font-semibold text-white">842 views</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-xs text-[#8C8C8C] flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-red-500/80" /> youtube.com
                </span>
                <span className="text-xs font-semibold text-white">611 views</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-xs text-[#8C8C8C] flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-red-500/80" /> Direct / Search
                </span>
                <span className="text-xs font-semibold text-white">439 views</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
