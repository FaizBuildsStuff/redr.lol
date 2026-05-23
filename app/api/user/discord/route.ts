import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/session";
import { sql } from "@/lib/db";

/* SAVE DISCORD ID */
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();

    const sessionCookie =
      cookieStore.get("session")?.value;

    const user = verifyToken(sessionCookie);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
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

    const cookieStore = await cookies();

    const sessionCookie =
      cookieStore.get("session")?.value;

    const user = verifyToken(sessionCookie);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
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