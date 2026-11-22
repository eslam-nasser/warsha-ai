import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// AI crawlers are allowed on purpose (AEO). Admin is never indexed.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/*/admin", "/api/"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
