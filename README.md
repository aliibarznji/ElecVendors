# ElecVendors Dashboard

Vendor management dashboard for ElecMall — bilingual (Arabic/English), RTL/LTR support. Vendors manage products, orders, inventory, pricing, settlements, and marketing campaigns.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 15 (App Router) + React + TypeScript |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL 16 + Prisma ORM |
| Auth | JWT in httpOnly cookies |
| Styling | Tailwind CSS v4 (`app/globals.css`) — no UI kit |
| Icons | lucide-react |

---

## Deploy with Docker Compose (recommended)

### 1. Create `.env` in repo root

```bash
POSTGRES_PASSWORD=<strong-random-password>
JWT_SECRET=<output of: openssl rand -base64 48>
JWT_EXPIRES_IN=7d
```

### 2. Build and start

```bash
docker compose up --build -d
```

Three containers start:

| Container | Port | Notes |
|---|---|---|
| `electromall_postgres` | 5432 (localhost only) | PostgreSQL 16 |
| `electromall_api` | 4000 (localhost only) | Express API — runs migrations on startup |
| `electromall_frontend` | 3000 (public) | Next.js |

### 3. Seed on first deploy

```bash
docker compose exec api npm run db:seed
```

Default login (change password after first login):
- Email: `admin@electromall.com`
- Password: `ChangeMe@123`

Override via env vars:
```bash
VENDOR_EMAIL=you@company.com VENDOR_PASSWORD=YourPassword123 VENDOR_NAME="Your Name" npm run db:seed
```

### Useful Docker commands

```bash
docker compose ps                        # status
docker compose logs api --tail 50        # API logs
docker compose restart api               # restart API only
docker compose down                      # stop all
docker compose down -v                   # stop + wipe DB volume
```

---

## Local development

### Prerequisites
- Node.js 22+
- Docker (for PostgreSQL) or a local PostgreSQL 16 instance

### 1. Start database

```bash
docker run -d --name pg-dev \
  -e POSTGRES_USER=electromall \
  -e POSTGRES_PASSWORD=devpass \
  -e POSTGRES_DB=electromall_vendors \
  -p 5432:5432 postgres:16-alpine
```

### 2. Configure backend

Create `backend/.env`:

```env
DATABASE_URL=postgresql://electromall:devpass@localhost:5432/electromall_vendors
JWT_SECRET=$(openssl rand -base64 48)
CORS_ORIGIN=http://localhost:3000
PORT=4000
NODE_ENV=development
```

### 3. Run backend

```bash
cd backend
npm install
npm run db:migrate   # prisma migrate deploy
npm run db:seed      # seed initial vendor
npm run dev          # http://localhost:4000
```

### 4. Run frontend

```bash
# from repo root
npm install
npm run dev          # http://localhost:3000
```

---

## Database migrations

Migrations live in `backend/prisma/migrations/`. The API container runs `prisma migrate deploy` on every startup via `entrypoint.sh`.

**Adding a new migration:**
1. Edit `backend/prisma/schema.prisma`
2. Create `backend/prisma/migrations/YYYYMMDDHHMMSS_<description>/migration.sql`
3. Write the SQL (`ALTER TABLE`, `CREATE TABLE`, etc.)
4. Restart or redeploy the API container — migration applies automatically

> Never use `prisma db push` in production. Always create an explicit migration file.

---

## API endpoints

All endpoints are prefixed `/api/`. The frontend proxies `/api/backend/*` → `http://api:4000/api/*` via Next.js rewrites (`next.config.ts`).

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/login` | — | Login, sets httpOnly cookie |
| POST | `/auth/signup` | — | Register new vendor |
| POST | `/auth/logout` | — | Clears cookie |
| GET | `/auth/me` | ✓ | Current vendor |
| GET | `/profile` | ✓ | Full vendor profile |
| PATCH | `/profile` | ✓ | Update profile + warehouses |
| GET | `/products` | ✓ | List products (search, filter, paginate) |
| POST | `/products` | ✓ | Create product |
| POST | `/products/upload` | ✓ | Upload product image (multipart) |
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

- **Passwords**: bcrypt (10 rounds)
- **Auth tokens**: JWT in `httpOnly; SameSite=Strict` cookie — JS-inaccessible
- **Cookie `Secure` flag**: set in production (`NODE_ENV=production`)
- **Input validation**: Zod schemas on every write endpoint — email lowercased + trimmed
- **Rate limiting**: 200 req/15 min globally, 10 req/15 min on auth routes
- **SQL injection**: impossible — Prisma parameterized queries only
- **HTTP headers**: `helmet()` — XSS, clickjacking, MIME sniffing protections
- **CORS**: explicit origin allowlist — no wildcard
- **Middleware auth guard**: Next.js middleware verifies JWT signature (via `jose`) on every request — invalid/expired cookies cleared and redirected to `/login`
- **Client 401 guard**: any API 401 redirects to `/login` and clears session
- **Error responses**: no stack traces or DB details exposed to client
- **Prisma errors**: P2002 (duplicate) → 409, P2025 (not found) → 404
- **Graceful shutdown**: SIGTERM/SIGINT close server then disconnect DB
- **Container**: non-root `api` user in Docker
- **Secrets**: all via env vars — no secrets in source code or image

---

## Frontend pages

| Route | Description |
|---|---|
| `/login` | Login — bilingual, links to signup |
| `/signup` | Vendor registration — bilingual |
| `/` | Dashboard — KPIs, charts, analytics |
| `/orders` | Orders with status tabs and search |
| `/orders/[orderNumber]` | Order detail |
| `/products` | Product list |
| `/products/add` | Add / edit product |
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

### Frontend pattern

```
page.tsx  →  DashboardShell  →  *-content.tsx
```

- `page.tsx` — thin server component, composes shell + feature
- `app/components/dashboard-shell.tsx` — TopNav + Sidebar + stage slot
- `app/content/*-content.tsx` — all feature UI lives here
- `app/lib/api.ts` — typed fetch client (`credentials: "include"`)
- `app/lib/utils.ts` — shared types + utility functions
- `app/components/sidebar.tsx` — centralized nav (`sidebarSections` array)
- `app/lib/lang-context.tsx` + `app/lib/translations.ts` — bilingual ar/en

### Backend pattern

```
Express route  →  Zod validation  →  Prisma query  →  errorHandler
```

- `backend/src/routes/` — one file per resource
- `backend/src/schemas/index.ts` — Zod schemas for all request bodies
- `backend/src/middleware/auth.ts` — JWT auth guard (`requireAuth`)
- `backend/src/middleware/errorHandler.ts` — maps Prisma/Zod errors to HTTP

---

## Backend commands

```bash
cd backend
npm run dev          # dev server with nodemon
npm run build        # tsc compile to dist/
npm run db:migrate   # prisma migrate deploy
npm run db:seed      # seed initial data
npm run db:studio    # Prisma Studio GUI
npm run db:generate  # regenerate Prisma client after schema change
```

## Frontend commands

```bash
npm run dev          # dev server
npm run build        # production build
npm run lint         # ESLint
npm test             # Node native test runner
```
