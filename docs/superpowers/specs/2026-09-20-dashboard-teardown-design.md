# Dashboard teardown — design

**Date:** 2026-09-20
**Status:** Approved

## Goal

Remove the admin dashboard and the member subsystem entirely — pages, layouts and API
routes — and reduce the navbar to the two buttons it exposes today: **Admin Login** and
**Member**. The public site is untouched.

The dashboards are being rebuilt from scratch later. Nothing is being added in their place.

## Scope

### Deleted — 32 files, ~4,000 lines

**Pages and layouts (11 files)**

| Path | Contents |
|---|---|
| `src/app/(admin)/` | Sidebar layout + 7 pages: members, notifications, webinars, videos, photos, guidelines, case-presentations |
| `src/app/(member)/` | Layout, `member-signup`, `member-dashboard` |

**API routes (18 files)**

| Path | Contents |
|---|---|
| `src/app/api/admin/**` | case-presentations, guidelines, members, photos, videos, webinars — each as list + `[id]` |
| `src/app/api/member/**` | login, logout, me, signup, photos, videos |

**Orphans left behind by the above (3 files)**

- `src/views/Dashboard.tsx` — sole consumer was `(admin)/dashboard/page.tsx`
- `src/components/RichTextEditor.tsx` — sole consumers were the admin and member dashboards
- `src/lib/memberAuth.ts` — sole consumers were `/api/member/login` and `/api/member/me`

### Rewritten — 1 file

`src/components/shared/Navbar.tsx`, from ~260 lines to ~40.

The navbar renders three states today. Two of them break once the routes above are gone,
so all three collapse into one:

| Removed | Why |
|---|---|
| Admin avatar + dropdown + notification badge | Links to `/dashboard` and `/dashboard/notifications`, both deleted |
| 30-second `pendingCount` polling | Calls `/api/admin/videos` and `/api/admin/photos`, both deleted |
| Member avatar + dropdown | Links to `/member-dashboard`, deleted |
| `fetch("/api/member/me")` on mount | Route deleted |
| "Sign Up" link in the Member dropdown | `/member-signup` deleted |

What remains: the logo link, `<AdminLoginModal />`, and a **Member** button whose dropdown
offers only **Log In**.

### Untouched

- The whole public site: Home, Live Webinars, BSLCTRcon, Doctors, Guidelines, Cases,
  Gallery, Live, plus TopBar / Search / NavLinksBar / Footer
- Public API: `/api/webinars`, `/api/photos`, `/api/videos`, `/api/members`,
  `/api/case-presentations`
- `prisma/schema.prisma` and the database — **no data is lost**
- `src/components/ShareButtons.tsx` — still used by the public `views/Live-Webinars.tsx`
- `src/app/api/upload/route.ts` — orphaned by this change but outside the agreed scope, so
  it stays
- `src/components/ProtectedRoute.tsx` — already unused before this change; left alone
- `AdminLoginModal.tsx` and `MemberLoginModal.tsx`

## Known consequence: member login stops working

This was raised and accepted.

- **Admin Login works.** `AdminLoginModal` is entirely client-side — it compares against
  hardcoded credentials and writes `adminAuth` to `localStorage`. No API involved. A
  successful login sets the flag, but there is no dashboard to visit.
- **Member Log In does not work.** `MemberLoginModal` posts to `/api/member/login`, which
  is deleted. The modal opens; submitting shows its "Login failed" error. Its
  `router.push("/member-dashboard")` on success is unreachable, so the deleted route is
  never navigated to.

Both modals are kept so a rebuilt dashboard can wire straight back into them.

## Verification

`npm run build` must pass — it runs `tsc` and Next's route collection, which catches any
dangling import or reference to a deleted module. `npm run lint` must be clean.

## Out of scope

No replacement UI, no new routes, no schema migration, no commit or push.
