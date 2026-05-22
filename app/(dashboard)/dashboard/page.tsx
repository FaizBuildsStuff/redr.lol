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

        {/* Dashboard Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* USER CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="md:col-span-2 group relative overflow-hidden rounded-[26px] border border-white/5 bg-[#0A0A0A]/80 p-8 backdrop-blur-3xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.04] via-transparent to-transparent" />
            
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/5 bg-[#101010] text-red-500 shadow-inner">
                  <User className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white tracking-tight">@{user.username}</h3>
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-[#7A7A7A]">
                    <Mail className="h-3.5 w-3.5" />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/10 px-4 py-2">
                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.16em] font-medium text-green-300">Live Profile</span>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/[0.02] bg-white/[0.01] p-4 text-center">
                <p className="text-[10px] uppercase tracking-wider text-[#666]">Identity Server</p>
                <p className="mt-1.5 text-sm font-semibold text-white tracking-wide">NeonDB (AWS US-East-1)</p>
              </div>
              <div className="rounded-2xl border border-white/[0.02] bg-white/[0.01] p-4 text-center">
                <p className="text-[10px] uppercase tracking-wider text-[#666]">Member Since</p>
                <p className="mt-1.5 text-sm font-semibold text-white tracking-wide">May 2026</p>
              </div>
            </div>
          </motion.div>

          {/* PROFILE LINK CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="group relative overflow-hidden rounded-[26px] border border-white/5 bg-[#0A0A0A]/80 p-8 backdrop-blur-3xl flex flex-col justify-between"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.03] via-transparent to-transparent" />
            
            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/10 bg-red-500/5 text-red-400">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-medium text-white tracking-tight">Your Digital Link</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#888]">
                Share this link with your audience across socials to show off your style.
              </p>
            </div>

            <div className="relative mt-8 space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3 text-xs text-[#CCCCCC] font-mono">
                <span>redr.lol/{user.username}</span>
                <button
                  onClick={handleCopyLink}
                  className="text-[#999] hover:text-white transition-colors duration-200"
                >
                  {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              <a
                href={`/${user.username}`}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-500 py-3 text-xs font-semibold text-white transition-all duration-300"
              >
                <span>View My Profile</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </motion.div>

          {/* ANALYTICS PREVIEW */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="md:col-span-3 group relative overflow-hidden rounded-[26px] border border-white/5 bg-[#0A0A0A]/80 p-8 backdrop-blur-3xl"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-red-500/[0.02] via-transparent to-transparent" />
            
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-[#121212] text-red-400">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-base font-medium text-white tracking-tight">Quantum Analytics Preview</h4>
                  <p className="text-xs text-[#7A7A7A]">Profile performance updates in real-time.</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#8C8C8C] bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-xl">
                <span>Update:</span>
                <span className="text-white font-medium">Just now</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/[0.03] bg-white/[0.01] p-5">
                <p className="text-[10px] uppercase tracking-wider text-[#666]">Unique Views</p>
                <p className="mt-2 text-3xl font-semibold text-white tracking-tight">1,248</p>
                <span className="mt-1 block text-[10px] text-green-400 font-medium">+12% this week</span>
              </div>
              <div className="rounded-2xl border border-white/[0.03] bg-white/[0.01] p-5">
                <p className="text-[10px] uppercase tracking-wider text-[#666]">Clickthrough Rate</p>
                <p className="mt-2 text-3xl font-semibold text-white tracking-tight">42.6%</p>
                <span className="mt-1 block text-[10px] text-green-400 font-medium">+4.8% this week</span>
              </div>
              <div className="rounded-2xl border border-white/[0.03] bg-white/[0.01] p-5">
                <p className="text-[10px] uppercase tracking-wider text-[#666]">Design Customizations</p>
                <p className="mt-2 text-3xl font-semibold text-white tracking-tight">14</p>
                <span className="mt-1 block text-[10px] text-[#888] font-medium">Saved themes active</span>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
