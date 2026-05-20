# 🧬 redr.lol — High-Fidelity Workspace Context Registry

This document serves as the high-fidelity technical specification for developers and automated AI agents to understand the directory layout, active database schemas, custom animation lifecycles, and core architectural rules of the **redr.lol** workspace.

---

## 🗺️ Architectural Mapping

The codebase leverages Next.js **App Router** layout paradigms. Directories are grouped logically to isolate public pages, core settings panels, secure auth layers, and dynamic public profiles.

```
app/
├── (auth)/                  # Core credentials validation sheets
│   ├── signin/              # Client-side neon signin forms & API response alerts
│   └── signup/              # Secure sign-up & credentials compilation
├── (dashboard)/             # Premium isolated internal chamber panels
│   ├── dashboard/           # Subroutes:
│   │   ├── analytics/       # Vector telemetry charts & visitor demographics
│   │   ├── badges/          # User badge unlock tracker and collection layout
│   │   ├── customize/       # Dynamic profile theme customizers & card controls
│   │   ├── image-host/      # Dropzone image host sandbox & simulation trackers
│   │   ├── links/           # Social inline SVG URL link managers
│   │   ├── premium/         # Supporter transaction checkouts & tier cards
│   │   ├── settings/        # Credentials updates & notification alerts
│   │   └── templates/       # Interactive visual templates registry
│   └── layout.tsx           # Sticky sidebar menu, status panels & upward menus
├── (root)/                  # Public root landing templates
│   ├── page.tsx             # Immersive entry showcase & neon highlights
│   └── layout.tsx           # Global landing page wraps & header controls
├── [username]/              # Public user profile chambers
│   ├── page.tsx             # Case-insensitive database query gateway
│   └── ClientProfile.tsx    # "Tap to Decipher" gateway card & audio systems
├── layout.tsx               # Primary HTML5 shell, custom fonts & global theme providers
└── globals.css              # Global styles, ambient lighting, custom crimson scrollbars
```

---

## 🛢️ Neon Serverless DB & Schema Blueprint

Core persistent records are stored on **Neon Serverless Postgres** instances accessed via native SQL drivers inside [lib/db.ts](file:///e:/Programming%20Projects/redrose/lib/db.ts).

### 1. `users` Table Registry
The active tables within the cluster represent high-speed developer records:
```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Parameterized Query Security
To shield critical backend systems from SQL injections, all queries utilize modern parameterized string templates:
```typescript
import { sql } from "@/lib/db";
const result = await sql`SELECT * FROM users WHERE LOWER(username) = LOWER(${username})`;
```

---

## ⚡ Core Identity Modules & Mechanics

### 1. Click-to-Enter Security Gateway (`/[username]`)
Due to web browser policies preventing media autoplay before a user gesture:
* **Interactive Lock Overlay:** The profile loads with a central pulsating neon core card carrying the **"Tap to Decipher"** command.
* **Synchronized Fadeout:** Once clicked, the audio player is initialized synchronously. Framer Motion's `AnimatePresence` performs parallel transitions:
  * The gating overlay scales up (`1.08`), fades out, and sets pointer events to `none`.
  * The glassmorphic info-card and visualizer bounce into view behind the overlay with a sleek spring configuration (`stiffness: 100`, `damping: 15`).
* **Active Sound Spectrum:** ClientProfile tracks current volume states and render bars inside a high-speed `<canvas>` element hooked into real-time audio amplitudes.

### 2. Modular Dashboard Navigation
The internal configuration panel utilizes physical file-based Next.js route folders (e.g., `/dashboard/analytics`, `/dashboard/links`) mapped inside an isolated workspace shell. The persistent dashboard layout contains:
* Visual status tags (e.g. Creator vs Supporter account indicators).
* Custom dithered client widgets rendering live user metadata (UUID, names, status).
* Upward-opening interaction menus bound to standard sign-out states and external support modules.

---

## 🎨 Premium Visual Theme Standards

The workspace implements a **"Cyber-Crimson Grid"** style palette:
* **Dark Interface Core:** Primary canvas is set to rich velvet darkness (`#050505` to `#0D0D0D`).
* **Neon Crimson Accents:** Ambient glowing borders and shadows use `#950000` coordinates combined with subtle glassmorphic backdrop filters.
* **Modern Typography:** Core text rendering implements high-performance **Satoshi** font configurations (400, 500, 700 weights).
* **Smooth Render Safeguards:** Root layout registers `suppressHydrationWarning` to eliminate standard browser/Next.js hydration mismatches on initialization.
