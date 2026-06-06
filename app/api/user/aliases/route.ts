import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/session";

// Ensure aliases table exists
async function ensureAliasTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS aliases (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      alias VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await sql`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS alias_credits INTEGER DEFAULT 0
  `.catch(() => null);
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = verifyToken(cookieStore.get("session")?.value);
    if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await ensureAliasTable();

    const [userRow] = await sql`SELECT alias_credits FROM users WHERE id = ${session.userId}`;
    const aliases = await sql`SELECT id, alias, created_at FROM aliases WHERE user_id = ${session.userId} ORDER BY created_at ASC`;

    return NextResponse.json({
      aliases,
      credits: userRow?.alias_credits ?? 0,
    });
  } catch (err: any) {
    console.error("GET /api/user/aliases error:", err);
    return NextResponse.json({ error: "Failed to fetch aliases" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = verifyToken(cookieStore.get("session")?.value);
    if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await ensureAliasTable();

    const { alias } = await req.json();
    const cleanAlias = alias?.trim().toLowerCase();

    if (!cleanAlias || cleanAlias.length < 3) {
      return NextResponse.json({ error: "Alias must be at least 3 characters." }, { status: 400 });
    }
    if (!/^[a-z0-9_][a-z0-9_-]*$/.test(cleanAlias)) {
      return NextResponse.json({ error: "Alias can only contain lowercase letters, numbers, underscores, and hyphens." }, { status: 400 });
    }

    // Check credits
    const [userRow] = await sql`SELECT alias_credits, role FROM users WHERE id = ${session.userId}`;
    const credits = userRow?.alias_credits ?? 0;

    // Check existing aliases count (free users: max 1, premium: max 5)
    const [countRow] = await sql`SELECT COUNT(*) as count FROM aliases WHERE user_id = ${session.userId}`;
    const currentCount = parseInt(countRow?.count ?? "0");
    const maxSlots = userRow?.role === "premium" || userRow?.role === "owner" ? 5 : 1;

    if (currentCount >= maxSlots && credits <= 0) {
      return NextResponse.json({ error: "No alias slots available. Upgrade to Premium or buy more credits." }, { status: 400 });
    }

    // Check if alias conflicts with existing username
    const [existingUser] = await sql`SELECT id FROM users WHERE LOWER(username) = LOWER(${cleanAlias})`;
    if (existingUser) return NextResponse.json({ error: "This alias is already taken by an existing username." }, { status: 400 });

    // Check if alias already exists
    const [existingAlias] = await sql`SELECT id FROM aliases WHERE alias = ${cleanAlias}`;
    if (existingAlias) return NextResponse.json({ error: "This alias is already taken." }, { status: 400 });

    // Deduct a credit if over free slots
    if (currentCount >= maxSlots) {
      await sql`UPDATE users SET alias_credits = alias_credits - 1 WHERE id = ${session.userId}`;
    }

    await sql`INSERT INTO aliases (user_id, alias) VALUES (${session.userId}, ${cleanAlias})`;

    return NextResponse.json({ success: true, message: "Alias created successfully." });
  } catch (err: any) {
    console.error("POST /api/user/aliases error:", err);
    return NextResponse.json({ error: "Failed to create alias" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = verifyToken(cookieStore.get("session")?.value);
    if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Alias ID required." }, { status: 400 });

    await sql`DELETE FROM aliases WHERE id = ${id} AND user_id = ${session.userId}`;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/user/aliases error:", err);
    return NextResponse.json({ error: "Failed to delete alias" }, { status: 500 });
  }
}
