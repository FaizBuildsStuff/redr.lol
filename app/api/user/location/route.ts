import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/session";
import { sql } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {

    /* SESSION */
    const sessionCookie =
      req.cookies.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /* VERIFY USER */
    const user = verifyToken(sessionCookie);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    /* BODY */
    const { location } = await req.json();

    /* UPDATE USER */
    const result = await sql`
      UPDATE users
      SET location = ${location}
      WHERE id = ${user.userId}
      RETURNING *;
    `;

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: result[0],
    });

  } catch (error) {

    console.error(
      "Location update error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to update location" },
      { status: 500 }
    );
  }
}