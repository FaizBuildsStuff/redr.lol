import React from "react";
import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import ClientProfile from "./ClientProfile";

interface PageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ preview?: string }>;
}

export default async function UserProfilePage({ params, searchParams }: PageProps) {
  const { username } = await params;
  const { preview } = await searchParams;
  const skipIntro = preview === "1" || preview === "true";

  const cleanUsername = decodeURIComponent(username)
  .trim()
  .toLowerCase();

  // Query database to check if user exists
  let user = null;
  try {
    const users = await sql`
      SELECT id, username, email, alias, discord_id, discord_access_token, created_at, typewriter_heading, typewriter_quotes, custom_links, active_badges, location, background_url, background_type, audios, audio_shuffle, audio_player_enabled, background_audio_enabled, active_audio_id, custom_cursor_url, discord_profile_transparency, banned_until, timeout_until, enter_screen_text
      FROM users 
      WHERE LOWER(TRIM(username)) = ${cleanUsername}
      LIMIT 1
    `;
    if (users && users.length > 0) {
      user = users[0];
    }
  } catch (error) {
    console.error("Failed to query user profile:", error);
  }

  // If user does not exist, or if they are banned/timed out, trigger the void screen
  let isVoided = !user;
  if (user) {
    const now = new Date();
    if (user.banned_until && new Date(user.banned_until) > now) isVoided = true;
    if (user.timeout_until && new Date(user.timeout_until) > now) isVoided = true;
  }

  if (isVoided || !user) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#0A0A0A] text-[#F5F1E8] px-6">
        <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/5 blur-[120px] pointer-events-none" />
        <div className="text-center relative z-10 space-y-4 max-w-sm">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
            <span className="text-2xl font-black text-red-500 font-mono">?</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase">Identity Void</h1>
          <p className="text-xs text-[#8C8C8C] leading-relaxed">
            The profile <span className="text-red-400 font-mono">@{username}</span> does not belong to any active cyber chamber in our database core.
          </p>
          <div className="pt-4">
            <a
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 px-6 text-xs font-semibold text-white hover:bg-white/[0.07] transition-all duration-300"
            >
              Back to Home Registry
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Fetch initial Discord data and connections
  let initialDiscordData = null;
  let initialConnections = [];

  if (user && user.discord_id) {
    try {
      // Use dcdn.dstn.to proxy because official Discord API does not expose bio or pronouns via OAuth
      const profileRes = await fetch(`https://dcdn.dstn.to/profile/${user.discord_id}`, {
        cache: 'no-store'
      });
      if (profileRes.ok) {
        initialDiscordData = await profileRes.json();
      } else if (user.discord_access_token) {
        // Fallback to official Discord API if the proxy fails (e.g. no mutual servers)
        const meRes = await fetch("https://discord.com/api/v10/users/@me", {
          headers: { Authorization: `Bearer ${user.discord_access_token}` },
          cache: 'no-store'
        });
        if (meRes.ok) {
          const meData = await meRes.json();
          initialDiscordData = {
            user: meData,
            user_profile: { bio: "", pronouns: "", theme_colors: [] },
            badges: []
          };
        }
      }

      // Ultimate fallback: if their access token is expired or proxy failed
      if (!initialDiscordData && process.env.DISCORD_BOT_TOKEN) {
        const botRes = await fetch(`https://discord.com/api/v10/users/${user.discord_id}`, {
          headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
          cache: 'no-store'
        });
        if (botRes.ok) {
          const botData = await botRes.json();
          initialDiscordData = {
            user: botData,
            user_profile: { bio: "", pronouns: "", theme_colors: [] },
            badges: []
          };
        }
      }

      if (user.discord_access_token) {
        const connRes = await fetch("https://discord.com/api/v10/users/@me/connections", {
          headers: { Authorization: `Bearer ${user.discord_access_token}` },
          cache: 'no-store'
        });
        if (connRes.ok) initialConnections = await connRes.json();
      }
    } catch (e) {
      console.error("Serverside fetch error:", e);
    }
  }

  return <ClientProfile skipIntro={skipIntro} isPreview={skipIntro} user={{
    id: user.id,
    username: user.username,
    alias: user.alias,
    email: user.email,
    discord_id: user.discord_id,
    created_at: user.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "May 2026",
    typewriter_heading: user.typewriter_heading,
    typewriter_quotes: user.typewriter_quotes,
    custom_links: user.custom_links,
    active_badges: user.active_badges,
    location: user.location,
    background_url: user.background_url,
    background_type: user.background_type,
    audios: user.audios,
    audio_shuffle: user.audio_shuffle,
    audio_player_enabled: user.audio_player_enabled,
    background_audio_enabled: user.background_audio_enabled,
    active_audio_id: user.active_audio_id,
    custom_cursor_url: user.custom_cursor_url,
    discord_profile_transparency: user.discord_profile_transparency,
    enter_screen_text: user.enter_screen_text
  }} initialDiscordData={initialDiscordData} initialConnections={initialConnections} />;
}