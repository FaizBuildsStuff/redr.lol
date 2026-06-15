import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql, initDb } from "@/lib/db";
import { createToken } from "@/lib/session";
import { logSystemEvent } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    await initDb();
    const body = await request.json();
    const { email, password, otpCode } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    const users = await sql`
      SELECT id, username, email, password, banned_until, timeout_until FROM users 
      WHERE email = ${cleanEmail}
      LIMIT 1
    `;

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
    }

    const now = new Date();
    if (user.banned_until && new Date(user.banned_until) > now) {
      return NextResponse.json({ error: "This account has been banned." }, { status: 403 });
    }
    if (user.timeout_until && new Date(user.timeout_until) > now) {
      return NextResponse.json({ error: `This account is on timeout until ${new Date(user.timeout_until).toLocaleString()}.` }, { status: 403 });
    }

    const ENABLE_OTP = false; // 🔴 Set this to true to turn OTP back on!

    // Step 1: No OTP provided, generate and send it
    if (ENABLE_OTP && !otpCode) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      await sql`
        INSERT INTO otps (email, code, purpose, expires_at)
        VALUES (${cleanEmail}, ${code}, 'signin', ${expiresAt})
      `;

      const { sendOtpEmail } = await import("@/lib/email");
      await sendOtpEmail(cleanEmail, code, "signin");

      return NextResponse.json({ requiresOtp: true, message: "OTP sent to your email." });
    }

    // Step 2: OTP provided, verify it
    if (ENABLE_OTP && otpCode) {
      const validOtps = await sql`
        SELECT id FROM otps 
        WHERE email = ${cleanEmail} AND code = ${otpCode} AND purpose = 'signin' AND expires_at > NOW()
        ORDER BY created_at DESC
        LIMIT 1
      `;

      if (validOtps.length === 0) {
        return NextResponse.json({ error: "Invalid or expired OTP." }, { status: 400 });
      }

      await sql`DELETE FROM otps WHERE id = ${validOtps[0].id}`;
    }

    const token = createToken({
      userId: user.id,
      username: user.username,
      email: user.email,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    response.cookies.set("is_logged_in", "true", {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    logSystemEvent("user_signin", { ip: request.headers.get("x-forwarded-for") || "unknown" }, user.id);

    return response;
  } catch (error: any) {
    console.error("Signin API error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during signin." },
      { status: 500 }
    );
  }
}
