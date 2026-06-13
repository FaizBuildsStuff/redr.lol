import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { checkUserAuth, unauthorizedResponse } from "@/lib/user-auth";

export async function GET() {
  try {
    const user = await checkUserAuth();
    if (!user || !user.userId) {
      return unauthorizedResponse();
    }

    const profiles = await sql`
      SELECT
        id,
        username,
        alias,
        typewriter_heading,
        typewriter_quotes,
        location,
        background_url,
        background_type,
        discord_profile_transparency,
        enter_screen_text,
        created_at
      FROM users
      WHERE id <> ${user.userId}
      ORDER BY created_at DESC
      LIMIT 20
    `;

    return NextResponse.json({ users: profiles });
  } catch (error) {
    console.error("Failed to load profile templates:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
