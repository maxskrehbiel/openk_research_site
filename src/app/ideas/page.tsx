import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { thesisArticles } from "@/content/articles";
import { ArticleCard } from "@/components/article_card";
export const metadata: Metadata = pageMeta(
  "/ideas",
  "Ideas",
  "The market assumptions that motivate OpenK Research, starting with the K curve: how short-term noise gives way to long-run structure as time expands.",
);
export default function Ideas() {
  return (
    <div className="zone-light zonewrap">
      <section className="room wrap">
        <p className="eyebrow">Ideas</p>
        <h1 className="section-h">The ideas behind the research</h1>
        <p className="prose section-lede">
          These essays explain the market assumptions that motivate OpenK. They are working views
          that guide the questions the research is designed to test, not established laws. More are
          published as they are finalized.
        </p>
        <div className="cards">
          {thesisArticles().map((article) => (
            <ArticleCard key={article.slug} article={article} headingLevel="h2" />
          ))}
        </div>
      </section>
    </div>
  );
}
