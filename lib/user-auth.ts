import { cookies } from "next/headers";
import { verifyToken, UserSession } from "@/lib/session";
import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * Checks authentication for standard user routes.
 * Verifies the JWT signature AND checks the database to ensure
 * the user has not been banned, timed out, or force logged out.
 */
export async function checkUserAuth(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = verifyToken(sessionCookie);

  if (!session) {
    return null;
  }

  // Fetch from DB to ensure no force logout, ban, or timeout
  const [dbUser] = await sql`
    SELECT id, force_logout_at, banned_until, timeout_until FROM users WHERE id = ${session.userId} LIMIT 1
  `;

  if (!dbUser) return null;

  // If force logout timestamp is newer than when the token was issued, reject
  if (dbUser.force_logout_at && session.issuedAt) {
    const forceLogoutTime = new Date(dbUser.force_logout_at).getTime();
    if (session.issuedAt < forceLogoutTime) {
      return null;
    }
  }

  // If currently banned or timed out, reject
  const now = new Date();
  if (dbUser.banned_until && new Date(dbUser.banned_until) > now) {
    return null;
  }
  if (dbUser.timeout_until && new Date(dbUser.timeout_until) > now) {
    return null;
  }

  return session;
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
