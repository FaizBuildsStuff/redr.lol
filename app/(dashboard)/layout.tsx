"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { DashboardLoading } from "@/components/DashboardUI";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  onboarding_completed?: boolean;
  role?: string;
  discord_id?: string | null;
  discord_avatar?: string | null;
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
          if (data.user.onboarding_completed === false) {
            router.push("/onboarding");
            return;
          }
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

    // Poll every 10 seconds to enforce real-time kicks/bans
    const interval = setInterval(checkAuth, 10000);
    return () => clearInterval(interval);
  }, [router]);

  if (loading) {
    return <DashboardLoading label="Syncing identity core" />;
  }

  if (!user) return null;

  return (
    <div className="relative flex min-h-screen bg-[#0A0A0A] text-[#F5F1E8] font-['Satoshi'] antialiased">
      
      {/* BACKGROUND MESH */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[300px] top-0 h-[600px] w-[600px] rounded-full bg-red-600/[0.02] blur-[160px]" />
      </div>

      {/* MOBILE HEADER BAR */}
      <div className="flex w-full items-center justify-between border-b border-white/[0.06] bg-[#0A0A0A]/95 px-4 py-3 md:hidden absolute top-0 left-0 right-0 z-40 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.15)]">
            <img src="/Logo.png" alt="redr logo" className="h-5 w-5 object-contain" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white">redr<span className="text-red-500 font-bold">.lol</span></span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-[#8C8C8C] hover:text-white hover:border-white/10 hover:bg-white/[0.06] transition-all duration-200"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      {/* DESKTOP FIXED SIDEBAR */}
      <aside className="fixed bottom-0 top-0 left-0 z-30 hidden w-[260px] border-r border-white/5 bg-[#0D0D0D]/80 p-6 md:flex md:flex-col backdrop-blur-xl shadow-[5px_0_30px_rgba(0,0,0,0.5)]">
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
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="fixed bottom-0 top-0 left-0 z-50 w-[280px] md:hidden flex flex-col border-r border-white/[0.06] shadow-[8px_0_40px_rgba(0,0,0,0.6)]"
              style={{ background: "linear-gradient(160deg, #111111 0%, #0A0A0A 60%, #0D0808 100%)" }}
            >
              {/* Glow inside drawer */}
              <div className="pointer-events-none absolute left-0 top-0 h-[300px] w-[300px] rounded-full bg-red-500/10 blur-[120px]" />
              <div className="pointer-events-none absolute bottom-0 right-0 h-[200px] w-[200px] rounded-full bg-red-600/10 blur-[100px]" />

              {/* Drawer Header */}
              <div className="relative z-10 flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.15)]">
                    <img src="/Logo.png" alt="redr logo" className="h-5 w-5 object-contain" />
                  </div>
                  <span className="text-sm font-semibold text-white tracking-tight">redr<span className="text-red-500 font-bold">.lol</span></span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-[#8C8C8C] hover:text-white hover:bg-white/[0.07] transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Sidebar content */}
              <div className="relative z-10 flex-1 overflow-y-auto px-4 py-4">
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