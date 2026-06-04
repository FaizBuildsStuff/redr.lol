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
      SELECT username, email, discord_id, typewriter_heading, typewriter_quotes, custom_links, active_badges, owned_badges,
        location, background_url, background_type, audios, audio_shuffle, audio_player_enabled, background_audio_enabled, discord_profile_transparency, onboarding_completed,
        role, banned_until, timeout_until, force_logout_at
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

    return NextResponse.json({ 
      user: { 
        ...user, 
        discord_id: dbUser.discord_id,
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
      } 
    });
  } catch (error) {
    console.error("Get user session error:", error);
    return NextResponse.json({ user: null });
  }
}
