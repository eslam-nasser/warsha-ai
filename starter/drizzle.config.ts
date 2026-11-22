import { defineConfig } from "drizzle-kit";

// Migrations live in drizzle/ and are committed. Never change a live database by hand.
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
  strict: true,
});
