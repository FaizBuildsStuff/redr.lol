import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyToken } from "@/lib/session";
import { cookies } from "next/headers";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

// GET /api/help/articles/[slug] — public
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { slug } = await params;
  try {
    const [article] = await sql`
      SELECT * FROM help_articles
      WHERE slug = ${slug} AND published = true
      LIMIT 1
    `;
    if (!article) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ article });
  } catch (err) {
    console.error("GET /api/help/articles/[slug] error:", err);
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}

// PATCH /api/help/articles/[slug] — owner only
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const user = verifyToken(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [dbUser] = await sql`SELECT role FROM users WHERE id = ${user.userId} LIMIT 1`;
  if (!dbUser || dbUser.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { title, category, category_icon, excerpt, content, read_time, popular, published, slug: newSlug } = body;

  try {
    const [updated] = await sql`
      UPDATE help_articles SET
        title = COALESCE(${title ?? null}, title),
        category = COALESCE(${category ?? null}, category),
        category_icon = COALESCE(${category_icon ?? null}, category_icon),
        excerpt = COALESCE(${excerpt ?? null}, excerpt),
        content = COALESCE(${content ?? null}, content),
        read_time = COALESCE(${read_time ?? null}, read_time),
        popular = COALESCE(${popular ?? null}, popular),
        published = COALESCE(${published ?? null}, published),
        slug = COALESCE(${newSlug ?? null}, slug),
        updated_at = NOW()
      WHERE slug = ${slug}
      RETURNING *
    `;
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ article: updated });
  } catch (err) {
    console.error("PATCH /api/help/articles/[slug] error:", err);
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

// DELETE /api/help/articles/[slug] — owner only
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const user = verifyToken(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [dbUser] = await sql`SELECT role FROM users WHERE id = ${user.userId} LIMIT 1`;
  if (!dbUser || dbUser.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await sql`DELETE FROM help_articles WHERE slug = ${slug}`;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/help/articles/[slug] error:", err);
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
