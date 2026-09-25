import { describe, expect, it } from "vitest";
import { articleMeta, clampDesc, pageMeta } from "@/lib/meta";
import type { Article } from "@/content/articles";

describe("clampDesc", () => {
  it("leaves short text unchanged", () => {
    expect(clampDesc("A short description.")).toBe("A short description.");
    const exact = "x".repeat(158);
    expect(clampDesc(exact)).toBe(exact);
  });

  it("cuts long text at the last word boundary within the limit", () => {
    const words = "market distribution ".repeat(20);
    const out = clampDesc(words);
    expect(out.length).toBeLessThanOrEqual(158);
    expect(words.startsWith(out)).toBe(true);
    expect(out.endsWith("distribution") || out.endsWith("market")).toBe(true);
  });

  it("cuts mid-word when the only word boundary would lose too much", () => {
    const text = "Short " + "x".repeat(300);
    expect(clampDesc(text)).toBe(text.slice(0, 158));
  });

  it("honors a custom limit and trims trailing spaces", () => {
    expect(clampDesc("one two three four five six seven eight nine ten eleven twelve", 50)).toBe(
      "one two three four five six seven eight nine ten",
    );
  });
});

describe("pageMeta", () => {
  it("gives each page its own canonical, Open Graph and Twitter entries", () => {
    expect(pageMeta("/methods", "Research Methods", "How OpenK validates results.")).toEqual({
      title: "Research Methods",
      description: "How OpenK validates results.",
      alternates: { canonical: "/methods" },
      openGraph: {
        type: "website",
        siteName: "OpenK Research",
        url: "/methods",
        title: "Research Methods | OpenK Research",
        description: "How OpenK validates results.",
        images: ["/og.png"],
      },
      twitter: {
        card: "summary_large_image",
        title: "Research Methods | OpenK Research",
        description: "How OpenK validates results.",
        images: ["/og.png"],
      },
    });
  });
});

describe("articleMeta", () => {
  const base: Article = {
    slug: "sample",
    kind: "note",
    title: "Sample note",
    dek: "What the note is about.",
    classification: "Concept explainer",
    readingMinutes: 4,
    sections: [],
    draft: false,
  };

  it("builds article metadata under the path for the article's kind", () => {
    const meta = articleMeta(base);
    expect(meta.alternates).toEqual({ canonical: "/research/sample" });
    expect(meta.openGraph).toMatchObject({ type: "article", url: "/research/sample" });
    expect(meta.openGraph).not.toHaveProperty("siteName");
    expect(articleMeta({ ...base, kind: "thesis" }).alternates).toEqual({
      canonical: "/ideas/sample",
    });
  });
});
