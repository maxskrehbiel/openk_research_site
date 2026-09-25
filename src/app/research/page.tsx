import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { programs, notes } from "@/content/articles";
import { ArticleCard } from "@/components/article_card";
export const metadata: Metadata = pageMeta(
  "/research",
  "Research",
  "OpenK research programs and notes: forward return distributions, read from where a market sits in its own history and how it got there.",
);
export default function Research() {
  return (
    <div className="zone-light zonewrap">
      <section className="room wrap">
        <p className="eyebrow">Research</p>
        <h1 className="section-h">Research programs</h1>
        <p className="prose section-lede">
          How the worldview becomes measurable and testable systems, built from price and options
          data.
        </p>
        <div className="cards">
          {programs().map((article) => (
            <ArticleCard key={article.slug} article={article} headingLevel="h2" />
          ))}
        </div>
        <h2 className="section-h section-break">Concept explainers</h2>
        <div className="cards">
          {notes().map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}
