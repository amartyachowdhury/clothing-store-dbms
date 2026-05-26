# Clothing Store Admin (Portfolio)

Modern admin console for a clothing retail store: manage **customers**, **products**, **orders**, and **payments**, backed by a relational PostgreSQL database.

- **Stack**: Next.js (App Router) · TypeScript · Tailwind · Prisma · PostgreSQL · Zod
- **Key behaviors**: order totals auto-recalculate, order status syncs from payments, and multi-step writes run in DB transactions.

## Quick start (local)

From the repo root:

```bash
cd web
cp .env.example .env
docker compose up -d
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

## Docker (strict 3-container setup)

Services: **`db`** (Postgres), **`backend`** (NestJS API), **`web`** (Next.js frontend).

```bash
# 1) Database only
docker compose up -d db

# 2) Migrations + seed (one-off)
docker compose --profile tools run --rm migrate
docker compose --profile tools run --rm seed

# 3) API only
docker compose up -d backend

# 4) Frontend only (talks to backend over HTTP)
docker compose up -d web
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000/health`
- Postgres: `localhost:5433`

## Database

- **Schema**: `web/prisma/schema.prisma`
- **Seed**: `web/prisma/seed.ts`
- **Migrations (recommended for deploys)**: `web/prisma/migrations/`

## Project layout

- **App**: `web/src/app/(dashboard)/...`
- **Server actions**: `web/src/app/actions/*.ts`
- **DB client**: `web/src/lib/prisma.ts`
- **Domain logic**: `web/src/lib/services/*.ts`

## Legacy course version (archived)

The original Spring Boot + Oracle 11g course app is kept for reference under `legacy/spring-oracle/`.
See `legacy/spring-oracle/a9-user-guide.md`.

## License

MIT License
