import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/site";

// List every public page here. Admin pages stay out.
const publicPaths = [""];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths.map((path) => ({
    url: `${siteUrl}/${routing.defaultLocale}${path}`,
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${siteUrl}/${l}${path}`])),
    },
  }));
}
