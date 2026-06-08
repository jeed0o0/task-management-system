#!/bin/bash
set -euo pipefail

echo "=== CI Pipeline ==="

# Backend
echo "--- Backend ---"
cd backend
npm ci
npx prisma generate
npm run lint
npm run build
npm test
cd ..

# Frontend
echo "--- Frontend ---"
cd frontend
npm ci
npm run lint
npm run build
npm test
cd ..

echo "=== CI Pipeline Complete ==="
