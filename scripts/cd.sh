#!/bin/bash
set -euo pipefail

echo "=== CD Pipeline ==="

# Build and push Docker images
docker compose build

# Run migrations
docker compose run --rm backend npx prisma migrate deploy

# Deploy with zero downtime (example with Docker Swarm or simple restart)
docker compose up -d --force-recreate

echo "=== Deployment Complete ==="
