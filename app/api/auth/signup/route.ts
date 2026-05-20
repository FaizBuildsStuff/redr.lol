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
    const { username, email, password } = body;

    // 3. Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email, and password are required." },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanUsername.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters long." },
        { status: 400 }
      );
    }

    if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // 4. Check if email or username is already taken
    const existingUsers = await sql`
      SELECT id, username, email FROM users 
      WHERE username = ${cleanUsername} OR email = ${cleanEmail}
      LIMIT 1
    `;

    if (existingUsers.length > 0) {
      const existing = existingUsers[0];
      if (existing.username === cleanUsername) {
        return NextResponse.json(
          { error: "Username is already taken." },
          { status: 400 }
        );
      }
      if (existing.email === cleanEmail) {
        return NextResponse.json(
          { error: "Email is already registered." },
          { status: 400 }
        );
      }
    }

    // 5. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 6. Insert new user into Neon DB
    const insertedUsers = await sql`
      INSERT INTO users (username, email, password)
      VALUES (${cleanUsername}, ${cleanEmail}, ${hashedPassword})
      RETURNING id, username, email
    `;

    const newUser = insertedUsers[0];

    // 7. Create Session Token
    const token = createToken({
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
    });

    // 8. Return response with cookies set
    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
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
    console.error("Signup API error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during signup." },
      { status: 500 }
    );
  }
}
