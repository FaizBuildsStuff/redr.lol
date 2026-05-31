import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(req: Request, { params }: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await params;
    const cleanUsername = decodeURIComponent(username).trim().toLowerCase();

    const users = await sql`
      SELECT views
      FROM users 
      WHERE LOWER(username) = ${cleanUsername}
      LIMIT 1
    `;

    if (users.length === 0) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ views: users[0].views });
  } catch (error) {
    console.error("Failed to fetch user stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
