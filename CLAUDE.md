# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Electromall Vendors Dashboard

## Stack
- Next.js (App Router) + React + TypeScript
- Plain CSS (no Tailwind, no CSS-in-JS) — all styling in `app/globals.css`
- `lucide-react` for icons (only third-party UI dep)

## Commands
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — ESLint (uses `eslint-config-next`)
- `npm test` — Node native test runner

## Architecture

**Route → Shell → Content pattern.** Every route follows the same shape:

```tsx
// app/<route>/page.tsx
export default function Page() {
  return (
    <DashboardShell>
      <FeatureContent />
    </DashboardShell>
  );
}
```

- `page.tsx` files are intentionally thin server components that only compose the shell and the feature content.
- `<DashboardShell>` (`app/dashboard-shell.tsx`) provides `<TopNav>` + `<Sidebar>` + a `<section className="dashboard-stage">` slot for the page body.
- The actual UI for each page lives in a sibling `*-content.tsx` file at the **`app/` root** (e.g. `app/product-list-content.tsx`), not under the route folder. New pages follow this layout.
- No shared `components/`, `hooks/`, or `lib/` directories — all utilities live in `app/` root.

**Navigation is centralized.** `app/sidebar.tsx` holds the full nav as a `sidebarSections` array (7 sections, 24 links). Adding a route means adding both a `page.tsx` and a link entry there — they are not auto-discovered.

**Bilingual (ar/en) + RTL/LTR.**
- `app/lang-context.tsx` — `LangProvider` + `useLang()` hook. Language persisted in `localStorage`. `LangProvider` wraps the root layout.
- `app/translations.ts` — full ar/en string dictionaries.
- All content components consume `useLang()` to get `{ lang, t, dir }`. New UI strings must be added to both dictionaries.

**Data layer.**
- `app/lib/api.ts` — all API calls via `api.*` (e.g. `api.profile.get()`, `api.orders.list()`). Base path `/api/backend`. Handles 401 → redirect to `/login`.
- `app/lib/utils.ts` — shared types (`ApiVendor`, `ApiOrder`, `ApiProduct`, `ApiWarehouse`, etc.) and pure helpers (`formatIqd`, `salesByProvince`, `bestSellingProducts`).
- Types live in `app/lib/utils.ts`. Import from there, not redeclared per-file.

**Shared components.**
- `app/status-pill.tsx` — `<StatusPill>` renders order/product status badges. Use it for any status display.

**Dynamic routes.**
- `app/orders/[orderNumber]/page.tsx` — order detail page. Param: `orderNumber`.

**Profile page patterns** (`app/profile-content.tsx`).
- Sub-components: `SectionHeading`, `Field`, `EditInput`, `EditTextarea`, `ChoiceGroup`, `ToggleLine`, `PhoneValue`, `LocationStatus`, `MapFrame`, `VendorAvatar`, `CopyButton`, `Sparkline`.
- `ChoiceGroup` requires `onChange` to be interactive — omitting it makes it read-only display.
- `ToggleLine` requires `onChange` to be interactive.
- CSS classes for profile (all in `globals.css`): `profile-avatar-section`, `profile-avatar`, `vendor-status-badge`, `copy-btn`, `profile-edit-textarea`, `performance-grid-4`, `performance-card-header`, `rate-good/warn/bad`, `perf-benchmark`, `sparkline`, `points-marketing-banner`, `points-marketing-link`.

**Client vs server components.** Pages and content components are server components by default. Mark `"use client"` only when interactivity (state, event handlers, `usePathname`, etc.) is required — e.g. `sidebar.tsx` and forms.

**Styling.** `app/globals.css` is the single source of truth: CSS custom properties at `:root` (`--brand`, `--surface`, `--radius`, `--shadow`, …) plus semantic class names. Reuse existing variables and class names.

## Rules
- No comments on unchanged code.
- No extra error handling unless asked.
- Minimal output: show only changed code.
- Use existing component patterns; don't introduce new libraries (no Tailwind, no UI kits, no CSS-in-JS).
- New pages must use the `DashboardShell` + `*-content.tsx` split and be registered in `app/sidebar.tsx`.
- New UI strings must have both `ar` and `en` entries in `app/translations.ts`.
