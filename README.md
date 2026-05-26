# Clothing Store Admin (Portfolio)

Modern admin console for a clothing retail store: manage **customers**, **products**, **orders**, and **payments**, backed by **PostgreSQL** and a small **REST API**.

- **Stack**: Next.js (App Router) · TypeScript · Tailwind · NestJS (Fastify) · Prisma · PostgreSQL · Zod  
- **Architecture**: the browser and Next.js server talk to **NestJS over HTTP**; only the API uses Prisma against the database.  
- **Key behaviors**: order totals auto-recalculate, order status syncs from payments, and multi-step writes run in **database transactions** on the API.

```
Browser ──► Next.js (:3000) ──HTTP──► NestJS API (:4000) ──Prisma──► PostgreSQL (:5433)
```

| Piece | Role |
|--------|------|
| **`web/`** | Next.js UI, server components, and server actions. Runtime data goes through **`web/src/lib/api.ts`** (`API_URL` / `NEXT_PUBLIC_API_URL`). |
| **`backend/`** | NestJS REST API, validation, and transactional domain logic. |
| **`docker-compose.yml` (repo root)** | **db**, **backend**, **web**, plus optional **migrate** / **seed** (profile `tools`). |

---

## Prerequisites

- **Node.js 22+** (matches `web/package.json` `engines` and GitHub Actions).  
- **Docker** (recommended for Postgres and the full three-service setup).

---

## Quick start (recommended): Docker

From the **repository root**:

```bash
docker compose up -d db
docker compose --profile tools run --rm migrate
docker compose --profile tools run --rm seed
docker compose up -d backend web
```

| URL | What |
|-----|------|
| [http://localhost:3000](http://localhost:3000) | Next.js admin UI |
| [http://localhost:4000/health](http://localhost:4000/health) | API health |
| `localhost:5433` | Postgres (host port → container `5432`) |

**One-liner** (first-time database setup + app):

```bash
docker compose up -d db && \
  docker compose --profile tools run --rm migrate && \
  docker compose --profile tools run --rm seed && \
  docker compose up -d backend web
```

---

## Local development (Postgres in Docker, API + Next on your machine)

Use this when you want **`nest start --watch`** and **`next dev`** on the host with hot reload.

### 1. Database

From the repo root:

```bash
docker compose up -d db
```

### 2. Backend (NestJS)

```bash
cd backend
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Default API URL: **http://localhost:4000** (see `PORT` in `backend/.env`).

### 3. Frontend (Next.js)

In a second terminal:

```bash
cd web
cp .env.example .env
npm install
npm run dev
```

Open **http://localhost:3000**.

> **Note:** `web/.env` still needs **`DATABASE_URL`** so `prisma generate` can run during **`npm install`** / **`npm run build`**, even though pages and server actions use the **HTTP API** at runtime.

---

## Environment variables

Copy the checked-in examples:

- **`web/.env.example`** → `web/.env`  
- **`backend/.env.example`** → `backend/.env`

| File | Variable | Purpose |
|------|-----------|---------|
| `web/.env` | `API_URL` | Server-side base URL for the Nest API (e.g. `http://localhost:4000`). |
| `web/.env` | `NEXT_PUBLIC_API_URL` | Browser-accessible API base URL (same as `API_URL` for local dev). |
| `web/.env` | `DATABASE_URL` | Prisma CLI / **build-time** client generation only. |
| `backend/.env` | `DATABASE_URL` | Database URL for migrations, seed, and the running API. |
| `backend/.env` | `PORT` | API listen port (default `4000`). |

---

## Database and Prisma layout

- **Authoritative for migrations, seed, and runtime DB access:** **`backend/prisma/`** (`schema.prisma`, `migrations/`, `seed.ts`). Docker **`migrate`** / **`seed`** services use this tree.  
- **`web/prisma/`** exists so **`prisma generate`** can run during the Next.js **install/build** pipeline. If you change the schema, keep **`backend/prisma`** and **`web/prisma`** in sync (or consolidate later so only one package owns migrations).

---

## Project layout

| What | Where |
|------|--------|
| Next.js routes & UI | `web/src/app/` |
| HTTP client to the API | `web/src/lib/api.ts` |
| Shared types for API payloads | `web/src/lib/types.ts` |
| Server actions (mutations → API) | `web/src/app/actions/*.ts` |
| NestJS app | `backend/src/` |
| API Prisma schema, migrations, seed | `backend/prisma/` |

---

## CI

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs **install → lint → typecheck → build** for **`web/`** on **Node 22**. Add a similar job for **`backend/`** when you want API builds enforced in CI.

---

## More docs

- **Frontend-only commands and scripts:** [`web/README.md`](web/README.md)  
- **Backend dev commands:** [`backend/README.md`](backend/README.md)

---

## Legacy course version (archived)

The original Spring Boot + Oracle 11g course app is kept for reference under **`legacy/spring-oracle/`**.  
See **`legacy/spring-oracle/a9-user-guide.md`**.

---

## License

MIT License
