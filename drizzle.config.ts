// Load DATABASE_URL from the local .env file for Drizzle Kit commands.
import "dotenv/config";
// Import Drizzle Kit's typed configuration helper.
import { defineConfig } from "drizzle-kit";

// Configure schema discovery, migration output, and PostgreSQL credentials.
export default defineConfig({
  // Drizzle reads table definitions from this file.
  schema: "./src/db/schema.ts",
  // Generated SQL migration files are stored in this directory.
  out: "./drizzle",
  // Tell Drizzle Kit which database dialect to generate SQL for.
  dialect: "postgresql",
  // Use the connection string to connect when applying migrations.
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});
