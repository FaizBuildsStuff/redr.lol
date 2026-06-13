# redr.lol

An interactive bio-link and creator profile platform built with Next.js App Router, Neon Postgres, signed cookie sessions, Discord presence, UploadThing media uploads, and a dark cyber-crimson design system.

## Current Stack

| Area | Implementation |
| :--- | :--- |
| App runtime | Next.js 16.2.6, App Router, Turbopack dev server |
| UI runtime | React 19.2.4, React Compiler enabled in `next.config.ts` |
| Styling | Tailwind CSS 4, custom `app/globals.css`, shadcn-style UI primitives |
| Motion | Framer Motion 12, GSAP dependency available |
| Database | Neon Serverless Postgres through `@neondatabase/serverless` |
| Auth | Custom HMAC-SHA256 signed session token stored in cookies |
| Uploads | UploadThing audio and profile background upload routes |
| Integrations | Discord OAuth, Discord API connections, Lanyard WebSocket presence |

## Product Surface

`redr.lol` lets users create public profile chambers at `/:username`. Profiles can show custom links, selected badges, typewriter text, Discord presence, Discord connections, location, uploaded background media, up to four audio tracks, an editable profile alias, and analytics-backed click/view counters.

The private dashboard contains:

- Dashboard home: account summary, profile URL, quick actions, and Discord connection surface.
- Analytics: total views, profile clicks, link clicks, CTR, device/referrer mix, and 12-day graph data.
- Links: custom social/link list editing.
- Customize: profile text, quotes, background media, audio tracks, player toggles, Discord card transparency, alias editing, and public-profile presentation settings.
- Badges: owned and active badge selection.
- Image host, premium, templates, and settings pages for additional creator tooling.
- Onboarding: first-run flow for Discord, links, media preferences, and premium prompt.

## Route Map

```text
app/
  (root)/
    page.tsx                         Public marketing home
    layout.tsx                       Root group wrapper
  (auth)/
    signin/page.tsx                  Email/password sign in
    signup/page.tsx                  Account creation, redirects to onboarding
  onboarding/
    layout.tsx                       Focused onboarding shell
    page.tsx                         Four-step setup wizard
  (dashboard)/
    layout.tsx                       Auth guard, onboarding guard, sidebar shell
    dashboard/page.tsx               Account dashboard
    dashboard/analytics/page.tsx     Analytics visualizations
    dashboard/badges/page.tsx        Badge inventory and active badge selection
    dashboard/customize/page.tsx     Profile text, media, audio, Discord card settings
    dashboard/image-host/page.tsx    Hosted asset UI
    dashboard/links/page.tsx         Custom links manager
    dashboard/premium/page.tsx       Supporter tier page
    dashboard/settings/page.tsx      Account settings UI
    dashboard/templates/page.tsx     Template gallery UI
  [username]/
    page.tsx                         Server profile loader, awaits async params
    ClientProfile.tsx                Interactive public profile experience
  api/
    analytics/click/route.ts         Public click tracking
    analytics/view/route.ts          Public view tracking
    auth/*                           Credentials auth and Discord OAuth
    uploadthing/route.ts             UploadThing route handler
    user/*                           Profile, media, onboarding, analytics APIs
```

## API Summary

| Route | Methods | Purpose |
| :--- | :--- | :--- |
| `/api/auth/signup` | `POST` | Validates credentials, initializes DB schema through `initDb()`, hashes password with `bcryptjs`, creates user, sets cookies. |
| `/api/auth/signin` | `POST` | Validates email/password, sets `session` and `is_logged_in` cookies. |
| `/api/auth/signout` | `POST`, `GET` | Clears auth cookies. |
| `/api/auth/me` | `GET` | Verifies the signed cookie and returns the latest user customization/session fields, including the saved alias. |
| `/api/auth/discord/login` | `GET` | Redirects to Discord OAuth. |
| `/api/auth/discord/callback` | `GET` | Exchanges OAuth code, stores Discord ID and tokens, redirects to onboarding or customize. |
| `/api/user/profile` | `PATCH` | Updates typewriter text, quotes, links, badges, theme flags, custom font, Discord card transparency, and the user's public alias. |
| `/api/user/background` | `POST`, `PATCH`, `DELETE` | Saves/removes image or video background and toggles background audio. |
| `/api/user/audio` | `POST`, `PATCH`, `DELETE` | Adds/removes up to four audio tracks and updates shuffle/player settings. |
| `/api/user/onboarding` | `POST` | Marks onboarding complete and optionally saves initial links/audio settings. |
| `/api/user/analytics` | `GET` | Returns dashboard analytics for the logged-in user. |
| `/api/user/[username]/stats` | `GET` | Returns public stats for a profile username. |
| `/api/user/discord` | `POST`, `DELETE` | Saves or disconnects a Discord ID for the logged-in user. |
| `/api/user/discord-profile` | `GET` | Fetches Discord profile and connections for a `username` query. |
| `/api/user/location` | `POST` | Updates the logged-in user's profile location. |
| `/api/analytics/view` | `POST` | Increments profile views, device counts, referrers, and daily analytics. |
| `/api/analytics/click` | `POST` | Increments profile or link click counters and daily analytics. |

## Database

The application uses Neon Serverless Postgres through `lib/db.ts`.

Core tables:

- `users`: credentials, Discord IDs/tokens, profile customization fields, badge JSON, media JSON, onboarding state, aggregate analytics counters, and the public alias field used by the profile experience.
- `daily_analytics`: per-user daily view, profile click, and link click totals with `UNIQUE(user_id, date)`.

Important note: `lib/db.ts:initDb()` contains the fullest schema expansion. `scripts/db-init.js` provisions the base user table, daily analytics, and aggregate analytics columns only. `scripts/migrate_badges.js` separately adds `owned_badges`.

All database writes and reads should use Neon tagged template syntax:

```ts
await sql`
  SELECT *
  FROM users
  WHERE LOWER(username) = LOWER(${username})
  LIMIT 1
`;
```

## Environment Variables

Create `.env` in the project root:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=replace-with-a-long-random-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
UPLOADTHING_TOKEN=...
```

`JWT_SECRET` has a development fallback in `lib/session.ts`, but production should always provide a real secret.

## Local Development

```bash
npm install
npm run db:init
npm run dev
```

Open `http://localhost:3000`.

Useful commands:

```bash
npm run build
npm start
node scripts/migrate_badges.js
```

There is no lint/test script currently defined in `package.json`.

## Implementation Rules

- Read relevant local Next docs in `node_modules/next/dist/docs/` before changing App Router code. This project runs Next 16, where route `params` and `searchParams` are asynchronous in many file conventions.
- In dynamic routes such as `app/[username]/page.tsx`, type params as `Promise<{ username: string }>` and resolve them with `await params`.
- Do not import brand logotypes from `lucide-react`. Use local inline SVGs or existing SVG assets under `public/assets/images/connections`.
- Keep SQL parameterized through tagged template literals. Avoid raw string interpolation.
- Preserve the dark cyber-crimson visual language: near-black backgrounds, subtle glass surfaces, restrained crimson accents, custom cursors, the existing view-transition mask, and the premium-style public-profile tab title animation.
- Keep `suppressHydrationWarning` on the root `<html>` in `app/layout.tsx` because `next-themes` is active.
