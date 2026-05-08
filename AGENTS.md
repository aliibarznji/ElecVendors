# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

# Electromall Vendors Dashboard

## Stack
- Next.js (App Router) + React + TypeScript
- Tailwind CSS v4 (no CSS-in-JS) - all styling entrypoints live in `app/globals.css`
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
- `<DashboardShell>` (`app/components/dashboard-shell.tsx`) provides `<TopNav>` + `<Sidebar>` + a `<section className="dashboard-stage">` slot for the page body.
- The actual UI for each page lives in `app/content/*-content.tsx` (e.g. `app/content/product-list-content.tsx`). New pages follow this layout.

**Directory layout.**
```
app/
├── layout.tsx / page.tsx / globals.css
├── lib/          — api.ts, utils.ts, translations.ts, lang-context.tsx
├── components/   — dashboard-shell.tsx, sidebar.tsx, top-nav.tsx, status-pill.tsx
├── content/      — all *-content.tsx page-body components
└── <route>/      — page.tsx route files (unchanged)
```

**Navigation is centralized.** `app/components/sidebar.tsx` holds the full nav as a `sidebarSections` array (7 sections, 24 links). Adding a route means adding both a `page.tsx` and a link entry there — they are not auto-discovered.

**Bilingual (ar/en) + RTL/LTR.**
- `app/lib/lang-context.tsx` — `LangProvider` + `useLang()` hook. Language persisted in `localStorage`. `LangProvider` wraps the root layout.
- `app/lib/translations.ts` — full ar/en string dictionaries.
- All content components consume `useLang()` to get `{ lang, t, dir }`. New UI strings must be added to both dictionaries.

**Data layer.**
- `app/lib/api.ts` — all API calls via `api.*` (e.g. `api.profile.get()`, `api.orders.list()`). Base path `/api/backend`. Handles 401 → redirect to `/login`.
- `app/lib/utils.ts` — shared types (`ApiVendor`, `ApiOrder`, `ApiProduct`, `ApiWarehouse`, etc.) and pure helpers (`formatIqd`, `salesByProvince`, `bestSellingProducts`).
- Types live in `app/lib/utils.ts`. Import from there, not redeclared per-file.

**Shared components.**
- `app/components/status-pill.tsx` — `<StatusPill>` renders order/product status badges. Use it for any status display.

**Dynamic routes.**
- `app/orders/[orderNumber]/page.tsx` — order detail page. Param: `orderNumber`.

**Import paths from `app/content/`.**
- `../lib/api`, `../lib/utils`, `../lib/lang-context`, `../lib/translations`
- `../components/status-pill`, `../components/dashboard-shell`

**Import paths from `app/components/`.**
- `../lib/lang-context`, `../lib/translations`, `../lib/api`

**Profile page patterns** (`app/content/profile-content.tsx`).
- Sub-components: `SectionHeading`, `Field`, `EditInput`, `EditTextarea`, `ChoiceGroup`, `ToggleLine`, `PhoneValue`, `LocationStatus`, `MapFrame`, `VendorAvatar`, `CopyButton`, `Sparkline`.
- `ChoiceGroup` requires `onChange` to be interactive — omitting it makes it read-only display.
- `ToggleLine` requires `onChange` to be interactive.
- Tailwind-backed profile classes (all in `globals.css`): `profile-avatar-section`, `profile-avatar`, `vendor-status-badge`, `copy-btn`, `profile-edit-textarea`, `performance-grid-4`, `performance-card-header`, `rate-good/warn/bad`, `perf-benchmark`, `sparkline`, `points-marketing-banner`, `points-marketing-link`.

**Client vs server components.** Pages and content components are server components by default. Mark `"use client"` only when interactivity (state, event handlers, `usePathname`, etc.) is required — e.g. `sidebar.tsx` and forms.

**Styling.** `app/globals.css` is the single source of truth: Tailwind v4 `@theme` tokens, CSS custom properties at `:root` (`--brand`, `--surface`, `--radius`, `--shadow`, ...), and semantic classes implemented with Tailwind `@apply`. Reuse existing variables and class names.

## Rules
- No comments on unchanged code.
- No extra error handling unless asked.
- Minimal output: show only changed code.
- Use existing component patterns; don't introduce new libraries (no UI kits, no CSS-in-JS).
- New pages must use the `DashboardShell` + `*-content.tsx` split and be registered in `app/components/sidebar.tsx`.
- New UI strings must have both `ar` and `en` entries in `app/lib/translations.ts`.
