"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { TerminalSquare, Activity, RotateCcw } from "lucide-react";

export default function OwnerLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const endOfLogsRef = useRef<HTMLDivElement>(null);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/owner/logs");
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Scroll to bottom on initial load
    if (!loading && endOfLogsRef.current) {
      endOfLogsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [loading]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 min-h-screen flex flex-col">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-6 relative z-20"
      >
        <div className="relative">
          <div className="absolute -left-4 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-red-500" />
          <h1 className="text-3xl font-black tracking-tight text-white uppercase flex items-center gap-3">
            <TerminalSquare className="h-8 w-8 text-red-500" />
            System Logs
          </h1>
          <p className="mt-2 text-sm text-[#8C8C8C] uppercase tracking-widest font-mono">
            Real-time telemetry and audit trail
          </p>
        </div>
        
        <button 
          onClick={() => {
            setLoading(true);
            fetchLogs();
          }}
          className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-xs font-semibold text-[#8C8C8C] hover:bg-white/10 hover:text-white transition-all backdrop-blur-xl"
        >
          <RotateCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Force Sync
        </button>
      </motion.div>

      {/* Terminal View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex-1 rounded-[24px] border border-white/10 bg-black/80 shadow-[0_0_50px_rgba(239,68,68,0.05)] overflow-hidden flex flex-col relative z-10"
      >
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.02] px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-4 text-xs font-mono text-[#555] uppercase tracking-widest">
            root@redr.lol:~# tail -f /var/log/system.log
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 font-mono text-xs sm:text-sm custom-scrollbar space-y-2">
          {logs.length === 0 && !loading ? (
            <div className="text-[#555] italic">No logs generated yet. System is silent.</div>
          ) : (
            [...logs].reverse().map((log) => { // Reverse to show chronological order (oldest top, newest bottom)
              const timestamp = new Date(log.created_at).toISOString();
              return (
                <div key={log.id} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 hover:bg-white/[0.02] rounded px-2 py-1 transition-colors">
                  <span className="text-[#555] shrink-0">[{timestamp}]</span>
                  <span className="text-red-400 font-bold uppercase tracking-wide shrink-0">
                    {log.action}
                  </span>
                  <span className="text-[#8C8C8C]">
                    Actor: <span className="text-white">{log.actor_username || "SYSTEM"}</span> 
                    {log.target_username && <> &rarr; Target: <span className="text-white">{log.target_username}</span></>}
                  </span>
                  {Object.keys(log.details || {}).length > 0 && (
                    <span className="text-[#555] ml-auto">
                      {JSON.stringify(log.details)}
                    </span>
                  )}
                </div>
              );
            })
          )}
          <div ref={endOfLogsRef} />
        </div>
      </motion.div>
    </div>
  );
}
