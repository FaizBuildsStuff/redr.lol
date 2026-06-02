<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This project uses Next.js 16.2.6. APIs, conventions, and file structure can differ from older training data. Read the relevant guide in `node_modules/next/dist/docs/` before changing App Router code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent Workspace Gateway

Welcome, automated agent. This is the entry rule book for the `redr.lol` codebase.

## Navigation Core

- Read `README.md` for the product overview, setup, route map, API summary, and current stack.
- Read `context.md` for the architecture, database schema, auth model, media pipeline, Discord integration, analytics, and visual system.
- Read `agent.md` for operational rules that must be followed while editing code.
- `CLAUDE.md` delegates here through `@AGENTS.md`.

## Enforcement Checklist

### 1. Async Params Binding

Dynamic route `params` and many `searchParams` values are promises under the current App Router conventions. Do not read fields synchronously.

```ts
interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function Page({ params }: PageProps) {
  const { username } = await params;
}
```

### 2. Brand SVG Constraints

Do not import brand logotypes from `lucide-react`. Examples: GitHub, Twitter/X, YouTube, Discord, Twitch, Spotify, Instagram.

Use inline SVG components or existing files under `public/assets/images/connections`.

### 3. SQL Parametric Tagging

Never use raw string interpolation in SQL. Always use the Neon tagged template exported from `lib/db.ts`.

```ts
await sql`
  SELECT *
  FROM users
  WHERE LOWER(username) = LOWER(${username})
`;
```

For username lookups, keep matching case-insensitive.

### 4. Auth Safety

Protected user mutations must verify the `session` cookie with `verifyToken()` and use `user.userId` from the verified token. Do not trust client-submitted IDs for ownership.

### 5. Visual DNA

Maintain the dark cyber-crimson interface:

- Backgrounds: `#050505`, `#0A0A0A`, `#0D0D0D`.
- Foreground: `#F5F1E8`.
- Accent: crimson/red with subtle low-alpha borders and glows.
- Typography: Satoshi-first unless an existing component already requires otherwise.
- Preserve custom cursors and the root view-transition behavior in `app/globals.css`.

### 6. Hydration Guard

Keep `suppressHydrationWarning` on the root `<html>` in `app/layout.tsx`; `next-themes` depends on client-side theme resolution.

## Current Project Facts

- Next.js `16.2.6`, React `19.2.4`, Tailwind CSS 4.
- React Compiler is enabled with `reactCompiler: true`.
- Neon Serverless Postgres is used through `lib/db.ts`.
- Custom signed cookie sessions live in `lib/session.ts`.
- UploadThing is configured in `lib/uploadthing.ts`.
- Discord OAuth routes live under `app/api/auth/discord`.
- Lanyard presence is consumed by `hooks/use-lanyard.ts`.
- Public profiles are rendered by `app/[username]/page.tsx` and `app/[username]/ClientProfile.tsx`.
