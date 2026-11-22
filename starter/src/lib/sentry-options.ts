// Shared Sentry options for the browser, server and edge runtimes.
// Personal data is off by default. Add user and project context with Sentry.setUser and Sentry.setTag after login.
export const sentryOptions = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1,
  sendDefaultPii: false,
};
