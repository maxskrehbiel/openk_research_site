import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

// Public launch: allow crawling and point robots at the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${env.siteUrl}/sitemap.xml`,
    host: env.siteUrl,
  };
}
