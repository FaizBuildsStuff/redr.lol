import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { checkOwnerAuth, unauthorizedResponse } from "@/lib/owner-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const owner = await checkOwnerAuth();
    if (!owner) return unauthorizedResponse();

    const logs = await sql`
      SELECT sl.id, sl.action, sl.details, sl.created_at, 
             u1.username AS actor_username, 
             u2.username AS target_username
      FROM system_logs sl
      LEFT JOIN users u1 ON sl.actor_id = u1.id
      LEFT JOIN users u2 ON sl.target_id = u2.id
      ORDER BY sl.id DESC
      LIMIT 100
    `;

    return NextResponse.json({ logs });
  } catch (error: any) {
    console.error("Owner logs fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
