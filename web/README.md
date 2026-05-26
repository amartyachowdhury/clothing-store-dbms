# Clothing Store Admin — Next.js frontend

This directory is the **Next.js (App Router)** admin UI. It loads and mutates data by calling the **NestJS API** over HTTP, not by querying the database directly from React or server actions.

**Full-stack setup, Docker, and architecture** are documented in the **[repository root `README.md`](../README.md)**.

---

## Stack (this package)

- **UI:** Next.js App Router, React, Tailwind CSS  
- **Data:** HTTP client in **`src/lib/api.ts`** (`API_URL`, `NEXT_PUBLIC_API_URL`)  
- **Validation:** Zod (forms / server actions)  
- **Prisma in `web/prisma/`:** used for **`prisma generate`** during install/build; **`DATABASE_URL`** must be set for those commands. Runtime reads/writes go through the API.

---

## Prerequisites

- **Node.js 22+**  
- **NestJS API running** (e.g. `http://localhost:4000`) — start from **`../backend`** or use **root `docker compose up -d backend`**.  
- **PostgreSQL** reachable at the URL in **`DATABASE_URL`** (for Prisma generate / optional local `db:*` scripts). Easiest: **`docker compose up -d db`** from the **repo root** (port **5433**).

Do **not** run two Postgres containers that both bind host port **5433** (e.g. root `db` and `web/docker-compose.yml` at the same time).

---

## Quick start (local)

### 1. Postgres (from repo root)

```bash
cd ..   # repository root
docker compose up -d db
```

_Alternative:_ Postgres only — `docker compose up -d` inside **`web/`** uses **`web/docker-compose.yml`**. Use **either** root **`db`** or **`web/`** Postgres, not both on **5433**.

### 2. Environment

```bash
cp .env.example .env
```

Ensure **`API_URL`** and **`NEXT_PUBLIC_API_URL`** match your API (default `http://localhost:4000`). Set **`DATABASE_URL`** for Prisma (same DB as the API uses).

### 3. Install and dev server

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Next.js dev server |
| `npm run build` | `prisma generate` + production build |
| `npm run start` | Production server (after `build`) |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:push` | Push schema to DB (dev convenience; API migrations are the source of truth in **`backend/prisma/`**) |
| `npm run db:migrate` | Prisma migrate (dev) |
| `npm run db:seed` | Seed via Prisma script in **`web/prisma/`** — prefer **`backend`** seed when using Docker **`seed`** service |
| `npm run db:studio` | Prisma Studio |

---

## Features

- Dashboard, CRUD for customers / products / orders / payments  
- **`/api/health`** — Next route that checks the **backend** health endpoint  

---

## Legacy note

The Spring + Oracle course app is under **`../legacy/spring-oracle/`**, not in `web/`.
