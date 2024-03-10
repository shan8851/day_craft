run:
	pnpm run dev

i:
	pnpm i

lint:
	npm run lint

build:
	pnpm run build

clean:
	rm -rf node_modules

generate:
	npx drizzle-kit generate:sqlite

db-push:
	npx drizzle-kit push:sqlite
