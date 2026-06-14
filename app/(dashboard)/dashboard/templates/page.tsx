"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Star, Link as LinkIcon, Eye, Plus, LayoutTemplate, LoaderCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardLoading } from "@/components/DashboardUI";
import { CreateTemplateDialog } from "./CreateTemplateDialog";

interface Template {
  id: number;
  name: string;
  tags: string[];
  visibility: string;
  uses: number;
  stars: number;
  created_at: string;
  username: string;
  alias?: string | null;
  discord_id?: string | null;
  discord_avatar?: string | null;
  profile_data: any;
}

export default function TemplatesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("library");

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

  useEffect(() => {
    async function loadTemplates() {
      if (!user) return;
      try {
        setLoadingTemplates(true);
        const res = await fetch("/api/user/templates");
        const data = await res.json();
        if (data.templates) {
          setTemplates(data.templates);
        }
      } catch (err) {
        console.error("Failed to load templates:", err);
      } finally {
        setLoadingTemplates(false);
      }
    }
    loadTemplates();
  }, [user]);

  const handleCopyProfile = async (template: Template) => {
    try {
      const data = template.profile_data;
      const profilePayload = {
        alias: data.alias ?? "",
        typewriter_heading: data.typewriter_heading ?? "",
        typewriter_quotes: data.typewriter_quotes ?? [],
        enter_screen_text: data.enter_screen_text ?? "",
        discord_profile_transparency: Number(data.discord_profile_transparency ?? 0.4),
      };

      const [profileRes, locationRes] = await Promise.all([
        fetch("/api/user/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profilePayload),
        }),
        fetch("/api/user/location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ location: data.location ?? "" }),
        }),
      ]);

      if (profileRes.ok && locationRes.ok) {
        setCopiedId(template.id);
        window.setTimeout(() => setCopiedId(null), 1800);
      }
    } catch (err) {
      console.error("Failed to copy template:", err);
    }
  };

  const handleViewProfile = (template: Template) => {
    window.open(`/${template.username}`, "_blank", "noopener,noreferrer");
  };

  const handleCreateSuccess = (newTemplate: Template) => {
    setTemplates([newTemplate, ...templates]);
  };

  if (loading) return <DashboardLoading label="Loading templates" />;
  if (!user) return null;

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-white">
          <LayoutTemplate className="h-6 w-6 text-white/80" />
          <h1 className="text-2xl font-bold tracking-tight">Discover the perfect redr.lol Template for your Profile</h1>
        </div>
        <p className="text-sm text-white/50 pl-8">Browse community-created templates, or design your own to share with the redr.lol community.</p>
      </div>

      {/* Nav Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-white/[0.04] bg-[#0A0A0A] p-2">
        <div className="flex items-center gap-1 overflow-x-auto px-2">
          <button 
            onClick={() => setActiveTab("library")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'library' ? 'bg-white/[0.06] text-white' : 'text-white/40 hover:text-white hover:bg-white/[0.03]'}`}
          >
            Template Library
          </button>
          <button 
            onClick={() => setActiveTab("favorites")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'favorites' ? 'bg-white/[0.06] text-white' : 'text-white/40 hover:text-white hover:bg-white/[0.03]'}`}
          >
            Favorite Templates
          </button>
          <button 
            onClick={() => setActiveTab("recent")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'recent' ? 'bg-white/[0.06] text-white' : 'text-white/40 hover:text-white hover:bg-white/[0.03]'}`}
          >
            Last Used Templates
          </button>
          <button 
            onClick={() => setActiveTab("uploads")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'uploads' ? 'bg-white/[0.06] text-white' : 'text-white/40 hover:text-white hover:bg-white/[0.03]'}`}
          >
            My Uploads
          </button>
        </div>
        
        <Button 
          onClick={() => setCreateDialogOpen(true)}
          className="h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-200 hover:bg-purple-500/20 text-xs font-bold px-5"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Explore community-created templates" 
            className="h-12 w-full rounded-[16px] border border-white/[0.06] bg-[#0A0A0A] pl-11 pr-4 text-sm text-white placeholder:text-white/30 focus-visible:ring-1 focus-visible:ring-white/10"
          />
        </div>
        <div className="flex items-center gap-2 rounded-[16px] border border-white/[0.06] bg-[#0A0A0A] h-12 px-5 text-sm text-white/50 font-medium cursor-pointer hover:bg-white/[0.03] transition-colors">
          <LayoutTemplate className="h-4 w-4" />
          <span>Trending</span>
        </div>
      </div>

      {/* Grid */}
      {loadingTemplates ? (
        <div className="flex items-center justify-center py-20 text-white/50">
          <LoaderCircle className="h-6 w-6 animate-spin mr-3" />
          Loading templates...
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/50 border border-dashed border-white/10 rounded-3xl">
          <LayoutTemplate className="h-12 w-12 mb-4 opacity-20" />
          <p>No templates found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredTemplates.map((template) => {
            const isCopied = copiedId === template.id;
            // Build Discord avatar URL from discord_id + discord_avatar hash, else fallback to DiceBear
            const avatarUrl = template.discord_id && template.discord_avatar
              ? `https://cdn.discordapp.com/avatars/${template.discord_id}/${template.discord_avatar}.png?size=128`
              : `https://api.dicebear.com/7.x/avataaars/svg?seed=${template.username}`;

            return (
              <div key={template.id} className="group flex flex-col rounded-[20px] border border-white/[0.06] bg-[#0A0A0A] overflow-hidden transition-all duration-300 hover:border-white/[0.12] hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
                {/* Preview Top Half */}
                <div className="relative aspect-[16/10] bg-black border-b border-white/[0.06] overflow-hidden">
                  <iframe
                    src={`/${template.username}?preview=1`}
                    title={`${template.name} preview`}
                    className="absolute left-0 top-0 h-[200%] w-[200%] origin-top-left scale-[0.5] border-0 bg-black pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-90" />
                  
                  {/* Star Icon */}
                  <button className="absolute top-3 right-3 p-2 rounded-full bg-black/40 border border-white/10 text-yellow-500/70 hover:text-yellow-400 hover:bg-black/60 transition-all backdrop-blur-md">
                    <Star className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Bottom Half */}
                <div className="flex flex-col p-4 flex-1">
                  {/* User Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <img src={avatarUrl} alt={template.username} className="h-10 w-10 rounded-full bg-white/10 border border-white/5 object-cover" />
                    <div className="flex flex-col overflow-hidden">
                      <h3 className="text-sm font-bold text-white truncate">{template.name}</h3>
                      <p className="text-[11px] font-medium text-white/40 truncate">@{template.username}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider text-white/40 mb-3 font-bold">
                    <span className="flex items-center gap-1.5"><LayoutTemplate className="h-3 w-3" /> {template.uses.toLocaleString()} uses</span>
                    <span className="flex items-center gap-1.5 text-white/70"><Star className="h-3 w-3 text-purple-400" /> Trending</span>
                    <span className="flex items-center gap-1.5"><Star className="h-3 w-3" /> {template.stars.toLocaleString()}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {template.tags && template.tags.length > 0 ? (
                      template.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-[9px] text-white/60 font-black uppercase tracking-[0.05em]">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-[9px] text-white/30 font-black uppercase tracking-[0.05em]">
                        no tags
                      </span>
                    )}
                  </div>

                  {/* Spacer to push buttons to bottom if height varies */}
                  <div className="flex-1" />

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-white/[0.04]">
                    <Button
                      onClick={() => handleCopyProfile(template)}
                      className="flex-1 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200 font-bold transition-all text-xs"
                    >
                      {isCopied ? <Check className="mr-2 h-4 w-4" /> : "Use Template"}
                    </Button>
                    <button 
                      onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${template.username}`)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors"
                    >
                      <LinkIcon className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleViewProfile(template)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CreateTemplateDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
        onSuccess={handleCreateSuccess} 
      />
    </div>
  );
}
