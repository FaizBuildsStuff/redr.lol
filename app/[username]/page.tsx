import React from "react";
import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import ClientProfile from "./ClientProfile";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;

  // Query database to check if user exists
  let user = null;
  try {
    const users = await sql`
      SELECT id, username, email, discord_id, created_at, typewriter_heading, typewriter_quotes, custom_links, active_badges 
      FROM users 
      WHERE LOWER(username) = LOWER(${username})
      LIMIT 1
    `;
    if (users && users.length > 0) {
      user = users[0];
    }
  } catch (error) {
    console.error("Failed to query user profile:", error);
  }

  // If user does not exist in Neon DB, trigger a custom aesthetic 404 identity screen
  if (!user) {
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

  // Fetch initial Discord and Lanyard data
  let initialDiscordData = null;
  let initialLanyardData = null;
  if (user && user.discord_id) {
    try {
      const [discordRes, lanyardRes] = await Promise.all([
        fetch(`https://redroseapi.vercel.app/v1/user/${user.discord_id}`, { cache: 'no-store' }),
        fetch(`https://api.lanyard.rest/v1/users/${user.discord_id}`, { cache: 'no-store' })
      ]);
      if (discordRes.ok) initialDiscordData = await discordRes.json();
      if (lanyardRes.ok) {
        const json = await lanyardRes.json();
        if (json.success) initialLanyardData = json.data;
      }
    } catch (e) {
      console.error("Serverside fetch error:", e);
    }
  }

  return <ClientProfile user={{
    id: user.id,
    username: user.username,
    email: user.email,
    discord_id: user.discord_id,
    created_at: user.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "May 2026",
    typewriter_heading: user.typewriter_heading,
    typewriter_quotes: user.typewriter_quotes,
    custom_links: user.custom_links,
    active_badges: user.active_badges
  }} initialDiscordData={initialDiscordData} initialLanyardData={initialLanyardData} />;
}
