# ElecVendors Dashboard

Vendor management dashboard for ElecMall — lets vendors manage products, orders, inventory, pricing, and marketing campaigns.

## Setup

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Stack

- Next.js 16 (App Router) + React + TypeScript
- Plain CSS — all styles in `app/globals.css`
- `lucide-react` icons only (no UI kit)

## Pages

| Route | Description |
|---|---|
| `/` | Dashboard — KPIs, charts, analytics |
| `/orders` | Order items with status tabs and search |
| `/orders/[orderNumber]` | Order detail |
| `/products` | Product list with status filtering |
| `/products/add` | Add / edit product form |
| `/products/bulk` | CSV bulk price and stock updates |
| `/products/discounts` | Discount plan management |
| `/inventory` | Stock levels and quantity editing |
| `/pricing` | Instant price and commission updates |
| `/seller-report` | Sales reports with CSV export |
| `/settlements` | Payment settlements and invoices |
| `/delivery-prices` | Per-province delivery pricing |
| `/warranty` | Warranty management |
| `/profile` | Vendor profile and documents |
| `/marketing/new` | Purchase marketing campaigns |
| `/marketing/campaigns` | Active campaign tracking and reports |
| `/account-manager/orders` | Account manager order view |
| `/account-manager/pending-products` | Product approval queue |
| `/account-manager/log` | Operations audit log |
| `/notifications` | Notification feed |

## Architecture

Every route follows the same pattern:

```
page.tsx → DashboardShell → *-content.tsx
```

- `page.tsx` — thin server component, composes shell + feature
- `DashboardShell` — TopNav + Sidebar + stage slot
- `*-content.tsx` — feature UI, lives at `app/` root
- `vendor-dashboard-data.ts` — all types, mock data, and utilities
- Navigation centralized in `app/sidebar.tsx`
