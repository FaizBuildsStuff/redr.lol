import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/session";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    const user = verifyToken(sessionCookie);

    if (!user) {
      return NextResponse.json({ user: null });
    }

    // Fetch the latest user info from the database including all customization fields
    const [dbUser] = await sql`
      SELECT username, email, discord_id, discord_avatar, discord_access_token, typewriter_heading, typewriter_quotes, custom_links, active_badges, owned_badges,
        location, background_url, background_type, audios, audio_shuffle, audio_player_enabled, background_audio_enabled, discord_profile_transparency, onboarding_completed,
        role, banned_until, timeout_until, force_logout_at, display_name, google_id, enter_screen_text
      FROM users
      WHERE id = ${user.userId}
    `;

    if (!dbUser) {
      return NextResponse.json({ user: null });
    }

    // Check force logout
    if (dbUser.force_logout_at && user.issuedAt) {
      const forceLogoutTime = new Date(dbUser.force_logout_at).getTime();
      if (user.issuedAt < forceLogoutTime) {
        return NextResponse.json({ user: null });
      }
    }

    // Check ban or timeout
    const now = new Date();
    if (dbUser.banned_until && new Date(dbUser.banned_until) > now) {
      return NextResponse.json({ user: null, reason: "banned" });
    }
    if (dbUser.timeout_until && new Date(dbUser.timeout_until) > now) {
      return NextResponse.json({ user: null, reason: "timeout" });
    }

    // Backfill discord_avatar if the user has a discord_id but no stored avatar hash yet.
    // This runs once silently in the background — after the first backfill it will never run again.
    let discordAvatar = dbUser.discord_avatar;
    if (dbUser.discord_id && !dbUser.discord_avatar) {
      try {
        // Use the stored access token if available, otherwise fall back to the proxy
        let avatarHash: string | null = null;

        if (dbUser.discord_access_token) {
          const discordRes = await fetch("https://discord.com/api/v10/users/@me", {
            headers: { Authorization: `Bearer ${dbUser.discord_access_token}` },
            cache: "no-store",
          });
          if (discordRes.ok) {
            const discordUser = await discordRes.json();
            avatarHash = discordUser.avatar ?? null;
          }
        }

        if (!avatarHash) {
          // Fallback: use the public proxy (no auth needed)
          const proxyRes = await fetch(`https://dcdn.dstn.to/profile/${dbUser.discord_id}`, {
            cache: "no-store",
          });
          if (proxyRes.ok) {
            const proxyData = await proxyRes.json();
            avatarHash = proxyData?.user?.avatar ?? null;
          }
        }

        if (avatarHash) {
          discordAvatar = avatarHash;
          // Persist so we don't need to fetch again next time
          await sql`
            UPDATE users SET discord_avatar = ${avatarHash} WHERE id = ${user.userId}
          `;
        }
      } catch {
        // Non-fatal — avatar just won't show until next successful backfill
      }
    }

    return NextResponse.json({ 
      user: { 
        ...user,
        id: user.userId,
        discord_id: dbUser.discord_id,
        discord_avatar: discordAvatar,
        typewriter_heading: dbUser.typewriter_heading,
        typewriter_quotes: dbUser.typewriter_quotes,
        custom_links: dbUser.custom_links,
        active_badges: dbUser.active_badges,
        owned_badges: dbUser.owned_badges,
        location: dbUser.location,
        background_url: dbUser.background_url,
        background_type: dbUser.background_type,
        audios: dbUser.audios,
        audio_shuffle: dbUser.audio_shuffle,
        audio_player_enabled: dbUser.audio_player_enabled,
        background_audio_enabled: dbUser.background_audio_enabled,
        discord_profile_transparency: dbUser.discord_profile_transparency,
        onboarding_completed: dbUser.onboarding_completed,
        role: dbUser.role,
        display_name: dbUser.display_name ?? null,
        google_id: dbUser.google_id ?? null,
        enter_screen_text: dbUser.enter_screen_text,
      } 
    });
  } catch (error) {
    console.error("Get user session error:", error);
    return NextResponse.json({ user: null });
  }
}
