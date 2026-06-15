import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql, initDb } from "@/lib/db";
import { createToken } from "@/lib/session";
import { logSystemEvent } from "@/lib/logger";

export async function GET(request: Request) {
  try {
    await initDb();

    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username")?.trim().toLowerCase();
    const email = searchParams.get("email")?.trim().toLowerCase();

    if (!username && !email) {
      return NextResponse.json(
        { error: "Username or email is required." },
        { status: 400 }
      );
    }

    if (username) {
      if (username.length < 3) {
        return NextResponse.json({
          available: false,
          reason: "Username must be at least 3 characters.",
        });
      }

      if (!/^[a-z0-9_][a-z0-9_-]*$/.test(username)) {
        return NextResponse.json({
          available: false,
          reason: "Use lowercase letters, numbers, underscores, or hyphens.",
        });
      }

      const users = await sql`
        SELECT id FROM users
        WHERE LOWER(username) = LOWER(${username})
        LIMIT 1
      `;

      return NextResponse.json({
        available: users.length === 0,
        reason: users.length === 0 ? null : "Username is already taken.",
      });
    }

    if (email) {
      const users = await sql`
        SELECT id FROM users
        WHERE LOWER(email) = LOWER(${email})
        LIMIT 1
      `;

      return NextResponse.json({
        available: users.length === 0,
        reason: users.length === 0 ? null : "Email is already registered.",
      });
    }
  } catch (error: any) {
    console.error("Availability API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to check availability." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await initDb();
    const body = await request.json();
    const { username, email, password, otpCode } = body;

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Username, email, and password are required." }, { status: 400 });
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanUsername.length < 3) {
      return NextResponse.json({ error: "Username must be at least 3 characters long." }, { status: 400 });
    }

    if (!/^[a-z0-9_][a-z0-9_-]*$/.test(cleanUsername)) {
      return NextResponse.json({ error: "Username can only contain lowercase letters, numbers, underscores, and hyphens." }, { status: 400 });
    }

    if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    const existingUsers = await sql`
      SELECT id, username, email FROM users 
      WHERE LOWER(username) = ${cleanUsername} OR LOWER(email) = ${cleanEmail}
      LIMIT 1
    `;

    if (existingUsers.length > 0) {
      const existing = existingUsers[0];
      if (existing.username.toLowerCase() === cleanUsername) {
        return NextResponse.json({ error: "Username is already taken." }, { status: 400 });
      }
      if (existing.email.toLowerCase() === cleanEmail) {
        return NextResponse.json({ error: "Email is already registered." }, { status: 400 });
      }
    }

    // Step 1: No OTP provided, generate and send it
    if (!otpCode) {
      const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

      await sql`
        INSERT INTO otps (email, code, purpose, expires_at)
        VALUES (${cleanEmail}, ${code}, 'signup', ${expiresAt})
      `;

      // Import inline to avoid circular issues or top-level await issues
      const { sendOtpEmail } = await import("@/lib/email");
      await sendOtpEmail(cleanEmail, code, "signup");

      return NextResponse.json({ requiresOtp: true, message: "OTP sent to your email." });
    }

    // Step 2: OTP provided, verify it
    const validOtps = await sql`
      SELECT id FROM otps 
      WHERE email = ${cleanEmail} AND code = ${otpCode} AND purpose = 'signup' AND expires_at > NOW()
      ORDER BY created_at DESC
      LIMIT 1
    `;

    if (validOtps.length === 0) {
      return NextResponse.json({ error: "Invalid or expired OTP." }, { status: 400 });
    }

    await sql`DELETE FROM otps WHERE id = ${validOtps[0].id}`;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const insertedUsers = await sql`
      INSERT INTO users (username, email, password)
      VALUES (${cleanUsername}, ${cleanEmail}, ${hashedPassword})
      RETURNING id, username, email
    `;

    const newUser = insertedUsers[0];

    const token = createToken({
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
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

    logSystemEvent("user_signup", { ip: request.headers.get("x-forwarded-for") || "unknown" }, newUser.id);

    return response;
  } catch (error: any) {
    console.error("Signup API error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during signup." },
      { status: 500 }
    );
  }
}
