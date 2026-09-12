# ILCA Design System Adoption — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin the entire BSLCTR public site to the design language of
<https://ilcalive.org/annual-conference-2026/> — Quicksand typeface, orange/navy
palette, light-weight headings, watermark section headers, and a full-viewport
animated hero — without touching the admin dashboard or member area.

**Architecture:** The work concentrates in `src/app/globals.css`. The shadcn
components already read `--primary`, `--secondary` and `--radius`, so swapping
the token *values* restyles every button, card, input and dialog site-wide for
free. Three new primitives (`Section`, a `pill` button variant, and
`ConferenceHero`) then carry the distinctive ILCA patterns, which makes the
eight-page restyle mostly a matter of wrapping existing content.

**Tech Stack:** Next.js 15.5 App Router · React 19 · Tailwind CSS v4
(`@theme inline`) · shadcn/ui · framer-motion 12 · `next/font/google`

**Spec:** `docs/superpowers/specs/2026-09-13-ilca-design-system-design.md`

---

## Global Constraints

- **Palette is fixed:** accent `#F16724`, deep `#0B4E84`, headings `#232323`,
  body `#616161`, watermark wash `#F6F6F6`. No teal anywhere on the public surface.
- **Heading weight is 500**, never bold. This is load-bearing — it accounts for
  most of the reference site's airy feel.
- **Body text is 16px with a 30px line-height** (ratio 1.875).
- **Typeface is Quicksand**, loaded via `next/font/google`, never via `@import`.
- **Do not modify** `src/app/(admin)/**`, `src/app/(member)/**`, `src/app/api/**`,
  `prisma/**`, or any auth flow. Restyling the markup *around* existing auth
  logic in `Navbar` is allowed; rewriting that logic is not.
- **Do not commit or push** unless the user explicitly asks. Per `CLAUDE.md`,
  all changes stay local. Every task below ends at a verification step, not a
  commit — see "Verification cycle" immediately below.
- **Preserve all behaviour.** Every link, dropdown, modal and route that works
  now must still work after.

### Correction to the spec: Quicksand has no weight 900

The spec records ILCA's watermark type as `weight 900`, read from their
computed styles. **Quicksand does not ship a 900 weight** — the family runs
300–700. ILCA requests a weight the font cannot provide.

This project sets `font-synthesis: none` in `:root`, so a requested 900 would
not be faux-bolded; it would render at 700 regardless. **Use weight 700 for the
watermark.** This is what ILCA actually renders, not a compromise.

### Verification cycle — read before starting

**This project has no test framework.** There is no jest, vitest, Playwright or
Cypress in `package.json`, and zero `*.test.*` / `*.spec.*` files in the repo.
A literal red-green-refactor cycle is therefore not available, and no task below
should invent one or add a test framework — that is scope the user did not ask
for, and unit tests carry little value for a pure visual re-skin.

Each task instead ends with this three-part gate. All three must pass before the
task is done:

```bash
npm run lint     # must pass clean
npm run build    # runs `tsc` — must compile with no type errors
```

...plus the **named visual check** written into that task. The dev server is
already running on `http://localhost:3000` and hot-reloads, so visual checks are
immediate. If the server is not running, start it with `npm run dev`.

---

## File Structure

| File | Status | Responsibility |
|------|--------|----------------|
| `src/app/globals.css` | Modify | Colour tokens, type scale, heading weight, watermark utility |
| `src/app/layout.tsx` | Modify | Load Quicksand via `next/font/google` |
| `src/components/ui/section.tsx` | **Create** | ILCA section wrapper — watermark, eyebrow, title |
| `src/components/ui/button.tsx` | Modify | Add `variant="pill"` |
| `src/components/ConferenceHero.tsx` | **Create** | 100vh animated navy hero |
| `src/views/Home.tsx` | Modify | Swap hero, wrap sections |
| `src/components/shared/Navbar.tsx` | Modify | Sticky translucent bar, centered nav, search + pill CTA |
| `src/components/shared/NavLinksBar.tsx` | Modify | Navy tile row, orange active tile |
| `src/components/shared/Footer.tsx` | Modify | Navy panel, remove `bg-teal-900` |
| `src/views/Live-Webinars.tsx` | Modify | Replace teal/cyan gradients |
| `src/app/(main)/gallery/page.tsx` | Modify | Replace teal/cyan gradients |
| `src/app/(main)/bslctrcon/page.tsx` | Modify | Replace teal/cyan gradients |

---

### Task 1: Design tokens and the Quicksand typeface

This is the foundation. Everything downstream inherits from it.

**Files:**
- Modify: `src/app/globals.css:1` (the `@import url(...)` line)
- Modify: `src/app/globals.css:6-70` (the `:root` block)
- Modify: `src/app/globals.css:71-110` (the `@theme inline` block)
- Modify: `src/app/globals.css:149-153` (the `@layer base` body rule)
- Modify: `src/app/globals.css:155-179` (the `@layer components` block)
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: CSS custom properties `--primary` `#F16724`, `--secondary` `#0B4E84`,
  `--foreground` `#232323`, `--body` `#616161`, `--wash` `#F6F6F6`; Tailwind
  utilities `text-body`, `bg-wash`, `text-wash`; the `.watermark` component
  class; a `--font-quicksand` variable on `<html>`. Tasks 2–8 all depend on these.

- [ ] **Step 1: Remove the Roboto Slab `@import`**

Delete line 1 of `src/app/globals.css` entirely:

```css
@import url("https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100..900&display=swap");
```

Leaving it would keep fetching a font nothing uses. The file must now begin with
`@import "tailwindcss";`.

- [ ] **Step 2: Load Quicksand in the root layout**

Replace the whole of `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import LiverCursor from "@/components/LiverCursor";

const quicksand = Quicksand({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-quicksand",
    display: "swap",
});

export const metadata: Metadata = {
    title: "BSLCTR",
    description: "Bangladesh Society for Liver Cancer Treatment & Research",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={quicksand.variable}>
            <body suppressHydrationWarning>
                <LiverCursor />
                {children}
            </body>
        </html>
    );
}
```

Weight 700 is the maximum Quicksand offers and is what the watermark uses. Do
not request 900 — see the correction note above.

- [ ] **Step 3: Replace the brand tokens in `:root`**

In `src/app/globals.css`, change the `font-family` line at the top of `:root`:

```css
    font-family: var(--font-quicksand), ui-sans-serif, system-ui, sans-serif;
    line-height: 1.875;
    font-weight: 400;
```

Replace the stale teal comment block:

```css
    /* Brand palette — adopted from the ILCA design system.
       Accent (orange) carries buttons, active nav and links.
       Deep (navy) carries the hero, nav tiles and footer. */
```

Then replace these specific token lines:

```css
    --foreground: #232323;
    --card-foreground: #232323;
    --popover-foreground: #232323;

    --primary: #f16724;
    --primary-foreground: #ffffff;

    --secondary: #0b4e84;
    --secondary-foreground: #ffffff;

    --accent: #fdf0e9;
    --accent-foreground: #232323;

    --body: #616161;
    --wash: #f6f6f6;

    --muted-foreground: #616161;
    --ring: #f16724;
    --radius: 0.5rem;
```

`--accent` becomes a pale orange tint rather than the old blue-grey, so
`hover:bg-accent` on ghost buttons reads as a warm wash consistent with the
palette. Leave `--background`, `--card`, `--popover`, `--muted`, `--border`,
`--input` and the `--chart-*` / `--sidebar-*` tokens as they are.

- [ ] **Step 4: Expose the two new tokens to Tailwind**

Tailwind v4 only generates a utility for a token declared in `@theme inline`.
Add these two lines inside that block, next to `--color-foreground`:

```css
    --color-body: var(--body);
    --color-wash: var(--wash);
```

Without this, `text-body` and `bg-wash` silently produce nothing.

- [ ] **Step 5: Set the type scale and heading weight**

In the `@layer base` block, extend the existing `body` rule:

```css
    body {
        @apply bg-background text-foreground;
        font-size: 1rem;
        line-height: 1.875;
    }

    /* ILCA sets headings at weight 500, not bold. This is deliberate and is
       most of why the reference design reads as airy — do not "fix" it. */
    h1, h2, h3, h4, h5, h6 {
        font-weight: 500;
        color: var(--foreground);
        line-height: 1.2;
    }

    h1 { font-size: 3rem; }      /* 48px */
    h2 { font-size: 2.5rem; }    /* 40px */
    h3 { font-size: 1.875rem; }  /* 30px */
    h4 { font-size: 1.5rem; }    /* 24px */
```

- [ ] **Step 6: Add the watermark utility**

Add to the existing `@layer components` block, after `.card-hover`:

```css
    /* Oversized pale word sitting behind a section heading — the signature
       ILCA section device. Weight 700 is Quicksand's maximum. */
    .watermark {
        @apply pointer-events-none absolute left-0 -top-4 select-none
               text-[4rem] font-bold uppercase leading-none tracking-tight
               text-wash sm:text-[6rem] lg:text-[7.5rem];
    }
```

It is `pointer-events-none` so it can never intercept a click, and
`select-none` so it never lands in a copied selection.

- [ ] **Step 7: Drop the rich-text heading weights to match**

Still in `globals.css`, the `.rich-text` block sets `font-weight: 700` on `h1`
and `600` on `h2`. Both must come down or admin-authored content will look
heavier than the rest of the site:

```css
.rich-text h1 {
    font-size: 1.35em;
    font-weight: 500;
    margin: 0.8em 0 0.4em;
}
.rich-text h2 {
    font-size: 1.15em;
    font-weight: 500;
    margin: 0.8em 0 0.4em;
}
```

- [ ] **Step 8: Verify**

```bash
npm run lint
npm run build
```

Both must pass. Then open `http://localhost:3000` and confirm:
- All text is Quicksand (rounded, geometric) — no serif anywhere
- Headings look noticeably lighter than before
- Buttons and the navbar are orange; the nav link bar is navy
- No teal remains except in `Footer`, `Navbar` member avatar,
  `Live-Webinars`, `gallery` and `bslctrcon` — those are hardcoded Tailwind
  palette classes and are fixed in Task 8, not here

---

### Task 2: The `Section` primitive and the `pill` button variant

**Files:**
- Create: `src/components/ui/section.tsx`
- Modify: `src/components/ui/button.tsx:12-32` (the `variants.variant` map)

**Interfaces:**
- Consumes: `--wash` and the `.watermark` class from Task 1; `cn` from `@/lib/utils`
- Produces:
  - `<Section watermark? eyebrow? title? className? children />` — default export
    absent, **named export `Section`**
  - `variant="pill"` on the existing `Button`
  - Tasks 4, 5, 6 and 8 consume both.

- [ ] **Step 1: Create the `Section` component**

Create `src/components/ui/section.tsx`:

```tsx
import type React from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
    /** Oversized pale word behind the heading. Omit for a section with no watermark. */
    watermark?: string;
    /** Small uppercase label above the title. */
    eyebrow?: string;
    /** The section heading. */
    title?: string;
    className?: string;
    children: React.ReactNode;
};

/**
 * The ILCA section wrapper: a giant pale watermark word behind a
 * light-weight title, with generous vertical rhythm.
 *
 * The header block is only rendered when there is something to put in it, so
 * a bare <Section> adds spacing and a container without reserving header space.
 */
export function Section({
    watermark,
    eyebrow,
    title,
    className,
    children,
}: SectionProps) {
    const hasHeader = Boolean(watermark || eyebrow || title);

    return (
        <section className={cn("page-container py-16 lg:py-24", className)}>
            {hasHeader && (
                <header className="relative mb-10 lg:mb-14">
                    {watermark && (
                        <span aria-hidden="true" className="watermark">
                            {watermark}
                        </span>
                    )}
                    <div className="relative">
                        {eyebrow && (
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                                {eyebrow}
                            </p>
                        )}
                        {title && <h2>{title}</h2>}
                    </div>
                </header>
            )}
            {children}
        </section>
    );
}
```

The watermark is `aria-hidden` — it is decorative, and a screen reader
announcing "CHAIRMAN" immediately before "Message from the Chairman" is noise.

- [ ] **Step 2: Add the `pill` button variant**

In `src/components/ui/button.tsx`, add one entry to the `variant` map, after
`link`:

```tsx
        pill: "rounded-full bg-primary px-7 text-primary-foreground uppercase tracking-[0.12em] shadow-xs hover:bg-primary/90",
```

Add it as a variant rather than a new component so it composes with every
existing `Button` usage, including `asChild`.

- [ ] **Step 3: Verify**

```bash
npm run lint
npm run build
```

Both must pass. `Section` is not yet rendered anywhere, so there is no visual
check for this task — the build passing means the component typechecks and the
new variant is valid. Task 4 is where both become visible.

---

### Task 3: `ConferenceHero`

**Files:**
- Create: `src/components/ConferenceHero.tsx`

**Interfaces:**
- Consumes: `Button` with `variant="pill"` from Task 2; `framer-motion` (already
  a dependency at `^12.9.2` — do not install anything)
- Produces: default-exported `ConferenceHero`, no props. Task 4 consumes it.

- [ ] **Step 1: Create the hero**

Create `src/components/ConferenceHero.tsx`:

```tsx
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";

const TITLE_WORDS = ["BSLCTR", "Annual", "Conference", "2026"];

export default function ConferenceHero() {
    // When the user has asked for reduced motion we render the final state
    // immediately. The animation is an enhancement over a correct static
    // hero, never a gate on the content appearing.
    const reduceMotion = useReducedMotion();

    return (
        <section className="relative flex h-svh min-h-[36rem] w-full items-center overflow-hidden bg-secondary">
            {/* Background. aria-hidden + empty alt: purely decorative. */}
            <img
                src="/02696689-b7f7-47f8-b269-2a9321d83ed7.webp"
                alt=""
                aria-hidden="true"
                width={2172}
                height={329}
                className="absolute inset-0 h-full w-full object-cover opacity-25"
            />
            {/* Navy scrim so the type always clears contrast over the image. */}
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/85 to-secondary/40"
            />

            <div className="page-container relative">
                <motion.p
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 text-sm font-semibold uppercase tracking-[0.25em] text-primary sm:text-base"
                >
                    12–14 March 2026 &nbsp;|&nbsp; Dhaka, Bangladesh
                </motion.p>

                <h1 className="max-w-4xl text-white">
                    {TITLE_WORDS.map((word, i) => (
                        <motion.span
                            key={word}
                            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: reduceMotion ? 0 : 0.15 + i * 0.12,
                            }}
                            className="mr-4 inline-block text-[2.75rem] leading-[1.05] sm:text-6xl lg:text-7xl"
                        >
                            {word}
                        </motion.span>
                    ))}
                </h1>

                <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.5,
                        delay: reduceMotion ? 0 : 0.15 + TITLE_WORDS.length * 0.12,
                    }}
                    className="mt-10"
                >
                    <Button asChild variant="pill" size="lg">
                        <Link href="/subscribe">Register now</Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
```

Three details that matter:

- `h-svh`, not `h-screen`. On mobile browsers `100vh` includes the collapsing
  address bar, which pushes the CTA below the fold on first paint. `svh` is the
  small-viewport unit and does not.
- `min-h-[36rem]` keeps the hero usable on short landscape viewports.
- Explicit `width`/`height` on the image reserve the box and prevent layout
  shift, which the spec flags as the site's highest CLS risk.

- [ ] **Step 2: Verify**

```bash
npm run lint
npm run build
```

Both must pass. Not yet rendered — Task 4 wires it in.

---

### Task 4: Home page

**Files:**
- Modify: `src/views/Home.tsx` (full rewrite — the file is 21 lines)

**Interfaces:**
- Consumes: `ConferenceHero` (Task 3), `Section` (Task 2)
- Produces: the restyled home page

- [ ] **Step 1: Rewrite `src/views/Home.tsx`**

```tsx
import ConferenceHero from "@/components/ConferenceHero";
import MessageFromChairman from "@/components/MessageFromChairman";
import MessageFromTreasurer from "@/components/MessageFromTreasurer";
import PhotoGallery from "@/components/PhotoGallery";
import RecentUpdates from "@/components/RecentUpdates";
import { Section } from "@/components/ui/section";

const Home = () => {
    return (
        <div className="flex flex-col">
            <ConferenceHero />

            <Section
                watermark="Chairman"
                eyebrow="Welcome"
                title="Message from the Chairman"
            >
                <MessageFromChairman />
            </Section>

            <Section
                watermark="Moments"
                eyebrow="Gallery"
                title="Relive the best moments"
                className="bg-wash/60"
            >
                <PhotoGallery />
            </Section>

            <Section watermark="Updates" eyebrow="News" title="Recent updates">
                <RecentUpdates />
            </Section>

            <Section
                watermark="Treasurer"
                eyebrow="Finance"
                title="Message from the Treasurer"
            >
                <MessageFromTreasurer />
            </Section>
        </div>
    );
};

export default Home;
```

`HeroSection` and `HeroSlider` are both dropped from this page per the spec.
**Do not delete either component file** — they stay in the repo unused; removing
them is a separate call the user has not made.

- [ ] **Step 2: Remove now-duplicated headings from the wrapped components**

Open each of `MessageFromChairman.tsx`, `PhotoGallery.tsx`, `RecentUpdates.tsx`
and `MessageFromTreasurer.tsx`. Each likely renders its own heading and its own
`max-w-7xl`/`page-container` wrapper. `Section` now supplies both.

For each file: delete the component's own top-level heading and its outer
container wrapper, keeping the inner content. Do not change any data fetching,
props or state.

If a component turns out **not** to have its own heading or container, leave it
alone — do not invent changes.

- [ ] **Step 3: Verify**

```bash
npm run lint
npm run build
```

Both must pass. Then at `http://localhost:3000`:
- The hero fills the viewport, navy, with "BSLCTR Annual Conference 2026"
  animating in word by word and an orange "REGISTER NOW" pill
- Each of the four sections shows a pale watermark word behind its heading
- No heading appears twice
- In DevTools, toggle **Rendering → Emulate `prefers-reduced-motion: reduce`**,
  reload, and confirm the hero text is fully visible immediately with no animation

---

### Task 5: Navbar

**Files:**
- Modify: `src/components/shared/Navbar.tsx:102-108` (the `<nav>` and logo block)
- Modify: `src/components/shared/Navbar.tsx:179` (`bg-teal-600` / `hover:bg-teal-500`)
- Modify: `src/components/shared/Navbar.tsx:196` (`text-teal-600`)

**Interfaces:**
- Consumes: tokens from Task 1
- Produces: restyled navbar. No API change.

**Do not touch** any of the state hooks, `loadAdmin`, `fetchPendingCount`,
`handleAdminLogout`, `handleMemberLogout`, the `useEffect` blocks, or the
click-outside handlers. This task changes markup and classes only.

- [ ] **Step 1: Restyle the nav shell and logo**

Replace the opening `<nav>` and the logo `<Link>` (lines 102–108) with:

```tsx
            <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-secondary/90 px-4 py-3 backdrop-blur-md">
                <Link href="/" className="flex items-center gap-2">
                    <img src="/Logo1.png" alt="BSLCTR" className="h-12 sm:h-14" />
                    <span className="hidden text-2xl font-medium tracking-wide text-white lg:block">
                        BSLCTR
                    </span>
                </Link>
```

Three changes from the original: the bar becomes navy and translucent with a
backdrop blur (ILCA's header treatment), it becomes sticky, and the logo shrinks
from `h-24` to `h-14`. The old `text-6xl font-bold` wordmark was far heavier
than anything in the ILCA design and drops to `text-2xl font-medium`.

**Note on stacking:** `NavLinksBar` is also `sticky top-0 z-50`. Two sticky
elements at `top-0` will overlap. Task 6 resolves this by giving `NavLinksBar`
a non-sticky position — do not attempt to fix it here.

- [ ] **Step 2: Replace the hardcoded teal on the member avatar**

Line 179, change `bg-teal-600` → `bg-primary` and `hover:bg-teal-500` →
`hover:bg-primary/90`:

```tsx
                                className="focus-ring flex size-11 items-center justify-center rounded-full border-2 border-white/30 bg-primary text-lg font-bold text-white shadow-md transition-colors hover:bg-primary/90 active:scale-95"
```

- [ ] **Step 3: Replace the hardcoded teal on the member dashboard icon**

Line 196, change `text-teal-600` → `text-primary`:

```tsx
                                        <LayoutDashboard className="h-4 w-4 text-primary" />
```

- [ ] **Step 4: Verify**

```bash
npm run lint
npm run build
```

Both must pass. Then at `http://localhost:3000`:
- The navbar is navy, translucent, and stays pinned when you scroll
- No teal remains in the navbar
- Click **Member** → the dropdown opens with Sign Up / Log In
- Click **Admin Login** → the modal opens
- Click outside either → it closes

---

### Task 6: NavLinksBar tiles

**Files:**
- Modify: `src/components/shared/NavLinksBar.tsx:100` (the `<nav>` element)
- Modify: `src/components/shared/NavLinksBar.tsx:~196-205` (the desktop `base` class string)

**Interfaces:**
- Consumes: tokens from Task 1
- Produces: navy tile row with an orange active tile

All 11 links stay. Both dropdowns and the Subscribe modal must keep working.

- [ ] **Step 1: Un-stick the bar and give it the tile row shell**

Line 100 currently reads `sticky top-0 z-50 w-full bg-secondary shadow-sm`.
The navbar took over the sticky slot in Task 5, so this must give it up or the
two will overlap:

```tsx
            <nav className="w-full bg-secondary shadow-sm">
```

- [ ] **Step 2: Turn the desktop links into tiles**

Find the desktop `base` class string (around line 196) and replace it with:

```tsx
                        const base = `relative rounded-md px-3 py-2 text-xs font-medium transition-colors xl:px-4 xl:text-sm ${
                            current
                                ? "bg-primary text-white hover:bg-primary/90"
                                : "text-white/90 hover:bg-white/10 hover:text-white"
                        }`;
```

Then add horizontal padding and a small gap to the desktop row container (the
`hidden items-stretch justify-center bg-secondary px-4 lg:flex` div):

```tsx
                <div className="hidden items-stretch justify-center gap-1.5 bg-secondary px-4 py-2 lg:flex">
```

The active tile is now solid orange rather than a white tint. If the existing
underline-on-current markup is still present below `base`, remove it — the
orange fill is now the "you are here" signal and an underline on top of it is
redundant.

- [ ] **Step 3: Match the mobile sheet**

In the mobile `Sheet`, the active state is `bg-white/20` in two places (the
top-level link buttons and the child links). Change both to `bg-primary`:

```tsx
                                                            ? "bg-primary"
```

- [ ] **Step 4: Verify**

```bash
npm run lint
npm run build
```

Both must pass. Then at `http://localhost:3000`:
- The link bar is navy with rounded tiles; the tile for the current page is orange
- Only the navbar is sticky — the tile row scrolls away
- Hover **Doctors** → its detail tooltip appears
- Click **Guidelines** → its dropdown opens with both children
- Click **Subscribe** → the modal opens
- Narrow to mobile width → the hamburger opens the sheet, the current page is
  orange, and navigation works

---

### Task 7: Footer

**Files:**
- Modify: `src/components/shared/Footer.tsx:22` (`bg-teal-900`)
- Modify: `src/components/shared/Footer.tsx:58` (`text-teal-900`)
- Modify: `src/components/shared/Footer.tsx:33` (the `BSLCTR` heading)

**Interfaces:**
- Consumes: tokens from Task 1
- Produces: navy footer

- [ ] **Step 1: Navy panel**

Line 22, `bg-teal-900` → `bg-secondary`:

```tsx
        <footer className="w-full bg-secondary text-white">
```

- [ ] **Step 2: Fix the brand heading colour**

Line 33 is an `<h3>`. Task 1 set all headings to `color: var(--foreground)`
(`#232323`), which on a navy panel is now near-invisible. It needs an explicit
white:

```tsx
                        <h3 className="text-lg font-medium text-white">BSLCTR</h3>
```

Note `font-medium`, not `font-semibold` — headings are weight 500 throughout.

- [ ] **Step 3: Recolour the Subscribe button**

Line 58, `text-teal-900` → `text-secondary`:

```tsx
                            className="mt-1 rounded-full bg-white px-5 py-2 text-sm font-semibold text-secondary outline-none transition-all duration-200 hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:scale-95"
```

- [ ] **Step 4: Verify**

```bash
npm run lint
npm run build
```

Both must pass. Then at `http://localhost:3000`, scroll to the footer:
- It is navy, not teal
- "BSLCTR" is legible white, not dark
- The Subscribe button is white with navy text, and clicking it opens the modal

---

### Task 8: Teal sweep and page pass

The token swap does not touch hardcoded Tailwind palette classes. This task
removes the last of them and applies `Section` to the remaining pages.

**Files:**
- Modify: `src/views/Live-Webinars.tsx:97-100`
- Modify: `src/app/(main)/gallery/page.tsx:20,28`
- Modify: `src/app/(main)/bslctrcon/page.tsx:48,56,84`
- Modify: `src/app/(main)/doctors/page.tsx`, `cases/page.tsx`,
  `guidelines/page.tsx`, `patients-guidelines/page.tsx`, `live/page.tsx`

- [ ] **Step 1: Replace every teal/cyan gradient**

These six occurrences are gradient pairs of the form
`from-teal-600 to-cyan-400` / `from-cyan-600 to-teal-400` and similar. Replace
each pair with the brand gradient:

```
from-primary to-secondary
```

Apply at: `Live-Webinars.tsx` lines 97, 98, 99, 100; `gallery/page.tsx` lines
20, 28; `bslctrcon/page.tsx` lines 48, 56, 84.

- [ ] **Step 2: Confirm no teal survives**

```bash
grep -rnE "(bg|text|border|from|to|via|ring|fill|stroke)-(teal|cyan)-[0-9]" src/components src/views "src/app/(main)"
```

Expected: **no output**. If anything matches, replace it — `*-teal-900` →
`bg-secondary`, accents → `text-primary`, gradients → `from-primary to-secondary`.

- [ ] **Step 3: Confirm no Roboto Slab survives**

```bash
grep -rni "roboto" src/ && echo "FOUND — remove it" || echo "clean"
```

Expected: `clean`.

- [ ] **Step 4: Apply `Section` to the remaining pages**

For each of `doctors`, `cases`, `guidelines`, `patients-guidelines`, `live`,
`gallery`, `live-webinars` and `bslctrcon`: replace the page's own
heading-plus-container block with a `Section` wrapper carrying a watermark, an
eyebrow and the existing title text.

Suggested watermarks — keep them to one short word so they do not overflow:

| Page | watermark | eyebrow |
|------|-----------|---------|
| `doctors` | `Doctors` | `Directory` |
| `cases` | `Cases` | `Clinical` |
| `guidelines` | `Guides` | `Clinical` |
| `patients-guidelines` | `Patients` | `Guidance` |
| `live` | `Live` | `Streaming` |
| `gallery` | `Gallery` | `Media` |
| `live-webinars` | `Webinars` | `Events` |
| `bslctrcon` | `Con` | `Conference` |

Preserve all behaviour: the `doctors` BN/EN toggle and district filter, the
`guidelines` children routes, and the `bslctrcon` `lectures` / `moments`
subpages must all still work.

- [ ] **Step 5: Full verification**

```bash
npm run lint
npm run build
```

Both must pass. Then walk every public route and confirm each renders with the
new design and no teal:

```
/                        /doctors                 /doctors/[slug]
/gallery                 /gallery/photo           /gallery/video
/live                    /live-webinars           /cases
/guidelines              /patients-guidelines     /bslctrcon
/bslctrcon/lectures      /bslctrcon/moments
```

Then confirm the interactive surface still works:
- Admin login modal opens
- Member login and signup open
- Subscribe modal opens from both the nav bar and the footer
- Both `NavLinksBar` dropdowns open
- Mobile sheet navigation opens and navigates

- [ ] **Step 6: Contrast check**

Per the spec's primary risk: orange `#F16724` on white is ~3.1:1, which fails
WCAG AA for normal-size text. Scan the site for orange text at body size on a
white background. It is fine as a button *background* behind white, fine on the
active nav tile, and fine for large text.

The one known case is `.rich-text a { color: var(--primary) }` in
`globals.css` — that rule already carries `text-decoration: underline`, which
is an acceptable non-colour affordance. Leave it.

If any *other* small orange-on-white text is found, either add an underline or
darken it to `#C4501A` (≈4.6:1, passes AA).

---

## Self-Review

**Spec coverage.** Every spec section maps to a task: tokens and typeface →
Task 1; the three primitives → Tasks 2 and 3; home page → Task 4; shared chrome
→ Tasks 5, 6, 7; page pass and the out-of-scope boundary → Task 8. The spec's
verification checklist is distributed across the per-task gates and re-run whole
in Task 8 Step 5. Both named risks are handled: heading-weight regression in
Task 1 Step 5 and Task 7 Step 2, contrast in Task 8 Step 6.

**Two things found while planning that the spec did not anticipate:**

1. **Quicksand has no weight 900.** The spec recorded ILCA's computed value
   verbatim; the font family only runs 300–700. Corrected at the top of this
   plan and applied in Task 1.
2. **23 hardcoded `teal-*` / `cyan-*` Tailwind classes across 6 files.** These
   are palette classes, not tokens, so the `globals.css` swap does not reach
   them. The spec's "no teal remains" check would have failed without Task 8.

**Also resolved:** `Navbar` and `NavLinksBar` are both `sticky top-0 z-50`.
Making the navbar sticky in Task 5 would have made them overlap, so Task 6
Step 1 un-sticks the tile row. Noted in both tasks so neither implementer is
surprised.

**Type consistency.** `Section` is a named export used as
`import { Section } from "@/components/ui/section"` in Tasks 4 and 8. Its props
(`watermark`, `eyebrow`, `title`, `className`, `children`) are identical at
definition and every call site. `ConferenceHero` is a default export, imported
as such in Task 4. `variant="pill"` is spelled the same in Tasks 2 and 3.

**No test framework** — confirmed absent, and deliberately not added. Each task
gates on `npm run lint` + `npm run build` + a named visual check instead.
