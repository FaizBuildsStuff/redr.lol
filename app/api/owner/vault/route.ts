import { NextResponse } from "next/server";
import { sql, initDb } from "@/lib/db";
import { checkOwnerAuth, unauthorizedResponse } from "@/lib/owner-auth";

export async function GET(request: Request) {
  try {
    await initDb();
    const owner = await checkOwnerAuth();
    if (!owner) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get("parent_id");
    
    let items;
    if (parentId && parentId !== "null") {
      items = await sql`
        SELECT * FROM owner_vault
        WHERE owner_id = ${owner.id} AND parent_id = ${parentId}
        ORDER BY type = 'folder' DESC, updated_at DESC
      `;
    } else {
      items = await sql`
        SELECT * FROM owner_vault
        WHERE owner_id = ${owner.id} AND parent_id IS NULL
        ORDER BY type = 'folder' DESC, updated_at DESC
      `;
    }

    return NextResponse.json({ items });
  } catch (error: any) {
    console.error("Vault GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await initDb();
    const owner = await checkOwnerAuth();
    if (!owner) return unauthorizedResponse();

    const body = await request.json();
    const { name, type, parent_id, content, url, size_bytes } = body;

    if (!name || !type) {
      return NextResponse.json({ error: "Name and type are required" }, { status: 400 });
    }

    // Insert into owner_vault
    const result = await sql`
      INSERT INTO owner_vault (owner_id, name, type, parent_id, content, url, size_bytes)
      VALUES (${owner.id}, ${name}, ${type}, ${parent_id || null}, ${content || null}, ${url || null}, ${size_bytes || 0})
      RETURNING *
    `;

    return NextResponse.json({ success: true, item: result[0] });
  } catch (error: any) {
    console.error("Vault POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
