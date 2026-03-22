#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

echo "Running seed..."
npx tsx prisma/seed.ts || echo "Seed skipped (already seeded)"

echo "Starting app..."
exec node server.js
