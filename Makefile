.PHONY: install up down logs test lint format migrate seed app rebuild

install:
	pnpm install

up:
	docker compose up --build

down:
	docker compose down -v

logs:
	docker compose logs -f

test:
	pnpm -r test

lint:
	pnpm -r lint

format:
	pnpm -r format

migrate:
	pnpm -r --filter "./apps/*/backend" prisma migrate deploy

seed:
	pnpm -r --filter "./apps/*/backend" prisma db seed

app:
	docker compose --profile $(APP) up --build

rebuild:
	docker compose build --no-cache
