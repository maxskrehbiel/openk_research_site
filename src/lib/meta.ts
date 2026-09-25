/** Page metadata builders: canonical URL, Open Graph and Twitter cards for pages and articles. */
import type { Metadata } from "next";
import { articlePath, type Article } from "@/content/articles";

/** Search engines show roughly the first 160 characters of a description. */
const MAX_DESCRIPTION_LENGTH = 158;
/** A word boundary earlier than this would cut too much, so the text is cut mid-word instead. */
const MIN_WORD_BREAK = 40;
const SHARE_IMAGE = "/og.png";

/** Trims a description to at most `max` characters, preferring to end at a word boundary. */
export function clampDesc(text: string, max = MAX_DESCRIPTION_LENGTH): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > MIN_WORD_BREAK ? cut.slice(0, lastSpace) : cut).trimEnd();
}

function socialMeta(
  type: "website" | "article",
  path: string,
  title: string,
  description: string,
): Metadata {
  const desc = clampDesc(description);
  const shareTitle = `${title} | OpenK Research`;
  return {
    title,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      type,
      ...(type === "website" ? { siteName: "OpenK Research" } : {}),
      url: path,
      title: shareTitle,
      description: desc,
      images: [SHARE_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description: desc,
      images: [SHARE_IMAGE],
    },
  };
}

/**
 * Metadata for a site page, with its own canonical, Open Graph and Twitter entries so subpages do not
 * inherit the home page's.
 */
export function pageMeta(path: string, title: string, description: string): Metadata {
  return socialMeta("website", path, title, description);
}

/** Metadata for an article page, described by the article's dek. */
export function articleMeta(article: Article): Metadata {
  return socialMeta("article", articlePath(article), article.title, article.dek);
}
