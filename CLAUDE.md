# CLAUDE.md

## Project Snapshot

**BSLCTR** — Next.js 15 + React 19 + TypeScript + Prisma 7 + PostgreSQL (Neon). Medical society website: public site (liver awareness, doctor directory, conferences, webinars, galleries) + read-only API. Admin/member dashboards removed 2026-09-20; slated for rebuild.

## Commands

```bash
npm run dev       # dev server (port 3000)
npm run build     # build + type-check + lint
npm run start     # serve production build
npm run seed      # seed admin row
npx tsc --noEmit  # type-check only (delete .next/ first)
```

⚠️ **`npm run lint` hangs** — no ESLint config. Use `npm run build` instead.

## Architecture & Conventions

**Path aliases**: `@/` → `./src/` (tsconfig only, no vite.config).  
**Routing**: `src/app/(main)/` wraps public site as `Navbar → Search → NavLinksBar → {children} → Footer`. Pages at `src/app/(main)/` or in `@/views/`.  
**Data**: Prisma + Neon adapter (serverless), singleton at `src/lib/prisma.ts`. Connection string via `.env` → `prisma.config.ts` → `prisma/schema.prisma`.  
**Styling**: Tailwind v4 via PostCSS. Design tokens (colors, utils) in `src/app/globals.css` using CSS variables. Quicksand font via `next/font/google` (max weight: 700).  
**Components**: shadcn/ui (New York variant), stored at `src/components/ui/`. Merge classes with `cn()` from `@/lib/utils.ts`.  
**Forms**: React Hook Form + Zod validation. Patient/Physician forms in `src/components/forms/` — no backend; `console.log` + alert only.

## Patterns We Do Not Use

- We do not verify admin auth on the server. `AdminLoginModal.tsx` checks hardcoded credentials client-side and writes to `localStorage`; nothing reads the `Admin` table. Member login (`/api/member/login`) does not exist.
- We do not write to the API from forms. `PatientForm` and `PhysicianForm` only log and alert; see git history for why backend was removed.
- We do not use ESLint directly. `next lint` hangs (no config); use `npm run build` for lint + type-check.
- We do not select `password` from `/api/members`. Personal contact details omitted from public directory.
- We do not assume dead code is wired up. `AutoplayCarousel`, `HeroSection`, `HeroSlider`, `Layout`, `ProtectedRoute`, `YoutubeLive`, `TopBar` are imported nowhere.

## Git & Version Control

**Push identity** — all pushes as `Muhammad-AIUB` / `mjubayer.aiub@gmail.com`:
```bash
git config user.name "Muhammad-AIUB" && git config user.email "mjubayer.aiub@gmail.com"
```
**Never push automatically.** Keep changes local unless explicitly asked.

## Known Landmines

- **`vercel.json` breaks routing** — SPA rewrite left over from Vite; deletes every route to `/`. Delete or fix before serverless deploy.
- **`components.json` misconfigured** — `tailwind.css` points to `src/index.css` (doesn't exist); real file is `src/app/globals.css`. `npx shadcn add` will fail until fixed.
- **`/api/upload` writes locally** — `public/uploads/` works in dev, fails on serverless.
- **Orphaned dependencies** — `@tiptap/*`, `jose` unused since dashboard removal; safe to delete.
- **`.env` untracked** — holds `DATABASE_URL`; both `prisma.config.ts` and `prisma/seed.ts` load it via `dotenv`.
- **`tsconfig.tsbuildinfo` committed** — appears modified after any type-check; expected here.

## Read First

- `src/app/layout.tsx` — root setup (font, cursor, wrapper)
- `src/views/Home.tsx` → `src/components/ConferenceHero.tsx` — hero section (conference date/location/title)
- `src/components/AdminLoginModal.tsx` — admin auth (hardcoded credentials in `ADMIN_CREDENTIALS` array)
- `src/app/globals.css` — design tokens, custom utilities, brand colors
- `prisma/schema.prisma` — data model

---

This file is a living document. Whenever an implementation gets rejected or corrected during a task, add the lesson to "Patterns We Do Not Use" — a rule plus its reason, not just a prohibition.
