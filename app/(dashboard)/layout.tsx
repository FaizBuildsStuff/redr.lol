"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  Menu,
  X,
  User,
  Check,
  Disc3
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Sidebar State
  const [accountOpen, setAccountOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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

  // Fetch auth
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

  const handleShare = () => {
    if (!user) return;
    navigator.clipboard.writeText(`https://redr.lol/${user.username}`);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-[#050505] text-[#F5F1E8]">
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

  const formattedUid = `UID ${String(user.id).padStart(3, "0")},${String(Math.floor(Math.random() * 900) + 100)}`;

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

  const SidebarContent = () => (
    <div className="flex h-full flex-col justify-between">
      <div>
        {/* LOGO AREA */}
        <div className="flex items-center gap-3 px-2 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
            <span className="text-xl font-bold text-red-500 font-serif">R</span>
          </div>
          <div>
            <span className="text-xl font-semibold tracking-tight text-white">redr<span className="text-red-500 font-bold">.lol</span></span>
          </div>
        </div>

        {/* NAVIGATION MENUS */}
        <div className="mt-8 space-y-6">
          
          {/* Account Group */}
          <div>
            <button
              onClick={() => setAccountOpen(!accountOpen)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#666666] hover:bg-white/[0.02] hover:text-white transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                <User className="h-4 w-4 text-red-500/80" />
                Account
              </span>
              <motion.div
                animate={{ rotate: accountOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {accountOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-1 overflow-hidden pl-3 space-y-1"
                >
                  {accountSublinks.map((sub) => {
                    const Icon = sub.icon;
                    const isActive = pathname === sub.href;
                    return (
                      <button
                        key={sub.name}
                        onClick={() => {
                          router.push(sub.href);
                          setMobileOpen(false);
                        }}
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                          isActive
                            ? "bg-red-500/10 text-red-400 border-l-2 border-red-500 font-semibold"
                            : "text-[#8C8C8C] hover:text-white hover:bg-white/[0.02]"
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${isActive ? "text-red-500" : ""}`} />
                        {sub.name}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Standard Navigation links */}
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <button
                  key={link.name}
                  onClick={() => {
                    router.push(link.href);
                    setMobileOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-red-500/10 text-red-400 border-l-2 border-red-500 font-semibold"
                      : "text-[#8C8C8C] hover:text-white hover:bg-white/[0.02]"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-red-500" : ""}`} />
                  {link.name}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* FOOTER WIDGET SECTION */}
      <div className="space-y-6 pt-6 border-t border-white/5">
        
        {/* HELP CENTER & MY PAGE WIDGETS */}
        <div className="space-y-3 rounded-2xl bg-white/[0.02] border border-white/5 p-4">
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
          className="relative w-full h-11 gap-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold uppercase tracking-wider text-white shadow-[0_4px_20px_rgba(239,68,68,0.2)] hover:shadow-[0_4px_25px_rgba(239,68,68,0.35)] transition-all duration-300 overflow-hidden"
        >
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
        </Button>

        {/* USER PROFILE FOOTER CARD */}
        <div className="relative" ref={dropdownRef}>
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
                <div className="px-3.5 py-2 border-b border-white/5 mb-1.5">
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
                      <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c1-.73,2-1.51,2.94-2.31A75.52,75.52,0,0,0,96,78.2c1,.8,1.94,1.58,2.94,2.31a68.17,68.17,0,0,1-10.5,5A77.7,77.7,0,0,0,95.12,96.36a105.73,105.73,0,0,0,31.06-18.83C129.87,50.7,123.36,27.83,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/>
                    </svg>
                  </div>
                  Discord Server
                </a>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-all duration-200"
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
          <div className="flex items-center justify-between rounded-2xl bg-white/[0.01] border border-white/5 p-3">
            <div className="flex items-center gap-3">
              {/* Avatar placeholder with dithered mesh */}
              <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-red-500/20 bg-gradient-to-br from-red-600 to-[#100303] flex items-center justify-center">
                <span className="text-sm font-black text-white tracking-widest uppercase">
                  {user.username.slice(0, 2)}
                </span>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
              </div>
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
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/[0.03] text-[#666] hover:text-white transition-all duration-200"
            >
              <MoreHorizontal className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );

  return (
    <div className="relative flex min-h-screen bg-[#050505] text-[#F5F1E8] font-['Satoshi'] antialiased">
      
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
        <SidebarContent />
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
                <SidebarContent />
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
