import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyToken } from "@/lib/session";
import { cookies } from "next/headers";
import { HELP_SEED_ARTICLES } from "@/lib/help-seed";

// GET /api/help/articles — public, returns all published articles
export async function GET() {
  try {
    const rows = await sql`
      SELECT id, slug, title, category, category_icon, excerpt, read_time, popular, published, updated_at, created_at
      FROM help_articles
      WHERE published = true
      ORDER BY category ASC, created_at ASC
    `;
    return NextResponse.json({ articles: rows });
  } catch (err) {
    console.error("GET /api/help/articles error:", err);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

// POST /api/help/articles — owner only, creates or seeds articles
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const user = verifyToken(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check owner role
  const [dbUser] = await sql`SELECT role FROM users WHERE id = ${user.userId} LIMIT 1`;
  if (!dbUser || dbUser.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  // Special: seed action
  if (body.action === "seed") {
    let seeded = 0;
    for (const article of HELP_SEED_ARTICLES) {
      try {
        await sql`
          INSERT INTO help_articles (slug, title, category, category_icon, excerpt, content, read_time, popular, published)
          VALUES (
            ${article.slug},
            ${article.title},
            ${article.category},
            ${article.category_icon},
            ${article.excerpt},
            ${article.content},
            ${article.read_time},
            ${article.popular},
            ${article.published}
          )
          ON CONFLICT (slug) DO NOTHING
        `;
        seeded++;
      } catch {}
    }
    return NextResponse.json({ seeded });
  }

  // Create single article
  const { slug, title, category, category_icon, excerpt, content, read_time, popular, published } = body;
  if (!slug || !title || !category || !excerpt || !content) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const [article] = await sql`
      INSERT INTO help_articles (slug, title, category, category_icon, excerpt, content, read_time, popular, published)
      VALUES (
        ${slug},
        ${title},
        ${category || "General"},
        ${category_icon || "📄"},
        ${excerpt},
        ${content},
        ${read_time || 3},
        ${popular ?? false},
        ${published ?? true}
      )
      RETURNING *
    `;
    return NextResponse.json({ article }, { status: 201 });
  } catch (err: any) {
    if (err?.message?.includes("unique")) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    console.error("POST /api/help/articles error:", err);
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}
