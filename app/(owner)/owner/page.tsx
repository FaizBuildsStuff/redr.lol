"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Server, ShieldAlert, Activity, Cpu, ActivitySquare } from "lucide-react";
import Image from "next/image";

export default function OwnerOverviewPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    bannedUsers: 0,
    activeServers: 1,
    systemLoad: "0.00%"
  });

  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, logsRes] = await Promise.all([
          fetch("/api/owner/stats"),
          fetch("/api/owner/logs")
        ]);
        
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
        
        if (logsRes.ok) {
          const logsData = await logsRes.json();
          setLogs(logsData.logs || []);
        }
      } catch (err) {
        console.error("Failed to fetch owner data", err);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 5000); // Real-time polling
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      title: "Banned Users",
      value: stats.bannedUsers,
      icon: ShieldAlert,
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20"
    },
    {
      title: "Active Servers",
      value: stats.activeServers,
      icon: Server,
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20"
    },
    {
      title: "System Load",
      value: stats.systemLoad,
      icon: ActivitySquare,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20"
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="absolute -left-4 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-red-500" />
        <h1 className="text-3xl font-black tracking-tight text-white uppercase flex items-center gap-3">
          <Cpu className="h-8 w-8 text-red-500" />
          System Core
        </h1>
        <p className="mt-2 text-sm text-[#8C8C8C] uppercase tracking-widest font-mono">
          Global owner diagnostics and telemetry
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative overflow-hidden rounded-[24px] border ${stat.border} ${stat.bg} p-6 backdrop-blur-3xl`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#8C8C8C]">
                    {stat.title}
                  </p>
                  <p className="mt-2 text-3xl font-black text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-black/50 ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {logs.length > 0 ? (
  logs.map((log) => (
    <div
      key={log.id}
      className="flex items-center justify-between rounded-xl bg-white/[0.02] p-4 border border-white/5"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <p className="text-sm text-white font-mono uppercase tracking-wider">
            {log.action}
          </p>
        </div>

        <p className="text-xs text-[#8C8C8C] font-mono ml-5">
          Actor: {log.actor_username || "SYSTEM"} | Target:{" "}
          {log.target_username || "N/A"}
        </p>
      </div>

      <span className="text-[10px] text-[#555] font-mono whitespace-nowrap ml-4">
        {new Date(log.created_at).toLocaleString()}
      </span>
    </div>
  ))
) : (
  <div className="flex flex-col items-center justify-center py-8">
    <div className="relative">
      <Image
        src="/honda.png"
        alt="Honda"
        width={220}
        height={220}
        className="drop-shadow-[0_0_35px_rgba(239,68,68,0.35)] animate-bounce"
      />

      <div className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-green-500 animate-ping" />
      <div className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-green-500" />
    </div>

    <h3 className="mt-5 text-lg font-bold text-white">
      Honda Monitoring Station
    </h3>

    <p className="mt-2 text-sm text-[#8C8C8C] text-center max-w-xs">
      🚗 Honda is chilling peacefully.
      <br />
      No suspicious activity detected.
    </p>

    <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-mono text-[#B3B3B3]">
      Engine: ONLINE ✅
      <br />
      Fuel: 87%
      <br />
      VTEC: Sleeping 😴
    </div>
  </div>
)}
    </div>
  );
}
