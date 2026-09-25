import Link from "next/link";
import { articlePath, getArticle, type Article } from "@/content/articles";
import { env } from "@/lib/env";
import { NewsletterSignup } from "@/components/newsletter_signup";

// Publication date used in the article structured data.
const ARTICLE_DATE = "2026-07-20";

function isDraft(article: Article) {
  return article.draft !== false;
}

/** schema.org Article structured data for search engines. */
function articleJsonLd(article: Article) {
  const url = `${env.siteUrl}${articlePath(article)}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.dek,
    url,
    mainEntityOfPage: url,
    inLanguage: "en",
    image: `${env.siteUrl}/og.png`,
    datePublished: ARTICLE_DATE,
    dateModified: ARTICLE_DATE,
    author: { "@type": "Person", name: "Max Krehbiel" },
    publisher: {
      "@type": "Organization",
      name: "OpenK Research",
      logo: { "@type": "ImageObject", url: `${env.siteUrl}/logo_square.png` },
    },
    creativeWorkStatus: isDraft(article) ? "Draft" : "Published",
  };
}

function ArticleHeader({ article }: { article: Article }) {
  const isThesis = article.kind === "thesis";
  return (
    <>
      <p className="eyebrow">
        <Link href={isThesis ? "/ideas" : "/research"}>{isThesis ? "Ideas" : "Research"}</Link>
      </p>
      <h1 className="article-title">{article.title}</h1>
      <p className="article-dek">{article.dek}</p>
      <p className="mono article-meta">
        <span>{article.classification}</span>
        <span>{article.readingMinutes} min read</span>
        {isDraft(article) && <span className="article-draft-flag">Working draft</span>}
      </p>
    </>
  );
}

function ArticleBody({ article }: { article: Article }) {
  return (
    <div className="articlebody">
      {article.sections.map((section, i) => (
        <section key={i} className="article-section">
          <h2 className="article-section-title">{section.heading}</h2>
          {section.body.map((paragraph, j) => (
            <p key={j} className="article-paragraph">
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}

function ArticleExtras({ article }: { article: Article }) {
  const related = (article.related ?? []).map(getArticle).filter(Boolean) as Article[];
  return (
    <>
      {article.keyTakeaways && article.keyTakeaways.length > 0 && (
        <div className="colophon article-summary">
          <h3 className="article-summary-title">In short</h3>
          <ul className="article-summary-list">
            {article.keyTakeaways.map((takeaway, i) => (
              <li key={i}>{takeaway}</li>
            ))}
          </ul>
        </div>
      )}
      {article.references && article.references.length > 0 && (
        <div className="article-references">
          <p className="eyebrow">References</p>
          <ol className="article-reference-list">
            {article.references.map((ref, i) => (
              <li key={i}>
                {ref.authors} ({ref.year}). <cite>{ref.title}.</cite> {ref.venue}.
              </li>
            ))}
          </ol>
        </div>
      )}
      {related.length > 0 && (
        <div className="article-related">
          <p className="eyebrow">Related</p>
          <ul className="article-related-list">
            {related.map((other) => (
              <li key={other.slug}>
                <Link href={articlePath(other)}>{other.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

function ArticleCallToAction() {
  return (
    <div className="article-cta">
      <p className="cap article-cta-note">
        OpenK articles explain the assumptions that motivate the research. They are working views
        that guide the questions the work is designed to test, not established results.
      </p>
      <p className="article-cta-action">
        <Link className="btn" href="/contact">
          Discuss the research
        </Link>
      </p>
      <p className="cap article-cta-signup">Or get new findings and essays as they publish.</p>
      <NewsletterSignup compact />
    </div>
  );
}

/** A full article: header, sections, takeaways, references, related links and the closing call to action. */
export function ArticleView({ article }: { article: Article }) {
  return (
    <article className="wrap article">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(article)) }}
      />
      <ArticleHeader article={article} />
      <ArticleBody article={article} />
      <ArticleExtras article={article} />
      <ArticleCallToAction />
    </article>
  );
}
