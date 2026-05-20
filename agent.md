# 🤖 redr.lol — AI Agent Operational Directive & Workspace Guidelines

Welcome, Agent. This document outlines the core constraints, visual guidelines, database protocols, and compilation parameters required to write production-grade code within the **redr.lol** workspace.

---

## ⚡ Quick Reference Dashboard

| Operational Boundary | Critical Parameter | Expected Behavior |
| :--- | :--- | :--- |
| **Compiler Targets** | Next.js 16 + Turbopack | Brand icon imports from `lucide-react` will fail. You must use native inline SVG React components instead. |
| **Route Parameters** | Next.js 15+ Promises | Dynamic route parameters (e.g. `params` and `searchParams`) must be properly awaited before accessing properties (e.g., `const { username } = await params`). |
| **Theme & Style** | Cyber-Crimson HSL Grid | Midnight background coordinates (`#050505` to `#0D0D0D`) with glassmorphism sheets and saturated red highlights (`#950000`). |
| **State Hydration** | Root level `suppressHydrationWarning` | Must remain active on `<html>` inside `layout.tsx` to handle custom client themes safely. |
| **Path Aliases** | `@/*` prefixes | All imports from components, libraries, or styles must resolve using the `@/` alias root. |

---

## 🛡️ Workspace Protocols & Rules

### 1. The Lucide Brand-Icon Compilation Constraint
> [!WARNING]
> **Lucide brand-icon exports are restricted.**
> Direct imports like `import { Github, Twitter, Youtube, Discord } from "lucide-react"` will cause Next.js Turbopack compiler builds to crash because those brand exports are absent in the local configuration module.
> **Action:** Declared brand icons must be designed as local inline SVGs inside your React code. Example:
> ```tsx
> const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
>   <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" {...props}>
>     <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
>   </svg>
> );
> ```

### 2. Async Dynamic Routing Parameters (Next.js 15+)
> [!IMPORTANT]
> **Always await `params` and `searchParams` promises in pages and layouts.**
> Under modern Next.js paradigms, route parameters are unresolved Promises. Accessing them synchronously will fail typecheck runs and crash production builds.
> **Action:** Keep dynamic inputs resolved asynchronously:
> ```typescript
> interface PageProps {
>   params: Promise<{ username: string }>;
> }
> export default async function Page({ params }: PageProps) {
>   const { username } = await params;
>   // Execute your queries...
> }
> ```

### 3. Absolute Path Resolution
> [!NOTE]
> **Always use `@/` absolute aliases.**
> All imports in components, libraries, and sub-pages must utilize absolute prefixing to avoid deep relative traversal (e.g. `../../../../components`).
> **Action:** Write clean, predictable imports:
> - `import { sql } from "@/lib/db";`
> - `import { Button } from "@/components/ui/button";`

### 4. Database Query Parameters and Case Insensitivity
> [!IMPORTANT]
> **Avoid raw string interpolation in SQL queries. Always lower-case usernames when checking uniqueness or fetching profiles.**
> SQL queries must use tagged templates to protect against injection. Usernames are queried case-insensitively using `LOWER()`.
> **Action:**
> ```typescript
> const users = await sql`
>   SELECT * FROM users 
>   WHERE LOWER(username) = LOWER(${username})
>   LIMIT 1
> `;
> ```

### 5. Hydration Mismatch Protection
* Next-themes reads theme parameters on the client. Keep `suppressHydrationWarning` assigned to the root `<html>` node inside the global [app/layout.tsx](file:///e:/Programming%20Projects/redrose/app/layout.tsx) file to ensure clean renders.

---

## 🎨 Visual Identity Checklists

When designing components, pages, or overlays:
1. **Harmonious Ambient Glows:** Restrict glows to fine border shadows (`box-shadow: 0 0 15px rgba(149, 0, 0, 0.15)`) and micro-animations. Avoid massive, fully saturated blocks of flat primary colors.
2. **Glassmorphic Backdrops:** Cards should use semi-transparent background blends (`rgba(13, 13, 13, 0.7)`) backed by heavy backdrop blurs (`backdrop-filter: blur(12px)`) to keep dashboard elements legible over dark noise.
3. **Fluid Micro-Animations:** Implement lightweight Framer Motion dynamic curves (`type: "spring"`, `stiffness: 120`, `damping: 18`) on interaction points, hover loops, and sidebar selections.
4. **Theme Accents:**
   * Crimson style (`#950000`/`#ef4444` borders and glows).
   * Violet style (`#a855f7` borders and glows).
   * Emerald style (`#22c55e` borders and glows).
   * Void style (stealth dark neutral borders).
