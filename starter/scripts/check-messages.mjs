// Fails when a message key exists in one locale file but not another.
// Usage: node scripts/check-messages.mjs [messagesDir]
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dir = process.argv[2] ?? "messages";
const files = readdirSync(dir).filter((f) => f.endsWith(".json"));

const keysOf = (obj, prefix = "") =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === "object" ? keysOf(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );

const byLocale = Object.fromEntries(
  files.map((f) => [f.replace(/\.json$/, ""), new Set(keysOf(JSON.parse(readFileSync(join(dir, f), "utf8"))))]),
);
const all = new Set(Object.values(byLocale).flatMap((s) => [...s]));

let missing = 0;
for (const [locale, keys] of Object.entries(byLocale)) {
  for (const key of all) {
    if (!keys.has(key)) {
      console.error(`FAIL ${locale}.json is missing ${key}`);
      missing++;
    }
  }
}
if (missing) process.exit(1);
console.log(`ok   ${files.length} locale file(s), ${all.size} keys, all in sync`);
