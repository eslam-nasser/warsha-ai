# Product built on the Warsha starter

@AGENTS.md

This product was made from the Warsha starter. Read `warsha.yaml` (when present) for the project config. The Warsha spec is the source for every rule below.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server on port 3000 |
| `npm run check` | Lint, message keys, types and unit tests. Run before every push. |
| `npm run build` then `npm run test:e2e` | Production build and Playwright browser tests |
| `npm run db:generate` | Write a migration from `src/db/schema.ts` into `drizzle/` |

## Rules

- All user-facing text lives in `messages/<locale>.json`. Read it with `getTranslations` (server) or `useTranslations` (client). Lint fails on text inside JSX.
- Use logical classes: `ms-`, `pe-`, `start-`, `text-start`, `border-e`, `rounded-s`. Lint fails on `ml-`, `pr-`, `left-`, `text-left` and the like.
- Format dates, numbers and currency with `getFormatter` or `useFormatter` from next-intl. Lint fails on `toLocaleString` and `new Intl.*`.
- Every key must exist in every locale file. `npm run lint:messages` checks it.
- Fonts cover Latin and Arabic. Icons that point in a direction flip with `rtl:` variants. Images carry no text.
- Links and redirects come from `@/i18n/navigation`, so they keep the locale.
- Public pages are server-rendered with unique metadata. Admin pages live under `/[locale]/admin` and are never indexed.
- Every schema change is a migration in `drizzle/`. Never change a live database by hand. A migration that drops or rewrites data is high-risk.
- Every route that reads user data checks who the user is with `supabase.auth.getUser()`.
- Secrets live only in `.env.local` locally and the host's secret store in deployed environments. Never commit them.
- Every action in the spec's event plan fires a named PostHog event. Sentry and PostHog stay on in every environment that has their keys.
- Lint, tests and pushes run as plain scripts. Stop after two failed CI retries on one task and hand off.
