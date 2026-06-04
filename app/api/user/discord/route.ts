import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { checkUserAuth, unauthorizedResponse } from "@/lib/user-auth";

/* SAVE DISCORD ID */
export async function POST(req: Request) {
  try {
    const user = await checkUserAuth();
    if (!user || !user.userId) {
      return unauthorizedResponse();
    }

    const { discord_id } = await req.json();

    if (typeof discord_id !== "string") {
      return NextResponse.json(
        { error: "Invalid discord_id" },
        { status: 400 }
      );
    }

    await sql`
      UPDATE users
      SET discord_id = ${discord_id}
      WHERE id = ${user.userId}
    `;

    return NextResponse.json({
      success: true,
      discord_id,
    });

  } catch (error) {

    console.error(
      "Save discord id error:",
      error
    );

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/* DISCONNECT DISCORD */
export async function DELETE() {
  try {

    const user = await checkUserAuth();
    if (!user || !user.userId) {
      return unauthorizedResponse();
    }

    await sql`
      UPDATE users
      SET discord_id = NULL
      WHERE id = ${user.userId}
    `;

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(
      "Disconnect discord error:",
      error
    );

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}