import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyToken } from "@/lib/session";
import { cookies } from "next/headers";

// GET /api/help/admin/articles — owner only, returns ALL articles including drafts
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const user = verifyToken(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [dbUser] = await sql`SELECT role FROM users WHERE id = ${user.userId} LIMIT 1`;
  if (!dbUser || dbUser.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const rows = await sql`
      SELECT * FROM help_articles
      ORDER BY category ASC, created_at ASC
    `;
    return NextResponse.json({ articles: rows });
  } catch (err) {
    console.error("GET /api/help/admin/articles error:", err);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}
