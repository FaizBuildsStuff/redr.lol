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
  MoreHorizontal,
  LayoutDashboard,
  Database,
  LockKeyhole,
  Search,
} from "lucide-react";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  role?: string;
}

interface OwnerSidebarProps {
  user: UserProfile;
  setMobileOpen?: (open: boolean) => void;
}

export default function OwnerSidebar({ user, setMobileOpen }: OwnerSidebarProps) {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    { name: "Owner Vault", href: "/owner/vault", icon: LockKeyhole },
  ];

  const filtered = searchQuery.trim()
    ? navLinks.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : navLinks;

  const userId = user?.id;
  const formattedUid = userId != null ? `UID ${String(userId).padStart(7, "0")}` : "UID unknown";

  return (
    <div className="relative flex h-full flex-col select-none">

      {/* ── LOGO ── */}
      <div className="flex items-center gap-3 px-2 py-1 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 shadow-[0_0_18px_rgba(239,68,68,0.2)]">
          <ShieldAlert className="h-5 w-5 text-red-500" />
        </div>
        <div>
          <span className="text-[17px] font-bold tracking-tight text-white">
            redr<span className="text-red-500">.owner</span>
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_rgba(239,68,68,1)]" />
            <span className="text-[10px] text-red-400/60 font-mono uppercase tracking-widest">secure</span>
          </div>
        </div>
      </div>

      {/* ── SEARCH ── */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#555]" />
        <input
          type="text"
          placeholder="Search panel..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full rounded-xl bg-white/[0.04] border border-white/[0.06] py-2.5 pl-9 pr-4 text-[13px] text-white placeholder:text-[#555] focus:outline-none focus:border-red-500/30 focus:bg-white/[0.06] transition-all"
        />
      </div>

      {/* ── NAV ── */}
      <div className="flex-1 overflow-y-auto space-y-0.5 pr-1 scrollbar-none">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#444]">Control Panel</p>
        {filtered.length > 0 ? filtered.map(link => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => { setSearchQuery(""); setMobileOpen && setMobileOpen(false); }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${isActive
                ? "bg-red-500/10 text-white border border-red-500/10"
                : "text-[#777] hover:text-white hover:bg-white/[0.04]"}`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-red-400" : "text-[#555]"}`} />
              {link.name}
            </Link>
          );
        }) : (
          <p className="px-3 py-4 text-xs text-[#555]">No results for "{searchQuery}"</p>
        )}
      </div>

      {/* ── FOOTER ── */}
      <div className="mt-4 space-y-3 border-t border-white/[0.05] pt-4">

        {/* Quick links */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.05] p-3.5 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center justify-between rounded-xl bg-red-500/8 hover:bg-red-500/15 border border-red-500/10 px-3.5 py-2.5 text-[12px] font-semibold text-red-300 transition-all duration-200"
          >
            <span className="flex items-center gap-2">
              <Database className="h-3.5 w-3.5" />
              Exit to Dashboard
            </span>
          </Link>
        </div>

        {/* User card */}
        <div className="relative" ref={dropdownRef}>
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-[calc(100%+8px)] left-0 right-0 z-50 rounded-2xl border border-white/[0.06] bg-[#0A0A0A] p-1.5 shadow-2xl"
              >
                <button
                  onClick={() => { setDropdownOpen(false); handleLogout(); }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[12px] font-medium text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                    <LogOut className="h-3.5 w-3.5" />
                  </div>
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] border border-white/[0.05] px-3 py-2.5">
            <div className="flex items-center gap-2.5">
              <div className="h-[34px] w-[34px] rounded-xl border border-red-500/30 bg-gradient-to-br from-red-600 to-[#100303] flex items-center justify-center shrink-0">
                <span className="text-xs font-black text-white uppercase">{user.username.slice(0, 2)}</span>
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-white truncate max-w-[100px]">{user.username}</h4>
                <p className="text-[10px] text-[#555] font-mono leading-none mt-0.5">{formattedUid}</p>
              </div>
            </div>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/[0.05] text-[#555] hover:text-white transition-all cursor-pointer"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
