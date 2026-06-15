"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Search, X, LayoutDashboard, Activity, Award, Settings, User, AtSign,
  Mail, Shield, Link as LinkIcon, Gem, Image as ImageIcon, LayoutTemplate,
  Share2, ExternalLink, HelpCircle, Home, Trophy, Palette, ChevronRight,
  Zap, Lock, Unlock, RefreshCw, Trash2, Key, Globe,
} from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  description: string;
  group: string;
  href?: string;
  action?: () => void;
  icon: React.ElementType;
  badge?: "upgrade" | "unlock";
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  username: string;
}

function buildItems(username: string, router: ReturnType<typeof useRouter>, onClose: () => void): CommandItem[] {
  const go = (href: string) => () => { onClose(); router.push(href); };
  const ext = (url: string) => () => { onClose(); window.open(url, "_blank"); };

  return [
    // Account
    { id: "overview", label: "Overview", description: "View your profile overview, UID, completion, and stats.", group: "Account", href: "/dashboard", icon: LayoutDashboard, action: go("/dashboard") },
    { id: "analytics", label: "Analytics", description: "Review views, clicks, devices, socials, referrers, and countries.", group: "Account", href: "/dashboard/analytics", icon: Activity, action: go("/dashboard/analytics") },
    { id: "badges", label: "Badges", description: "Manage profile badges and custom badge display.", group: "Account", href: "/dashboard/badges", icon: Award, action: go("/dashboard/badges") },

    // Settings
    { id: "username", label: "Username", description: "Change your public profile username.", group: "Settings", href: "/dashboard/settings", icon: User, action: go("/dashboard/settings") },
    { id: "display-name", label: "Display Name", description: "Change the display name shown on your profile.", group: "Settings", href: "/dashboard/settings", icon: AtSign, action: go("/dashboard/settings") },
    { id: "email", label: "Email", description: "View or change your account email.", group: "Settings", href: "/dashboard/settings", icon: Mail, action: go("/dashboard/settings") },
    { id: "password", label: "Change Password", description: "Change or add your account password.", group: "Account Actions", href: "/dashboard/settings", icon: Key, action: go("/dashboard/settings") },
    { id: "recovery", label: "Regenerate Recovery Codes", description: "Regenerate account recovery codes.", group: "Account Actions", href: "/dashboard/settings", icon: RefreshCw, action: go("/dashboard/settings") },
    { id: "delete-account", label: "Delete Account", description: "Find the account deletion controls.", group: "Account Actions", href: "/dashboard/settings", icon: Trash2, action: go("/dashboard/settings") },

    // Security
    { id: "mfa", label: "Multi-factor Authentication", description: "Enable or disable multi-factor authentication.", group: "Security Settings", href: "/dashboard/settings", icon: Shield, action: go("/dashboard/settings") },
    { id: "sessions", label: "Session Management", description: "Review active sessions and invalidate devices you don't recognize.", group: "Security Settings", href: "/dashboard/settings", icon: Lock, action: go("/dashboard/settings") },
    { id: "google-login", label: "Login with Google", description: "Control whether Google can be used to log in.", group: "Connections", href: "/dashboard/settings", icon: Globe, action: go("/dashboard/settings") },
    { id: "discord-login", label: "Login with Discord", description: "Control whether Discord can be used to log in.", group: "Connections", href: "/dashboard/settings", icon: LinkIcon, action: go("/dashboard/settings") },
    { id: "email-marketing", label: "Email Updates", description: "Manage product update emails.", group: "Email Marketing", href: "/dashboard/settings", icon: Mail, action: go("/dashboard/settings") },

    // Customize
    { id: "description", label: "Description", description: "Edit the text shown on your profile.", group: "Customize", href: "/dashboard/customize", icon: Palette, action: go("/dashboard/customize") },
    { id: "discord-presence", label: "Discord Presence", description: "Show or hide Discord presence on your profile.", group: "Customize", href: "/dashboard/customize", icon: Activity, action: go("/dashboard/customize") },
    { id: "background-effects", label: "Background Effects", description: "Choose visual background effects.", group: "Customize", href: "/dashboard/customize", icon: Palette, action: go("/dashboard/customize") },
    { id: "profile-opacity", label: "Profile Opacity", description: "Adjust the profile container opacity.", group: "Customize", href: "/dashboard/customize", icon: Palette, action: go("/dashboard/customize") },
    { id: "profile-blur", label: "Profile Blur", description: "Adjust the profile background blur.", group: "Customize", href: "/dashboard/customize", icon: Palette, action: go("/dashboard/customize") },
    { id: "username-effects", label: "Username Effects", description: "Choose animated username effects.", group: "Customize", href: "/dashboard/customize", icon: Zap, action: go("/dashboard/customize") },
    { id: "accent-color", label: "Accent Color", description: "Change profile accent color.", group: "Customize", href: "/dashboard/customize", icon: Palette, action: go("/dashboard/customize") },
    { id: "bg-color", label: "Background Color", description: "Change profile background color.", group: "Customize", href: "/dashboard/customize", icon: Palette, action: go("/dashboard/customize") },
    { id: "profile-gradient", label: "Enable Profile Gradient", description: "Enable and edit profile gradient colors.", group: "Customize", href: "/dashboard/customize", icon: Palette, action: go("/dashboard/customize") },

    // Links
    { id: "links", label: "Links", description: "Manage social links and buttons on your profile.", group: "Links", href: "/dashboard/links", icon: LinkIcon, action: go("/dashboard/links") },

    // Premium
    { id: "profile-layout", label: "Profile Layout", description: "Unlock this premium feature.", group: "Premium", href: "/dashboard/premium", icon: Gem, action: go("/dashboard/premium"), badge: "upgrade" },
    { id: "profile-animation", label: "Profile Animation", description: "Unlock this premium feature.", group: "Premium", href: "/dashboard/premium", icon: Zap, action: go("/dashboard/premium"), badge: "upgrade" },
    { id: "cursor-effects", label: "Cursor Effects", description: "Unlock this premium feature.", group: "Premium", href: "/dashboard/premium", icon: Gem, action: go("/dashboard/premium"), badge: "upgrade" },
    { id: "text-font", label: "Text Font", description: "Unlock this premium feature.", group: "Premium", href: "/dashboard/premium", icon: Gem, action: go("/dashboard/premium"), badge: "upgrade" },
    { id: "page-enter-text", label: "Page Enter Text", description: "Unlock this premium feature.", group: "Premium", href: "/dashboard/premium", icon: Gem, action: go("/dashboard/premium"), badge: "upgrade" },
    { id: "typewriter", label: "Typewriter Description", description: "Unlock this premium feature.", group: "Premium", href: "/dashboard/premium", icon: Gem, action: go("/dashboard/premium"), badge: "upgrade" },
    { id: "parallax", label: "Parallax Profile Animation", description: "Unlock this premium feature.", group: "Premium", href: "/dashboard/premium", icon: Gem, action: go("/dashboard/premium"), badge: "upgrade" },
    { id: "hide-views", label: "Hide Views", description: "Unlock this premium feature.", group: "Premium", href: "/dashboard/premium", icon: Gem, action: go("/dashboard/premium"), badge: "upgrade" },
    { id: "border-color", label: "Border Color", description: "Unlock this premium feature.", group: "Premium", href: "/dashboard/premium", icon: Gem, action: go("/dashboard/premium"), badge: "upgrade" },
    { id: "border-radius", label: "Profile Border Radius", description: "Unlock this premium feature.", group: "Premium", href: "/dashboard/premium", icon: Gem, action: go("/dashboard/premium"), badge: "upgrade" },
    { id: "social-alignment", label: "Social Links Alignment", description: "Unlock this premium feature.", group: "Premium", href: "/dashboard/premium", icon: Gem, action: go("/dashboard/premium"), badge: "upgrade" },
    { id: "profile-metadata", label: "Profile Metadata", description: "Unlock this premium feature.", group: "Premium", href: "/dashboard/premium", icon: Gem, action: go("/dashboard/premium"), badge: "upgrade" },

    // Image Host
    { id: "img-filename", label: "Filename Length", description: "Unlock Image Host access.", group: "Image Host", href: "/dashboard/image-host", icon: ImageIcon, action: go("/dashboard/image-host"), badge: "unlock" },
    { id: "img-embed", label: "Discord Embed", description: "Unlock Image Host access.", group: "Image Host", href: "/dashboard/image-host", icon: ImageIcon, action: go("/dashboard/image-host"), badge: "unlock" },
    { id: "img-anon", label: "Anonymous Uploads", description: "Unlock Image Host access.", group: "Image Host", href: "/dashboard/image-host", icon: ImageIcon, action: go("/dashboard/image-host"), badge: "unlock" },
    { id: "img-ext", label: "Hide File Extension in URLs", description: "Unlock Image Host access.", group: "Image Host", href: "/dashboard/image-host", icon: ImageIcon, action: go("/dashboard/image-host"), badge: "unlock" },
    { id: "img-domain", label: "Image Host Domain", description: "Unlock Image Host access.", group: "Image Host", href: "/dashboard/image-host", icon: Globe, action: go("/dashboard/image-host"), badge: "unlock" },
    { id: "img-upload-key", label: "Upload Key", description: "Unlock Image Host access.", group: "Image Host", href: "/dashboard/image-host", icon: Key, action: go("/dashboard/image-host"), badge: "unlock" },

    // Templates
    { id: "template-library", label: "Template Library", description: "Browse, favorite, and manage profile templates.", group: "Templates", href: "/dashboard/templates", icon: LayoutTemplate, action: go("/dashboard/templates") },
    { id: "template-favorites", label: "Favorite Templates", description: "Find your favorite templates.", group: "Templates", href: "/dashboard/templates", icon: LayoutTemplate, action: go("/dashboard/templates") },
    { id: "my-uploads", label: "My Uploads", description: "Manage templates you uploaded.", group: "Templates", href: "/dashboard/templates", icon: LayoutTemplate, action: go("/dashboard/templates") },

    // Quick Actions
    { id: "share", label: "Share Your Profile", description: `Copy your redr.lol/${username} link to clipboard.`, group: "Quick Actions", icon: Share2, action: () => { navigator.clipboard.writeText(`https://redr.lol/${username}`); onClose(); } },
    { id: "my-page", label: "My Page", description: `Open redr.lol/${username} in a new tab.`, group: "Quick Actions", icon: ExternalLink, action: ext(`https://redr.lol/${username}`) },
    { id: "help", label: "Help Center", description: "Open the redr.lol help center.", group: "Quick Actions", icon: HelpCircle, action: ext("https://discord.gg/redrose") },
    { id: "discord", label: "Discord Server", description: "Join the redr.lol Discord server.", group: "Quick Actions", icon: HelpCircle, action: ext("https://discord.gg/redrose") },
    { id: "home", label: "Home", description: "Go to the redr.lol home page.", group: "Quick Actions", icon: Home, action: ext("https://redr.lol") },
  ];
}

const GROUP_ORDER = [
  "Account", "Settings", "Security Settings", "Connections", "Email Marketing",
  "Account Actions", "Customize", "Links", "Premium", "Image Host", "Templates", "Quick Actions",
];

export default function CommandPalette({ open, onClose, username }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const items = buildItems(username, router, onClose);

  const filtered = query.trim()
    ? items.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.group.toLowerCase().includes(query.toLowerCase())
      )
    : items;

  // Group filtered items
  const grouped = GROUP_ORDER.reduce<Record<string, CommandItem[]>>((acc, group) => {
    const groupItems = filtered.filter(i => i.group === group);
    if (groupItems.length > 0) acc[group] = groupItems;
    return acc;
  }, {});

  // Flat list for keyboard navigation
  const flatList = Object.values(grouped).flat();

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, flatList.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flatList[activeIdx];
      if (item?.action) item.action();
    } else if (e.key === "Escape") {
      onClose();
    }
  }, [flatList, activeIdx, onClose]);

  // Scroll active into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh] px-4" onKeyDown={handleKeyDown}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -12 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0C0C0C] shadow-[0_30px_80px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.04)] flex flex-col"
            style={{ maxHeight: "78vh" }}
          >
            {/* Top red accent */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3.5">
              <Search className="h-4 w-4 shrink-0 text-[#555]" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search features, pages, and actions..."
                className="flex-1 bg-transparent text-[14px] text-white placeholder:text-[#444] outline-none"
              />
              <div className="flex items-center gap-2">
                {query && (
                  <button onClick={() => setQuery("")} className="text-[#444] hover:text-[#888] transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                <kbd className="text-[10px] text-[#444] border border-[#333] rounded px-1.5 py-0.5 font-mono">ESC</kbd>
              </div>
            </div>

            {/* Results */}
            <div ref={listRef} className="flex-1 overflow-y-auto py-2 custom-scrollbar">
              {flatList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-[#444]">
                  <Search className="h-8 w-8 mb-3 opacity-30" />
                  <p className="text-sm">No results for <span className="text-[#666]">"{query}"</span></p>
                </div>
              ) : (
                Object.entries(grouped).map(([group, groupItems]) => {
                  const groupStart = flatList.findIndex(i => i.id === groupItems[0].id);
                  return (
                    <div key={group} className="mb-1">
                      {/* Group header */}
                      <div className="px-4 py-2 mt-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#444]">{group}</span>
                      </div>

                      {/* Items */}
                      {groupItems.map((item, itemIdx) => {
                        const flatIdx = groupStart + itemIdx;
                        const Icon = item.icon;
                        const isActive = flatIdx === activeIdx;
                        return (
                          <button
                            key={item.id}
                            data-idx={flatIdx}
                            onMouseEnter={() => setActiveIdx(flatIdx)}
                            onClick={item.action}
                            className={`w-full flex items-center gap-3.5 px-3 mx-2 py-2.5 rounded-xl text-left transition-all duration-100 group ${isActive ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"}`}
                            style={{ width: "calc(100% - 16px)" }}
                          >
                            {/* Icon */}
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all ${isActive ? "bg-red-500/15 border-red-500/20 text-red-400" : "bg-white/[0.04] border-white/[0.06] text-[#555]"}`}>
                              <Icon className="h-3.5 w-3.5" />
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`text-[13px] font-medium truncate transition-colors ${isActive ? "text-white" : "text-[#ccc]"}`}>
                                  {item.label}
                                </span>
                                {item.badge === "upgrade" && (
                                  <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    Upgrade
                                  </span>
                                )}
                                {item.badge === "unlock" && (
                                  <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                    Unlock
                                  </span>
                                )}
                              </div>
                              <p className={`text-[11px] truncate transition-colors ${isActive ? "text-[#888]" : "text-[#555]"}`}>
                                {item.description}
                              </p>
                            </div>

                            {/* Arrow */}
                            <ChevronRight className={`h-3.5 w-3.5 shrink-0 transition-all ${isActive ? "text-[#666] translate-x-0.5" : "text-[#333]"}`} />
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/[0.05] px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3 text-[10px] text-[#444]">
                <span className="flex items-center gap-1">
                  <kbd className="border border-[#333] rounded px-1 py-0.5 font-mono text-[9px]">↑↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="border border-[#333] rounded px-1 py-0.5 font-mono text-[9px]">↵</kbd>
                  open
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="border border-[#333] rounded px-1 py-0.5 font-mono text-[9px]">ESC</kbd>
                  close
                </span>
              </div>
              <span className="text-[10px] text-[#333] font-mono">{flatList.length} results</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
