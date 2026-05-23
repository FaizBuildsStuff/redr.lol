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
  <section className="relative min-h-screen overflow-hidden bg-black px-3 pb-20 pt-6 sm:px-6 lg:px-10">

    {/* BACKGROUND */}
    <div className="pointer-events-none absolute inset-0 overflow-hidden">

      {/* Main Red Glow */}
      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-red-500/10 blur-[140px]"
      />

      {/* Purple Orb */}
      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-10%] right-[-10%] h-[550px] w-[550px] rounded-full bg-purple-500/10 blur-[160px]"
      />

      {/* White Glow */}
      <div className="absolute left-1/2 top-1/3 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-white/[0.03] blur-[120px]" />

      {/* GRID */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
    </div>

    <div className="relative z-10 mx-auto max-w-7xl">

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative mb-10 overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-3xl sm:p-8 lg:p-10"
      >

        {/* Glow */}
        <div className="absolute left-0 top-0 h-[250px] w-[250px] rounded-full bg-red-500/10 blur-[120px]" />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          {/* LEFT */}
          <div className="max-w-2xl">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-400 backdrop-blur-xl">
              <Gem className="h-3.5 w-3.5" />
              Premium Access
            </div>

            <h1 className="text-4xl font-semibold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
              redr
              <span className="bg-gradient-to-r from-red-400 via-red-500 to-purple-500 bg-clip-text text-transparent">
                .lol
              </span>
              <br />
              Premium
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/45 sm:text-base">
              Unlock animated themes, audio streaming, custom domains,
              verified badges and elite creator customization tools.
            </p>

          </div>

          {/* RIGHT CARD */}
          <motion.div
            whileHover={{
              y: -5,
              scale: 1.01,
            }}
            className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-black/40 p-7 backdrop-blur-3xl"
          >

            {/* Card Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-purple-500/10" />

            <div className="relative z-10">

              {/* Badge */}
              <div className="flex items-center justify-between">

                <div className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">
                  Lifetime Access
                </div>

                <Star className="h-5 w-5 fill-red-400/20 text-red-400" />
              </div>

              {/* Pricing */}
              <div className="mt-8">

                <div className="flex items-end gap-2">

                  <h2 className="text-5xl font-bold tracking-tight text-white">
                    $4.99
                  </h2>

                  <span className="pb-1 text-xs font-semibold uppercase tracking-wider text-white/30">
                    one-time
                  </span>

                </div>

                <p className="mt-3 text-sm leading-relaxed text-white/45">
                  One payment. Unlimited updates. No recurring subscriptions.
                </p>

              </div>

              {/* Features */}
              <div className="mt-8 space-y-4">

                {[
                  "Verified premium badge",
                  "Animated premium themes",
                  "Custom domain support",
                  "HD audio uploads",
                  "Unlimited custom links",
                  "Lifetime future updates",
                ].map((item) => (
                  <motion.div
                    key={item}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3"
                  >

                    <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-green-500/20 bg-green-500/10">
                      <Check className="h-4 w-4 text-green-400" />
                    </div>

                    <span className="text-sm text-white/70">
                      {item}
                    </span>

                  </motion.div>
                ))}

              </div>

              {/* CTA */}
              <Button
                className="
                group
                relative
                mt-8
                h-14
                w-full
                overflow-hidden
                rounded-2xl
                bg-gradient-to-r
                from-red-500
                via-red-600
                to-purple-600
                text-sm
                font-semibold
                uppercase
                tracking-[0.15em]
                text-white
                transition-all
                duration-500
                hover:scale-[1.02]
                hover:shadow-[0_0_60px_rgba(239,68,68,0.45)]
              "
              >

                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <span className="relative z-10">
                  Purchase Premium
                </span>

              </Button>

            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* FEATURES */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {premiumPerks.map((perk, i) => {
          const Icon = perk.icon;

          return (
            <motion.div
              key={perk.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.08,
                duration: 0.5,
              }}
              whileHover={{
                y: -6,
                scale: 1.02,
              }}
              className="
              group
              relative
              overflow-hidden
              rounded-[30px]
              border
              border-white/10
              bg-white/[0.03]
              p-6
              backdrop-blur-3xl
            "
            >

              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative z-10">

                {/* Icon */}
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 transition-all duration-500 group-hover:scale-110 group-hover:bg-red-500/20">

                  <Icon className="h-6 w-6 text-red-400" />

                </div>

                {/* Text */}
                <h3 className="text-lg font-semibold text-white">
                  {perk.name}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-white/45">
                  {perk.desc}
                </p>

              </div>

            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);
}
