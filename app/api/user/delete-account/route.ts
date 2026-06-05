import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/session";
import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";

// DELETE /api/user/delete-account – permanently delete the current user's account
export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    const session = verifyToken(sessionCookie);

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { password, confirmText } = body;

    if (confirmText !== "DELETE") {
      return NextResponse.json({ error: "Please type DELETE to confirm." }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ error: "Password is required to delete your account." }, { status: 400 });
    }

    const [dbUser] = await sql`SELECT password FROM users WHERE id = ${session.userId}`;
    if (!dbUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, dbUser.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 400 });
    }

    // Delete the user (cascade will clean daily_analytics)
    await sql`DELETE FROM users WHERE id = ${session.userId}`;

    const response = NextResponse.json({ success: true, message: "Account deleted successfully." });

    // Clear session cookies
    response.cookies.set("session", "", { httpOnly: true, expires: new Date(0), path: "/" });
    response.cookies.set("is_logged_in", "", { expires: new Date(0), path: "/" });

    return response;
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
