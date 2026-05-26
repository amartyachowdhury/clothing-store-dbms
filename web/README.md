# Clothing Store Admin (Next.js)

Portfolio rebuild of the clothing retail DBMS using **Next.js**, **TypeScript**, **Prisma**, and **PostgreSQL**.

## Stack

- **Frontend:** Next.js App Router, Tailwind CSS, server components
- **Backend:** Next.js server actions + route handlers
- **Database:** PostgreSQL with Prisma ORM
- **Validation:** Zod

## Quick start

### 1. Start PostgreSQL

```bash
cd web
docker compose up -d
```

### 2. Configure environment

```bash
cp .env.example .env
```

Default local URL:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/clothing_store?schema=public"
```

### 3. Apply schema and seed data

```bash
npm run db:push
npm run db:seed
```

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Generate Prisma client and build for production |
| `npm run db:push` | Push schema to the database |
| `npm run db:migrate` | Create and apply migrations (preferred for production) |
| `npm run db:seed` | Load sample categories, products, orders, and payments |
| `npm run db:studio` | Open Prisma Studio |

## Features (phase 1)

- Dashboard with stats, revenue, low-stock alerts, recent orders
- CRUD for customers and products (with search)
- Order creation, line-item management, automatic total recalculation
- Payment tracking with automatic order status updates
- Health check at `/api/health`

## Legacy app

The original Spring Boot + Oracle application remains in the repository root (`src/`, `pom.xml`) for course reference.

## Deployment

1. Provision PostgreSQL (Neon, Supabase, Railway).
2. Set `DATABASE_URL` in your host environment.
3. Run `npm run db:push` (or `db:migrate`) and `npm run db:seed`.
4. Deploy the `web/` directory to Vercel or similar.
