#!/usr/bin/env bash
# Regenerate package-lock.json files using Node 22 (same as GitHub Actions).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
NODE_IMAGE="${NODE_IMAGE:-node:22-bookworm-slim}"

echo "Syncing lockfiles with ${NODE_IMAGE}…"

for dir in web backend; do
  echo ""
  echo "==> ${dir}/ npm install"
  docker run --rm \
    -e DATABASE_URL="${DATABASE_URL:-postgresql://postgres:postgres@localhost:5432/clothing_store?schema=public}" \
    -v "${ROOT}/${dir}:/app" \
    -w /app \
    "${NODE_IMAGE}" \
    bash -lc 'rm -rf node_modules && npm install'
done

echo ""
echo "Done. Commit updated package-lock.json files in web/ and backend/."
