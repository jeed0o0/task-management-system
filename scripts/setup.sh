#!/bin/bash
set -euo pipefail

echo "=== Task Manager - Project Setup ==="

# Copy environment file
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
npx prisma generate
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "=== Setup Complete ==="
echo "Run 'docker compose up' to start all services"
