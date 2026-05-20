import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/session";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    const user = verifyToken(sessionCookie);

    if (!user) {
      return NextResponse.json({ user: null });
    }

    // Fetch the latest user info from the database to include discord_id
    const [dbUser] = await sql`
      SELECT username, email, discord_id
      FROM users
      WHERE id = ${user.userId}
    `;

    if (!dbUser) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ 
      user: { 
        ...user, 
        discord_id: dbUser.discord_id 
      } 
    });
  } catch (error) {
    console.error("Get user session error:", error);
    return NextResponse.json({ user: null });
  }
}
