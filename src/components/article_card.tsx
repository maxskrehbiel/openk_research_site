import Link from "next/link";
import { articlePath, type Article } from "@/content/articles";

export function ArticleCard({
  article,
  headingLevel = "h3",
}: {
  article: Article;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <Link className="card card-link" href={articlePath(article)}>
      <span className="badge">{article.classification}</span>
      <Heading>{article.title}</Heading>
      <p className="promise">{article.dek}</p>
      <p className="cap">{article.readingMinutes} min read</p>
    </Link>
  );
}
