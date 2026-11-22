import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Every schema change is a migration file: edit this file, then run npm run db:generate.
// A migration that drops or rewrites data is high-risk and always gated.
export const profiles = pgTable("profiles", {
  // Matches auth.users.id from Supabase Auth.
  id: uuid("id").primaryKey(),
  displayName: text("display_name"),
  locale: text("locale").notNull().default("en"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
