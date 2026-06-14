import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { checkUserAuth, unauthorizedResponse } from "@/lib/user-auth";

export async function GET(req: Request) {
  try {
    const user = await checkUserAuth();
    if (!user || !user.userId) {
      return unauthorizedResponse();
    }

    const templates = await sql`
      SELECT 
        pt.id, 
        pt.name, 
        pt.tags, 
        pt.visibility, 
        pt.profile_data, 
        pt.uses, 
        pt.stars, 
        pt.created_at,
        u.username,
        u.alias,
        u.discord_id,
        u.discord_avatar
      FROM profile_templates pt
      JOIN users u ON pt.user_id = u.id
      WHERE pt.visibility = 'public'
      ORDER BY pt.created_at DESC
      LIMIT 20
    `;

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Failed to load profile templates:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await checkUserAuth();
    if (!user || !user.userId) {
      return unauthorizedResponse();
    }

    const body = await req.json();
    const { name, tags, visibility } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Fetch user's current profile data to use as the template snapshot
    const userProfileQuery = await sql`
      SELECT 
        username, alias, typewriter_heading, typewriter_quotes, location,
        background_url, background_type, discord_profile_transparency, 
        enter_screen_text, custom_cursor_url, custom_links, active_badges, theme,
        music_active, sparkles_active, custom_font
      FROM users
      WHERE id = ${user.userId}
    `;

    if (userProfileQuery.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const profileData = userProfileQuery[0];

    // Insert into templates
    const newTemplate = await sql`
      INSERT INTO profile_templates 
        (user_id, name, tags, visibility, profile_data)
      VALUES
        (${user.userId}, ${name}, ${JSON.stringify(tags || [])}::jsonb, ${visibility || 'public'}, ${JSON.stringify(profileData)}::jsonb)
      RETURNING *
    `;

    // Fetch the inserted template with username info
    const fullTemplate = await sql`
      SELECT 
        pt.id, 
        pt.name, 
        pt.tags, 
        pt.visibility, 
        pt.profile_data, 
        pt.uses, 
        pt.stars, 
        pt.created_at,
        u.username,
        u.alias,
        u.discord_id,
        u.discord_avatar
      FROM profile_templates pt
      JOIN users u ON pt.user_id = u.id
      WHERE pt.id = ${newTemplate[0].id}
    `;

    return NextResponse.json({ template: fullTemplate[0] });

  } catch (error) {
    console.error("Failed to create profile template:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
