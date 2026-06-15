"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Folder, File as FileIcon, FileText, LockKeyhole, TerminalSquare, Upload, 
  Plus, MoreVertical, Edit2, Trash2, ChevronRight, HardDrive, ArrowLeft, Loader2 
} from "lucide-react";
import { generateUploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";

const UploadButton = generateUploadButton<OurFileRouter>();
interface VaultItem {
  id: number;
  name: string;
  type: "folder" | "doc" | "file";
  content?: string | null;
  url?: string | null;
  size_bytes?: number;
  parent_id: number | null;
  updated_at: string;
}

// Survives client-side navigation but resets on full page reload
let _vaultSessionUnlocked = false;

export default function OwnerVaultPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [glitch, setGlitch] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [bootSequence, setBootSequence] = useState(true);
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  
  // Vault State
  const [items, setItems] = useState<VaultItem[]>([]);
  const [currentFolder, setCurrentFolder] = useState<number | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [showDocEditor, setShowDocEditor] = useState<VaultItem | "new" | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [docName, setDocName] = useState("");
  const [docContent, setDocContent] = useState("");
  const [actionMenu, setActionMenu] = useState<number | null>(null);

  useEffect(() => {
    if (_vaultSessionUnlocked) {
      setUnlocked(true);
      setBootSequence(false);
    } else {
      // Run fake boot sequence
      const logs = [
        "INITIALIZING MAINFRAME KERNEL...",
        "MOUNTING SECURE VOLUME [0x08F4]...",
        "DECRYPTING SECTOR 7G...",
        "LOADING FIREWALL PROTOCOLS...",
        "ESTABLISHING SECURE TUNNEL...",
        "BYPASSING LOCAL PROXIES...",
        "SYSTEM ONLINE."
      ];
      let i = 0;
      const interval = setInterval(() => {
        if (i < logs.length) {
          setBootLogs(prev => [...prev, logs[i]]);
          i++;
        } else {
          clearInterval(interval);
          setTimeout(() => setBootSequence(false), 500);
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (unlocked) {
      fetchItems();
    }
  }, [unlocked, currentFolder]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/owner/vault?parent_id=${currentFolder || "null"}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthenticating(true);
    setGlitch(true);
    
    setTimeout(() => {
      if (passcode === "dameungrr") {
        _vaultSessionUnlocked = true;
        setUnlocked(true);
      } else {
        setPasscode("");
      }
      setAuthenticating(false);
      setGlitch(false);
    }, 1500);
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const res = await fetch("/api/owner/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFolderName, type: "folder", parent_id: currentFolder })
      });
      if (res.ok) {
        setNewFolderName("");
        setShowNewFolder(false);
        fetchItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveDoc = async () => {
    if (!docName.trim()) return;
    try {
      const isNew = showDocEditor === "new";
      const res = await fetch(isNew ? "/api/owner/vault" : `/api/owner/vault/${(showDocEditor as VaultItem).id}`, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: docName,
          content: docContent,
          type: "doc",
          parent_id: currentFolder
        })
      });
      
      if (res.ok) {
        setShowDocEditor(null);
        setDocName("");
        setDocContent("");
        fetchItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItem = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`/api/owner/vault/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openItem = (item: VaultItem) => {
    if (item.type === "folder") {
      setBreadcrumbs([...breadcrumbs, { id: item.id, name: item.name }]);
      setCurrentFolder(item.id);
    } else if (item.type === "doc") {
      setDocName(item.name);
      setDocContent(item.content || "");
      setShowDocEditor(item);
    } else if (item.type === "file" && item.url) {
      window.open(item.url, "_blank");
    }
  };

  const navigateUp = (index: number) => {
    if (index === -1) {
      setBreadcrumbs([]);
      setCurrentFolder(null);
    } else {
      setBreadcrumbs(breadcrumbs.slice(0, index + 1));
      setCurrentFolder(breadcrumbs[index].id);
    }
  };

  if (!unlocked) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden font-mono text-red-500 select-none">
        {/* Background Grid & Scanline */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.8)_100%)]" />
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #f00 2px, #f00 4px)", backgroundSize: "100% 4px" }} />
        
        {bootSequence ? (
          <div className="absolute left-8 bottom-8 flex flex-col gap-1 w-full max-w-2xl">
            {bootLogs.map((log, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-xs sm:text-sm text-red-500/80">
                <span className="text-white/50 mr-2">[{new Date().toISOString()}]</span> {log}
              </motion.div>
            ))}
            <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-3 h-4 bg-red-500 mt-2" />
          </div>
        ) : (
          <div className="relative w-full h-full p-4 sm:p-8 flex items-center justify-center">
            
            {/* eDEX-style HUD Borders */}
            <div className="absolute top-4 left-4 border-t-2 border-l-2 border-red-500 w-16 h-16 opacity-50" />
            <div className="absolute top-4 right-4 border-t-2 border-r-2 border-red-500 w-16 h-16 opacity-50" />
            <div className="absolute bottom-4 left-4 border-b-2 border-l-2 border-red-500 w-16 h-16 opacity-50" />
            <div className="absolute bottom-4 right-4 border-b-2 border-r-2 border-red-500 w-16 h-16 opacity-50" />

            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-50">
              <div className="h-px w-32 bg-gradient-to-r from-transparent to-red-500" />
              <span className="text-[10px] tracking-[0.3em] font-bold">REDR.OS SECURE TERMINAL</span>
              <div className="h-px w-32 bg-gradient-to-l from-transparent to-red-500" />
            </div>

            {/* Fake Telemetry Sidebars */}
            <div className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 flex-col gap-6 w-48 opacity-40">
              <div>
                <p className="text-[10px] tracking-widest mb-2 border-b border-red-500/30 pb-1">CPU LOAD</p>
                <div className="h-2 w-full bg-red-950/30 rounded overflow-hidden">
                  <motion.div animate={{ width: ["40%", "70%", "45%", "85%", "30%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="h-full bg-red-500" />
                </div>
              </div>
              <div>
                <p className="text-[10px] tracking-widest mb-2 border-b border-red-500/30 pb-1">MEM USAGE</p>
                <div className="h-2 w-full bg-red-950/30 rounded overflow-hidden">
                  <div className="h-full bg-red-500/60 w-[60%]" />
                </div>
              </div>
              <div>
                <p className="text-[10px] tracking-widest mb-2 border-b border-red-500/30 pb-1">NETWORK INFRA</p>
                <div className="text-[8px] leading-tight opacity-70">
                  <p>TX: 4.2 TB/s</p>
                  <p>RX: 1.1 TB/s</p>
                  <p>LATENCY: 0.4ms</p>
                </div>
              </div>
            </div>

            {/* Main Auth Box */}
            <motion.div 
              animate={glitch ? { x: [-10, 10, -10, 10, 0], filter: ["hue-rotate(90deg)", "hue-rotate(-90deg)", "none"] } : {}}
              transition={{ duration: 0.3 }}
              className="relative z-10 w-full max-w-lg bg-black/60 border border-red-500/30 p-1 shadow-[0_0_50px_rgba(239,68,68,0.1)] backdrop-blur-md"
            >
              {/* Outer Decor */}
              <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-red-500" />
              <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-red-500" />
              
              <div className="border border-red-500/10 p-8 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_rgba(255,0,0,0.05)_0%,_transparent_100%)]">
                
                <div className="flex justify-center mb-6">
                  <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden border border-red-500 bg-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.4)]">
                    <LockKeyhole className="h-8 w-8 text-red-500 animate-pulse" />
                  </div>
                </div>
                
                <div className="text-center space-y-2 mb-8">
                  <h2 className="text-2xl font-black tracking-[0.3em] text-red-500">ACCESS DENIED</h2>
                  <p className="text-xs text-red-400/60 tracking-widest">AUTHORIZED PERSONNEL ONLY</p>
                </div>
                
                <form onSubmit={handlePasscodeSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] tracking-[0.2em] text-red-500/70 mb-2 block">{'// INPUT SECURITY KEY'}</label>
                    <div className="relative group">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                      <input
                        type="password"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        disabled={authenticating}
                        autoFocus
                        spellCheck="false"
                        className="w-full bg-red-950/20 border-y border-r border-red-500/30 py-4 pl-6 pr-4 text-xl tracking-[0.4em] text-red-500 focus:outline-none focus:bg-red-500/10 focus:border-red-500 transition-all placeholder:text-red-900/50 uppercase"
                        placeholder="•••••••••"
                      />
                      <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-5 bg-red-500 pointer-events-none" />
                    </div>
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={authenticating || !passcode}
                    className="relative w-full overflow-hidden border border-red-500 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold tracking-[0.3em] py-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <span className="relative z-10">{authenticating ? "VERIFYING CRYPTOGRAPHY..." : "INITIATE OVERRIDE"}</span>
                    <div className="absolute inset-0 w-0 bg-red-500 group-hover:w-full transition-all duration-300 z-0 opacity-10" />
                  </button>
                </form>

                <div className="mt-6 pt-4 border-t border-red-500/20 flex justify-between text-[8px] tracking-widest text-red-500/40">
                  <span>SYS_LOC: 0x8F9A2B</span>
                  <span>IP: {Math.floor(Math.random()*255)}.{Math.floor(Math.random()*255)}.{Math.floor(Math.random()*255)}.X</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen flex flex-col">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
            <HardDrive className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white uppercase">Owner Vault</h1>
            <p className="text-xs text-[#8C8C8C] font-mono mt-1">Secure Encrypted File System</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setShowNewFolder(true)}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          >
            <Folder className="h-4 w-4" /> New Folder
          </button>
          <button 
            onClick={() => {
              setDocName("");
              setDocContent("");
              setShowDocEditor("new");
            }}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          >
            <FileText className="h-4 w-4" /> New Doc
          </button>
          <div className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all overflow-hidden relative cursor-pointer group">
            <span className="flex items-center gap-2 relative z-10"><Upload className="h-4 w-4" /> Upload</span>
            <div className="absolute inset-0 opacity-0 cursor-pointer">
              <UploadButton
                endpoint="vaultUploader"
                onClientUploadComplete={(res) => {
                  if (res && res[0]) {
                    // Save uploaded file info to db
                    fetch("/api/owner/vault", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: res[0].name,
                        type: "file",
                        url: res[0].url,
                        size_bytes: res[0].size,
                        parent_id: currentFolder
                      })
                    }).then(() => fetchItems());
                  }
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* File Explorer */}
      <div className="flex-1 border border-white/10 bg-[#0D0D0D]/60 rounded-3xl backdrop-blur-xl flex flex-col overflow-hidden shadow-2xl">
        {/* Breadcrumbs */}
        <div className="border-b border-white/10 bg-white/[0.02] px-6 py-4 flex items-center gap-2 overflow-x-auto custom-scrollbar text-sm font-medium">
          <button 
            onClick={() => navigateUp(-1)} 
            className={`flex items-center gap-1.5 hover:text-white transition-colors ${currentFolder === null ? "text-white" : "text-[#8C8C8C]"}`}
          >
            <HardDrive className="h-4 w-4" /> Root
          </button>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.id}>
              <ChevronRight className="h-4 w-4 text-[#555] shrink-0" />
              <button 
                onClick={() => navigateUp(index)}
                className={`truncate max-w-[150px] hover:text-white transition-colors ${index === breadcrumbs.length - 1 ? "text-white" : "text-[#8C8C8C]"}`}
              >
                {crumb.name}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-[#555] gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-red-500" />
              Decrypting sector...
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[#555] gap-3">
              <Folder className="h-12 w-12 opacity-20" />
              <p>This folder is empty.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative group flex flex-col items-center p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer"
                    onDoubleClick={() => openItem(item)}
                    onClick={() => {
                      // On mobile, single click opens
                      if (window.innerWidth < 768) openItem(item);
                    }}
                  >
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActionMenu(actionMenu === item.id ? null : item.id); }}
                        className="p-1 rounded-md hover:bg-white/10 text-[#8C8C8C] hover:text-white"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      
                      {/* Context Menu */}
                      {actionMenu === item.id && (
                        <div className="absolute top-full right-0 mt-1 w-32 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-xl z-50 p-1">
                          <div className="fixed inset-0 z-[-1]" onClick={(e) => { e.stopPropagation(); setActionMenu(null); }} />
                          {item.type === "doc" && (
                            <button onClick={(e) => { e.stopPropagation(); openItem(item); setActionMenu(null); }} className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-white/10 text-white flex items-center gap-2">
                              <Edit2 className="h-3 w-3" /> Edit
                            </button>
                          )}
                          <button onClick={(e) => { e.stopPropagation(); deleteItem(item.id); setActionMenu(null); }} className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-red-500/20 text-red-400 flex items-center gap-2">
                            <Trash2 className="h-3 w-3" /> Delete
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="h-16 w-16 flex items-center justify-center mb-3">
                      {item.type === "folder" ? (
                        <Folder className="h-12 w-12 text-blue-400 fill-blue-400/20 drop-shadow-[0_0_15px_rgba(96,165,250,0.3)]" />
                      ) : item.type === "doc" ? (
                        <FileText className="h-12 w-12 text-red-400 fill-red-400/20 drop-shadow-[0_0_15px_rgba(248,113,113,0.3)]" />
                      ) : (
                        <FileIcon className="h-12 w-12 text-zinc-400 fill-zinc-400/20 drop-shadow-[0_0_15px_rgba(161,161,170,0.3)]" />
                      )}
                    </div>
                    
                    <span className="text-sm font-medium text-center truncate w-full group-hover:text-white text-[#CCC]">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-[#666] mt-1 font-mono uppercase">
                      {new Date(item.updated_at).toLocaleDateString()}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showNewFolder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-[#111] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Create Folder</h3>
            <input 
              autoFocus
              type="text" 
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder Name"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none mb-6"
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowNewFolder(false)} className="px-4 py-2 rounded-xl text-sm font-semibold text-[#8C8C8C] hover:text-white">Cancel</button>
              <button onClick={createFolder} className="px-4 py-2 rounded-xl text-sm font-semibold bg-white text-black hover:bg-gray-200">Create</button>
            </div>
          </div>
        </div>
      )}

      {showDocEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-0 md:p-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full h-full md:h-[85vh] max-w-5xl bg-[#0A0A0A] border border-white/10 rounded-none md:rounded-3xl flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center gap-4 border-b border-white/10 px-6 py-4 bg-white/[0.02]">
              <button onClick={() => setShowDocEditor(null)} className="p-2 hover:bg-white/10 rounded-xl text-[#8C8C8C] hover:text-white">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <input 
                type="text" 
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="Document Title"
                className="flex-1 bg-transparent text-lg font-bold text-white outline-none placeholder:text-[#555]"
              />
              <button onClick={saveDoc} className="px-5 py-2 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                Save Document
              </button>
            </div>
            <textarea 
              value={docContent}
              onChange={(e) => setDocContent(e.target.value)}
              placeholder="Start typing..."
              className="flex-1 w-full bg-transparent p-6 text-[#E0E0E0] outline-none resize-none font-mono text-sm leading-relaxed custom-scrollbar placeholder:text-[#333]"
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}
