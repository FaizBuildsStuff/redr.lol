import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const { username } = await req.json();
    if (!username) return NextResponse.json({ error: "Missing username" }, { status: 400 });

    const cleanUsername = username.trim().toLowerCase();

    // Get headers
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    const referer = headersList.get("referer") || "";

    // Parse Device
    let deviceType = "desktop";
    if (/mobile/i.test(userAgent)) deviceType = "mobile";
    else if (/ipad|tablet/i.test(userAgent)) deviceType = "tablet";

    // Parse Referrer
    let referrerDomain = "direct";
    if (referer) {
      try {
        const url = new URL(referer);
        referrerDomain = url.hostname.replace('www.', '');
      } catch (e) {
        referrerDomain = "unknown";
      }
    }

    // 1. Get user id
    const users = await sql`SELECT id FROM users WHERE LOWER(username) = ${cleanUsername}`;
    if (users.length === 0) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const userId = users[0].id;

    // 2. Update users total views, devices, referrers
    await sql`
      UPDATE users 
      SET 
        views = views + 1,
        devices = COALESCE(devices, '{"desktop": 0, "mobile": 0, "tablet": 0}'::jsonb) || 
                  jsonb_build_object(${deviceType}::text, COALESCE((devices->>${deviceType})::int, 0) + 1),
        referrers = COALESCE(referrers, '{}'::jsonb) || 
                    jsonb_build_object(${referrerDomain}::text, COALESCE((referrers->>${referrerDomain})::int, 0) + 1)
      WHERE id = ${userId}
    `;

    // 3. Upsert daily_analytics
    await sql`
      INSERT INTO daily_analytics (user_id, date, views, profile_clicks, link_clicks)
      VALUES (${userId}, CURRENT_DATE, 1, 0, 0)
      ON CONFLICT (user_id, date) DO UPDATE 
      SET views = daily_analytics.views + 1
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to increment views:", error);
    return NextResponse.json({ error: "Failed to increment views" }, { status: 500 });
  }
}
