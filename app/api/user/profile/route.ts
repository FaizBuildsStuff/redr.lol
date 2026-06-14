import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { checkUserAuth, unauthorizedResponse } from "@/lib/user-auth";

export async function PATCH(req: NextRequest) {
  try {
    const user = await checkUserAuth();
    if (!user || !user.userId) {
      return unauthorizedResponse();
    }

    const body = await req.json();
    const userId = user.userId;
    let hasUpdates = false;

    await sql`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS alias VARCHAR(100) DEFAULT NULL
    `.catch(() => null);

    // Run individual tagged-template updates for each provided field.
    // The neon driver requires tagged template syntax — raw function calls don't work reliably.

    if (body.typewriter_heading !== undefined) {
      await sql`
        UPDATE users SET typewriter_heading = ${body.typewriter_heading}
        WHERE id = ${userId}
      `;
      hasUpdates = true;
    }

    if (body.typewriter_quotes !== undefined) {
      const quotesJson = JSON.stringify(body.typewriter_quotes);
      await sql`
        UPDATE users SET typewriter_quotes = ${quotesJson}::jsonb
        WHERE id = ${userId}
      `;
      hasUpdates = true;
    }

    if (body.custom_links !== undefined) {
      const linksJson = JSON.stringify(body.custom_links);
      await sql`
        UPDATE users SET custom_links = ${linksJson}::jsonb
        WHERE id = ${userId}
      `;
      hasUpdates = true;
    }

    if (body.active_badges !== undefined) {
      const badgesJson = JSON.stringify(body.active_badges);
      await sql`
        UPDATE users SET active_badges = ${badgesJson}::jsonb
        WHERE id = ${userId}
      `;
      hasUpdates = true;
    }

    if (body.theme !== undefined) {
      await sql`
        UPDATE users SET theme = ${body.theme}
        WHERE id = ${userId}
      `;
      hasUpdates = true;
    }

    if (body.music_active !== undefined) {
      await sql`
        UPDATE users SET music_active = ${body.music_active}
        WHERE id = ${userId}
      `;
      hasUpdates = true;
    }

    if (body.sparkles_active !== undefined) {
      await sql`
        UPDATE users SET sparkles_active = ${body.sparkles_active}
        WHERE id = ${userId}
      `;
      hasUpdates = true;
    }

    if (body.custom_font !== undefined) {
      await sql`
        UPDATE users SET custom_font = ${body.custom_font}
        WHERE id = ${userId}
      `;
      hasUpdates = true;
    }

    if (body.discord_profile_transparency !== undefined) {
      await sql`
        UPDATE users SET discord_profile_transparency = ${body.discord_profile_transparency}
        WHERE id = ${userId}
      `;
      hasUpdates = true;
    }

    if (body.enter_screen_text !== undefined) {
      await sql`
        UPDATE users SET enter_screen_text = ${body.enter_screen_text}
        WHERE id = ${userId}
      `;
      hasUpdates = true;
    }

    if (body.custom_cursor_url !== undefined) {
      await sql`
        UPDATE users SET custom_cursor_url = ${body.custom_cursor_url}
        WHERE id = ${userId}
      `;
      hasUpdates = true;
    }

    if (body.alias !== undefined) {
      const cleanAlias = typeof body.alias === "string" ? body.alias.trim().toLowerCase() : "";
      if (cleanAlias && !/^[a-z0-9_][a-z0-9_-]*$/.test(cleanAlias)) {
        return NextResponse.json(
          { error: "Alias can only contain lowercase letters, numbers, underscores, and hyphens." },
          { status: 400 }
        );
      }

      await sql`
        UPDATE users SET alias = ${cleanAlias || null}
        WHERE id = ${userId}
      `;
      hasUpdates = true;
    }

    if (!hasUpdates) {
      return NextResponse.json({ message: "No updates provided" });
    }

    // Return the updated user row
    const [updated] = await sql`
      SELECT id, username, email, alias, typewriter_heading, typewriter_quotes,
             custom_links, active_badges, theme, music_active, sparkles_active, custom_font, discord_profile_transparency, enter_screen_text, custom_cursor_url
      FROM users
      WHERE id = ${userId}
    `;

    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: updated });

  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
