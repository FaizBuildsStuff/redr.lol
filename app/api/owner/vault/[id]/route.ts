import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { checkOwnerAuth, unauthorizedResponse } from "@/lib/owner-auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const owner = await checkOwnerAuth();
    if (!owner) return unauthorizedResponse();

    const resolvedParams = await params;
    const itemId = parseInt(resolvedParams.id, 10);
    const body = await request.json();
    const { name, content, parent_id } = body;

    let result;

    if (content !== undefined) {
      // Editing document content
      result = await sql`
        UPDATE owner_vault
        SET content = ${content}, updated_at = NOW()
        WHERE id = ${itemId} AND owner_id = ${owner.id}
        RETURNING *
      `;
    } else if (name !== undefined) {
      // Renaming
      result = await sql`
        UPDATE owner_vault
        SET name = ${name}, updated_at = NOW()
        WHERE id = ${itemId} AND owner_id = ${owner.id}
        RETURNING *
      `;
    } else if (parent_id !== undefined) {
      // Moving
      result = await sql`
        UPDATE owner_vault
        SET parent_id = ${parent_id}, updated_at = NOW()
        WHERE id = ${itemId} AND owner_id = ${owner.id}
        RETURNING *
      `;
    }

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Item not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: result[0] });
  } catch (error: any) {
    console.error("Vault PATCH error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const owner = await checkOwnerAuth();
    if (!owner) return unauthorizedResponse();

    const resolvedParams = await params;
    const itemId = parseInt(resolvedParams.id, 10);

    // Because of ON DELETE CASCADE in the DB schema, deleting a folder will delete its children automatically.
    const result = await sql`
      DELETE FROM owner_vault
      WHERE id = ${itemId} AND owner_id = ${owner.id}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Item not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true, deleted_id: result[0].id });
  } catch (error: any) {
    console.error("Vault DELETE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
