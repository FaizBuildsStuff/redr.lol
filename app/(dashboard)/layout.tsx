"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Disc3 } from "lucide-react";
import Sidebar from "@/components/Sidebar";

interface UserProfile {
  id: number;
  username: string;
  email: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fetch auth status and user details
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        } else {
          localStorage.removeItem("is_logged_in");
          router.push("/signin");
        }
      } catch (err) {
        console.error("Layout auth check error:", err);
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
            Syncing identity core...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="relative flex min-h-screen bg-[#0A0A0A] text-[#F5F1E8] font-['Satoshi'] antialiased">
      
      {/* BACKGROUND MESH */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[300px] top-0 h-[600px] w-[600px] rounded-full bg-red-600/[0.02] blur-[160px]" />
      </div>

      {/* MOBILE HEADER BAR */}
      <div className="flex w-full items-center justify-between border-b border-white/5 bg-[#090909]/90 px-4 py-3 md:hidden absolute top-0 left-0 right-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20">
            <span className="text-sm font-black text-red-500 font-serif">R</span>
          </div>
          <span className="text-base font-semibold tracking-tight text-white">redr.lol</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] text-[#8C8C8C] hover:text-white transition-all"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* DESKTOP FIXED SIDEBAR */}
      <aside className="fixed bottom-0 top-0 left-0 z-30 hidden w-[260px] border-r border-white/5 bg-[#090909]/80 p-6 md:flex md:flex-col backdrop-blur-xl shadow-[5px_0_30px_rgba(0,0,0,0.5)]">
        <Sidebar user={user} />
      </aside>

      {/* MOBILE NAVIGATION DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />
            {/* Menu container */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 top-0 left-0 z-50 w-[280px] bg-[#090909] p-6 shadow-2xl md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20">
                    <span className="text-sm font-black text-red-500 font-serif">R</span>
                  </div>
                  <span className="text-base font-semibold text-white">redr.lol</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] text-[#8C8C8C] hover:text-white"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto pr-1">
                <Sidebar user={user} setMobileOpen={setMobileOpen} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTAINER PANEL */}
      <main className="flex-1 md:pl-[260px] pt-[60px] md:pt-0 min-h-screen flex flex-col">
        <div className="flex-1">
          {children}
        </div>
      </main>

    </div>
  );
}
