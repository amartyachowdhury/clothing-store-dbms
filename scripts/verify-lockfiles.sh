#!/usr/bin/env bash
# Verify package-lock.json files install cleanly with the same Node major as CI.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
NODE_IMAGE="${NODE_IMAGE:-node:22-bookworm-slim}"

echo "Verifying lockfiles with ${NODE_IMAGE} (matches CI Node 22)…"

for dir in web backend; do
  echo ""
  echo "==> ${dir}/"
  docker run --rm \
    -e DATABASE_URL="${DATABASE_URL:-postgresql://postgres:postgres@localhost:5432/clothing_store?schema=public}" \
    -v "${ROOT}/${dir}:/app" \
    -w /app \
    "${NODE_IMAGE}" \
    bash -lc 'rm -rf node_modules && npm ci --ignore-scripts && npm ci'
done

echo ""
echo "Lockfiles OK for web/ and backend/."
