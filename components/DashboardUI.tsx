"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon, Sparkles } from "lucide-react";

export function DashboardLoading({ label = "Preparing dashboard" }: { label?: string }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] text-[#F5F1E8]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] opacity-40" />
      <div className="relative flex flex-col items-center gap-5 text-center">
        <motion.div
          animate={{ opacity: [0.72, 1, 0.72], scale: [0.98, 1.02, 0.98] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-20 w-20 items-center justify-center rounded-[24px] border border-white/[0.08] bg-white/[0.035] shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
        >
          <img src="/Logo.png" alt="redr logo" className="h-12 w-12 object-contain" />
        </motion.div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">{label}</p>
          <div className="mx-auto mt-4 h-1 w-44 overflow-hidden rounded-full bg-white/[0.08]">
            <motion.div
              animate={{ x: ["-100%", "130%"] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-20 rounded-full bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardShell({
  eyebrow,
  title,
  description,
  action,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050505] px-4 pb-20 pt-7 sm:px-6 lg:px-10 lg:pt-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.028)_1px,transparent_1px)] bg-[size:56px_56px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06),transparent_28%),linear-gradient(180deg,rgba(5,5,5,0)_0%,#050505_80%)]" />
      </div>

      <div className="relative z-10 w-full">
        <div className="mb-7 flex flex-col gap-5 border-b border-white/[0.07] pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
              <Sparkles className="h-3.5 w-3.5 text-white/70" />
              {eyebrow}
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#8C8C8C]">{description}</p>
          </div>
          {action}
        </div>
        {children}
      </div>
    </section>
  );
}

export function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-[26px] border border-white/[0.08] bg-white/[0.025] shadow-[0_24px_90px_rgba(0,0,0,0.24)] backdrop-blur-2xl ${className}`}>
      {children}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}) {
  return (
    <Panel className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/38">{label}</p>
          <p className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white">{value}</p>
          <p className="mt-1 text-xs text-white/42">{detail}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] text-white">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </Panel>
  );
}

export function BarsChart({ data }: { data: Array<{ views?: number; link_clicks?: number; profile_clicks?: number }> }) {
  const values = data.length ? data.map((item) => item.views || 0) : [0];
  const max = Math.max(...values, 1);
  const padded = data.length ? data.slice(-12) : Array.from({ length: 12 }, () => ({ views: 0 }));

  return (
    <div className="flex h-64 items-end gap-2">
      {padded.map((item, index) => {
        const height = Math.max(6, ((item.views || 0) / max) * 100);
        return (
          <motion.div
            key={index}
            initial={{ height: 0 }}
            animate={{ height: `${height}%` }}
            transition={{ duration: 0.65, delay: index * 0.035 }}
            className="min-w-0 flex-1 rounded-t-xl bg-gradient-to-t from-white/35 via-white/70 to-white"
          />
        );
      })}
    </div>
  );
}

export function LineChart({ data }: { data: Array<{ views?: number }> }) {
  const points = data.length ? data.slice(-12) : Array.from({ length: 12 }, () => ({ views: 0 }));
  const max = Math.max(...points.map((item) => item.views || 0), 1);
  const width = 1000;
  const height = 280;
  const step = width / Math.max(points.length - 1, 1);
  const path = points
    .map((item, index) => {
      const x = index * step;
      const y = height - 42 - (((item.views || 0) / max) * 180);
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  return (
    <div className="h-72 w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id="whiteGraphFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.20)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        {[58, 128, 198, 268].map((y) => (
          <line key={y} x1="0" x2={width} y1={y} y2={y} stroke="rgba(255,255,255,0.055)" strokeWidth="1" />
        ))}
        <path d={`${path} L${width},${height} L0,${height} Z`} fill="url(#whiteGraphFill)" />
        <path d={path} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
