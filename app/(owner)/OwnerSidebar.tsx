"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  Users,
  TerminalSquare,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Database
} from "lucide-react";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  role?: string;
}

export default function OwnerSidebar({ user }: { user: UserProfile }) {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      localStorage.removeItem("is_logged_in");
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navLinks = [
    { name: "Overview", href: "/owner", icon: LayoutDashboard },
    { name: "User Management", href: "/owner/users", icon: Users },
    { name: "System Logs", href: "/owner/logs", icon: TerminalSquare },
  ];

  return (
    <div className="relative flex h-full flex-col justify-between">
      {/* Background visual layers for owner */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-[-20px] top-[-20px] h-[200px] w-[200px] rounded-full bg-red-600/30 blur-[90px]" />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between flex-1">
        <div>
          {/* LOGO AREA */}
          <div className="relative flex items-center gap-4 rounded-[20px] border border-red-500/20 bg-red-500/[0.03] px-4 py-4 backdrop-blur-3xl shadow-[0_0_30px_rgba(239,68,68,0.05)]">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-red-500/30 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              <ShieldAlert className="h-5 w-5 text-red-500" />
            </div>
            <div className="relative">
              <span className="text-lg font-bold tracking-tight text-white">
                redr
                <span className="text-red-500">.owner</span>
              </span>
              <div className="absolute -right-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)] animate-pulse" />
            </div>
          </div>

          <div className="mt-8 space-y-2">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-red-500/70">
              Control Panel
            </div>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                      : "text-[#8C8C8C] hover:text-white hover:bg-white/[0.03]"
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${isActive ? "text-red-500" : ""}`} />
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* FOOTER WIDGET SECTION */}
        <div className="space-y-4 pt-6 border-t border-white/5 relative z-10" ref={dropdownRef}>
          <div className="flex items-center justify-between relative overflow-hidden rounded-[20px] border border-red-500/10 bg-black/40 p-3 backdrop-blur-2xl">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-red-500/30 bg-gradient-to-br from-red-600 to-[#100303] flex items-center justify-center">
                <span className="text-sm font-black text-white tracking-widest uppercase">
                  {user.username.slice(0, 2)}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white truncate max-w-[100px]">
                  {user.username}
                </h4>
                <p className="text-[10px] text-red-400 font-mono leading-none mt-1 uppercase tracking-wider">
                  {user.role || "OWNER"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/[0.05] text-[#8C8C8C] hover:text-white transition-all duration-200 cursor-pointer"
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>
          </div>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-[calc(100%+12px)] left-0 right-0 z-50 rounded-2xl border border-white/10 bg-[#0D0D0D] p-2 shadow-2xl backdrop-blur-xl"
              >
                <Link
                  href="/dashboard"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#8C8C8C] hover:text-white hover:bg-white/[0.03] transition-all duration-200"
                >
                  <Database className="h-4 w-4 text-white/50" />
                  Exit to Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                >
                  <LogOut className="h-4 w-4 text-red-500" />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
