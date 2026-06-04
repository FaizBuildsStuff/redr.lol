import { NextRequest, NextResponse } from "next/server";
import { checkUserAuth, unauthorizedResponse } from "@/lib/user-auth";
import { sql } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {

    const user = await checkUserAuth();
    if (!user || !user.userId) return unauthorizedResponse();

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