import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next.js 16 renamed middleware to proxy. This sends / to /en and keeps the locale in the path.
export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next.js internals, the Sentry tunnel and files with an extension.
  matcher: ["/((?!api|monitoring|_next|_vercel|.*\\..*).*)"],
};
