# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BSLCTR (Bangladesh Society of Liver, Cholangiocarcinoma and Transplant Research) - A React-based medical society website for liver disease awareness, physician/patient registration, live webinars, and an admin dashboard.

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 (using `@tailwindcss/vite` plugin)
- **UI Components**: Radix UI primitives with shadcn/ui (New York style variant)
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router DOM v7
- **Animations**: Framer Motion, embla-carousel-react
- **Icons**: lucide-react

## Development Commands

```bash
# Start development server
npm run dev

# Build for production (includes TypeScript compilation check)
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Path Aliases

The project uses `@/` as an alias for `./src/` configured in both `vite.config.ts` and `tsconfig.json`:
- `@/components` - All React components
- `@/lib` - Utility functions
- `@/pages` - Route page components

### Application Structure

**Entry Point**: `src/App.tsx` defines the complete application layout and routing structure:
- Layout order: TopBar → Navbar → Search → ScrollToTop → NavLinksBar → Routes → Footer
- All components wrapped in BrowserRouter

**Routing**:
- `/` - Home page (public)
- `/live-webinars` - Webinars listing (public)
- `/live` - Live stream (public)
- `/gallery` - Photo gallery (public)
- `/dashboard` - Admin dashboard (protected route)

### Authentication Flow

Simple localStorage-based authentication for admin access:
- Storage key: `adminAuth`
- Expected format: `{ email: string }`
- Protected by `ProtectedRoute` component (`src/components/ProtectedRoute.tsx`)
- Login modal integrated in `Navbar` component
- Redirects to home page if not authenticated

### Component Organization

**Pages** (`src/pages/`):
- Main route components that compose features together
- Dashboard contains hardcoded statistics and metrics (no backend)

**Shared Layout Components** (`src/components/shared/`):
- `TopBar.tsx` - Contact/info banner
- `Navbar.tsx` - Main navigation with admin login modal
- `NavLinksBar.tsx` - Secondary navigation
- `Footer.tsx` - Site footer

**Feature Components** (`src/components/`):
- `SubscribeModal.tsx` - Entry point for patient/physician registration
- `AdminLoginModal.tsx` - Admin authentication modal
- Form components, carousels, galleries, live video embeds

**Forms** (`src/components/forms/`):
- `PatientForm.tsx` - Collects liver disease history and contact info
- `PhysicianForm.tsx` - Collects specialty and contact info
- Both use Zod schemas for validation
- **Important**: Both forms have TODO comments indicating no backend is connected - they currently only log to console and show alerts

**UI Components** (`src/components/ui/`):
- shadcn/ui components (New York variant)
- Installed via components.json configuration
- Use `cn()` utility from `@/lib/utils.ts` for className merging

### Styling System

- Tailwind CSS v4 with Vite plugin (not PostCSS)
- Custom animations via `tw-animate-css` package
- CSS variables defined in `src/index.css`
- Component variants managed with `class-variance-authority`
- `cn()` helper combines `clsx` and `tailwind-merge`

### TypeScript Configuration

- Composite project with references to `tsconfig.app.json` and `tsconfig.node.json`
- Path aliases configured for `@/*` imports
- Strict mode enabled in app config
- Build command runs `tsc -b` before Vite build

## Important Implementation Notes

- **No Backend Integration**: Form submissions are client-side only with console logging
- **Environment Variables**: `.env` file exists but is not tracked in git
- **Static Data**: Dashboard statistics and content are hardcoded
- **Browser Storage**: Admin auth state persists in localStorage only
- **React 19**: Uses latest React version with updated patterns
