# Dependency discipline

This repo has **two independent npm packages**: `web/` and `backend/`. Each has its own `package.json` and **`package-lock.json`**. CI runs `npm ci` on **Node 22** (see `.nvmrc`).

## Rules

1. **Commit lockfiles** — never commit only `package.json` changes without updating the matching `package-lock.json`.
2. **Use Node 22+** locally (`engines` + `engine-strict` in `.npmrc`).
3. **Regenerate locks on Node 22** — macOS/npm version differences can produce locks that fail `npm ci` on Linux CI (optional peer deps, etc.).

## Commands (from repo root)

| Script | Purpose |
|--------|---------|
| `npm run verify:lockfiles` | Docker + Node 22: clean `npm ci` in `web/` and `backend/` |
| `npm run sync:lockfiles` | Docker + Node 22: `npm install` to refresh both lockfiles |
| `npm run ci:web` | Local web CI pipeline |
| `npm run ci:backend` | Local backend CI pipeline |

Requires **Docker** for verify/sync scripts.

### Manual sync (one package)

```bash
cd web   # or backend
nvm use    # reads .nvmrc → 22
rm -rf node_modules
npm install
```

## CI alignment

- **`.nvmrc`** / **`.node-version`**: `22`
- **`packageManager`**: `npm@10.9.2` (root `package.json`)
- GitHub Actions: `node-version-file: '.nvmrc'`

## Dependabot

[`.github/dependabot.yml`](../.github/dependabot.yml) opens weekly npm PRs for `web/` and `backend/`, plus monthly GitHub Actions updates. Review lockfile changes in those PRs with `npm run verify:lockfiles`.
