import { NextRequest, NextResponse } from "next/server";
import { checkUserAuth, unauthorizedResponse } from "@/lib/user-auth";
import { sql } from "@/lib/db";

/* SAVE BACKGROUND */
export async function POST(
  req: NextRequest
) {
  try {

    const user = await checkUserAuth();
    if (!user || !user.userId) return unauthorizedResponse();

    const {
      background_url,
      background_type,
      background_audio_enabled,
    } = await req.json();

    let result;
    if (background_audio_enabled !== undefined) {
      result = await sql`
        UPDATE users

        SET
          background_url = ${background_url},
          background_type = ${background_type},
          background_audio_enabled = ${background_audio_enabled}
        WHERE id = ${user.userId}
        RETURNING *;
      `;
    } else {
      result = await sql`
        UPDATE users

        SET
          background_url = ${background_url},
          background_type = ${background_type}
        WHERE id = ${user.userId}
        RETURNING *;
      `;
    }

    if (
      !result ||
      result.length === 0
    ) {
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
      "Background upload error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update background",
      },
      { status: 500 }
    );
  }
}

/* TOGGLE VIDEO AUDIO */
export async function PATCH(
  req: NextRequest
) {
  try {
    const user = await checkUserAuth();
    if (!user || !user.userId) return unauthorizedResponse();

    const { background_audio_enabled } = await req.json();

    const result = await sql`
      UPDATE users

      SET
        background_audio_enabled = ${background_audio_enabled}
      WHERE id = ${user.userId}
      RETURNING *;
    `;

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: result[0] });
  } catch (error) {
    console.error("Background audio toggle error:", error);
    return NextResponse.json({ error: "Failed to update background audio state" }, { status: 500 });
  }
}

/* REMOVE BACKGROUND */
export async function DELETE(
  req: NextRequest
) {
  try {

    const user = await checkUserAuth();
    if (!user || !user.userId) return unauthorizedResponse();

    const result = await sql`
      UPDATE users

      SET
        background_url = NULL,
        background_type = NULL,
        background_audio_enabled = false

      WHERE id =
        ${user.userId}

      RETURNING *;
    `;

    if (
      !result ||
      result.length === 0
    ) {
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
      "Background delete error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete background",
      },
      { status: 500 }
    );
  }
}