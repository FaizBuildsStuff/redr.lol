import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 });
  }

  try {
    const users = await sql`SELECT * FROM users WHERE username = ${username} LIMIT 1`;
    if (!users || users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[0];
    if (!user.discord_id) {
      return NextResponse.json({ error: "No Discord connected" }, { status: 404 });
    }

    // Fetch user profile and connections directly from Discord if access token is available
    let profileData = null;
    let connections = [];

    if (user.discord_access_token) {
      try {
        const profileRes = await fetch("https://discord.com/api/v10/users/@me", {
          headers: { Authorization: `Bearer ${user.discord_access_token}` }
        });
        if (profileRes.ok) {
          profileData = await profileRes.json();
        }
      } catch (e) {
        console.error("Failed to fetch proxy profile", e);
      }

      try {
        const connRes = await fetch("https://discord.com/api/v10/users/@me/connections", {
          headers: { Authorization: `Bearer ${user.discord_access_token}` }
        });
        if (connRes.ok) {
          connections = await connRes.json();
        }
      } catch (e) {
        console.error("Failed to fetch connections", e);
      }
    }

    return NextResponse.json({
      success: true,
      discord_user: profileData,
      connections: connections,
    });
  } catch (error) {
    console.error("Error in discord-profile API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
