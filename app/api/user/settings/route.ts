import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyToken, createToken } from "@/lib/session";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    const session = verifyToken(sessionCookie);

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { username, email, currentPassword, newPassword } = body;

    const cleanUsername = username?.trim().toLowerCase();
    const cleanEmail = email?.trim().toLowerCase();

    if (!cleanUsername || !cleanEmail) {
      return NextResponse.json({ error: "Username and email are required." }, { status: 400 });
    }

    if (cleanUsername.length < 3) {
      return NextResponse.json({ error: "Username must be at least 3 characters long." }, { status: 400 });
    }

    if (!/^[a-z0-9_][a-z0-9_-]*$/.test(cleanUsername)) {
      return NextResponse.json(
        { error: "Username can only contain lowercase letters, numbers, underscores, and hyphens." },
        { status: 400 }
      );
    }

    if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    // Check if the username or email is already taken by someone else
    const existingUsers = await sql`
      SELECT id, username, email FROM users 
      WHERE (username = ${cleanUsername} OR email = ${cleanEmail}) AND id != ${session.userId}
    `;

    for (const existing of existingUsers) {
      if (existing.username === cleanUsername) {
        return NextResponse.json({ error: "Username is already taken." }, { status: 400 });
      }
      if (existing.email === cleanEmail) {
        return NextResponse.json({ error: "Email is already registered by another account." }, { status: 400 });
      }
    }

    const [currentUser] = await sql`SELECT password FROM users WHERE id = ${session.userId}`;

    let finalPasswordHash = currentUser.password;

    // Handle password change if newPassword is provided
    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json({ error: "New password must be at least 6 characters long." }, { status: 400 });
      }
      
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password is required to set a new password." }, { status: 400 });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, currentUser.password);
      if (!isPasswordValid) {
        return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
      }

      const salt = await bcrypt.genSalt(10);
      finalPasswordHash = await bcrypt.hash(newPassword, salt);
    }

    // Update the database
    await sql`
      UPDATE users 
      SET 
        username = ${cleanUsername},
        email = ${cleanEmail},
        password = ${finalPasswordHash}
      WHERE id = ${session.userId}
    `;

    // Create a new session token since username/email might have changed
    const newToken = createToken({
      userId: session.userId,
      username: cleanUsername,
      email: cleanEmail,
    });

    const response = NextResponse.json({
      success: true,
      message: "Settings updated successfully."
    });

    response.cookies.set("session", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;

  } catch (error: any) {
    console.error("Settings API Error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred while updating settings." },
      { status: 500 }
    );
  }
}
