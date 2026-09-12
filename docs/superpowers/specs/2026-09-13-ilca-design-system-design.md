# BSLCTR — ILCA Design System Adoption

**Date:** 2026-09-13
**Status:** Approved for planning

## Goal

Re-skin the entire BSLCTR public site to match the design language of
<https://ilcalive.org/annual-conference-2026/>. The admin dashboard and member
area are explicitly out of scope and must not change.

This is a visual/identity change only. No data model, API route, or auth flow
changes. Every existing page keeps its content and its behaviour.

## What is being copied, and what is not

Copied: the design system — typeface, colour tokens, type scale, heading
weight, spacing rhythm, component shapes, section patterns, hero treatment.

Not copied: ILCA's logo, photography, and body copy. BSLCTR keeps its own
mark and its own words throughout.

## Decisions

These were settled with the user before planning. They are not open.

| # | Question | Decision |
|---|----------|----------|
| 1 | Scope | Whole public site. Dashboard + member area untouched. |
| 2 | Palette | ILCA's exact colours — orange `#F16724`, navy `#0B4E84`. BSLCTR's teal is retired. |
| 3 | Home hero | Full-viewport (100vh) animated hero. |
| 4 | Home content | Keep BSLCTR's existing sections, restyled. Do not adopt ILCA's section set. |
| 5 | Nav tiles | Slim navy tile row carrying all 11 links, not ILCA's four big tiles. |

## Extracted design tokens

Read directly from ILCA's live DOM via computed styles.

| Token | Value | Notes |
|-------|-------|-------|
| Typeface | Quicksand | Rounded geometric sans, used for everything |
| Body text | 16px / 30px line-height, `#616161` | Line-height ratio 1.875 — unusually airy |
| Heading colour | `#232323` | |
| Heading weight | **500** | Not bold. This is load-bearing — see below. |
| h1 | 48px | |
| h3 | 40px | |
| h4 | 30px | |
| Accent | `#F16724` | Buttons, active nav tile, links |
| Deep | `#0B4E84` | Hero, nav tiles, footer |
| Watermark | 120px / weight 900 / uppercase / `#F6F6F6` | Sits behind section headings |
| Tile radius | ~8px (`0.5rem`) | |
| Button shape | Fully rounded pill, uppercase, letter-spaced | |

**On heading weight:** ILCA sets headings at weight 500 while Tailwind's
defaults and the current BSLCTR styles run bold. That single choice accounts
for most of the reference site's airy feel. The heading weight override must
be explicit, not left to defaults, or the rebuild will look heavy and wrong
despite having correct colours and fonts.

## Architecture

### Token layer — the leverage point

`src/app/globals.css` is where the work concentrates. The shadcn components
already read `--primary`, `--secondary`, `--radius` and friends, so replacing
the token *values* restyles every button, card, input, dialog and select
site-wide without touching those files.

```
--primary:    #F16724   (was teal oklch)
--secondary:  #0B4E84   (was #20768b)
--foreground: #232323
--body:       #616161
--wash:       #F6F6F6
--radius:     0.5rem    (was 0.625rem)
```

The teal brand-colour comment block at the top of `:root` describes colours
that will no longer exist and must be rewritten, not left stale.

### Typeface loading

Quicksand loads via `next/font/google` in `src/app/layout.tsx`, replacing the
Roboto Slab `@import url(...)` at the top of `globals.css`. This is the
Next.js-idiomatic path: self-hosted, no render-blocking network request, no
layout shift. The `@import` line is removed in the same change — leaving it
would keep fetching a font nothing uses.

Weights needed: 500 (headings), 400 and 600 (body and emphasis), 900
(watermark).

### New primitives

Three components carry the design system. Building these first is what makes
the eight-page restyle cheap.

| Component | Location | Responsibility |
|-----------|----------|----------------|
| `Section` | `src/components/ui/section.tsx` | The ILCA section wrapper: watermark word, eyebrow, light-weight title, vertical rhythm. Takes `watermark`, `eyebrow`, `title`, `children`. |
| `PillButton` | new `variant="pill"` in `src/components/ui/button.tsx` | Fully rounded, uppercase, letter-spaced. Added as a variant rather than a new component so it composes with existing `Button` usage. |
| `ConferenceHero` | `src/components/ConferenceHero.tsx` | 100vh navy panel, oversized display type, staggered word reveal. |

`Section` must be usable without a watermark (some sections won't want one),
so `watermark` is optional and the layout must not reserve space for it when
absent.

### Hero

Client component built on **framer-motion**, already a dependency at
`^12.9.2`. Words stagger in; eyebrow above (date and location); orange pill
CTA below. Background is the existing banner image, darkened toward navy.

**Reduced motion:** the hero must render its final state immediately when
`prefers-reduced-motion: reduce` is set. ILCA's own hero does not do this —
during design extraction it sat blank for over ten seconds and never fully
resolved under automation. Reproducing that failure would be copying a bug,
not a design. The animation is an enhancement over a correct static state,
never a gate on content appearing.

`HeroSection` (the current static banner) is replaced by `ConferenceHero` —
its banner image is reused as the hero background. `HeroSlider` is removed
from the home page: decision 4 fixes the below-hero order as exactly the four
named sections, and a rotating slider directly beneath a 100vh hero would
compete with it. The component file stays in the repo, unused, rather than
being deleted — removing it is a separate call.

### Shared chrome

**`Navbar`** — sticky translucent bar; logo left, centered nav, search icon
and orange pill CTA right. The admin and member auth menus, their
`localStorage` handling, the pending-count polling and all click-outside
behaviour stay exactly as they are. This is a restyle of the markup around
that logic, not a rewrite of it.

**`NavLinksBar`** — navy bar, auto-width tiles, active tile orange, wrapping
on narrow viewports. All 11 links stay: Home, Live Webinars, BSLCTRcon,
Doctors, Guidelines, Cases, Gallery, Q&A, Donation, Subscribe, About Us. The
two dropdowns (Doctors detail, Guidelines children) and the Subscribe modal
must keep working. The mobile `Sheet` gets the same palette treatment.

**`Footer`** — navy panel, social icons, copyright row.

**`TopBar`** — currently a construction notice using `bg-primary/10`. It will
inherit orange automatically from the token swap; it needs a visual check
rather than a rewrite.

### Home page

Order below the hero, per decision 4:

```
ConferenceHero        100vh navy
NavLinksBar tiles     slim navy row
  CHAIRMAN     →  Message from the Chairman
  MOMENTS      →  Photo gallery
  UPDATES      →  Recent updates
  TREASURER    →  Message from the Treasurer
Footer                navy
```

Each of the four existing components is wrapped in `Section` with its
watermark and eyebrow. Their content and data-fetching are unchanged.

### Page pass

Eight public pages rewrapped in `Section` and inheriting the new tokens:
`doctors`, `gallery`, `live`, `live-webinars`, `cases`, `guidelines`,
`patients-guidelines`, `bslctrcon`.

`doctors` has a BN/EN language toggle and district filtering, and `bslctrcon`
has `lectures` and `moments` subpages. These keep their behaviour; only
presentation changes.

## Out of scope

- `src/app/(admin)/**` — the entire dashboard
- `src/app/(member)/**` — member signup and dashboard
- All `src/app/api/**` routes
- Prisma schema and seeds
- Auth flows, both admin `localStorage` and member JWT

The token swap in `globals.css` is global, so admin and member pages will
pick up the new colours by inheritance. That is acceptable and expected —
what must not happen is editing their markup or layout.

## Verification

- `npm run build` passes — this runs the TypeScript check
- `npm run lint` passes
- Every public route renders: `/`, `/doctors`, `/doctors/[slug]`, `/gallery`,
  `/gallery/photo`, `/gallery/video`, `/live`, `/live-webinars`, `/cases`,
  `/guidelines`, `/patients-guidelines`, `/bslctrcon`,
  `/bslctrcon/lectures`, `/bslctrcon/moments`
- Admin login, member login, and the Subscribe modal all still open and work
- Both `NavLinksBar` dropdowns still open
- Mobile `Sheet` navigation still opens and navigates
- Hero renders its final state with `prefers-reduced-motion: reduce`
- No teal (`#00A2B7`, `#20768b`) remains in the public surface
- No Roboto Slab reference remains anywhere

## Risks

**Contrast.** Orange `#F16724` on white fails WCAG AA for normal-size body
text (~3.1:1). It is safe for large text, for the pill buttons where it is a
background behind white, and for the active nav tile. It must not become the
colour of small body copy or small links on white. Where an orange link sits
in running text, it needs an underline or a darkened shade to carry the
contrast.

**Heading weight regression.** Any heading left at Tailwind's default bold
will visually break the design. Worth an explicit sweep rather than trusting
component-by-component edits.

**Hero and CLS.** A 100vh hero with a background image and animated type is
the highest layout-shift risk on the site. Image dimensions must be reserved.

**Stale project documentation.** `CLAUDE.md` describes this project as React +
Vite with `src/pages/`, `src/App.tsx`, and a Vite-based build. The project is
actually Next.js 15 with the App Router, Prisma, and a member auth system.
None of the routing or architecture described there is accurate. This does not
block the redesign, but anyone reading `CLAUDE.md` for orientation will be
misled. Correcting it is not part of this work and should be raised separately.
