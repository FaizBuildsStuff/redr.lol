import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { username, type } = await req.json();
    if (!username || !type)
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 },
      );

    const cleanUsername = username.trim().toLowerCase();

    // 1. Get user id
    const users =
      await sql`SELECT id FROM users WHERE LOWER(username) = ${cleanUsername}`;
    if (users.length === 0)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    const userId = users[0].id;

    if (type === "profile") {
      await sql`UPDATE users SET profile_clicks = profile_clicks + 1 WHERE id = ${userId}`;
      await sql`
        INSERT INTO daily_analytics (user_id, date, views, profile_clicks, link_clicks)
        VALUES (${userId}, CURRENT_DATE, 0, 1, 0)
        ON CONFLICT (user_id, date) DO UPDATE SET profile_clicks = daily_analytics.profile_clicks + 1
      `;
    } else if (type === "link") {
      await sql`UPDATE users SET link_clicks = link_clicks + 1, profile_clicks = profile_clicks + 1 WHERE id = ${userId}`;
      await sql`
        INSERT INTO daily_analytics (user_id, date, views, profile_clicks, link_clicks)
        VALUES (${userId}, CURRENT_DATE, 0, 1, 1)
        ON CONFLICT (user_id, date) DO UPDATE 
        SET link_clicks = daily_analytics.link_clicks + 1, profile_clicks = daily_analytics.profile_clicks + 1
      `;
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to increment clicks:", error);
    return NextResponse.json(
      { error: "Failed to increment clicks" },
      { status: 500 },
    );
  }
}
