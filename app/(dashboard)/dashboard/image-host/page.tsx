"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Disc3,
  Image as ImageIcon,
  UploadCloud,
  FileCode,
  Trash2,
  ExternalLink,
  Lock,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserProfile {
  id: number;
  username: string;
  email: string;
}

interface UserAsset {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
}

export default function ImageHostPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Asset gallery state
  const [assets, setAssets] = useState<UserAsset[]>([
    { id: "1", name: "avatar_stealth.png", size: "412 KB", type: "image/png", url: "https://grainy-gradients.vercel.app/noise.svg" },
    { id: "2", name: "quantum_background.gif", size: "2.1 MB", type: "image/gif", url: "https://grainy-gradients.vercel.app/noise.svg" }
  ]);

  // Upload simulation states
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        } else {
          router.push("/signin");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  const simulateUpload = (fileName: string) => {
    setUploading(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const newAsset: UserAsset = {
              id: Date.now().toString(),
              name: fileName || "uploaded_asset.png",
              size: "148 KB",
              type: "image/png",
              url: "https://grainy-gradients.vercel.app/noise.svg"
            };
            setAssets((prevAssets) => [newAsset, ...prevAssets]);
            setUploading(false);
          }, 300);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      simulateUpload(file.name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      simulateUpload(e.target.files[0].name);
    }
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(assets.filter((a) => a.id !== id));
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
            Configuring storage arrays...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050505] px-4 md:px-10 pb-20 pt-8 md:pt-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-red-600/5 blur-[150px]" />
      </div>

      <div className="mx-auto max-w-4xl relative z-10">
        
        {/* Header */}
        <div className="border-b border-white/5 pb-8 mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-red-400 text-xs font-semibold uppercase tracking-[0.2em]">
              <ImageIcon className="h-4 w-4" /> Asset Host
            </div>
            <h1 className="mt-2 text-4xl font-medium tracking-tight text-white">
              Image & File Hosting
            </h1>
            <p className="mt-2 text-sm text-[#8C8C8C]">
              Upload background assets, audio overlays, and avatars for your profiles.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-[#555] uppercase font-bold tracking-wider bg-white/[0.01] border border-white/5 px-4 py-2 rounded-xl">
            <Lock className="h-3.5 w-3.5 text-red-500" /> 10 MB Max file size
          </div>
        </div>

        {/* UPLOAD ZONE */}
        <div className="mb-10">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-[28px] border-2 border-dashed p-10 text-center transition-all duration-300 ${
              dragging
                ? "border-red-500 bg-red-500/5 shadow-[0_0_30px_rgba(239,68,68,0.1)]"
                : "border-white/10 bg-[#0A0A0A] hover:border-white/20"
            }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center py-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400"
                >
                  <Disc3 className="h-6 w-6" />
                </motion.div>
                <h4 className="mt-4 text-sm font-semibold text-white tracking-tight">Uploading Asset...</h4>
                <div className="mt-4 w-full max-w-xs bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full transition-all duration-150" style={{ width: `${progress}%` }} />
                </div>
                <span className="mt-2 text-[10px] text-[#555] uppercase font-mono">{progress}% Complete</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.02] border border-white/5 text-[#666]">
                  <UploadCloud className="h-7 w-7 text-red-500/80" />
                </div>
                
                <h3 className="mt-5 text-base font-medium text-white">Drag & drop files here</h3>
                <p className="mt-1.5 text-xs text-[#8C8C8C]">or click to navigate your local storage registry</p>

                <div className="mt-6">
                  <input
                    type="file"
                    id="fileUpload"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <label
                    htmlFor="fileUpload"
                    className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.07] px-6 py-2.5 text-xs font-semibold text-white transition-all duration-300"
                  >
                    <Plus className="h-4 w-4 text-red-500" /> Choose File
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ASSET INVENTORY */}
        <div className="rounded-[26px] border border-white/5 bg-[#0A0A0A]/80 p-6 backdrop-blur-3xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
            <h3 className="text-sm font-semibold text-white">Asset Inventory</h3>
            <span className="text-[10px] text-[#555] font-semibold">{assets.length} stored files</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence initial={false}>
              {assets.map((asset) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-2xl border border-white/5 bg-[#0D0D0D] p-4 flex items-center justify-between transition-all hover:border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-xl overflow-hidden bg-white/[0.02] border border-white/5 flex items-center justify-center text-[#555]">
                      {asset.type.startsWith("image") ? (
                        <ImageIcon className="h-5 w-5 text-red-400" />
                      ) : (
                        <FileCode className="h-5 w-5 text-indigo-400" />
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-medium text-white truncate max-w-[140px]">{asset.name}</h4>
                      <p className="text-[10px] text-[#666] font-mono mt-0.5">{asset.size} • {asset.type}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-white/[0.01] text-[#444] hover:text-white transition-all duration-200"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>

                    <button
                      onClick={() => handleDeleteAsset(asset.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-white/[0.01] text-[#444] hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}
