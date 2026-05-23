"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Disc3,
  User,
  Mail,
  Calendar,
  ExternalLink,
  Copy,
  Check,
  LogOut,
  Sparkles,
  Layers,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserProfile {
  id: number;
  username: string;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        
        if (data.user) {
          setUser(data.user);
        } else {
          // If no active session cookie, try local storage fallback or redirect
          const localLoggedIn = localStorage.getItem("is_logged_in");
          if (!localLoggedIn) {
            router.push("/signin");
          } else {
            // Local storage says logged in, but cookie is missing/expired. Redirect to signin to refresh
            localStorage.removeItem("is_logged_in");
            router.push("/signin");
          }
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

  const handleCopyLink = () => {
    if (!user) return;
    navigator.clipboard.writeText(`redr.lol/${user.username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      localStorage.removeItem("is_logged_in");
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-[#0A0A0A] text-[#F5F1E8]">
        {/* Glowing Orbs */}
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
            Loading your quantum chamber...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0A0A0A] px-4 md:px-10 pb-20 pt-8 md:pt-12">
      {/* Background aesthetics */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Glow */}
        <div className="absolute left-1/3 top-0 h-[600px] w-[600px] rounded-full bg-red-600/5 blur-[160px]" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-red-500/5 blur-[140px]" />
        
        {/* Soft Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at top left, rgba(239, 68, 68, 0.1), transparent 30%)`,
          }}
        />
        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-[0.02] mix-blend-soft-light">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')",
            }}
          />
        </div>
      </div>

      <div className="mx-auto max-w-5xl relative z-10">
        
        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-white/5 pb-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 text-red-400 text-xs font-semibold uppercase tracking-[0.2em]"
            >
              <Sparkles className="h-4 w-4" /> Account Space
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-2 text-4xl font-medium tracking-tight text-white sm:text-5xl"
            >
              Hello, <span className="text-red-500 font-semibold">{user.username}</span> dashboard
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-2 text-sm text-[#8C8C8C]"
            >
              Manage your cyber identity, review custom link traffic, and configure layouts.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button
              onClick={handleLogout}
              variant="outline"
              className="h-12 gap-2 rounded-2xl border-white/10 bg-white/[0.03] px-6 text-sm text-white hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all duration-300"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </motion.div>
        </div>

        {/* DASHBOARD */}
<div className="mt-12 space-y-6">

  {/* TOP STATS */}
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

    {[
      {
        title: "Total Views",
        value: "24.8K",
        growth: "+18%",
        color: "from-red-500/20 to-red-500/5",
      },
      {
        title: "Profile Clicks",
        value: "8.2K",
        growth: "+9%",
        color: "from-purple-500/20 to-purple-500/5",
      },
      {
        title: "Link CTR",
        value: "42%",
        growth: "+12%",
        color: "from-indigo-500/20 to-indigo-500/5",
      },
      {
        title: "Active Themes",
        value: "14",
        growth: "+2",
        color: "from-pink-500/20 to-pink-500/5",
      },
    ].map((item, i) => (
      <motion.div
        key={item.title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: i * 0.08,
        }}
        whileHover={{
          y: -4,
          scale: 1.01,
        }}
        className="
        group
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-white/10
        bg-white/[0.03]
        p-6
        backdrop-blur-3xl
      "
      >

        {/* Glow */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
        />

        <div className="relative z-10">

          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
            {item.title}
          </p>

          <div className="mt-4 flex items-end justify-between">

            <h3 className="text-4xl font-bold tracking-tight text-white">
              {item.value}
            </h3>

            <div className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-green-400">
              {item.growth}
            </div>

          </div>

        </div>
      </motion.div>
    ))}
  </div>

  {/* MAIN GRID */}
  <div className="grid gap-6 xl:grid-cols-[1fr_380px]">

    {/* LEFT */}
    <div className="space-y-6">

      {/* USER PROFILE */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="
        relative
        overflow-hidden
        rounded-[34px]
        border
        border-white/10
        bg-white/[0.03]
        p-6
        backdrop-blur-3xl
      "
      >

        {/* Glow */}
        <div className="absolute left-0 top-0 h-[220px] w-[220px] rounded-full bg-red-500/10 blur-[120px]" />

        <div className="relative z-10">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            {/* LEFT */}
            <div className="flex items-center gap-5">

              <div className="relative">

                <div className="absolute inset-0 rounded-3xl bg-red-500/20 blur-xl" />

                <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl">
                  <User className="h-9 w-9 text-red-400" />
                </div>

              </div>

              <div>

                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-green-400">
                  <div className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
                  Online
                </div>

                <h2 className="text-3xl font-semibold tracking-tight text-white">
                  @{user.username}
                </h2>

                <div className="mt-2 flex items-center gap-2 text-sm text-white/40">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </div>

              </div>

            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-3">

              <Button
                onClick={() =>
                  router.push("/dashboard/customize")
                }
                className="
                h-12
                rounded-2xl
                bg-red-500
                px-5
                text-sm
                font-semibold
                text-white
                transition-all
                duration-300
                hover:scale-[1.02]
                hover:bg-red-400
                hover:shadow-[0_0_40px_rgba(239,68,68,0.35)]
              "
              >
                Customize Profile
              </Button>

              <Button
                onClick={() =>
                  router.push("/dashboard/links")
                }
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
                Manage Links
              </Button>

            </div>
          </div>

          {/* LINK */}
          <div className="mt-8 flex flex-col gap-3 rounded-3xl border border-white/10 bg-black/30 p-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/35">
                Public Profile URL
              </p>

              <div className="mt-2 flex items-center gap-2 text-lg font-semibold text-white">
                redr.lol/{user.username}
              </div>

            </div>

            <div className="flex gap-3">

              <button
                onClick={handleCopyLink}
                className="
                flex
                h-12
                items-center
                gap-2
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                px-5
                text-sm
                font-semibold
                text-white
                transition-all
                hover:bg-white/[0.06]
              "
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}

                {copied ? "Copied" : "Copy"}
              </button>

              <a
                href={`/${user.username}`}
                target="_blank"
                rel="noreferrer"
                className="
                flex
                h-12
                items-center
                gap-2
                rounded-2xl
                bg-gradient-to-r
                from-red-500
                to-purple-600
                px-5
                text-sm
                font-semibold
                text-white
                transition-all
                duration-300
                hover:scale-[1.02]
              "
              >
                Visit
                <ExternalLink className="h-4 w-4" />
              </a>

            </div>
          </div>
        </div>
      </motion.div>

      {/* ANALYTICS GRAPH */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="
        relative
        overflow-hidden
        rounded-[34px]
        border
        border-white/10
        bg-white/[0.03]
        p-6
        backdrop-blur-3xl
      "
      >

        {/* Glow */}
        <div className="absolute right-0 top-0 h-[240px] w-[240px] rounded-full bg-purple-500/10 blur-[120px]" />

        <div className="relative z-10">

          <div className="mb-8 flex items-center justify-between">

            <div>
              <h3 className="text-xl font-semibold text-white">
                Engagement Analytics
              </h3>

              <p className="mt-1 text-sm text-white/40">
                Real-time profile interaction overview
              </p>
            </div>

            <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
              Last 30 Days
            </div>

          </div>

          {/* FAKE GRAPH */}
          <div className="flex h-[260px] items-end gap-3">

            {[35, 65, 40, 90, 75, 55, 95, 80, 70, 100, 85, 60].map(
              (height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.05,
                  }}
                  className="
                  relative
                  flex-1
                  rounded-t-[20px]
                  bg-gradient-to-t
                  from-red-500
                  via-red-400
                  to-purple-500
                  opacity-90
                "
                >
                  <div className="absolute inset-0 rounded-t-[20px] bg-white/10" />
                </motion.div>
              )
            )}

          </div>

        </div>
      </motion.div>
    </div>

    {/* RIGHT SIDEBAR */}
    <div className="space-y-6">

      {/* QUICK ACTIONS */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="
        relative
        overflow-hidden
        rounded-[34px]
        border
        border-white/10
        bg-white/[0.03]
        p-6
        backdrop-blur-3xl
      "
      >

        <div className="absolute bottom-0 right-0 h-[180px] w-[180px] rounded-full bg-red-500/10 blur-[100px]" />

        <div className="relative z-10">

          <h3 className="text-lg font-semibold text-white">
            Quick Actions
          </h3>

          <div className="mt-5 space-y-3">

            {[
              "Customize Profile",
              "Manage Social Links",
              "Upgrade Premium",
              "Analytics Center",
            ].map((item, i) => (
              <button
                key={i}
                className="
                flex
                h-14
                w-full
                items-center
                justify-between
                rounded-2xl
                border
                border-white/10
                bg-black/30
                px-5
                text-sm
                font-semibold
                text-white
                transition-all
                duration-300
                hover:border-red-500/20
                hover:bg-red-500/10
              "
              >
                {item}

                <ExternalLink className="h-4 w-4 text-white/30" />
              </button>
            ))}

          </div>
        </div>
      </motion.div>

      {/* ACTIVITY */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="
        relative
        overflow-hidden
        rounded-[34px]
        border
        border-white/10
        bg-white/[0.03]
        p-6
        backdrop-blur-3xl
      "
      >

        <div className="relative z-10">

          <h3 className="text-lg font-semibold text-white">
            Recent Activity
          </h3>

          <div className="mt-5 space-y-4">

            {[
              "Profile theme updated",
              "New social link added",
              "Analytics synced",
              "Discord connected",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3"
              >

                <div className="h-3 w-3 rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.8)]" />

                <div>
                  <p className="text-sm text-white">
                    {item}
                  </p>

                  <p className="text-xs text-white/35">
                    Just now
                  </p>
                </div>

              </div>
            ))}

          </div>
        </div>
      </motion.div>
    </div>
  </div>
</div>

      </div>
    </section>
  );
}
