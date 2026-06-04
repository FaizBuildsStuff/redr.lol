"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

      {/* DESKTOP FIXED SIDEBAR */}
      <aside className="fixed bottom-0 top-0 left-0 z-30 hidden w-[260px] border-r border-red-500/10 bg-[#0D0D0D]/90 p-6 md:flex md:flex-col backdrop-blur-2xl shadow-[5px_0_40px_rgba(239,68,68,0.05)]">
        <OwnerSidebar user={user} />
      </aside>

      {/* MAIN CONTAINER PANEL */}
      <main className="flex-1 md:pl-[260px] min-h-screen flex flex-col relative z-10">
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
