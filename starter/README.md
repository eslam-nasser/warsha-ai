# Warsha starter

Every Warsha product starts from this template. It is the web profile from the spec: Next.js 16 on Vercel, Supabase Postgres with Drizzle, next-intl, Sentry and PostHog.

## What is already wired

| Area | Where |
| --- | --- |
| Localization | `messages/`, `src/i18n/`, `src/proxy.ts`. English first, right-to-left ready. |
| Lint rules | `eslint-rules/` and `eslint.config.mjs`: no hardcoded text, no left or right classes, no manual formatting. `scripts/check-messages.mjs` keeps locale keys in sync. |
| Errors | Sentry in `src/instrumentation.ts` and `src/instrumentation-client.ts`, with replay on errors and source maps in CI |
| Usage | PostHog in `src/instrumentation-client.ts` and `src/lib/posthog-server.ts`, inputs masked in replay |
| Data | Drizzle schema in `src/db/`, migrations in `drizzle/`, Supabase clients in `src/lib/supabase/` |
| UI | Tailwind 4, shadcn/ui (Base UI, RTL on), admin shell in `src/app/[locale]/admin/` |
| SEO and AEO | `src/app/robots.ts`, `src/app/sitemap.ts`, `public/llms.txt`, per-page metadata |
| Tests | Vitest in `tests/unit/`, Playwright in `tests/e2e/` |
| CI | `.github/workflows/ci.yml`: checks, build, browser tests, Lighthouse speed budgets, secret and dependency scans, Claude security review |

Sentry, PostHog and Supabase stay off until their variables are set, so the starter builds with no accounts.

## Start a product

1. Copy this folder into a new repo.
2. Copy `.env.example` to `.env.local` and fill it in.
3. Run `npm ci`, then `npm run dev`.
4. Add `ar` to `src/i18n/routing.ts` and a `messages/ar.json` to turn on Arabic.
