run:
	npm run dev

i:
	npm i

lint:
	npm run lint

build:
	npm run build

clean:
	rm -rf node_modules

drizzle-migrate:
	npx drizzle-kit generate:sqlite
