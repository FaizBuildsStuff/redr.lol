"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { DashboardLoading } from "@/components/DashboardUI";
import OwnerSidebar from "./OwnerSidebar";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  role?: string;
}

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fetch auth status and check if user is owner
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        
        if (data.user && data.user.role === "owner") {
          setUser(data.user);
        } else {
          // If not an owner, kick them back to dashboard
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Owner layout auth check error:", err);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  if (loading) {
    return <DashboardLoading label="Securing owner portal..." />;
  }

  if (!user) return null;

  return (
    <div className="relative flex min-h-screen bg-[#050505] text-[#F5F1E8] font-['Satoshi'] antialiased">
      {/* BACKGROUND MESH */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[300px] top-0 h-[600px] w-[600px] rounded-full bg-red-600/[0.03] blur-[160px]" />
      </div>

      {/* MOBILE HEADER BAR */}
      <div className="flex w-full items-center justify-between border-b border-red-500/10 bg-[#0A0A0A]/95 px-4 py-3 md:hidden absolute top-0 left-0 right-0 z-40 backdrop-blur-xl shadow-[0_4px_30px_rgba(239,68,68,0.05)]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.15)]">
            <img src="/Logo.png" alt="redr logo" className="h-5 w-5 object-contain" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white">redr<span className="text-red-500 font-bold">.owner</span></span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/10 bg-red-500/5 text-red-400 hover:text-white hover:bg-red-500/20 transition-all duration-200"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      {/* DESKTOP FIXED SIDEBAR */}
      <aside className="fixed bottom-0 top-0 left-0 z-30 hidden w-[260px] border-r border-red-500/10 bg-[#0D0D0D]/90 p-6 md:flex md:flex-col backdrop-blur-2xl shadow-[5px_0_40px_rgba(239,68,68,0.05)]">
        <OwnerSidebar user={user} setMobileOpen={setMobileOpen} />
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
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="fixed bottom-0 top-0 left-0 z-50 w-[280px] md:hidden flex flex-col border-r border-red-500/20 shadow-[8px_0_40px_rgba(239,68,68,0.15)] bg-[#050505]"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-red-600/5 to-transparent" />
              
              {/* Drawer Header */}
              <div className="relative z-10 flex items-center justify-between border-b border-red-500/10 px-5 py-4 bg-black/20">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.15)]">
                    <img src="/Logo.png" alt="redr logo" className="h-5 w-5 object-contain" />
                  </div>
                  <span className="text-sm font-semibold tracking-tight text-white">redr<span className="text-red-500 font-bold">.owner</span></span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-500/10 bg-red-500/5 text-red-400 hover:text-white hover:bg-red-500/20 transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Sidebar content */}
              <div className="relative z-10 flex-1 overflow-y-auto px-4 py-4">
                <OwnerSidebar user={user} setMobileOpen={setMobileOpen} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTAINER PANEL */}
      <main className="flex-1 md:pl-[260px] pt-[60px] md:pt-0 min-h-screen flex flex-col relative z-10">
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
