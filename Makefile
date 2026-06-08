.PHONY: setup dev build test lint clean

setup:
	cp -n .env.example .env || true
	cd backend && npm install && npx prisma generate
	cd frontend && npm install

dev:
	docker compose up

dev-build:
	docker compose up --build

dev-backend:
	cd backend && npm run dev

dev-frontend:
	cd frontend && npm run dev

build:
	docker compose build

test:
	cd backend && npm test
	cd frontend && npm test

lint:
	cd backend && npm run lint
	cd frontend && npm run lint

clean:
	docker compose down -v
	rm -rf backend/node_modules frontend/node_modules backend/dist frontend/dist

logs:
	docker compose logs -f

ps:
	docker compose ps

migrate:
	docker compose run --rm backend npx prisma migrate deploy

seed:
	docker compose run --rm backend npx prisma db seed

studio:
	docker compose run --rm -p 5555:5555 backend npx prisma studio
