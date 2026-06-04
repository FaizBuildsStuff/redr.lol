import { cookies } from "next/headers";
import { verifyToken } from "@/lib/session";
import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function checkOwnerAuth() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = verifyToken(sessionCookie);

  if (!session) {
    return null;
  }

  // Fetch from DB to ensure role hasn't changed recently and no force logout
  const [dbUser] = await sql`
    SELECT id, role, force_logout_at, banned_until FROM users WHERE id = ${session.userId} LIMIT 1
  `;

  if (!dbUser) return null;

  if (dbUser.force_logout_at && session.issuedAt) {
    const forceLogoutTime = new Date(dbUser.force_logout_at).getTime();
    if (session.issuedAt < forceLogoutTime) {
      return null;
    }
  }

  const now = new Date();
  if (dbUser.banned_until && new Date(dbUser.banned_until) > now) {
    return null;
  }

  if (dbUser.role !== "owner") {
    return null;
  }

  return dbUser;
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
}
