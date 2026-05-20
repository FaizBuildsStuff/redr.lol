# 🧬 redr.lol — High-Fidelity Workspace Context Registry

This document serves as the high-fidelity technical specification for developers and automated AI agents to understand the codebase structure, active database schemas, authentication systems, client widgets, and style parameters of the **redr.lol** platform.

---

## 🗺️ Architectural Mapping

The codebase leverages the Next.js **App Router** layout paradigm. Directories are grouped logically to isolate public landing page modules, control dashboards, auth endpoints, and client-rendered identity profile chambers.

```
app/
├── (auth)/                  # Credentials validation & session registry
│   ├── signin/              # Client-side signin forms & API response handlers
│   │   └── page.tsx         # Responsive login UI with crimson glow highlights
│   └── signup/              # Secure sign-up & user credentials compilation
│       └── page.tsx         # Account registration page with validation rules
├── (dashboard)/             # Premium isolated internal chamber panels
│   ├── dashboard/           # Dashboard subroutes:
│   │   ├── page.tsx         # Account space home showing unique views and profile link
│   │   ├── analytics/       # Vector telemetry charts & visitor demographics
│   │   │   └── page.tsx     # Custom SVG sparkline rendering traffic fluctuations
│   │   ├── badges/          # User badge unlock tracker and collection layout
│   │   │   └── page.tsx     # cosmetic badge showcase (Early Adopter, Verified, etc.)
│   │   ├── customize/       # Dynamic profile theme customizers & card controls
│   │   │   └── page.tsx     # Switch themes, custom fonts, and cosmetic toggles
│   │   ├── image-host/      # Dropzone image host sandbox & simulation trackers
│   │   ├── links/           # Social inline SVG URL link managers
│   │   │   └── page.tsx     # Dynamic buttons configuration (Discord, GitHub, Twitter)
│   │   ├── premium/         # Supporter transaction checkouts & tier cards
│   │   ├── settings/        # Credentials updates & notification alerts
│   │   │   └── page.tsx     # Form to modify username, email, and update passwords
│   │   └── templates/       # Interactive visual templates registry
│   └── layout.tsx           # Sticky sidebar menu, status panels & mobile nav drawer
├── (root)/                  # Public root landing templates
│   ├── page.tsx             # Composed marketing home page (Hero, Stats, Pricing, FAQ)
│   └── layout.tsx           # Global landing page wraps & header controls
├── [username]/              # Public user profile chambers
│   ├── page.tsx             # Case-insensitive database query gateway
│   └── ClientProfile.tsx    # "Tap to Decipher" gateway card, visualizer & audio systems
├── layout.tsx               # HTML5 shell, custom fonts, next-themes provider
└── globals.css              # Global styles, ambient lighting, custom crimson scrollbars
```

---

## 🛢️ Database Schema & Connection Pool

Core user registry records are stored in a **Neon Serverless Postgres** database cluster. Access to the database is managed via Edge-optimized serverless queries in [lib/db.ts](file:///e:/Programming%20Projects/redrose/lib/db.ts).

### 1. The `users` Table
```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2. DB Initializer Helper
The script `scripts/db-init.js` and the library helper `initDb()` run DDL statements to ensure that the `users` table is provisioned automatically with correct data types.

### 3. Parameterized Query Constraint
To shield backend systems from SQL injections, all queries utilize modern parameterized string templates:
```typescript
import { sql } from "@/lib/db";
const result = await sql`SELECT * FROM users WHERE LOWER(username) = LOWER(${username})`;
```

---

## 🔒 Authentication & Session Controls

The workspace implements a cookie-based custom session layer using JWT-like custom tokens in [lib/session.ts](file:///e:/Programming%20Projects/redrose/lib/session.ts).

### 1. Token Signatures
The session utilizes HMAC-SHA256 signatures for tamper protection. A secret string (`JWT_SECRET`) is combined with base64url payloads to sign tokens. Payloads include:
- `userId` (number)
- `username` (string)
- `email` (string)
- `expiresAt` (timestamp)

### 2. Cookie Registry
When a user logs in, two cookies are set in the HTTP response:
1. `session`: Secure, `httpOnly`, `sameSite: "lax"`, `path: "/"`, duration: 7 days.
2. `is_logged_in`: Standard client-readable cookie containing `"true"`, used for quick client-side validation logic.

### 3. Auth API Paths
- **`POST /api/auth/signup`**: Validates input length (username >= 3 chars, email formatting, password >= 6 chars). Performs case-insensitive checks on existing users. Hashes the password using `bcryptjs` (salt factor 10) and saves the user. Issues session cookies.
- **`POST /api/auth/signin`**: Fetches the user by email, executes `bcryptjs.compare` checks, issues session cookies.
- **`POST /api/auth/signout`**: Clears authentication session cookies.
- **`GET /api/auth/me`**: Reads the `session` cookie, verifies the token signature, check for expiration, and returns the decapsulated user session payload `{ userId, username, email }`.

---

## 👁️ Core Identity Modules & Client Mechanics

### 1. Interactive Lock Gateway (`/[username]`)
Due to web browser policies preventing media autoplay before a user gesture:
* **Interactive Lock Overlay:** The profile loads with a central pulsating neon core card carrying the **"Tap to Decipher"** command.
* **Synchronized Fadeout:** Once clicked, the audio player is initialized. Framer Motion's `AnimatePresence` performs parallel transitions:
  * The gating overlay scales up (`1.08`), fades out, and sets pointer events to `none`.
  * The glassmorphic info-card and visualizer bounce into view behind the overlay with a sleek spring configuration (`stiffness: 100`, `damping: 15`).
* **Active Sound Spectrum:** ClientProfile tracks current volume states and renders visualizer lines inside a `<canvas>` element hooked into real-time audio frequencies.

### 2. The Oneko Interactive Tracker Widget
* A desktop sprite tracker component follows the user's mouse pointer across client profiles using `oneko.gif`.
* Employs specialized sprite frame maps: `idle`, `alert`, `scratch`, `tired`, `sleeping`, and cardinal directions (`N`, `NE`, `E`, `SE`, `S`, `SW`, `W`, `NW`) to give profiles an organic, retro-gaming feel.

### 3. Custom Hover Cursor Coordinates
Interactive cards read mouse move metrics to dynamically tilt and shift angles:
* Passes CSS custom properties `--mouse-x` and `--mouse-y` to card scopes.
* Triggers spring-based rotations on user mouse hovering (limited on mobile layouts for performance).

### 4. Shigure UI Dance View Transition
To make themes feel incredibly premium and responsive, `globals.css` overrides the `::view-transition` rendering tree:
* Employs the animated mask `https://media.tenor.com/cyORI7kwShQAAAAi/shigure-ui-dance.gif`.
* Triggers dynamic masking scale updates to execute transitions.

---

## 🎨 Premium Visual Theme Standards

The workspace implements a **"Cyber-Crimson Grid"** style palette:
* **Dark Interface Core:** Primary canvas is set to rich darkness (`#050505` to `#0D0D0D`).
* **Ambient Lighting Shadows:** Card components use transparent cards (`rgba(13, 13, 13, 0.7)`) and glassmorphism blurs (`backdrop-filter: blur(12px)`). Glowing borders use crimson coordinates (`rgba(149, 0, 0, 0.15)`).
* **Curated Themes:**
  1. `crimson-dither`: Cyber-red grid layout with ambient glow.
  2. `quantum-purple`: Deep space violet accent colors.
  3. `neon-emerald`: Green command console aesthetics.
  4. `void-mono`: Ultra-stealth dark monochrome.
* **Modern Typography:** Core text rendering implements high-performance **Satoshi**, **Outfit**, and **Space Mono** font families.
