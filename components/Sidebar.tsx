"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Activity,
  Award,
  Settings,
  Palette,
  Link2,
  Gem,
  Image as ImageIcon,
  LayoutTemplate,
  ChevronUp,
  HelpCircle,
  ExternalLink,
  Share2,
  MoreHorizontal,
  LogOut,
  User,
  Check,
  Search,
} from "lucide-react";
import UserAvatar from "@/components/UserAvatar";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  role?: string;
  discord_id?: string | null;
  discord_avatar?: string | null;
}

interface SidebarProps {
  user: UserProfile;
  setMobileOpen?: (open: boolean) => void;
  openCmd?: () => void;
}

export default function Sidebar({ user, setMobileOpen, openCmd }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [accountOpen, setAccountOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [shared, setShared] = useState(false);

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

  const handleShare = () => {
    navigator.clipboard.writeText(`https://redr.lol/${user.username}`);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const handleLogoClick = () => {
    if (user.role === "owner") router.push("/owner");
  };

  const userId = user?.id ?? (user as any)?.userId ?? (user as any)?.user_id;
  const formattedUid = userId != null ? `UID ${String(userId).padStart(7, "0")}` : "UID unknown";

  const accountSublinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Analytics", href: "/dashboard/analytics", icon: Activity },
    { name: "Badges", href: "/dashboard/badges", icon: Award },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const navLinks = [
    { name: "Customize", href: "/dashboard/customize", icon: Palette },
    { name: "Links", href: "/dashboard/links", icon: Link2 },
    { name: "Premium", href: "/dashboard/premium", icon: Gem },
    { name: "Image Host", href: "/dashboard/image-host", icon: ImageIcon },
    { name: "Templates", href: "/dashboard/templates", icon: LayoutTemplate },
  ];

  return (
    <div className="relative flex h-full flex-col select-none">

      {/* ── LOGO ── */}
      <div
        className="flex items-center gap-3 px-2 py-1 mb-5 cursor-pointer group"
        onClick={handleLogoClick}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/8 shadow-[0_0_18px_rgba(239,68,68,0.15)] group-hover:shadow-[0_0_24px_rgba(239,68,68,0.25)] transition-all">
          <img src="/Logo.png" alt="redr logo" className="h-6 w-6 object-contain drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
        </div>
        <span className="text-[17px] font-bold tracking-tight text-white">
          redr<span className="text-red-500">.lol</span>
        </span>
      </div>

      {/* ── SEARCH ── */}
      <button
        onClick={openCmd}
        className="relative mb-6 flex w-full items-center rounded-xl bg-white/[0.04] border border-white/[0.06] py-2.5 pl-9 pr-14 text-[13px] text-[#555] hover:text-[#888] hover:bg-white/[0.06] transition-all cursor-pointer text-left focus:outline-none focus:border-red-500/30"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#555]" />
        Search features...
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-[#444] border border-[#333] rounded px-1.5 py-0.5">
          Ctrl K
        </span>
      </button>

      {/* ── NAV ── */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-none">

        {/* Account Accordion */}
        <div className="mb-2">
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all duration-200 cursor-pointer ${accountOpen ? "bg-red-500/10 text-white" : "text-[#777] hover:text-white hover:bg-white/[0.04]"}`}
              >
                <span className="flex items-center gap-2.5">
                  <User className={`h-4 w-4 shrink-0 ${accountOpen ? "text-red-400" : "text-[#555]"}`} />
                  Account
                </span>
                <motion.div animate={{ rotate: accountOpen ? 0 : 180 }} transition={{ duration: 0.2 }}>
                  <ChevronUp className="h-4 w-4 text-[#555]" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {accountOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="mt-1 ml-4 pl-3 border-l border-white/[0.06] space-y-0.5 py-1">
                      {accountSublinks.map(sub => {
                        const Icon = sub.icon;
                        const isActive = pathname === sub.href;
                        return (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={() => setMobileOpen && setMobileOpen(false)}
                            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-all duration-200 ${isActive
                              ? "text-white font-medium"
                              : "text-[#666] hover:text-[#ccc]"}`}
                          >
                            {isActive && <span className="absolute left-[-17px] top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-red-500" />}
                            {sub.name}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Standard nav links */}
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen && setMobileOpen(false)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${isActive
                    ? "bg-red-500/10 text-white border border-red-500/10"
                    : "text-[#777] hover:text-white hover:bg-white/[0.04]"}`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-red-400" : "text-[#555]"}`} />
                  {link.name}
                </Link>
              );
            })}
      </div>

      {/* ── FOOTER ── */}
      <div className="mt-4 space-y-3 border-t border-white/[0.05] pt-4">

        {/* Support card */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.05] p-3.5 space-y-3">
          <div>
            <p className="text-[11px] text-[#666] leading-snug">Have a question or need support?</p>
            <a
              href="https://discord.gg/redrose"
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/15 py-2.5 text-[12px] font-semibold text-red-300 transition-all duration-200"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              Help Center
            </a>
          </div>
          <div>
            <p className="text-[11px] text-[#666] leading-snug">Check out your page</p>
            <a
              href={`/${user.username}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex items-center justify-between rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/15 px-3.5 py-2.5 text-[12px] font-semibold text-red-300 transition-all duration-200"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="h-3.5 w-3.5" />
                My Page
              </span>
            </a>
          </div>
        </div>

        {/* Share button */}
        <button
          onClick={handleShare}
          className="group relative w-full overflow-hidden rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] py-3 text-[12px] font-semibold text-[#888] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
        >
          {shared ? (
            <><Check className="h-3.5 w-3.5 text-green-400" /> Copied Link!</>
          ) : (
            <><Share2 className="h-3.5 w-3.5" /> Share Your Profile</>
          )}
        </button>

        {/* User profile card */}
        <div className="relative" ref={dropdownRef}>
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-[calc(100%+8px)] left-0 right-0 z-50 rounded-2xl border border-white/[0.06] bg-[#0D0D0D] p-1.5 shadow-2xl"
              >
                <a
                  href="https://discord.gg/redrose"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[12px] font-medium text-[#888] hover:text-white hover:bg-white/[0.04] transition-all"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 127.14 96.36">
                      <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c1-.73,2-1.51,2.94-2.31A75.52,75.52,0,0,0,96,78.2c1,.8,1.94,1.58,2.94,2.31a68.17,68.17,0,0,1-10.5,5A77.7,77.7,0,0,0,95.12,96.36a105.73,105.73,0,0,0,31.06-18.83C129.87,50.7,123.36,27.83,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" />
                    </svg>
                  </div>
                  Discord Server
                </a>
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
              <UserAvatar
                discordId={user.discord_id}
                discordAvatar={user.discord_avatar}
                username={user.username}
                size={34}
                rounded="rounded-xl"
              />
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
