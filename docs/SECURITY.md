# Security and operations

This project is configured for **local development and portfolio demos**. Treat anything on the public internet as **production** and harden further.

## Defaults are not production-safe

Docker Compose and `.env.example` use well-known credentials (`postgres` / `postgres`) and no API key. That is intentional for zero-friction local setup.

Before exposing the stack:

1. Set strong **`POSTGRES_PASSWORD`** (and restrict Postgres to internal networks).
2. Set a long random **`API_KEY`** on the backend and on the Next.js server (`API_KEY` in `web/.env` — never `NEXT_PUBLIC_*`).
3. Set **`CORS_ORIGINS`** to your real frontend origin(s) only (comma-separated).
4. Tune **`THROTTLE_TTL_MS`** / **`THROTTLE_LIMIT`** for expected traffic.
5. Terminate TLS at a reverse proxy; do not publish Postgres or the API admin port without a firewall.

## API protections (backend)

| Control | Env | Behavior |
|---------|-----|----------|
| **CORS** | `CORS_ORIGINS` | Allowed browser origins (default `http://localhost:3000`). |
| **Rate limiting** | `THROTTLE_TTL_MS`, `THROTTLE_LIMIT` | Global limit per client IP (Nest Throttler). `/health` is exempt. |
| **API key** | `API_KEY` | When set, requires `X-API-Key` or `Authorization: Bearer <key>` on all routes except `/health`. When unset, auth is disabled. |

The Next.js app sends **`X-API-Key`** from server-side `API_KEY` when calling the API.

## Logging

HTTP requests are logged as `METHOD path status duration` via the Nest **`HTTP`** logger. For production, forward logs to your platform (CloudWatch, Datadog, etc.) and avoid logging secrets or PII.

## What this stack does not include

- User login / sessions (admin UI is open if the API key is off).
- Row-level authorization or multi-tenant isolation.
- WAF, mTLS, or secret rotation.

Add those if you deploy beyond a personal demo.
