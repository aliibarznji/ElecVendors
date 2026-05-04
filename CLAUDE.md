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
- No test runner is configured.

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
- The actual UI for each page lives in a sibling `*-content.tsx` file at the **`app/` root** (e.g. `app/product-list-content.tsx`, `app/payments-content.tsx`), not under the route folder. New pages should follow this layout.

**Navigation is centralized.** `app/sidebar.tsx` holds the full nav as a `sidebarSections` array. Adding a route means adding both a `page.tsx` and a link entry there — they are not auto-discovered.

**Client vs server components.** Pages and content components are server components by default. Mark `"use client"` only when interactivity (state, event handlers, `usePathname`, etc.) is required — e.g. `sidebar.tsx` and forms.

**Styling.** `app/globals.css` is the single source of truth: CSS custom properties at `:root` (`--brand`, `--surface`, `--radius`, `--shadow`, …) plus semantic class names. Reuse existing variables and class names rather than introducing new color/spacing values or a styling library.

## Rules
- No comments on unchanged code.
- No extra error handling unless asked.
- Minimal output: show only changed code.
- Use existing component patterns; don't introduce new libraries (no Tailwind, no UI kits, no CSS-in-JS).
- New pages must use the `DashboardShell` + `*-content.tsx` split and be registered in `app/sidebar.tsx`.
