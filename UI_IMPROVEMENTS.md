# UI Improvements Log

> Living progress document for the BSLCTR UI quality pass.
> **This file is updated after every completed task.** (Kept separate from `CLAUDE.md`, which holds project build instructions and must not be overwritten.)

**Stack:** Next.js 15 (App Router) · React 19 · Tailwind CSS v4 · shadcn/ui (New York) · Prisma
**Started:** 2026-07-16

---

## Design System — Canonical Scales

These are the single sources of truth. When editing any component, conform to these.

### Spacing
Use the standard step scale only: `2 · 4 · 6 · 8 · 12 · 16 · 24`. No arbitrary values (`p-[13px]`).
Section vertical rhythm: `py-12` (compact) · `py-16` (default) · `py-24` (hero/large).

### Border radius (2 tiers + pills)
| Use | Class |
|-----|-------|
| Small controls: buttons, inputs, badges | `rounded-md` |
| Surfaces: cards, panels, modals, dropdowns, images | `rounded-xl` |
| Pills / avatars / toggles | `rounded-full` |

`rounded-2xl` and card-like `rounded-lg` are collapsed into `rounded-xl`.

### Shadows (hierarchy)
| Elevation | Class |
|-----------|-------|
| Resting control | `shadow-xs` |
| Resting card | `shadow-sm` → `hover:shadow-md` |
| Nav / sticky header | `shadow-md` |
| Dropdown / popover | `shadow-lg` |
| Modal / dialog | `shadow-xl` |

### Color
- Prefer theme tokens: `bg-primary` (teal brand), `bg-secondary` (deep teal nav), `text-foreground`, `text-muted-foreground`, `border-border`, `bg-muted` (hover surface), `bg-card`.
- Neutrals consolidated onto theme tokens instead of ad-hoc `slate-*` / `gray-*`.
- Body copy must meet WCAG AA — no `text-gray-400` / `text-white/40` for readable text.

### Typography
- Headings: `text-3xl/2xl/xl/lg` + `font-bold`/`font-semibold` + `leading-tight` + `tracking-tight`.
- Body: `leading-relaxed`.
- Tiny labels use the new `text-2xs` (0.625rem) token — not `text-[10px]`.

### Interactive states (every button/link)
`hover:` + `focus-visible:` (visible ring via `.focus-ring`) + `active:` + `disabled:` + `transition-colors`/`transition-all duration-200`.

### Reusable helpers (in `globals.css`)
- `.page-container` — `mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8`
- `.focus-ring` — accessible focus ring for custom controls
- `.menu-panel` / `.menu-item` — dropdown surface + row (used across Navbar)
- `.card-hover` — lift + shadow on hover

---

## Task Checklist

Legend: ✅ done · 🔧 in progress · ⬜ pending

### Phase 0 — Foundation
- ✅ `globals.css` — added `text-2xs` token + `.page-container`, `.focus-ring`, `.menu-panel`, `.menu-item`, `.card-hover`

### Phase 1 — Shared layout (most visible)
- ✅ `shared/TopBar.tsx`
- ✅ `shared/Navbar.tsx`
- ✅ `shared/NavLinksBar.tsx`
- ✅ `shared/Footer.tsx`

### Phase 2 — Home page stack
- ✅ `HeroSection.tsx` (image-only, no change needed) · `HeroSlider.tsx` (focus ring on dots)
- ✅ `MessageFromChairman.tsx` (radius) · `MessageFromTreasurer.tsx` (purple → teal re-brand)
- ✅ `PhotoGallery.tsx` (shadow scale + filter focus rings) · `RecentUpdates.tsx` (brand headings + container)

### Phase 3 — Forms & modals
- ✅ `SubscribeModal.tsx` · `AdminLoginModal.tsx` · `MemberLoginModal.tsx`
- ✅ `forms/PatientForm.tsx` · `forms/PhysicianForm.tsx`

### Phase 4 — Public pages & views
- ✅ `views/Live-Webinars.tsx` · `views/Live.tsx`
- ✅ `app/(main)/cases` · `app/(main)/gallery` (+ `photo`, `video`) · `app/(main)/bslctrcon` (+ `lectures`, `moments`)
- ✅ misc components: `Search.tsx` · `ShareButtons.tsx` · `RecentUpdates.tsx` (done in Phase 2)
- ⏭️ `views/Gallery.tsx`, `views/Webinar.tsx` — **unused/dead code** (no route imports them); skipped intentionally. `AutoplayCarousel`, `YoutubeLive`, `RichTextEditor`, `LiverCursor` — pending (low visual priority).

### Phase 5 — Admin & member dashboards
- ✅ `app/(admin)/dashboard/layout.tsx` (shared admin chrome)
- ✅ `app/(admin)/dashboard/*` (notifications, webinars, videos, photos, guidelines, case-presentations)
- ✅ `app/(member)/member-signup` · `app/(member)/member-dashboard`

### Phase 6 — Verify
- ✅ `tsc -b` (project typecheck) passes clean (exit 0) — no type/syntax errors
- ✅ All 20+ routes return HTTP 200; no console or server errors; design-system tokens confirmed via computed styles
- ⚠️ `next lint` — ESLint is **not configured** in this repo (interactive setup prompt); pre-existing, unrelated to these changes
- ⚠️ Full `next build` not run — it statically renders DB-backed pages and needs live DB credentials; per-route dev compilation + `tsc -b` cover correctness instead

---

## Status: ✅ Complete

Every rendered component/page has been brought onto one design system. Not touched (intentional):
- `views/Gallery.tsx`, `views/Webinar.tsx` — **dead code**, imported by no route (still contain old blue/sky styling; delete candidates).
- `LiverCursor.tsx`, `AutoplayCarousel.tsx`, `YoutubeLive.tsx`, `RichTextEditor.tsx` — behavior/util components with negligible standalone styling.

Note: the in-app screenshot tool couldn't capture frames because the site runs continuous animations (custom cursor + `animate-pulse`); verification was done via HTTP status, `tsc -b`, and computed-style probes instead.

---

## Changelog

_(newest first)_

- **2026-07-16** — **Phases 5 & 6 (dashboards + verification) complete.**
  - `dashboard/layout.tsx`: count badge `bg-red-500`/`text-[10px]`/`min-w-[20px]` → `bg-destructive`/`text-2xs`/`min-w-5`; low-contrast `text-white/50`,`/60` captions → `/70`; hamburger button got a `focus-visible` ring.
  - `member-signup`: `sky-50` wash → `primary/5`; `rounded-2xl` cards → `rounded-xl`; chamber sub-panel `slate-50`/`rounded-lg` → `muted`/`rounded-md`; error box → `destructive` tokens + `role="alert"`; low-contrast helper text + chamber-remove button fixed with tokens & focus ring.
  - `Navbar`: last off-brand color removed — admin avatar `bg-blue-700` → `bg-secondary` (deep teal), keeping admin visually distinct from the teal-600 member avatar while staying on-brand.
  - **6 admin CRUD pages + member-dashboard** (via subagent, className-only): `rounded-2xl`→`rounded-xl`, control `rounded-lg`→`rounded-md`, `shadow-2xl`→`shadow-lg`, off-brand blue accents→`primary`, notification badges→`destructive`, `text-slate-400`→`slate-500`, and `focus-visible` rings added to every hand-rolled button/link (destructive actions use a destructive ring). Semantic status colors (green approve / red reject / amber pending) intentionally preserved.
  - **Verification:** `tsc -b` exit 0; whole-repo grep shows 0 off-brand `blue/sky/indigo` in active code (only the two dead-code views remain); all routes HTTP 200.
- **2026-07-16** — **Phase 4 (public pages & views) complete.** Unified the whole public surface onto the **teal brand** — removed all off-brand `blue-*`/`sky-*`/`indigo-*` (verified 0 remaining in `app/(main)`):
  - `Search` (global): blue search button → `bg-secondary`; added `focus-within` ring to the search pill; icon/text → theme tokens.
  - `Live-Webinars`: page wash `sky-50` → `primary/5`; card gradients blue/indigo → teal/cyan; Join Now gradient → `bg-secondary`; `rounded-2xl` → `rounded-xl`; colored `shadow-sky-100` → `shadow-primary/10`; sponsor chips `slate-50`/`rounded-lg` → `muted`/`rounded-md`; low-contrast `slate-400` → `slate-500`.
  - `Live`: sky wash/heading/border/link → teal (`primary`/`secondary`); `rounded-2xl` → `rounded-xl`; added link focus styles + `leading-relaxed`.
  - `cases`, `gallery` (+photo/video), `bslctrcon` (+lectures/moments): sky/blue washes → `primary/5`; card gradients → teal/cyan; icons → `text-white` on gradients / `text-primary`; `rounded-2xl` → `rounded-xl`; card shadows normalized to `shadow-sm` → `hover:shadow-lg`; play buttons `bg-blue-600` → `bg-primary`; **added `focus-visible` rings to all card links, year buttons, and back links**; `slate-400` → `slate-500`; lightbox surfaces `rounded-lg` → `rounded-xl`.
  - `ShareButtons`: social hex colors kept (brand-accurate); label contrast fixed; focus rings added to share links.
  - **Verification:** dev server recompiled clean; `/`, `/cases`, `/bslctrcon`, `/gallery`, `/live-webinars` all HTTP 200, no server errors.
- **2026-07-16** — **Phase 3 (forms & modals) complete.** All use shadcn Form/Dialog/Input (focus + error states already correct), so fixes were brand/consistency:
  - `SubscribeModal`: Patient/Physician choice buttons `bg-red-700`/`bg-blue-800` → brand `bg-secondary`/`bg-primary` + `active:scale`.
  - `AdminLoginModal`: navbar trigger `bg-blue-800` pill → white-overlay pill matching the Member button (consistent navbar).
  - `MemberLoginModal`: error box `red-500/50/200` → `destructive` tokens + `rounded-md` + `role="alert"`.
  - `PatientForm`/`PhysicianForm`: off-brand `bg-blue-800` submit → `bg-secondary`; semantically-odd red "Back" button → neutral `text-muted-foreground hover:bg-muted`; `bg-slate-50` note → `bg-muted` + `leading-relaxed`.
  - **Verification checkpoint:** dev server compiled clean (no `@apply` errors), home page HTTP 200, no console/server errors; confirmed `text-2xs`/`.page-container`/`.menu-item` resolve via computed styles.
- **2026-07-16** — **Phase 2 (home page stack) complete.**
  - `MessageFromTreasurer`: re-branded from an off-brand **purple** theme (`purple-50/200/600`, `rgba(139,69,190)`) to the site's **teal** brand (`primary`/`secondary`); card border `gray-200` → `slate-200`.
  - `MessageFromChairman`: content card `rounded-2xl` → `rounded-xl`; padding `p-5` → `p-6` (on scale).
  - `PhotoGallery`: card shadow `shadow-md`/`hover:shadow-2xl` → `shadow-sm`/`hover:shadow-lg` (matches hierarchy); category filter buttons got `focus-visible` rings; lightbox image/info surfaces `rounded-lg` → `rounded-xl`. (Empty state already present ✅.)
  - `RecentUpdates`: off-brand `text-sky-800` headings → `text-secondary`; `gray-600` body → `slate-600`; `max-w-7xl mx-auto px-4` → `.page-container`; added `leading-tight`/`tracking-tight` on headings, `leading-relaxed` on body.
  - `HeroSlider`: pagination dot buttons got a visible `focus-visible` ring + `active:scale-90`.
- **2026-07-16** — **Phase 1 (shared layout) complete.**
  - `TopBar`: one-off `bg-cyan-100`/`text-gray-900`/heavy `shadow-md` → brand-tinted `bg-primary/10` banner with `border-b`, `text-sm`.
  - `Navbar`: added `.focus-ring` + `active:scale-95` to all hand-rolled avatar/menu buttons; `rounded-2xl`+`shadow-xl` dropdowns → `.menu-panel`; repeated menu rows → `.menu-item`; `slate-*` neutrals → theme tokens (`text-foreground`/`text-muted-foreground`/`border-border`); `bg-red-500` badges → `bg-destructive`; arbitrary `text-[10px]`/`min-w-[18px]`/`h-[18px]` → `text-2xs`/`size-5`/`size-11`.
  - `NavLinksBar`: unified mobile menu (was `bg-sky-500`/`bg-sky-400`) and desktop bar onto one teal `bg-secondary` surface with contrast-safe `hover:bg-white/10` + active `bg-white/20`; dividers → `bg-white/15`; badge `text-[9px]`/`text-[10px]` → `text-2xs`.
  - `Footer`: off-brand `bg-blue-900` → on-brand `bg-teal-900`; `container mx-auto px-4 py-10` → `.page-container py-12`; Subscribe button got focus ring + `active:scale-95`; low-contrast `text-white/50` → `text-white/60`; links got `focus-visible` styles.
- **2026-07-16** — Phase 0: added `globals.css` design-system layer (`text-2xs` token; `.page-container`, `.focus-ring`, `.menu-panel`, `.menu-item`, `.card-hover`).
- **2026-07-16** — Created this tracking doc; audited codebase (392 raw palette-color uses across 36 files, 27 arbitrary spacing values, mixed radii/shadows, missing focus states on hand-written buttons). Established canonical design-system scales above.
