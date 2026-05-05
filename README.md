# ElecVendors Dashboard

Vendor management dashboard for ElecMall — bilingual (Arabic/English), RTL/LTR support. Vendors manage products, orders, inventory, pricing, settlements, and marketing campaigns.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16 (App Router) + React + TypeScript |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL 16 + Prisma ORM |
| Auth | JWT in httpOnly cookies |
| Styling | Plain CSS (`app/globals.css`) — no Tailwind, no UI kit |

---

## Local development

### Prerequisites
- Node.js 22+
- PostgreSQL 16 running locally (or use Docker)

### 1. Set up the database

```bash
# Create the role and database (run as postgres superuser, replace password)
psql -U postgres -f backend/setup-db.sql
```

### 2. Configure backend

```bash
cp backend/.env.example backend/.env
# Edit backend/.env — set DATABASE_URL, JWT_SECRET, CORS_ORIGIN
```

Generate a secure JWT secret:
```bash
openssl rand -base64 48
```

### 3. Install and run backend

```bash
cd backend
npm install
npx prisma migrate deploy   # create tables
npm run db:seed             # seed demo data
npm run dev                 # http://localhost:4000
```

### 4. Install and run frontend

```bash
# from repo root
npm install
npm run dev    # http://localhost:3000
```

**Demo login** (seeded by `npm run db:seed`):
- Email: `beautifulgril2294@gmail.com`
- Password: `Vendor@12345`

---

## Deploy with Docker Compose

### 1. Create a `.env` file in the repo root

```bash
POSTGRES_PASSWORD=<strong-random-password>
JWT_SECRET=<output of: openssl rand -base64 48>
CORS_ORIGIN=https://your-frontend-domain.com
```

### 2. Build and start

```bash
docker compose up --build -d
```

This starts:
- `electromall_postgres` — PostgreSQL 16 on port 5432
- `electromall_api` — Express API on port 4000 (runs migrations on startup)

### 3. Seed demo data (first deploy only)

```bash
docker compose exec api node -e "require('./dist/...') " # or run seed via npm
cd backend && DATABASE_URL=... npm run db:seed
```

---

## API endpoints

All endpoints are prefixed `/api/`. The frontend proxies `/api/backend/*` → `http://localhost:4000/api/*` via Next.js rewrites.

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/login` | — | Login, sets httpOnly cookie |
| POST | `/auth/logout` | — | Clears cookie |
| GET | `/auth/me` | ✓ | Current vendor |
| GET | `/profile` | ✓ | Full vendor profile |
| PATCH | `/profile` | ✓ | Update profile + warehouses |
| GET | `/products` | ✓ | List products (search, filter, paginate) |
| POST | `/products` | ✓ | Create product |
| GET | `/products/:id` | ✓ | Get product |
| PATCH | `/products/:id` | ✓ | Update product |
| DELETE | `/products/:id` | ✓ | Delete product (blocked if has orders) |
| GET | `/orders` | ✓ | List orders (filter, sort, paginate) |
| GET | `/orders/:orderNumber` | ✓ | Get order |
| PATCH | `/orders/:orderNumber/status` | ✓ | Update order status |
| GET | `/settlements` | ✓ | List settlements with amounts |
| GET | `/notifications` | ✓ | List notifications + unread count |
| PATCH | `/notifications/read-all` | ✓ | Mark all read |
| PATCH | `/notifications/:id/read` | ✓ | Mark one read |
| GET | `/discount-plans` | ✓ | List discount plans |
| POST | `/discount-plans` | ✓ | Create discount plan |
| DELETE | `/discount-plans/:id` | ✓ | Delete discount plan |
| GET | `/marketing/packages` | — | List marketing packages |
| GET | `/marketing/campaigns` | ✓ | List vendor campaigns |
| POST | `/marketing/campaigns` | ✓ | Purchase campaign |
| GET | `/delivery-prices` | ✓ | Per-province delivery prices |
| GET | `/health` | — | Health check |

---

## Security

- **Passwords**: bcrypt (12 rounds)
- **Auth tokens**: JWT in `httpOnly; SameSite=Strict` cookie — JS-inaccessible
- **Cookie `Secure` flag**: set in production (`NODE_ENV=production`)
- **Input validation**: Zod schemas on every write endpoint
- **Rate limiting**: 200 req/15 min globally, 10 req/15 min on login
- **SQL injection**: impossible — Prisma parameterized queries only
- **HTTP headers**: `helmet()` — XSS, clickjacking, MIME sniffing protections
- **CORS**: explicit origin allowlist — no wildcard
- **Error responses**: no stack traces or DB details exposed to client
- **Prisma errors**: P2002 (duplicate) → 409, P2025 (not found) → 404
- **Graceful shutdown**: SIGTERM/SIGINT close server then disconnect DB
- **Container**: non-root `api` user in Docker
- **Secrets**: all via env vars — no secrets in source code or image

---

## Frontend pages

| Route | Description |
|---|---|
| `/login` | Login page |
| `/` | Dashboard — KPIs, charts, analytics |
| `/orders` | Orders with status tabs and search |
| `/orders/[orderNumber]` | Order detail |
| `/products` | Product list |
| `/products/add` | Add / edit product (StartMode flow) |
| `/products/bulk` | CSV bulk stock/price updates |
| `/products/discounts` | Discount plan management |
| `/inventory` | Stock levels |
| `/pricing` | Price and commission updates |
| `/seller-report` | Sales report + CSV export |
| `/settlements` | Payment settlements |
| `/delivery-prices` | Per-province delivery pricing |
| `/warranty` | Warranty management |
| `/profile` | Vendor profile and warehouses |
| `/marketing/new` | Purchase marketing packages |
| `/marketing/campaigns` | Campaign tracking |
| `/notifications` | Notification feed |

---

## Architecture

```
page.tsx  →  DashboardShell  →  *-content.tsx
```

- `page.tsx` — thin server component
- `DashboardShell` (`app/dashboard-shell.tsx`) — TopNav + Sidebar + stage slot
- `*-content.tsx` — feature UI at `app/` root
- `app/lib/api.ts` — typed fetch client (`credentials: "include"`)
- `app/lib/utils.ts` — shared types + utility functions
- `app/middleware.ts` — Next.js auth guard (redirects to `/login` if no cookie)
- Navigation in `app/sidebar.tsx`

## Commands

```bash
# Frontend
npm run dev        # dev server
npm run build      # production build
npm run lint       # ESLint

# Backend
cd backend
npm run dev        # dev server (nodemon)
npm run build      # tsc compile
npx prisma studio  # DB GUI
npm run db:seed    # seed demo data
npm run db:migrate # run migrations
```
