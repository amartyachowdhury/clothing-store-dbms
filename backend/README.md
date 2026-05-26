# Clothing Store Admin — NestJS API

REST API for the clothing store admin: **customers**, **products**, **orders**, **payments**, **dashboard** aggregates, and **health**. Uses **Prisma** with **PostgreSQL**.

The **Next.js** app in **`../web`** calls this service over HTTP. Configure CORS and authentication if you expose the API beyond local development.

---

## Prerequisites

- **Node.js 22+** (recommended; matches the `web` app CI)  
- **PostgreSQL** — e.g. **`docker compose up -d db`** from the **repository root** (host port **5433**).

---

## Environment

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (must match the DB used by migrations and seed). |
| `PORT` | HTTP port (default **4000**). |

---

## Scripts

| Command | Description |
|--------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | `nest start --watch` — development with hot reload |
| `npm run build` | Compile TypeScript to **`dist/`** (gitignored; produced locally or in Docker) |
| `npm run start` | Run **`dist/main.js`** (production; run **`build`** first) |
| `npm run db:generate` | `prisma generate` |
| `npm run db:migrate` | `prisma migrate deploy` |
| `npm run db:seed` | Run **`prisma/seed.ts`** |

---

## Layout

| Path | Purpose |
|------|---------|
| `src/` | NestJS modules, controllers, services |
| `prisma/schema.prisma` | Database schema |
| `prisma/migrations/` | SQL migrations |
| `prisma/seed.ts` | Seed data |

---

## Docker

From the **repository root**, **`backend`** is built and run with **`docker compose`**. One-off migrate/seed:

```bash
docker compose --profile tools run --rm migrate
docker compose --profile tools run --rm seed
```

See the **[root README.md](../README.md)** for the full stack.
