"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  LayoutDashboard,
  Activity,
  Award,
  Settings,
  Palette,
  Link2,
  Gem,
  Image as ImageIcon,
  LayoutTemplate,
  ChevronDown,
  HelpCircle,
  ExternalLink,
  Share2,
  MoreHorizontal,
  LogOut,
  User,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
}

export default function Sidebar({ user, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Sidebar State
  const [accountOpen, setAccountOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [shared, setShared] = useState(false);



  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
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

  const handleShare = () => {
    navigator.clipboard.writeText(`https://redr.lol/${user.username}`);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const handleLogoClick = () => {
    if (user.role === "owner") {
      router.push("/owner");
    }
  };

  const userId = user?.id ?? (user as { userId?: number } | null)?.userId ?? (user as { user_id?: number } | null)?.user_id;
  const formattedUid = userId != null
    ? `UID ${String(userId).padStart(3, "0")},${String(Math.floor(Math.random() * 900) + 100)}`
    : "UID unavailable";

  const navLinks = [
    {
      name: "Customize",
      href: "/dashboard/customize",
      icon: Palette,
    },
    {
      name: "Links",
      href: "/dashboard/links",
      icon: Link2,
    },
    {
      name: "Premium",
      href: "/dashboard/premium",
      icon: Gem,
    },
    {
      name: "Image Host",
      href: "/dashboard/image-host",
      icon: ImageIcon,
    },
    {
      name: "Templates",
      href: "/dashboard/templates",
      icon: LayoutTemplate,
    },
  ];

  const accountSublinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Analytics", href: "/dashboard/analytics", icon: Activity },
    { name: "Badges", href: "/dashboard/badges", icon: Award },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="relative flex h-full flex-col justify-between">

      {/* BACKGROUND GLOW EFFECTS (z-0: fully locked behind clicks) */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Top Glow: Saturated & shifted for high visibility */}
        <div className="absolute left-[-30px] top-[-30px] h-[280px] w-[280px] rounded-full bg-red-500/25 blur-[95px] pointer-events-none" />

        {/* Bottom Glow: Rich, bleeding atmospheric halo */}
        <div className="absolute right-[-40px] bottom-[-40px] h-[300px] w-[300px] rounded-full bg-red-600/25 blur-[105px] pointer-events-none" />

        {/* Textured Noise Overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light pointer-events-none">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "url('https://grainy-gradients.vercel.app/noise.svg')",
            }}
          />
        </div>

        {/* Decorative Ring */}
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[-20px] top-[100px] opacity-[0.06]"
        >
          <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
            <path
              d="M40 90C40 45 140 45 140 90C140 135 40 135 40 90Z"
              stroke="#ef4444"
              strokeWidth="4"
              strokeDasharray="10 12"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      </div>

      {/* FOREGROUND CONTENT CONTAINER (z-10: elevated above glows for clean clicks) */}
      <div className="relative z-10 flex h-full flex-col justify-between flex-1">

        <div>
          {/* LOGO AREA */}
          <div
            className="relative flex items-center gap-4 rounded-[24px] border border-white/[0.05] bg-white/[0.025] px-4 py-4 backdrop-blur-3xl cursor-pointer"
            onClick={handleLogoClick}
          >

            {/* Glow */}
            <div className="absolute inset-0 rounded-[24px] bg-gradient-to-r from-red-500/5 via-transparent to-transparent" />

            {/* Logo */}
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-red-500/15 bg-red-500/5 shadow-[0_0_25px_rgba(239,68,68,0.12)]">

              <img
                src="/Logo.png"
                alt="redr logo"
                className="
      h-8
      w-8
      object-contain
      drop-shadow-[0_0_12px_rgba(239,68,68,0.45)]
    "
              />

            </div>

            {/* Text */}
            <div className="relative">

              <span className="text-xl font-semibold tracking-[-0.04em] text-white">
                redr
                <span className="font-bold text-red-500">
                  .lol
                </span>
              </span>

              {/* Tiny Glow Dot */}
              <div className="absolute -right-4 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.9)]" />

            </div>

          </div>

          {/* NAVIGATION MENUS */}
          <div className="mt-8 space-y-6">

            {/* Account Group Accordion */}
            <div>
              <button
                type="button"
                onClick={() => setAccountOpen(!accountOpen)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#666666] hover:bg-white/[0.02] hover:text-white transition-all duration-300 cursor-pointer"
              >
                <span className="flex items-center gap-2 pointer-events-none">
                  <User className="h-4 w-4 text-red-500/80" />
                  Account
                </span>
                <motion.div
                  animate={{ rotate: accountOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="pointer-events-none"
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
              </button>

              {/* Instant highly-reactive Accordion transition */}
              {accountOpen && (
                <div className="mt-1 pl-3 space-y-1">
                  {accountSublinks.map((sub) => {
                    const Icon = sub.icon;
                    const isActive = pathname === sub.href;
                    return (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        onClick={() => {
                          if (setMobileOpen) setMobileOpen(false);
                        }}
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 cursor-pointer ${isActive
                            ? "bg-gradient-to-r from-red-500/15 to-transparent text-white border border-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.08)]"
                            : "text-[#8C8C8C] hover:text-white hover:bg-white/[0.03] hover:translate-x-[2px]"
                          }`}
                      >
                        <Icon className={`h-4 w-4 ${isActive ? "text-red-500" : ""}`} />
                        {sub.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Standard Navigation Links */}
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => {
                      if (setMobileOpen) setMobileOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 cursor-pointer ${isActive
                        ? "bg-red-500/10 text-red-400 border-l-2 border-red-500 font-semibold"
                        : "text-[#8C8C8C] hover:text-white hover:bg-white/[0.02]"
                      }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? "text-red-500" : ""}`} />
                    {link.name}
                  </Link>
                );
              })}
            </div>

          </div>
        </div>

        {/* FOOTER WIDGET SECTION */}
        <div className="space-y-6 pt-6 border-t border-white/5 relative z-10">

          {/* HELP CENTER & MY PAGE WIDGETS */}
          <div className="relative space-y-3 rounded-2xl bg-white/[0.02] border border-white/5 p-4 overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-500/[0.06] via-transparent to-transparent" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#555]">Need Support?</p>
              <p className="mt-1 text-xs text-[#8C8C8C]">Have a question or need server setup assistance?</p>
              <a
                href="https://discord.gg/redrose"
                target="_blank"
                rel="noreferrer"
                className="mt-2.5 flex items-center justify-center gap-1.5 rounded-xl bg-white/[0.03] border border-white/5 py-2 text-xs font-medium text-white hover:bg-white/[0.07] transition-all duration-300"
              >
                <HelpCircle className="h-3.5 w-3.5 text-red-500" />
                Help Center
              </a>
            </div>



            <div className="pt-3 border-t border-white/5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#555]">Check out your page</p>
              <a
                href={`/${user.username}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex items-center justify-between rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-400 transition-all duration-300"
              >
                <span>View Live Profile</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* SHARE PROFILE BUTTON */}
          <Button
            onClick={handleShare}
            className="group relative h-12 w-full overflow-hidden rounded-2xl bg-red-600 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_40px_rgba(239,68,68,0.25)] transition-all duration-500 hover:-translate-y-[2px] hover:bg-red-500 hover:shadow-[0_10px_60px_rgba(239,68,68,0.45)] cursor-pointer"
          >
            {/* Animated Glow locked inside the button */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-400 to-red-700 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

            {/* Shine locked inside the button */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              <div className="absolute left-[-120%] top-0 h-full w-[60%] rotate-[20deg] bg-white/20 blur-xl transition-all duration-1000 group-hover:left-[140%]" />
            </div>

            {/* Label elevated above overlays */}
            <span className="relative z-10 flex items-center justify-center gap-2">
              {shared ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-300" />
                  Copied Link!
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" />
                  Share Your Profile
                </>
              )}
            </span>
          </Button>

          {/* USER PROFILE FOOTER CARD */}
          <div className="relative z-30" ref={dropdownRef}>
            {/* UPWARD DROPDOWN MENU */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute bottom-[calc(100%+12px)] left-0 right-0 z-50 rounded-2xl border border-white/5 bg-[#0D0D0D] p-2 shadow-2xl backdrop-blur-md"
                >
                  <div className="px-3.5 py-2 border-b border-white/5 mb-1.5 font-sans">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#555]">Quick Actions</p>
                  </div>

                  <a
                    href="https://discord.gg/redrose"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#8C8C8C] hover:text-white hover:bg-white/[0.03] transition-all duration-200"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                      <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 127.14 96.36">
                        <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c1-.73,2-1.51,2.94-2.31A75.52,75.52,0,0,0,96,78.2c1,.8,1.94,1.58,2.94,2.31a68.17,68.17,0,0,1-10.5,5A77.7,77.7,0,0,0,95.12,96.36a105.73,105.73,0,0,0,31.06-18.83C129.87,50.7,123.36,27.83,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" />
                      </svg>
                    </div>
                    Discord Server
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                      <LogOut className="h-3.5 w-3.5" />
                    </div>
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>



            {/* TRIGGER BASE CARD */}
            <div className="flex items-center justify-between relative overflow-hidden rounded-[24px] border border-white/[0.05] bg-white/[0.02] p-3 backdrop-blur-2xl">
              <div className="flex items-center gap-3">
                <UserAvatar
                  discordId={user.discord_id}
                  discordAvatar={user.discord_avatar}
                  username={user.username}
                  size={40}
                  rounded="rounded-xl"
                />
                <div>
                  <h4 className="text-sm font-medium text-white truncate max-w-[100px]">
                    {user.username}
                  </h4>
                  <p className="text-[10px] text-[#555] font-mono leading-none mt-1">
                    {formattedUid}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/[0.03] text-[#666] hover:text-white transition-all duration-200 cursor-pointer z-10 relative"
              >
                <MoreHorizontal className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
