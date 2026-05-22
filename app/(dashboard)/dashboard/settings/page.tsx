"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Disc3,
  Settings,
  Mail,
  User,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserProfile {
  id: number;
  username: string;
  email: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  // Status states
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setEmail(data.user.email);
          setUsername(data.user.username);
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

  const handleSubmitSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(null);
    setError(null);

    // Mock API delay & response
    setTimeout(() => {
      setSubmitting(false);
      setSuccess("Account settings saved successfully! Your public profile is updated.");
    }, 1000);
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
            Accessing root registry...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0A0A0A] px-4 md:px-10 pb-20 pt-8 md:pt-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-red-600/5 blur-[150px]" />
      </div>

      <div className="mx-auto max-w-3xl relative z-10">
        
        {/* Header */}
        <div className="border-b border-white/5 pb-8 mb-10">
          <div className="flex items-center gap-2 text-red-400 text-xs font-semibold uppercase tracking-[0.2em]">
            <Settings className="h-4 w-4" /> Identity control
          </div>
          <h1 className="mt-2 text-4xl font-medium tracking-tight text-white">
            System Settings
          </h1>
          <p className="mt-2 text-sm text-[#8C8C8C]">
            Update your registered account data, credentials, and visibility toggles.
          </p>
        </div>

        {/* Notifications */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-start gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-green-400"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <p className="text-xs font-medium">{success}</p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-400"
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-xs font-medium">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmitSettings} className="space-y-8">
          {/* PROFILE DATA PANEL */}
          <div className="rounded-[24px] border border-white/5 bg-[#0A0A0A]/80 p-6 backdrop-blur-3xl">
            <h3 className="text-base font-semibold text-white mb-6">Profile Settings</h3>

            <div className="space-y-5">
              {/* Username input */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#666] font-semibold mb-2">Username</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#444]">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="h-12 w-full rounded-xl border border-white/5 bg-[#0D0D0D] pl-11 pr-4 text-sm text-white placeholder-[#444] transition-all duration-300 focus:border-red-500/30 focus:bg-[#110505] focus:outline-none focus:ring-1 focus:ring-red-500/20"
                  />
                </div>
              </div>

              {/* Email input */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#666] font-semibold mb-2">Email Address</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#444]">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 w-full rounded-xl border border-white/5 bg-[#0D0D0D] pl-11 pr-4 text-sm text-white placeholder-[#444] transition-all duration-300 focus:border-red-500/30 focus:bg-[#110505] focus:outline-none focus:ring-1 focus:ring-red-500/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CREDENTIALS/PASSWORD RESET PANEL */}
          <div className="rounded-[24px] border border-white/5 bg-[#0A0A0A]/80 p-6 backdrop-blur-3xl">
            <h3 className="text-base font-semibold text-white mb-6">Security & Password</h3>

            <div className="space-y-5">
              {/* Current Password input */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#666] font-semibold mb-2">Current Password</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#444]">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="h-12 w-full rounded-xl border border-white/5 bg-[#0D0D0D] pl-11 pr-4 text-sm text-white placeholder-[#444] transition-all duration-300 focus:border-red-500/30 focus:bg-[#110505] focus:outline-none focus:ring-1 focus:ring-red-500/20"
                  />
                </div>
              </div>

              {/* New Password input */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#666] font-semibold mb-2">New Password</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#444]">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    placeholder="Min. 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-12 w-full rounded-xl border border-white/5 bg-[#0D0D0D] pl-11 pr-4 text-sm text-white placeholder-[#444] transition-all duration-300 focus:border-red-500/30 focus:bg-[#110505] focus:outline-none focus:ring-1 focus:ring-red-500/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={submitting}
              className="h-12 px-8 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold uppercase tracking-wider text-white shadow-[0_4px_20px_rgba(239,68,68,0.2)] transition-all duration-300 flex items-center gap-2"
            >
              {submitting ? (
                <Disc3 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>

        </form>

      </div>
    </section>
  );
}
