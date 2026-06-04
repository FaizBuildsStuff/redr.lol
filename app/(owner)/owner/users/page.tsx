"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, MoreVertical, ShieldAlert, Clock, LogOut, Star, UserCheck, CheckCircle2 } from "lucide-react";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
  banned_until: string | null;
  timeout_until: string | null;
}

export default function OwnerUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionMenuId, setActionMenuId] = useState<number | null>(null);

  const fetchUsers = async (searchQuery = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/owner/users?search=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleAction = async (userId: number, action: string, value: any = null) => {
    setActionMenuId(null);
    try {
      const res = await fetch(`/api/owner/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, value }),
      });
      if (res.ok) {
        fetchUsers(search);
      } else {
        const err = await res.json();
        alert(`Failed to perform action: ${err.error}`);
      }
    } catch (err) {
      console.error("Action error:", err);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-20"
      >
        <div className="relative">
          <div className="absolute -left-4 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-red-500" />
          <h1 className="text-3xl font-black tracking-tight text-white uppercase flex items-center gap-3">
            <Users className="h-8 w-8 text-red-500" />
            User Management
          </h1>
          <p className="mt-2 text-sm text-[#8C8C8C] uppercase tracking-widest font-mono">
            Control center for all active cyber chamber profiles
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="h-4 w-4 text-[#8C8C8C]" />
          </div>
          <input
            type="text"
            className="w-full bg-[#0D0D0D]/80 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder-[#555] focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all backdrop-blur-xl"
            placeholder="Search by username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Users Table / List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-[24px] border border-white/5 bg-[#0D0D0D]/60 shadow-2xl backdrop-blur-xl overflow-hidden relative z-10"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white whitespace-nowrap">
            <thead className="bg-white/[0.02] border-b border-white/5 text-xs uppercase tracking-widest text-[#8C8C8C] font-semibold">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#555] font-mono">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-6 w-6 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#555] font-mono">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const isBanned = user.banned_until && new Date(user.banned_until) > new Date();
                  const isTimedOut = user.timeout_until && new Date(user.timeout_until) > new Date();
                  const isOwner = user.role === "owner";

                  return (
                    <tr key={user.id} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors relative">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600/20 to-black border border-white/5 font-black uppercase text-red-500">
                            {user.username.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-bold text-white">{user.username}</p>
                            <p className="text-xs text-[#666] font-mono">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                          isOwner 
                            ? "bg-red-500/10 text-red-400 border-red-500/20" 
                            : "bg-white/5 text-[#8C8C8C] border-white/10"
                        }`}>
                          {isOwner ? <Star className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {isBanned ? (
                          <span className="inline-flex items-center gap-1.5 text-red-500 text-xs font-semibold bg-red-500/10 px-2 py-1 rounded-md">
                            <ShieldAlert className="h-3.5 w-3.5" /> Banned
                          </span>
                        ) : isTimedOut ? (
                          <span className="inline-flex items-center gap-1.5 text-yellow-500 text-xs font-semibold bg-yellow-500/10 px-2 py-1 rounded-md">
                            <Clock className="h-3.5 w-3.5" /> Timed Out
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-green-500 text-xs font-semibold bg-green-500/10 px-2 py-1 rounded-md">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-[#8C8C8C] text-xs font-mono">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() => setActionMenuId(actionMenuId === user.id ? null : user.id)}
                            className="p-2 hover:bg-white/5 rounded-lg text-[#8C8C8C] hover:text-white transition-colors"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          
                          <AnimatePresence>
                            {actionMenuId === user.id && (
                              <>
                                <div 
                                  className="fixed inset-0 z-40" 
                                  onClick={() => setActionMenuId(null)} 
                                />
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-white/10 bg-[#1A1A1A] p-2 shadow-2xl backdrop-blur-3xl z-50 origin-top-right"
                                >
                                  {!isBanned && (
                                    <button 
                                      onClick={() => handleAction(user.id, "ban", 7)} // Ban for 7 days
                                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                                    >
                                      <ShieldAlert className="h-4 w-4" /> Ban User (7d)
                                    </button>
                                  )}
                                  {isBanned && (
                                    <button 
                                      onClick={() => handleAction(user.id, "ban", null)} // Unban
                                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-green-400 hover:bg-green-500/10 transition-colors"
                                    >
                                      <ShieldAlert className="h-4 w-4" /> Unban User
                                    </button>
                                  )}
                                  
                                  {!isTimedOut && (
                                    <button 
                                      onClick={() => handleAction(user.id, "timeout", 60)} // Timeout for 60 mins
                                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-yellow-500 hover:bg-yellow-500/10 transition-colors"
                                    >
                                      <Clock className="h-4 w-4" /> Timeout (1h)
                                    </button>
                                  )}
                                  {isTimedOut && (
                                    <button 
                                      onClick={() => handleAction(user.id, "timeout", null)} // Remove Timeout
                                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-green-400 hover:bg-green-500/10 transition-colors"
                                    >
                                      <Clock className="h-4 w-4" /> Remove Timeout
                                    </button>
                                  )}

                                  <button 
                                    onClick={() => handleAction(user.id, "kick")}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[#8C8C8C] hover:bg-white/5 hover:text-white transition-colors"
                                  >
                                    <LogOut className="h-4 w-4" /> Force Logout
                                  </button>

                                  <div className="my-1 h-px w-full bg-white/5" />

                                  <button 
                                    onClick={() => handleAction(user.id, "role", isOwner ? "user" : "owner")}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[#8C8C8C] hover:bg-white/5 hover:text-white transition-colors"
                                  >
                                    <Star className="h-4 w-4" /> 
                                    {isOwner ? "Demote to User" : "Promote to Owner"}
                                  </button>
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
