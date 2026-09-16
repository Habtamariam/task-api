// Import Drizzle's PostgreSQL adapter for application queries.
import { drizzle } from "drizzle-orm/node-postgres";
// Import PostgreSQL's connection pool for reusable database connections.
import { Pool } from "pg";

// Read the database URL from the environment and fail early if it is missing.
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured");
}

// Reuse a pool of connections instead of opening one connection per query.
const pool = new Pool({ connectionString: databaseUrl });

// Export the Drizzle database instance used by repositories and services.
export const db = drizzle(pool);
