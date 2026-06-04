import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { checkOwnerAuth, unauthorizedResponse } from "@/lib/owner-auth";

export async function GET(request: Request) {
  try {
    const owner = await checkOwnerAuth();
    if (!owner) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim().toLowerCase() || "";
    
    let users;
    
    if (search) {
      users = await sql`
        SELECT id, username, email, role, created_at, banned_until, timeout_until, discord_id, discord_avatar
        FROM users
        WHERE LOWER(username) LIKE ${`%${search}%`} OR LOWER(email) LIKE ${`%${search}%`}
        ORDER BY id DESC
        LIMIT 50
      `;
    } else {
      users = await sql`
        SELECT id, username, email, role, created_at, banned_until, timeout_until, discord_id, discord_avatar
        FROM users
        ORDER BY id DESC
        LIMIT 50
      `;
    }

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error("Owner users fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
