import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql, initDb } from "@/lib/db";
import { createToken } from "@/lib/session";

export async function POST(request: Request) {
  try {
    // 1. Ensure the database schema exists
    await initDb();

    // 2. Parse request body
    const body = await request.json();
    const { email, password } = body;

    // 3. Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 4. Fetch the user from Neon DB
    const users = await sql`
      SELECT id, username, email, password FROM users 
      WHERE email = ${cleanEmail}
      LIMIT 1
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 400 }
      );
    }

    const user = users[0];

    // 5. Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 400 }
      );
    }

    // 6. Create Session Token
    const token = createToken({
      userId: user.id,
      username: user.username,
      email: user.email,
    });

    // 7. Return response with cookies set
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });

    // HttpOnly Cookie for secure session
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    // Client-accessible cookie for instant front-end logged-in checks
    response.cookies.set("is_logged_in", "true", {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    return response;
  } catch (error: any) {
    console.error("Signin API error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during signin." },
      { status: 500 }
    );
  }
}
