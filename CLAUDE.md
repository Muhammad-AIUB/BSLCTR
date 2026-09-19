# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BSLCTR (Bangladesh Society of Liver, Cholangiocarcinoma and Transplant Research) — a Next.js
medical society website: liver disease awareness, a doctor directory, conference pages
(BSLCTRcon), live webinars, galleries, and patient guidelines.

The admin and member dashboards were **removed on 2026-09-20** and are slated for a rebuild.
See `docs/superpowers/specs/2026-09-20-dashboard-teardown-design.md` for exactly what went
and why. What is left is the public site plus a read-only public API.

## Tech Stack

- **Framework**: Next.js 15 (App Router) with React 19 and TypeScript
- **Database**: Prisma 7 against PostgreSQL, via the Neon serverless driver adapter
- **Styling**: Tailwind CSS v4 through **PostCSS** (`@tailwindcss/postcss`), not the Vite plugin
- **UI Components**: Radix UI primitives with shadcn/ui (New York style variant)
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion, embla-carousel-react
- **Icons**: lucide-react
- **Font**: Quicksand via `next/font/google` (ships 300–700 only — 700 is the heaviest real
  weight; do not request 900)

## Development Commands

```bash
# Start development server
npm run dev

# Build for production (Next also runs type-checking and lint here)
npm run build

# Serve the production build
npm run start

# Seed the database (creates the admin row)
npm run seed
```

**`npm run lint` does not work in this repo.** There is no ESLint config file, so `next lint`
drops into an interactive setup prompt and hangs. Use `npm run build` for verification — it
type-checks and lints as part of the build. To type-check alone, run `npx tsc --noEmit`, but
delete `.next/` first: a stale `.next/types/validator.ts` reports phantom errors for routes
that no longer exist.

## Architecture

### Path Aliases

`@/` maps to `./src/`, configured in `tsconfig.json` only (there is no `vite.config.ts`):

- `@/components` — all React components
- `@/lib` — utilities, Prisma client, static data
- `@/views` — large page bodies that route files import

### Application Structure

**Root layout** (`src/app/layout.tsx`): sets the Quicksand font variable, renders
`<LiverCursor />`, and wraps everything.

**Route groups**:

- `src/app/(main)/` — the entire public site. Its `layout.tsx` composes
  `Navbar → Search → ScrollToTop → NavLinksBar → {children} → Footer`.
  (Note: `TopBar.tsx` exists but is **not** in this layout.)
- `src/app/api/` — route handlers.

**Pages that exist** (everything is in `(main)` unless noted):

| Route | Source |
|---|---|
| `/` | `page.tsx` → `@/views/Home` |
| `/live-webinars` | `live-webinars/page.tsx` → `@/views/Live-Webinars` |
| `/live` | `live/page.tsx` → `@/views/Live` |
| `/bslctrcon`, `/bslctrcon/lectures`, `/bslctrcon/moments` | `bslctrcon/` |
| `/cases` | `cases/page.tsx` |
| `/doctors`, `/doctors/[slug]` | `doctors/` (SSG from `@/lib/doctors`) |
| `/gallery`, `/gallery/photo`, `/gallery/video` | `gallery/` |
| `/patients-guidelines` | `patients-guidelines/page.tsx` |

**Known broken links**: `NavLinksBar` links to `/guidelines`, `/qa`, `/donate` and `/about`.
None of those pages exist — all four 404 today. `/subscribe` in that same list is marked
`isModal: true`, so it opens `SubscribeModal` rather than navigating; that one is fine.

`next.config.ts` holds one permanent redirect: `/hepatologist-surgeon-interventiona` → `/doctors`.

### Data Layer

- `prisma/schema.prisma` — models `Admin`, `Webinar`, `Video`, `Photo`, `Member`,
  `CasePresentation`, `Guideline`; enums `UploadStatus` and `MemberStatus`.
- The `datasource` block carries **no `url`**. The connection string comes from
  `prisma.config.ts`, which reads `DATABASE_URL` out of `.env`.
- `src/lib/prisma.ts` — singleton client using `PrismaNeon` (the serverless adapter),
  cached on `globalThis` outside production.
- `prisma/seed.ts` uses a **different** adapter — `PrismaPg` over a `pg` `Pool`. Both
  adapter packages are dependencies for this reason.

### API Routes

All public routes are read-only `GET` except `/api/upload`.

| Route | Notes |
|---|---|
| `/api/webinars` | Also **deletes expired webinars** as a side effect of the GET |
| `/api/photos`, `/api/videos` | List uploads |
| `/api/case-presentations` | List case presentations |
| `/api/members` | Public directory. Returns `APPROVED` members only and omits `email` and `mobileNo` — those are personal contact details from signup, not directory data. **Never select `password`.** |
| `/api/upload` | `POST` only. Writes into `public/uploads/` — a local-filesystem write that will not survive a serverless deploy |

### Authentication

Admin auth is a **client-side stub**, not real authentication:

- `AdminLoginModal.tsx` compares against credentials hardcoded in the component and, on a
  match, writes `{ email, loggedInAt }` to `localStorage` under the key `adminAuth`.
- Nothing on the server verifies it. The `Admin` table is still seeded by `prisma/seed.ts`,
  but no code reads it any more — the routes that did were deleted.
- `MemberLoginModal.tsx` is still rendered by `Navbar`, but it posts to `/api/member/login`,
  which no longer exists. **Member login cannot succeed.** Both modals were deliberately kept
  so a rebuilt dashboard can wire straight back into them.

### Component Organization

**Shared layout** (`src/components/shared/`): `Navbar.tsx` (logo plus the Admin Login and
Member buttons — nothing else), `NavLinksBar.tsx` (primary nav, hosts `SubscribeModal`),
`Footer.tsx`.

**Feature components** (`src/components/`): `ConferenceHero`, `MessageFromChairman`,
`MessageFromTreasurer`, `PhotoGallery`, `RecentUpdates` (these five compose `@/views/Home`),
plus `Search`, `ScrollToTop`, `LiverCursor`, `SubscribeModal`, `AdminLoginModal`,
`MemberLoginModal`, `DistrictCombobox` and `LanguageToggle` (doctors pages), `ShareButtons`
(Live-Webinars), `ShareMenu` (patients-guidelines).

**Forms** (`src/components/forms/`): `PatientForm.tsx` and `PhysicianForm.tsx`, both reached
through `SubscribeModal`, both validated with Zod. **These two really do have no backend** —
they carry `// TODO: Implement form submission logic`, `console.log` the values and show an
`alert`. This is the one place the old "no backend" note still holds; everything else on the
site talks to Prisma.

**UI components** (`src/components/ui/`): shadcn/ui, New York variant, configured by
`components.json`. Use `cn()` from `@/lib/utils.ts` for className merging.

**Dead code — do not assume these are wired up.** Nothing imports any of them:
`AutoplayCarousel.tsx`, `HeroSection.tsx`, `HeroSlider.tsx`, `Layout.tsx`,
`ProtectedRoute.tsx`, `YoutubeLive.tsx`, `shared/TopBar.tsx`. `ProtectedRoute` in particular
is a leftover from the React Router era and guards nothing.

### Styling System

- Tailwind CSS v4 via PostCSS — `postcss.config.mjs` registers `@tailwindcss/postcss`.
- Design tokens live in **`src/app/globals.css`**: `@import "tailwindcss"`, a `:root` block of
  CSS variables, and an `@theme inline` block that maps them to Tailwind color utilities.
  Brand colors are `--primary: #f16724` (orange) and `--secondary: #0b4e84` (blue).
- That file also defines custom utilities the components rely on: `.page-container`,
  `.focus-ring`, `.menu-panel`, `.menu-item`, `.card-hover`, `.watermark`, `.animate-slide-in`.
- Extra animations come from `tw-animate-css`.
- Component variants use `class-variance-authority`; `cn()` combines `clsx` and `tailwind-merge`.

### TypeScript Configuration

A single `tsconfig.json` — **not** a composite project, and there is no `tsconfig.app.json` or
`tsconfig.node.json`. Strict mode on, `noEmit`, `moduleResolution: "bundler"`, the `next`
plugin, and `prisma` excluded from the program.

## Git & Version Control

- **Push identity**: All pushes to this repository must always be made as:
  - Name: `Muhammad-AIUB`
  - Email: `mjubayer.aiub@gmail.com`
- Remote: `origin` → https://github.com/Muhammad-AIUB/BSLCTR.git
- Set the identity locally for this repo before pushing:

```bash
git config user.name "Muhammad-AIUB" && git config user.email "mjubayer.aiub@gmail.com"
```

- **Never push automatically.** Commits and pushes only happen when the user explicitly asks for them; otherwise keep all changes local.

## Known Landmines

Verified against the working tree — these are real, not hypothetical:

- **`vercel.json` would break routing.** It contains `{"rewrites": [{"source": "/(.*)",
  "destination": "/"}]}`, a single-page-app rewrite left over from the Vite build. Every route
  is rewritten to `/`. Fix or delete it before relying on a Vercel deploy.
- **`components.json` points at a file that does not exist.** Its `tailwind.css` field says
  `src/index.css`; the real stylesheet is `src/app/globals.css`. `npx shadcn add` will misbehave
  until that is corrected.
- **`/api/upload` writes to the local filesystem** (`public/uploads/`). That works in dev and
  fails on serverless hosting.
- **Orphaned dependencies.** The `@tiptap/*` packages and `jose` are still in `package.json`
  but nothing imports them — they went unused when `RichTextEditor.tsx` and `lib/memberAuth.ts`
  were deleted.
- **`.env` is untracked** and holds `DATABASE_URL`. Both `prisma.config.ts` and `prisma/seed.ts`
  load it with `dotenv`.
- **`tsconfig.tsbuildinfo` is committed to git** in this repo, so it shows up as a modified file
  after any type-check. That is existing convention here, not a mistake to clean up.
