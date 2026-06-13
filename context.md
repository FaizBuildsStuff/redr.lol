# redr.lol Workspace Context

This file is the high-signal technical map for the current `redrose` workspace. It reflects the project state observed in source on 2026-06-02.

## Architecture

The app uses the Next.js App Router with route groups for public, auth, onboarding, dashboard, and public profile experiences.

```text
app/
  layout.tsx                         Global metadata, Fontshare Satoshi link, ThemeProvider
  globals.css                        Tailwind 4 theme tokens, view transitions, cursor assets

  (root)/
    layout.tsx                       Public route-group shell
    page.tsx                         Marketing landing page

  (auth)/
    signin/page.tsx                  Credentials sign in
    signup/page.tsx                  Account creation

  onboarding/
    layout.tsx                       Centered onboarding shell
    page.tsx                         Four-step setup flow

  (dashboard)/
    layout.tsx                       Client auth guard, onboarding redirect, responsive sidebar
    dashboard/
      page.tsx                       Dashboard home
      analytics/page.tsx             User analytics dashboard
      badges/page.tsx                Badge activation UI
      customize/page.tsx             Profile, background, audio, and Discord-card customization
      image-host/page.tsx            Image hosting UI
      links/page.tsx                 Custom link editor
      premium/page.tsx               Premium tier page
      settings/page.tsx              Account settings
      templates/page.tsx             Template gallery

  [username]/
    page.tsx                         Server-side profile lookup, Discord prefetch, and alias-aware profile loading
    ClientProfile.tsx                Public interactive profile chamber with alias-driven tab-title animation

  api/
    analytics/click/route.ts
    analytics/view/route.ts
    auth/me/route.ts
    auth/signin/route.ts
    auth/signout/route.ts
    auth/signup/route.ts
    auth/discord/login/route.ts
    auth/discord/callback/route.ts
    uploadthing/route.ts
    user/analytics/route.ts
    user/audio/route.ts
    user/background/route.ts
    user/discord/route.ts
    user/discord-profile/route.ts
    user/location/route.ts
    user/onboarding/route.ts
    user/profile/route.ts
    user/[username]/stats/route.ts
```

Supporting code:

```text
components/                         Landing sections, Sidebar, Discord card, UI primitives
hooks/use-lanyard.ts                Lanyard WebSocket presence hook
lib/db.ts                           Neon client and full runtime schema initializer
lib/session.ts                      HMAC signed session token helpers
lib/uploadthing.ts                  Authenticated UploadThing file router
lib/utils.ts                        cn() class merge helper
scripts/db-init.js                  Base schema initializer
scripts/migrate_badges.js           Adds owned_badges JSONB column
public/assets/images/               Cursor, profile, badge, and connection assets
```

## Next.js Runtime Notes

This is Next.js 16.2.6 with React 19.2.4 and `reactCompiler: true` in `next.config.ts`. Before changing framework-sensitive files, read the matching guide in `node_modules/next/dist/docs/`.

Dynamic route params are asynchronous in the relevant App Router file conventions. The public profile route follows the local docs:

```ts
interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;
}
```

Route handlers with dynamic segments should use the same shape:

```ts
export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
}
```

## Database Context

Database access is centralized through `lib/db.ts`:

```ts
import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL);
```

`DATABASE_URL` is required at module load time. Server files importing `lib/db.ts` will throw if it is missing.

### `users`

Base columns:

```sql
id SERIAL PRIMARY KEY
username VARCHAR(255) UNIQUE NOT NULL
email VARCHAR(255) UNIQUE NOT NULL
password VARCHAR(255) NOT NULL
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
```

Runtime/profile columns added by `lib/db.ts:initDb()`:

```sql
discord_id VARCHAR(255)
discord_access_token TEXT
discord_refresh_token TEXT
typewriter_heading VARCHAR(255)
typewriter_quotes JSONB
custom_links JSONB
active_badges JSONB
theme VARCHAR(50) DEFAULT 'crimson-dither'
music_active BOOLEAN DEFAULT false
sparkles_active BOOLEAN DEFAULT true
custom_font VARCHAR(50) DEFAULT 'Satoshi'
background_url TEXT
background_type VARCHAR(50)
audios JSONB DEFAULT '[]'::jsonb
audio_shuffle BOOLEAN DEFAULT false
audio_player_enabled BOOLEAN DEFAULT false
background_audio_enabled BOOLEAN DEFAULT false
location VARCHAR(255)
discord_profile_transparency NUMERIC DEFAULT 0.40
alias VARCHAR(100)
views INTEGER DEFAULT 0
profile_clicks INTEGER DEFAULT 0
link_clicks INTEGER DEFAULT 0
devices JSONB DEFAULT '{"desktop": 0, "mobile": 0, "tablet": 0}'::jsonb
referrers JSONB DEFAULT '{}'::jsonb
onboarding_completed BOOLEAN DEFAULT false
```

Badge migration:

```sql
owned_badges JSONB DEFAULT '[]'::jsonb
```

### `daily_analytics`

```sql
id SERIAL PRIMARY KEY
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
date DATE NOT NULL DEFAULT CURRENT_DATE
views INTEGER DEFAULT 0
profile_clicks INTEGER DEFAULT 0
link_clicks INTEGER DEFAULT 0
UNIQUE(user_id, date)
```

### Schema Initializers

- `lib/db.ts:initDb()` is called by signup and signin and carries the fuller evolving schema.
- `scripts/db-init.js` manually loads `.env`, creates `users`, creates `daily_analytics`, and adds aggregate analytics/onboarding fields.
- `scripts/migrate_badges.js` adds `owned_badges`.

Keep these in sync when adding database-backed features.

## SQL Rules

Use Neon tagged templates for all SQL:

```ts
await sql`
  UPDATE users
  SET custom_links = ${JSON.stringify(links)}::jsonb
  WHERE id = ${userId}
`;
```

For username reads, prefer case-insensitive matching:

```ts
await sql`
  SELECT *
  FROM users
  WHERE LOWER(TRIM(username)) = LOWER(TRIM(${username}))
  LIMIT 1
`;
```

Do not build SQL through string concatenation or template-string interpolation outside the `sql` tag.

## Authentication

`lib/session.ts` implements a custom signed token:

- Payload: `userId`, `username`, `email`, `expiresAt`.
- Signature: HMAC-SHA256 over the JSON payload.
- Encoding: `base64url(payload).base64url(signature)`.
- Default duration: 7 days.
- Secret: `JWT_SECRET`, with a development fallback.

Credential auth routes:

- `POST /api/auth/signup`: validates username/email/password, lowercases username/email, hashes with `bcryptjs`, inserts user, sets cookies.
- `POST /api/auth/signin`: validates email/password and sets cookies.
- `POST /api/auth/signout` and `GET /api/auth/signout`: clears cookies.
- `GET /api/auth/me`: verifies cookie and returns latest profile/session fields from the database, including the saved alias.

Cookies:

- `session`: HttpOnly, signed token, `sameSite: "lax"`, path `/`, 7-day max age.
- `is_logged_in`: client-readable `"true"` marker with the same max age.

## Discord Integration

OAuth:

- `/api/auth/discord/login` builds the Discord authorization URL from `DISCORD_CLIENT_ID` and `NEXT_PUBLIC_APP_URL`.
- `/api/auth/discord/callback` exchanges the code with Discord, stores `discord_id`, `discord_access_token`, and `discord_refresh_token`, then redirects to onboarding or customize.

Profile rendering:

- `app/[username]/page.tsx` prefetches Discord profile data from `https://dcdn.dstn.to/profile/{discord_id}` and reads the user's saved alias.
- `app/[username]/ClientProfile.tsx` uses the alias for the public profile experience and animates the browser tab title with a premium-style reveal.
- If an access token exists, it also fetches Discord connections from `https://discord.com/api/v10/users/@me/connections`.
- `hooks/use-lanyard.ts` subscribes to `wss://api.lanyard.rest/socket` for live Discord presence.

## Uploads and Media

`lib/uploadthing.ts` defines two authenticated upload endpoints:

- `audioUploader`: one audio file up to 32 MB.
- `backgroundUploader`: one image (`png`, `jpeg`, `webp`, `gif`) up to 32 MB or one video (`mp4`, `webm`) up to 128 MB.

UploadThing authentication calls `${NEXT_PUBLIC_APP_URL}/api/auth/me` with forwarded cookies and rejects unauthenticated uploads.

Media persistence:

- `/api/user/audio` stores audio track objects in `users.audios`; the current limit is four tracks.
- `/api/user/background` stores `background_url`, `background_type`, and optional `background_audio_enabled`.

## Analytics

Public tracking:

- `POST /api/analytics/view` accepts `username`, increments `users.views`, updates `devices` from the user agent, updates `referrers` from the request referer, and upserts `daily_analytics`.
- `POST /api/analytics/click` accepts `username` and `type` (`profile` or `link`), increments aggregate counters, and upserts daily click metrics.

Dashboard analytics:

- `GET /api/user/analytics` requires a valid session and returns totals, link CTR, devices, referrers, and the latest 12 daily rows in chronological order.

## Public Profile Experience

`app/[username]/page.tsx`:

- Awaits `params`.
- Decodes and normalizes the username.
- Queries the user case-insensitively.
- Renders a custom "Identity Void" fallback when no profile exists.
- Passes profile, Discord, media, and customization props into `ClientProfile`.

`ClientProfile.tsx`:

- Is a large client component for the interactive public profile.
- Uses `next-themes`, Framer Motion, audio playback, canvas-style visual behavior, social widgets, active badges, Discord presence, and background media.
- Includes Oneko-style sprite tracking using `public/assets/images/oneko.gif`.

## Visual System

Global styling lives in `app/globals.css`.

Important visual constants:

- Primary dark surfaces: `#050505`, `#0A0A0A`, `#0D0D0D`.
- Cream foreground: `#F5F1E8`.
- Crimson accent family: `#950000`, red-500/red-600 Tailwind utilities.
- Root font: Satoshi loaded from Fontshare in `app/layout.tsx`.
- Custom cursors: `/assets/images/cursor/pointer.png` and `/assets/images/cursor/link.png`.
- View transition mask: Shigure UI dance GIF applied to `::view-transition-new(root)`.

Root layout must keep:

```tsx
<html lang="en" className="h-full antialiased" suppressHydrationWarning>
```

The hydration warning suppression protects `next-themes` client theme behavior.

## Environment Variables

```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
UPLOADTHING_TOKEN=...
```

## Known Maintenance Notes

- `README.md`, `context.md`, `agent.md`, and `AGENTS.md` are the primary documentation entry points.
- `CLAUDE.md` delegates to `AGENTS.md`.
- `scripts/db-init.js` does not currently mirror every column in `lib/db.ts:initDb()`.
- Some username queries normalize differently across routes. New work should use one consistent case-insensitive pattern.
- `package.json` has `dev`, `build`, `start`, and `db:init` scripts only.
