# CLAUDE.md

## Project Snapshot

**BSLCTR** — Next.js 15 + React 19 + TypeScript + Prisma 7 + PostgreSQL (Neon). Medical society website: public site (liver awareness, doctor directory, conferences, webinars, galleries), an admin dashboard at `/dashboard` (guidelines, webinars, gallery, and read-only lists of conference registrations and member signups with CSV export), and an API (public reads, signup and conference-registration writes, admin writes behind a session cookie). The member dashboard was removed 2026-09-20 and is not rebuilt.

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
**Routing**: `src/app/(main)/` wraps public site as `Navbar → NavLinksBar → {children} → Footer`. Pages at `src/app/(main)/` or in `@/views/`.  
**Data**: Prisma + Neon adapter (serverless), singleton at `src/lib/prisma.ts`. Connection string via `.env` → `prisma.config.ts` → `prisma/schema.prisma`.  
**Styling**: Tailwind v4 via PostCSS. Design tokens (colors, utils) in `src/app/globals.css` using CSS variables. Quicksand font via `next/font/google` (max weight: 700).  
**Components**: shadcn/ui (New York variant), stored at `src/components/ui/`. Merge classes with `cn()` from `@/lib/utils.ts`.  
**Forms**: React Hook Form + Zod validation. `MemberSignupForm` and `ConferenceRegistrationForm` POST to `/api/member/signup` and `/api/conference/register`, which save to the database; admins read both from the dashboard (`src/lib/submissions.ts`). The Patient/Physician forms in `src/components/forms/` have no backend and are not mounted: the Subscribe buttons open a "not open yet" notice.

## Patterns We Do Not Use

- We do not check admin auth in the browser. Admins come from the `ADMIN_CREDENTIALS` env var; `src/lib/admin-auth.ts` signs an httpOnly session cookie, and every `/api/admin/*` route and the `/dashboard` layout verify it on the server, because a client-side check can be bypassed. Nothing reads the `Admin` table. Member login (`/api/member/login`) does not exist.
- We do not give `PatientForm` or `PhysicianForm` a backend, and we do not mount them without one. They only log and alert (see git history for why the backend was removed), and Subscribe used to take a patient's health details and discard them; `SubscribeModal` now shows a notice instead. `MemberSignupForm` and `ConferenceRegistrationForm` are the forms that write, through their API routes.
- We do not change data in a GET handler. `/api/webinars` used to delete past webinars on every read, so a webinar vanished the moment it started; it now only hides them, and admins delete from the dashboard.
- We do not read webinar dates in the server's or the visitor's timezone. They are Bangladesh time (UTC+6): use `webinarStart()` and `webinarHasStarted()` from `src/lib/webinars.ts`, because `new Date("…T…")` and `toISOString()` shift with the host timezone.
- We do not render sample content when real data is missing. `PhotoGallery` once fell back to stock photos captioned as society events on the home page; a section with no data is left out instead.
- We do not tell a user something happened unless the code did it. No "email sent" or "registration received" message without the send or the saved row behind it.
- We do not pass database HTML to `dangerouslySetInnerHTML` unsanitised. Run it through `DOMPurify.sanitize` first (see `cases/page.tsx`), because any stored `<script>`/`onerror` would run on the same origin as the admin session.
- We do not use ESLint directly. `next lint` hangs (no config); use `npm run build` for lint + type-check.
- We do not select `password` from `/api/members`. Personal contact details omitted from public directory.
- We do not assume dead code is wired up. `AutoplayCarousel`, `HeroSection`, `HeroSlider`, `Layout`, `ProtectedRoute`, `YoutubeLive`, `TopBar`, `PatientForm`, `PhysicianForm` are imported nowhere.
- We do not show a failed load as an empty list. A database error used to render "No clinical guidelines published yet" and, in the dashboard, "Nothing published yet"; loaders return `null` and fetching pages keep a failed state, so the page says it could not load. (The home page's photo strip is the exception: it is left out, like any section with no data.)
- We do not call a webinar live from its date alone. One scheduled for 8 pm was labelled "Live" from midnight; `webinarHasStarted()` compares the start instant.
- We do not send a caught error's message to the browser unless it is an `UploadError` (`src/lib/uploads.ts`). A Prisma or filesystem failure otherwise reaches the admin as a 400 with server paths in it.
- We do not put a `<Button>` inside a `<Link>` or `<a>`. That is two tab stops for one link; use `<Button asChild><Link …/></Button>`.
- We do not leave HEAD to Next on a route that streams a file. Next answers HEAD by running GET and then drops the body unread, which left every uploaded file open after one `curl -I`; `/api/files/[name]` exports its own `HEAD` and ties each stream to `req.signal`.
- We do not give a `useSearchParams` page an empty Suspense fallback. Only the fallback is in the prerendered HTML, so `/doctors` shipped with no doctors in it; the fallback is the page's default content.
- We do not write a form value into a CSV by hand. The rows come from public forms, and a cell starting with `=`, `+`, `-` or `@` runs as a formula in the admin's spreadsheet; `toCsv()` in `src/lib/csv.ts` neutralises those and keeps phone and BMDC numbers as text.
- We do not put a control on the page that does nothing. The site-wide search box had no handler and was removed; a feature that is not built yet gets no control, or one that says so.
- We do not build an overlay without dialog behaviour. The photo lightboxes could not be opened or left from the keyboard; `useModal()` from `src/lib/use-modal.ts` moves focus in and out, keeps Tab inside and stops the page behind scrolling.

## Git & Version Control

**Push identity** — all pushes as `Muhammad-AIUB` / `mjubayer.aiub@gmail.com`:
```bash
git config user.name "Muhammad-AIUB" && git config user.email "mjubayer.aiub@gmail.com"
```
**Never push automatically.** Keep changes local unless explicitly asked.

## Known Landmines

- **`vercel.json` breaks routing** — SPA rewrite left over from Vite; deletes every route to `/`. Delete or fix before serverless deploy.
- **`components.json` misconfigured** — `tailwind.css` points to `src/index.css` (doesn't exist); real file is `src/app/globals.css`. `npx shadcn add` will fail until fixed.
- **Uploads are written to local disk** — `src/lib/uploads.ts` saves to `uploads/` (or `UPLOAD_DIR`) and `/api/files/[name]` serves them; works on a persistent server, fails on serverless. The old unauthenticated `/api/upload` route was deleted.
- **No migrations folder** — a change to `prisma/schema.prisma` reaches the database only through `npx prisma db push`.
- **Orphaned dependencies** — `@tiptap/*`, `jose` unused since dashboard removal; safe to delete.
- **`.env` untracked** — holds `DATABASE_URL`; both `prisma.config.ts` and `prisma/seed.ts` load it via `dotenv`.
- **`tsconfig.tsbuildinfo` committed** — appears modified after any type-check; expected here.

## Read First

- `src/app/layout.tsx` — root setup (font, cursor, wrapper)
- `src/views/Home.tsx` → `src/components/ConferenceHero.tsx` — hero section (conference date/location/title)
- `src/lib/admin-auth.ts` — admin auth (env-var credentials, signed session cookie, login throttling); `src/components/AdminLoginModal.tsx` is only the form
- `src/app/globals.css` — design tokens, custom utilities, brand colors
- `prisma/schema.prisma` — data model

---

This file is a living document. Whenever an implementation gets rejected or corrected during a task, add the lesson to "Patterns We Do Not Use" — a rule plus its reason, not just a prohibition.
