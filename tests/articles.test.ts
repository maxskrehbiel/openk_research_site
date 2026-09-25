import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import {
  articlePath,
  articles,
  getArticle,
  isPublished,
  notes,
  programs,
  thesisArticles,
  type Article,
} from "@/content/articles";

describe("article catalog", () => {
  it("has unique slugs and related links that resolve", () => {
    const slugs = articles.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const article of articles) {
      for (const related of article.related ?? []) expect(slugs).toContain(related);
    }
  });

  it("splits articles by kind", () => {
    expect(thesisArticles().every((a) => a.kind === "thesis")).toBe(true);
    expect(notes().every((a) => a.kind === "note")).toBe(true);
    expect(programs().every((a) => a.kind === "program")).toBe(true);
    expect(thesisArticles().length + notes().length + programs().length).toBe(articles.length);
  });

  it("finds articles by slug", () => {
    expect(getArticle("the-k-curve")?.title).toMatch(/K Curve/);
    expect(getArticle("no-such-article")).toBeUndefined();
  });

  it("routes theses under /ideas and everything else under /research", () => {
    const stub = { slug: "s" } as Article;
    expect(articlePath({ ...stub, kind: "thesis" })).toBe("/ideas/s");
    expect(articlePath({ ...stub, kind: "note" })).toBe("/research/s");
    expect(articlePath({ ...stub, kind: "program" })).toBe("/research/s");
  });

  it("treats only draft === false as published", () => {
    const stub = { slug: "s", kind: "note" } as Article;
    expect(isPublished({ ...stub, draft: false })).toBe(true);
    expect(isPublished({ ...stub, draft: true })).toBe(false);
    expect(isPublished(stub)).toBe(false);
  });
});

describe("sitemap", () => {
  it("lists the static pages and every published article, without duplicates", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain("http://localhost:3000/");
    expect(urls).toContain("http://localhost:3000/data-and-licensing");
    for (const article of articles.filter(isPublished)) {
      expect(urls).toContain(`http://localhost:3000${articlePath(article)}`);
    }
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toHaveLength(12 + articles.filter(isPublished).length);
  });
});
