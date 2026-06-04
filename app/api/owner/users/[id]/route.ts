import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { checkOwnerAuth, unauthorizedResponse } from "@/lib/owner-auth";
import { logSystemEvent } from "@/lib/logger";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const owner = await checkOwnerAuth();
    if (!owner) return unauthorizedResponse();

    const { id } = await params;
    
    const users = await sql`
      SELECT id, username, email, role, created_at, banned_until, timeout_until, force_logout_at
      FROM users
      WHERE id = ${Number(id)}
      LIMIT 1
    `;

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: users[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const owner = await checkOwnerAuth();
    if (!owner) return unauthorizedResponse();

    const { id } = await params;
    const body = await request.json();
    const targetUserId = Number(id);

    const { action, value } = body;

    let result;
    
    if (action === "role") {
      result = await sql`UPDATE users SET role = ${value} WHERE id = ${targetUserId} RETURNING id, username`;
      await logSystemEvent("change_role", { oldRole: null, newRole: value }, owner.id, targetUserId);
    } else if (action === "ban") {
      const banDate = value ? new Date(Date.now() + value * 24 * 60 * 60 * 1000).toISOString() : null; // value in days
      result = await sql`UPDATE users SET banned_until = ${banDate} WHERE id = ${targetUserId} RETURNING id`;
      await logSystemEvent("ban_user", { durationDays: value }, owner.id, targetUserId);
    } else if (action === "timeout") {
      const timeoutDate = value ? new Date(Date.now() + value * 60 * 1000).toISOString() : null; // value in minutes
      result = await sql`UPDATE users SET timeout_until = ${timeoutDate} WHERE id = ${targetUserId} RETURNING id`;
      await logSystemEvent("timeout_user", { durationMinutes: value }, owner.id, targetUserId);
    } else if (action === "kick") {
      result = await sql`UPDATE users SET force_logout_at = CURRENT_TIMESTAMP WHERE id = ${targetUserId} RETURNING id`;
      await logSystemEvent("kick_user", {}, owner.id, targetUserId);
    }

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
