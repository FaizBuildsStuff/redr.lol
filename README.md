# 🌹 redr.lol — Cyber-Identity Chamber & Bio-Link Genesis

<div align="center">

```
             __          _       _ 
  _ __ ___  / _|  _ __  | | ___ | |_ 
 | '__/ _ \| |_  | '__| | |/ _ \| __|
 | | |  __/|  _| | |    | | (_) | |_ 
 |_|  \___||_|   |_|    |_|\___/ \__|
                                     
```

**An elite, ultra-modern bio-profile and custom web-identity space.**  
*A highly optimized, glassmorphic, visual canvas crafted for digital creators, collectors, and cyber-enthusiasts.*

---

[![Next.js v16](https://img.shields.io/badge/Next.js-16.2.6-F5F1E8?style=for-the-badge&logo=nextdotjs&logoColor=0D0D0D&color=F5F1E8)](https://nextjs.org)
[![React v19](https://img.shields.io/badge/React-19.2.4-00D8FF?style=for-the-badge&logo=react&logoColor=white&color=082F49)](https://react.dev)
[![Neon Postgres Edge](https://img.shields.io/badge/Neon_DB-Serverless-00E599?style=for-the-badge&logo=postgresql&logoColor=white&color=022C22)](https://neon.tech)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.0-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white&color=0C4A6E)](https://tailwindcss.com)
[![Framer Motion v12](https://img.shields.io/badge/Framer_Motion-v12-FF00C8?style=for-the-badge&logo=framer&logoColor=white&color=4C0519)](https://framer.com)

</div>

---

## 👁️ System Overview & Architecture

`redr.lol` allows developers and creators to design high-fidelity, interactive digital profile chambers. Powered by a responsive global layout featuring a custom **Cyber-Crimson Grid** design system, users can register, unlock rare badges, custom-host high-resolution profile imagery, structure custom links, and publish beautiful bio-profile sites.

```
       [ Public Landing ]  ───────>  [ Secure Gateways ] (Cookie-based Session JWT)
               │                                   │
               ▼                                   ▼
      [ Chamber Identity ] <───────────── [ Creator Dashboard ]
   pulsating "Tap to Decipher" gateway       • Modular Settings & Layout Control
   audio visualizer & dynamic canvas         • SVG-rendered live analytics charts
   lossless media loop streaming             • Theme templates & custom visual nodes
   Oneko mouse tracking pixel animations     • Badges inventory & supporter tiers
```

---

## ✨ Primary Features

| Feature Module | Technical Focus | Core Mechanics |
| :--- | :--- | :--- |
| **🔒 Authenticated Shell (`(auth)`)** | Security & Session Registry | Secure signup and signin APIs utilizing `bcryptjs` password hashing and signed cookie verification using HMAC-SHA256. |
| **🛠️ Control Chamber (`(dashboard)`)** | Unified Layout Sandbox | Persistent custom sidebar shell featuring sublink trees, live user metrics, support widgets, and profile status tags. |
| **🎨 Live Customizer** | Real-time Canvas Rendering | Active state customization spanning glassmorphic card variables, accent switches (Crimson, Purple, Emerald, Mono), and Satoshi/Outfit typography templates. |
| **🔗 Dynamic Links Router** | Interactive social nodes | Manage, toggle visibility of, and delete custom redirection buttons (GitHub, Twitter, Discord, YouTube, Web). |
| **🌐 Dynamic Chamber Gates (`/[username]`)**| Gestural Core Autoplay | Pulsating visual gate overcoming standard browser audio restrictions via client-bound click loops, animated cursor shapes, pixelated Oneko widget track loops, and real-time audio visualizer spectrum canvas. |
| **📊 Quantum Analytics** | SVG Sparkline Graphics | Visual metrics dashboard highlighting Unique Views, Click-Through Rates (CTR), referrals, and device share. |
| **🛢️ Neon Serverless DB** | High-Performance Storage | Direct query interface with serverless Postgres edge clusters and safe parameterized protection filters. |

---

## 🛠️ Technology Stack

* **Client & Compiler:** Next.js 16.2.6 utilizing the cutting-edge **Turbopack Compiler Core** for instant hot-module updates.
* **Database Pipeline:** Neon Serverless PostgreSQL running edge-optimized query clusters accessed via modern tagged templates.
* **Session Layer:** Custom JWT-like signed cookies (`session` HttpOnly cookie & `is_logged_in` client cookie) with SHA256 signatures.
* **Aesthetic Styling:** Tailwind CSS v4.0 with customized ambient red glow filters, glassmorphism cards, and textured noise sheets.
* **Motion Physics:** Framer Motion v12 delivering seamless spatial transitions, drag animations, and exit timelines.
* **Metadata & SEO:** Semantic header hierarchies equipped with automated dynamic site templates, OpenGraph indices, and theme hydration guards.

---

## 🚀 Installation & Local Launch

### 1. Register Environment Secrets
Create a `.env` file at the root registry of your workspace directory:
```env
DATABASE_URL=postgresql://neondb_owner:[password]@ep-[id]-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=[secure-quantum-identity-key]
```

### 2. Provision Dependencies
Install the package registry using your terminal shell:
```bash
npm install
```

### 3. Setup Database Schema
Execute the database schema setup to deploy tables to your Neon DB cluster:
```bash
npm run db:init
```

### 4. Boot Dev Environment
Start the development server with Next's high-speed Turbopack engine:
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser to inspect the application.

---

## 🛡️ Coding Guidelines & Codebase Commitments

> [!IMPORTANT]
> **1. Tailwind CSS Theme Conformity**
> Maintain curated dark HSL coordinates (`#050505` / `#0D0D0D` and accents `#950000`). Never utilize default browser visual presets or basic, non-harmonious primary colors.

> [!WARNING]
> **2. No Lucide Brand Icons**
> Next.js Turbopack compiler restrictions prevent direct Lucide React imports for brand logos (e.g. `Github`, `Twitter`, `Youtube`, `Discord`). These icons **must** be implemented utilizing native inline SVG components to ensure clean compilation.

> [!NOTE]
> **3. Hydration Mismatch Prevention**
> Keep `suppressHydrationWarning` assigned to the root `<html>` node inside the global [app/layout.tsx](file:///e:/Programming%20Projects/redrose/app/layout.tsx) file to ensure clean renders when client layouts read active theme states.
