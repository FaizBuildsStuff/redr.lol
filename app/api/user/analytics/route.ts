import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { checkUserAuth, unauthorizedResponse } from "@/lib/user-auth";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const session = await checkUserAuth();

    if (!session || !session.userId) {
      return unauthorizedResponse();
    }

    const users = await sql`
      SELECT views, profile_clicks, link_clicks, devices, referrers
      FROM users 
      WHERE id = ${session.userId}
      LIMIT 1
    `;

    if (users.length === 0) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const user = users[0];
    
    // Calculate CTR
    let ctr = 0;
    if (user.views > 0) {
      ctr = Math.round((user.link_clicks / user.views) * 100);
    }

    // Fetch daily graph data (last 12 days)
    const dailyData = await sql`
      SELECT date, views, profile_clicks, link_clicks
      FROM daily_analytics
      WHERE user_id = ${session.userId}
      ORDER BY date DESC
      LIMIT 12
    `;

    return NextResponse.json({
      views: user.views,
      profile_clicks: user.profile_clicks,
      link_clicks: user.link_clicks,
      link_ctr: ctr,
      devices: user.devices || { desktop: 0, mobile: 0, tablet: 0 },
      referrers: user.referrers || {},
      graph_data: dailyData.reverse() // Chronological order
    });
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
