"use client";

import React, { useState } from "react";
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
    <section className="relative min-h-[125vh] overflow-hidden bg-[#050505] px-4 pb-20 pt-7 sm:px-6 lg:px-10 lg:pt-10">
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

export function BarsChart({ data }: { data: Array<{ views?: number; link_clicks?: number; profile_clicks?: number; date?: string }> }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const values = data.length ? data.map((item) => item.views || 0) : [0];
  const max = Math.max(...values, 1);
  const padded = data.length ? data.slice(-12) : Array.from({ length: 12 }, () => ({ views: 0, date: "" }));

  return (
    <div className="relative mt-4 flex h-52 w-full items-end justify-start gap-2 sm:gap-4">
      {/* Horizontal guide lines */}
      <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-full border-t border-white/[0.04]" />
        ))}
      </div>

      {padded.map((item, index) => {
        const height = Math.max(4, ((item.views || 0) / max) * 100);
        return (
          <div
            key={index}
            className="group relative z-10 flex h-full w-full max-w-[42px] items-end justify-center cursor-crosshair"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.65, delay: index * 0.035 }}
              className="w-full rounded-t-[6px] bg-gradient-to-t from-white/10 via-white/40 to-white/90 opacity-70 transition-all duration-300 group-hover:from-red-500/20 group-hover:via-red-500/70 group-hover:to-red-400 group-hover:opacity-100 group-hover:shadow-[0_0_24px_rgba(248,113,113,0.4)]"
            />
            {hoveredIndex === index && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full left-1/2 z-50 mb-3 -translate-x-1/2 pointer-events-none"
              >
                <div className="flex w-max flex-col items-center gap-1 rounded-2xl border border-white/[0.08] bg-[#0A0A0A]/95 px-4 py-2.5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                    {item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No Data'}
                  </span>
                  <span className="text-sm font-bold tracking-tight text-white">{item.views || 0} Views</span>
                </div>
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function LineChart({ data }: { data: Array<{ views?: number; date?: string }> }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const points = data.length ? data.slice(-12) : Array.from({ length: 12 }, () => ({ views: 0, date: "" }));
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
    <div className="relative mt-4 h-64 w-full">
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
      <div className="absolute inset-0 flex">
        {points.map((item, index) => (
          <div
            key={index}
            className="group relative flex-1 h-full cursor-crosshair"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {hoveredIndex === index && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.15 }}
                className="absolute left-1/2 top-4 z-50 -translate-x-1/2 pointer-events-none"
              >
                <div className="flex w-max flex-col items-center gap-1 rounded-2xl border border-white/[0.08] bg-[#0A0A0A]/95 px-4 py-2.5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                    {item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No Data'}
                  </span>
                  <span className="text-sm font-bold tracking-tight text-white">{item.views || 0} Views</span>
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
