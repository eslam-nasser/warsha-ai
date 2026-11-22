import * as Sentry from "@sentry/nextjs";
import { sentryOptions } from "@/lib/sentry-options";

// Server and edge error capture and tracing.
export function register() {
  Sentry.init(sentryOptions);
}

// Captures errors thrown in Server Components, route handlers and proxy.
export const onRequestError = Sentry.captureRequestError;
