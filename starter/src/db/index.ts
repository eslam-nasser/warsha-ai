import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// One connection per server instance. Use the Supabase pooler URL (port 6543) in DATABASE_URL.
let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  // prepare: false is required by the Supabase transaction pooler.
  db ??= drizzle(postgres(url, { prepare: false }), { schema });
  return db;
}
