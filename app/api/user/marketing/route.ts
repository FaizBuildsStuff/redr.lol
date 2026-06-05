import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/session";
import { sql } from "@/lib/db";

// PATCH /api/user/marketing – toggle email marketing preference
export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    const session = verifyToken(sessionCookie);

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { emailUpdates } = body;

    // Ensure column exists
    await sql`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS email_marketing BOOLEAN DEFAULT true
    `.catch(() => null);

    await sql`
      UPDATE users SET email_marketing = ${!!emailUpdates} WHERE id = ${session.userId}
    `;

    return NextResponse.json({ success: true, emailUpdates: !!emailUpdates });
  } catch (error) {
    console.error("Marketing PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/user/marketing – get email marketing preference
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    const session = verifyToken(sessionCookie);

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await sql`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS email_marketing BOOLEAN DEFAULT true
    `.catch(() => null);

    const [dbUser] = await sql`
      SELECT email_marketing FROM users WHERE id = ${session.userId}
    `;

    return NextResponse.json({ emailUpdates: dbUser?.email_marketing ?? true });
  } catch (error) {
    console.error("Marketing GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
