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

