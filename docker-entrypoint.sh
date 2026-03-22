#!/bin/sh
set -e

# Create the database directory if it doesn't exist
if [ -n "$DATABASE_URL" ]; then
  DB_PATH="${DATABASE_URL#file:}"
  DB_DIR=$(dirname "$DB_PATH")
  mkdir -p "$DB_DIR" 2>/dev/null || true
fi

echo "→ Running database migrations..."
npx prisma migrate deploy

echo "→ Seeding database (skipped if already done)..."
npx tsx prisma/seed.ts || echo "Seed skipped"

echo "→ Starting Next.js server..."
exec node server.js
