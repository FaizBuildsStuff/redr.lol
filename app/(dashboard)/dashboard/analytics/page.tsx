"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, BarChart3, Globe, Laptop, MousePointerClick, Smartphone, Tablet } from "lucide-react";
import { DashboardLoading, DashboardShell, LineChart, MetricCard, Panel } from "@/components/DashboardUI";

interface UserProfile {
  id: number;
  username: string;
  email: string;
}

interface Stats {
  views: number;
  profile_clicks: number;
  link_clicks: number;
  link_ctr: number;
  graph_data: any[];
  devices: { desktop: number; mobile: number; tablet: number };
  referrers: Record<string, number>;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    views: 0,
    profile_clicks: 0,
    link_clicks: 0,
    link_ctr: 0,
    graph_data: [],
    devices: { desktop: 0, mobile: 0, tablet: 0 },
    referrers: {},
  });

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) setUser(data.user);
        else router.push("/signin");
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

  if (loading) return <DashboardLoading label="Loading analytics" />;
  if (!user) return null;

  const totalDevices = (stats.devices.desktop || 0) + (stats.devices.mobile || 0) + (stats.devices.tablet || 0);
  const deviceRows = [
    ["Desktop", stats.devices.desktop || 0, Laptop],
    ["Mobile", stats.devices.mobile || 0, Smartphone],
    ["Tablet", stats.devices.tablet || 0, Tablet],
  ] as const;
  const sortedReferrers = Object.entries(stats.referrers || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <DashboardShell
      eyebrow="Analytics"
      title="Traffic intelligence"
      description="A clean telemetry view for profile views, click behavior, devices, and referral channels."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total views" value={stats.views.toLocaleString()} detail="All public profile visits" icon={BarChart3} />
        <MetricCard label="Profile clicks" value={stats.profile_clicks.toLocaleString()} detail="Profile-level interactions" icon={MousePointerClick} />
        <MetricCard label="Link clicks" value={stats.link_clicks.toLocaleString()} detail="Outbound destinations" icon={Globe} />
        <MetricCard label="CTR" value={`${stats.link_ctr}%`} detail="Link clicks against views" icon={Activity} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.9fr)]">
        <Panel className="p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Views over time</h2>
              <p className="mt-1 text-sm text-white/42">Dark and white trend graph for the latest tracked days.</p>
            </div>
            <div className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1 text-xs text-white/50">
              {Math.max(stats.graph_data.length, 1)} day window
            </div>
          </div>
          <LineChart data={stats.graph_data} />
        </Panel>

        <div className="space-y-6">
          <Panel className="p-6">
            <h2 className="text-lg font-semibold text-white">Device share</h2>
            <div className="mt-5 space-y-5">
              {deviceRows.map(([label, count, Icon]) => {
                const pct = totalDevices ? Math.round((count / totalDevices) * 100) : 0;
                return (
                  <div key={label}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 font-medium text-white">
                        <Icon className="h-4 w-4 text-white/55" />
                        {label}
                      </span>
                      <span className="text-white/45">{pct}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                      <div className="h-full rounded-full bg-white transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel className="p-6">
            <h2 className="text-lg font-semibold text-white">Referrers</h2>
            <div className="mt-4 divide-y divide-white/[0.07]">
              {sortedReferrers.length > 0 ? (
                sortedReferrers.map(([domain, count]) => (
                  <div key={domain} className="flex items-center justify-between py-3">
                    <span className="flex min-w-0 items-center gap-2 text-sm text-white/62">
                      <Globe className="h-4 w-4 shrink-0 text-white/40" />
                      <span className="truncate">{domain}</span>
                    </span>
                    <span className="text-sm font-semibold text-white">{count}</span>
                  </div>
                ))
              ) : (
                <div className="py-6 text-sm text-white/42">No referral data yet.</div>
              )}
            </div>
          </Panel>
        </div>
      </div>
    </DashboardShell>
  );
}
