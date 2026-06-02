import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyToken } from "@/lib/session";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    const user = verifyToken(sessionCookie);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json().catch(() => ({}));

    // Update the completion flag
    await sql`
      UPDATE users 
      SET
        onboarding_completed = true,
        onboarding_discovery_source = ${data.discoverySource || null},
        onboarding_discovery_other = ${data.discoveryOther || null},
        onboarding_planned_use = ${data.plannedUse || null},
        onboarding_planned_use_other = ${data.plannedUseOther || null}
      WHERE id = ${user.userId}
    `;

    // Optionally update other fields if provided
    if (data.customLinks) {
       await sql`UPDATE users SET custom_links = ${JSON.stringify(data.customLinks)}::jsonb WHERE id = ${user.userId}`;
    }
    if (data.audioPlayerEnabled !== undefined) {
       await sql`UPDATE users SET audio_player_enabled = ${data.audioPlayerEnabled} WHERE id = ${user.userId}`;
    }
    if (data.backgroundAudioEnabled !== undefined) {
       await sql`UPDATE users SET background_audio_enabled = ${data.backgroundAudioEnabled} WHERE id = ${user.userId}`;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Onboarding completion error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
