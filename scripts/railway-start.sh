#!/bin/sh
set -e

echo "→ Running database migrations..."
npx prisma migrate deploy

echo "→ Seeding database (skipped if already done)..."
npx tsx prisma/seed.ts || echo "Seed skipped"

echo "→ Starting Next.js server..."
exec node .next/standalone/server.js
