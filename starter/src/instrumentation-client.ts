import * as Sentry from "@sentry/nextjs";
import posthog from "posthog-js";
import { sentryOptions } from "@/lib/sentry-options";

// Browser error capture, tracing and session replay on errors.
Sentry.init({
  ...sentryOptions,
  integrations: [Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true })],
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

// Usage tracking: autocapture, page views and session replay with inputs masked.
// Name every event from the spec's event plan with posthog.capture("event_name", { ... }).
const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
if (posthogKey) {
  posthog.init(posthogKey, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com",
    defaults: "2025-05-24",
    autocapture: true,
    capture_pageview: "history_change",
    session_recording: { maskAllInputs: true },
    person_profiles: "identified_only",
  });
}
