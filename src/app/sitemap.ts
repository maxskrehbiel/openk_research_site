import type { MetadataRoute } from "next";
import { articlePath, articles, isPublished } from "@/content/articles";
import { env } from "@/lib/env";

const STATIC_ROUTES = [
  "/",
  "/ideas",
  "/research",
  "/methods",
  "/about",
  "/founder",
  "/disclosures",
  "/data-and-licensing",
  "/contact",
  "/privacy",
  "/terms",
  "/accessibility",
];

// Lists only published articles, including in development, so the sitemap never exposes drafts.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...STATIC_ROUTES, ...articles.filter(isPublished).map(articlePath)];
  return paths.map((path) => ({ url: `${env.siteUrl}${path}` }));
}
