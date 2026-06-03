"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Check,
  Copy,
  ExternalLink,
  Link2,
  LogOut,
  MousePointerClick,
  Palette,
  Radio,
  ShieldCheck,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarsChart, DashboardLoading, DashboardShell, MetricCard, Panel } from "@/components/DashboardUI";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  discord_id?: string;
}

interface Stats {
  views: number;
  profile_clicks: number;
  link_clicks: number;
  link_ctr: number;
  graph_data: any[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [savingDiscord, setSavingDiscord] = useState(false);
  const [stats, setStats] = useState<Stats>({ views: 0, profile_clicks: 0, link_clicks: 0, link_ctr: 0, graph_data: [] });

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
        console.error("Auth check failed:", err);
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    }

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/user/analytics");
        if (res.ok) {
          const data = await res.json();
          if (data.views !== undefined) setStats(data);
        }
      } catch {}
    };

    checkAuth();
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, [router]);

  const handleCopyLink = () => {
    if (!user) return;
    navigator.clipboard.writeText(`redr.lol/${user.username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  const handleDisconnectDiscord = async () => {
    try {
      setSavingDiscord(true);
      const res = await fetch("/api/user/discord", { method: "DELETE" });
      if (res.ok) setUser((prev) => (prev ? { ...prev, discord_id: undefined } : prev));
    } catch (error) {
      console.error("Failed to disconnect discord:", error);
    } finally {
      setSavingDiscord(false);
    }
  };

  if (loading) return <DashboardLoading label="Loading overview" />;
  if (!user) return null;

  return (
    <DashboardShell
      eyebrow="Dashboard overview"
      title={`Welcome back, ${user.username}`}
      description="A clean command center for your public profile, link traffic, Discord presence, and customization flow."
      action={
        <Button
          onClick={handleLogout}
          className="h-11 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-5 text-sm font-semibold text-white hover:bg-white/[0.07]"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total views" value={stats.views.toLocaleString()} detail="Live profile impressions" icon={BarChart3} />
        <MetricCard label="Profile clicks" value={stats.profile_clicks.toLocaleString()} detail="All tracked interactions" icon={MousePointerClick} />
        <MetricCard label="Link clicks" value={stats.link_clicks.toLocaleString()} detail="Outbound social traffic" icon={Link2} />
        <MetricCard label="Link CTR" value={`${stats.link_ctr}%`} detail="Clicks divided by views" icon={Activity} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.85fr)]">
        <div className="space-y-6">
          <Panel className="overflow-hidden p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/[0.08] bg-white/[0.04]">
                  <User className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    Active profile
                  </div>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">@{user.username}</h2>
                  <p className="mt-1 text-sm text-white/42">{user.email}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={() => router.push("/dashboard/customize")} className="h-11 rounded-2xl bg-white px-5 text-sm font-semibold text-black hover:bg-white/85">
                  <Palette className="mr-2 h-4 w-4" />
                  Customize
                </Button>
                <Button onClick={() => router.push("/dashboard/links")} className="h-11 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-5 text-sm font-semibold text-white hover:bg-white/[0.07]">
                  <Link2 className="mr-2 h-4 w-4" />
                  Links
                </Button>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">Public URL</p>
                <p className="mt-2 break-all text-lg font-semibold text-white">redr.lol/{user.username}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={handleCopyLink} className="flex h-11 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 text-sm font-semibold text-white hover:bg-white/[0.07]">
                  {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <a href={`/${user.username}`} target="_blank" rel="noreferrer" className="flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-black hover:bg-white/85">
                  Open
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </Panel>

          <Panel className="p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Views graph</h3>
                <p className="mt-1 text-sm text-white/42">Minimal dark and white activity bars.</p>
              </div>
              <div className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1 text-xs text-white/50">Last 12 days</div>
            </div>
            <BarsChart data={stats.graph_data} />
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Discord presence</h3>
                <p className="mt-1 text-sm text-white/42">Show live presence on your profile.</p>
              </div>
              <Radio className="h-5 w-5 text-white/70" />
            </div>

            <div className="mt-6 rounded-2xl border border-white/[0.07] bg-black/20 p-4">
              {user.discord_id ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-emerald-300" />
                    <div>
                      <p className="text-sm font-semibold text-white">Connected</p>
                      <p className="text-xs text-white/40">Presence sync is enabled.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={() => (window.location.href = "/api/auth/discord/login")} className="h-10 rounded-xl bg-white text-xs font-semibold text-black hover:bg-white/85">
                      Reconnect
                    </Button>
                    <Button onClick={handleDisconnectDiscord} disabled={savingDiscord} className="h-10 rounded-xl border border-white/[0.08] bg-white/[0.035] text-xs font-semibold text-white hover:bg-white/[0.07]">
                      Disconnect
                    </Button>
                  </div>
                </div>
              ) : (
                <Button onClick={() => (window.location.href = "/api/auth/discord/login")} className="h-11 w-full rounded-xl bg-white text-sm font-semibold text-black hover:bg-white/85">
                  Connect Discord
                </Button>
              )}
            </div>
          </Panel>

          <Panel className="p-6">
            <h3 className="text-lg font-semibold text-white">Quick actions</h3>
            <div className="mt-5 grid gap-3">
              {[
                ["Customize profile", "/dashboard/customize", Palette],
                ["Manage socials", "/dashboard/links", Link2],
                ["View analytics", "/dashboard/analytics", BarChart3],
              ].map(([label, href, Icon]) => {
                const RowIcon = Icon as typeof Palette;
                return (
                  <button key={label as string} onClick={() => router.push(href as string)} className="flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 text-left hover:bg-white/[0.05]">
                    <span className="flex items-center gap-3 text-sm font-semibold text-white">
                      <RowIcon className="h-4 w-4 text-white/60" />
                      {label as string}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-white/35" />
                  </button>
                );
              })}
            </div>
          </Panel>

          <Panel className="p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
              <div>
                <p className="text-sm font-semibold text-white">Account protected</p>
                <p className="mt-1 text-xs leading-5 text-white/42">Signed cookie sessions keep dashboard writes scoped to your account.</p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </DashboardShell>
  );
}
