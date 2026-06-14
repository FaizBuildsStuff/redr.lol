import { NextRequest, NextResponse } from "next/server";
import { checkUserAuth, unauthorizedResponse } from "@/lib/user-auth";
import { sql } from "@/lib/db";

interface Audio {
  id: string;
  url: string;
  name: string;
}

/* ADD AUDIO */
export async function POST(req: NextRequest) {
  try {

    const user = await checkUserAuth();
    if (!user || !user.userId) return unauthorizedResponse();

    const {
      audio_url,
      audio_name,
      shuffle,
      player_enabled,
    } = await req.json();

    /* GET CURRENT AUDIOS */
    const currentUser = await sql`
      SELECT audios
      FROM users
      WHERE id = ${user.userId}
    `;

    if (
      !currentUser ||
      currentUser.length === 0
    ) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const currentAudios: Audio[] =
      currentUser[0].audios || [];

    /* LIMIT */
    if (currentAudios.length >= 4) {
      return NextResponse.json(
        {
          error:
            "Maximum 4 audios allowed",
        },
        { status: 400 }
      );
    }

    /* NEW AUDIO */
    const newAudio: Audio = {
      id: Date.now().toString(),
      url: audio_url,
      name:
        audio_name ||
        `Audio ${currentAudios.length + 1}`,
    };

    currentAudios.push(newAudio);

    /* UPDATE */
    const result = await sql`
      UPDATE users
      SET
        audios = ${JSON.stringify(
          currentAudios
        )}::jsonb,

        audio_shuffle =
          ${
            shuffle !== undefined
              ? shuffle
              : false
          },

        audio_player_enabled =
          ${
            player_enabled !== undefined
              ? player_enabled
              : true
          }

      WHERE id = ${user.userId}

      RETURNING *;
    `;

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "Failed to update" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: result[0],
    });

  } catch (error) {

    console.error(
      "Audio upload error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to add audio" },
      { status: 500 }
    );
  }
}

/* DELETE AUDIO */
export async function DELETE(
  req: NextRequest
) {
  try {

    const user = await checkUserAuth();
    if (!user || !user.userId) return unauthorizedResponse();

    const { audioId } =
      await req.json();

    /* GET CURRENT AUDIOS */
    const currentUser = await sql`
      SELECT audios
      FROM users
      WHERE id = ${user.userId}
    `;

    if (
      !currentUser ||
      currentUser.length === 0
    ) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const currentAudios: Audio[] =
      currentUser[0].audios || [];

    const filteredAudios =
      currentAudios.filter(
        (a) => a.id !== audioId
      );

    /* UPDATE */
    const result = await sql`
      UPDATE users
      SET
        audios = ${JSON.stringify(
          filteredAudios
        )}::jsonb

      WHERE id = ${user.userId}

      RETURNING *;
    `;

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "Failed to update" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: result[0],
    });

  } catch (error) {

    console.error(
      "Audio delete error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to delete audio" },
      { status: 500 }
    );
  }
}

/* UPDATE SETTINGS */
export async function PATCH(
  req: NextRequest
) {
  try {

    const user = await checkUserAuth();
    if (!user || !user.userId) return unauthorizedResponse();

    const {
      shuffle,
      player_enabled,
      active_audio_id,
    } = await req.json();

    const result = await sql`
      UPDATE users
      SET
        audio_shuffle = COALESCE(${shuffle}, audio_shuffle),
        audio_player_enabled = COALESCE(${player_enabled}, audio_player_enabled),
        active_audio_id = COALESCE(${active_audio_id}, active_audio_id)
      WHERE id = ${user.userId}
      RETURNING *;
    `;

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "Failed to update" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: result[0],
    });

  } catch (error) {

    console.error(
      "Audio settings error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update settings",
      },
      { status: 500 }
    );
  }
}