"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, ExternalLink, Eye, LayoutTemplate, LoaderCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLoading, DashboardShell, Panel } from "@/components/DashboardUI";

interface UserProfile {
  id: number;
  username: string;
  email: string;
}

interface ProfileTemplateUser {
  id: number;
  username: string;
  alias?: string | null;
  typewriter_heading?: string | null;
  typewriter_quotes?: string[] | null;
  location?: string | null;
  background_url?: string | null;
  background_type?: string | null;
  discord_profile_transparency?: number | null;
  enter_screen_text?: string | null;
  created_at?: string | null;
}

export default function TemplatesPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profiles, setProfiles] = useState<ProfileTemplateUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);

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
    async function loadProfiles() {
      if (!user) return;
      try {
        setLoadingProfiles(true);
        const res = await fetch("/api/user/templates");
        const data = await res.json();
        if (data.users) {
          setProfiles(data.users);
        }
      } catch (err) {
        console.error("Failed to load profile templates:", err);
      } finally {
        setLoadingProfiles(false);
      }
    }

    loadProfiles();
  }, [user]);

  const handleCopyProfile = async (profile: ProfileTemplateUser) => {
    try {
      const profilePayload = {
        alias: profile.alias ?? "",
        typewriter_heading: profile.typewriter_heading ?? "",
        typewriter_quotes: profile.typewriter_quotes ?? [],
        enter_screen_text: profile.enter_screen_text ?? "",
        discord_profile_transparency: Number(profile.discord_profile_transparency ?? 0.4),
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
          body: JSON.stringify({ location: profile.location ?? "" }),
        }),
      ]);

      if (profileRes.ok && locationRes.ok) {
        setCopiedId(profile.id);
        window.setTimeout(() => setCopiedId(null), 1800);
      }
    } catch (err) {
      console.error("Failed to copy profile:", err);
    }
  };

  const handleViewProfile = (profile: ProfileTemplateUser) => {
    window.open(`/${profile.username}`, "_blank", "noopener,noreferrer");
  };

  if (loading) return <DashboardLoading label="Loading templates" />;
  if (!user) return null;

  return (
    <DashboardShell
      eyebrow="Templates"
      title="Community profile inspiration"
      description="Browse live public profiles, preview them instantly, and copy their core details into your own profile."
      action={<div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 text-xs font-semibold text-white/55">{profiles.length} profiles</div>}
    >
      {loadingProfiles ? (
        <div className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm text-white/55">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Pulling live profiles...
        </div>
      ) : profiles.length === 0 ? (
        <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.025] p-6 text-sm text-white/55">
          No public profiles are available to preview yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {profiles.map((profile) => {
            const isCopied = copiedId === profile.id;

            return (
              <Panel key={profile.id} className="group overflow-hidden p-0">
                <div className="relative aspect-[16/10] overflow-hidden border-b border-white/[0.07] bg-black/30">
                  <iframe
                    src={`/${profile.username}?preview=1`}
                    title={`${profile.username} preview`}
                    className="absolute left-0 top-0 h-[200%] w-[200%] origin-top-left scale-[0.5] border-0 bg-black"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute inset-x-4 top-4 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70 backdrop-blur-xl">
                      <LayoutTemplate className="h-3.5 w-3.5" />
                      {profile.alias || profile.username}
                    </div>
                    <div className="rounded-full border border-white/[0.08] bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/60 backdrop-blur-xl">
                      Live
                    </div>
                  </div>

                  <div className="absolute inset-x-4 bottom-4 flex items-center gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 md:opacity-100 md:group-hover:opacity-100">
                    <Button
                      onClick={() => handleCopyProfile(profile)}
                      className="h-10 rounded-xl border border-white/[0.08] bg-white/[0.9] px-4 text-sm font-semibold text-black hover:bg-white"
                    >
                      {isCopied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                      {isCopied ? "Copied" : "Copy"}
                    </Button>
                    <Button
                      onClick={() => handleViewProfile(profile)}
                      className="h-10 rounded-xl border border-white/[0.08] bg-white/[0.08] px-4 text-sm font-semibold text-white hover:bg-white/[0.14]"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-3 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold tracking-[-0.03em] text-white">{profile.alias || profile.username}</h2>
                      <p className="mt-1 text-sm leading-6 text-white/45">
                        {profile.enter_screen_text || "A polished public profile with custom intro text and motion."}
                      </p>
                    </div>
                    <div className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
                      {profile.location || "Global"}
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-black/20 px-3 py-3 text-sm text-white/50">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Intro, typewriter, location, and glass depth
                    </div>
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-white/35">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Public page
                    </div>
                  </div>
                </div>
              </Panel>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
