# redr.lol Agent Directives

These are the operational rules for agents editing the `redrose` workspace.

## Required Reading Before Edits

1. Read `README.md` for product, setup, stack, and route overview.
2. Read `context.md` for architecture, database, API, auth, UploadThing, Discord, and styling details.
3. Read the relevant local Next.js guide in `node_modules/next/dist/docs/` before changing App Router files. This project uses Next.js 16.2.6, and assumptions from older Next versions can be wrong.

## Runtime Boundaries

| Boundary | Current Value | Rule |
| :--- | :--- | :--- |
| Next.js | `16.2.6` | Use local docs for App Router APIs and file conventions. |
| React | `19.2.4` | React Compiler is enabled in `next.config.ts`. |
| Dynamic params | Promise-based | Await `params` and `searchParams` before reading fields. |
| Database | Neon Serverless | Use `sql` tagged templates only. |
| Auth | Custom signed cookies | Use `verifyToken()` for protected API routes. |
| Styling | Dark cyber-crimson | Preserve the near-black/glass/crimson visual language. |
| Imports | `@/*` alias | Prefer absolute workspace imports over deep relative imports. |

## Next.js App Router Rules

Dynamic pages:

```ts
interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function Page({ params }: PageProps) {
  const { username } = await params;
}
```

Dynamic route handlers:

```ts
export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
}
```

Do not read `params.username`, `params.slug`, or `searchParams.foo` synchronously in App Router files covered by the new conventions.

## SQL and Database Rules

Always use Neon tagged template syntax:

```ts
await sql`
  SELECT id
  FROM users
  WHERE LOWER(username) = LOWER(${username})
  LIMIT 1
`;
```

Never build SQL like this:

```ts
await sql(`SELECT * FROM users WHERE username = '${username}'`);
```

When querying usernames, normalize case. Prefer:

```sql
LOWER(TRIM(username)) = LOWER(TRIM(${username}))
```

When adding profile fields, update the runtime schema in `lib/db.ts:initDb()` and consider whether `scripts/db-init.js` or a migration script also needs the field. Profile aliases should be surfaced through `/api/user/profile`, `/api/auth/me`, the customize screen, and the public profile experience.

## Auth Rules

Protected API routes should:

1. Read the `session` cookie.
2. Call `verifyToken(sessionCookie)`.
3. Return `401` if missing or invalid.
4. Use `user.userId` from the verified token for writes.

Do not trust client-provided user IDs for profile mutations. Alias edits should be validated server-side and reflected in the public profile tab/title experience.

## Lucide and Brand Icons

`lucide-react` is available for general UI symbols. Do not import brand logotypes such as GitHub, Twitter/X, YouTube, Discord, Twitch, Instagram, or Spotify from `lucide-react`.

Use one of these instead:

- Existing SVG assets in `public/assets/images/connections`.
- Inline local SVG React components scoped to the component that needs them.

## Visual Design Rules

Preserve the established UI DNA:

- Use dark surfaces: `#050505`, `#0A0A0A`, `#0D0D0D`.
- Use restrained crimson accents: `#950000`, red-500/red-600 utilities, low-alpha borders and glows.
- Keep glass surfaces subtle with low-alpha backgrounds and blur.
- Keep typography aligned with Satoshi and the existing scale.
- Keep custom cursors and `::view-transition` behavior in `app/globals.css`.
- Keep `suppressHydrationWarning` on `<html>` in `app/layout.tsx`.

Avoid introducing unrelated bright palettes, default-blue buttons, flat white cards, or marketing layouts inside operational dashboard screens.

## Upload and Media Rules

UploadThing endpoints are defined in `lib/uploadthing.ts`.

- Audio uploads: one file, 32 MB max, stored later through `/api/user/audio`.
- Background uploads: images up to 32 MB or videos up to 128 MB, stored later through `/api/user/background`.
- Upload auth depends on `NEXT_PUBLIC_APP_URL` and `/api/auth/me`.

The audio route caps profile tracks at four.

## API Inventory

Authentication:

- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `POST|GET /api/auth/signout`
- `GET /api/auth/me`
- `GET /api/auth/discord/login`
- `GET /api/auth/discord/callback`

User/profile:

- `PATCH /api/user/profile`
- `POST|PATCH|DELETE /api/user/background`
- `POST|PATCH|DELETE /api/user/audio`
- `POST /api/user/onboarding`
- `GET /api/user/analytics`
- `GET /api/user/[username]/stats`
- `POST|DELETE /api/user/discord`
- `GET /api/user/discord-profile`
- `POST /api/user/location`

Analytics:

- `POST /api/analytics/view`
- `POST /api/analytics/click`

Uploads:

- `GET|POST /api/uploadthing`

## Editing Expectations

- Keep changes scoped to the requested behavior.
- Follow existing component and file patterns.
- Use `@/` imports for project modules.
- Do not rewrite large components for style preference alone.
- If touching documentation, keep README, context, agent, and AGENTS guidance consistent.
- If adding scripts, update `README.md`.
- If adding env requirements, update `README.md` and `context.md`.
