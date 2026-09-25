/** Public environment settings, validated once at startup so a malformed value fails the build. */

function readPublicUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  try {
    return new URL(raw).toString().replace(/\/$/, "");
  } catch {
    throw new Error("NEXT_PUBLIC_SITE_URL is not a valid URL");
  }
}

export const env = {
  /** Base URL for canonical links, structured data and the sitemap, without a trailing slash. */
  siteUrl: readPublicUrl(),
};
