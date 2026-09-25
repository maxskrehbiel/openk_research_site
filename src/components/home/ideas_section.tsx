import { ArticleCard } from "@/components/article_card";
import { Reveal } from "@/components/reveal";
import { thesisArticles } from "@/content/articles";

export function IdeasSection() {
  return (
    <section className="room wrap" id="ideas">
      <Reveal>
        <p className="eyebrow">The ideas behind the research</p>
        <h2 className="section-h">The framework the research is built on</h2>
        <p className="prose section-lede">
          How we believe markets behave, and why the shape of uncertainty is the thing worth
          forecasting.
        </p>
        <div className="cards">
          {thesisArticles().map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
