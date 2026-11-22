import { PostHog } from "posthog-node";

// Server-side events for route handlers and server actions. Returns null when PostHog is not set up.
let client: PostHog | null = null;

export function posthogServer(): PostHog | null {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return null;
  client ??= new PostHog(key, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com",
    flushAt: 1,
    flushInterval: 0,
  });
  return client;
}
