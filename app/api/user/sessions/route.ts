import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, createToken } from "@/lib/session";
import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";

// GET /api/user/sessions – return info about the current session
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    const session = verifyToken(sessionCookie);

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [dbUser] = await sql`
      SELECT id, username, email, created_at FROM users WHERE id = ${session.userId}
    `;

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return a single "current session" representation
    const now = Date.now();
    const sessionData = {
      id: "current",
      device: "Current Session",
      browser: "Active Browser",
      location: "Current Device",
      issuedAt: session.issuedAt ?? now,
      isCurrent: true,
    };

    return NextResponse.json({ sessions: [sessionData] });
  } catch (error) {
    console.error("Sessions GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/user/sessions – sign out all sessions (force logout) by resetting force_logout_at
export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    const session = verifyToken(sessionCookie);

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { password } = body;

    if (password) {
      const [dbUser] = await sql`SELECT password FROM users WHERE id = ${session.userId}`;
      const valid = await bcrypt.compare(password, dbUser.password);
      if (!valid) {
        return NextResponse.json({ error: "Incorrect password." }, { status: 400 });
      }
    }

    // Invalidate all sessions by setting force_logout_at to now
    await sql`
      UPDATE users SET force_logout_at = NOW() WHERE id = ${session.userId}
    `;

    // Immediately reissue a new session for the current user so they stay logged in
    const newToken = createToken({
      userId: session.userId,
      username: session.username,
      email: session.email,
    });

    const response = NextResponse.json({ success: true, message: "All other sessions have been invalidated." });
    response.cookies.set("session", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Sessions DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
