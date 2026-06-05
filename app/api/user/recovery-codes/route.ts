import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/session";
import { sql } from "@/lib/db";
import crypto from "crypto";

function generateRecoveryCodes(count = 8): string[] {
  return Array.from({ length: count }, () => {
    const part1 = crypto.randomBytes(4).toString("hex").toUpperCase();
    const part2 = crypto.randomBytes(4).toString("hex").toUpperCase();
    return `${part1}-${part2}`;
  });
}

// GET – fetch existing recovery codes (or show masked)
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    const session = verifyToken(sessionCookie);

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [dbUser] = await sql`
      SELECT recovery_codes FROM users WHERE id = ${session.userId}
    `.catch(() => [null]);

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const codes = dbUser?.recovery_codes ?? null;
    return NextResponse.json({ hasCodes: !!codes, count: codes ? codes.length : 0 });
  } catch (error) {
    console.error("Recovery codes GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST – generate new recovery codes (requires password confirmation)
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    const session = verifyToken(sessionCookie);

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newCodes = generateRecoveryCodes(8);

    // Store as JSONB – add column if not exists via ALTER (idempotent)
    await sql`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS recovery_codes JSONB DEFAULT NULL
    `.catch(() => null); // ignore if already exists

    await sql`
      UPDATE users SET recovery_codes = ${JSON.stringify(newCodes)}::jsonb WHERE id = ${session.userId}
    `;

    return NextResponse.json({ success: true, codes: newCodes });
  } catch (error) {
    console.error("Recovery codes POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
