import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

// Initialize the SQLite database
const sqlite = new Database('sqlite.db');

// Initialize Drizzle with the SQLite database
export const db = drizzle(sqlite);

// Run migrations
migrate(db, { migrationsFolder: "drizzle" });
