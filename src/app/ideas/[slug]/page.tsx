import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/article_page";
import { getArticle, thesisArticles } from "@/content/articles";
import { articleMeta } from "@/lib/meta";

type Props = { params: Promise<{ slug: string }> };

// Only pre-generated (published) slugs exist in production; any other slug 404s instead of rendering on demand.
export const dynamicParams = false;

export function generateStaticParams() {
  return thesisArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticle((await params).slug);
  return article ? articleMeta(article) : { title: "Not found" };
}

export default async function IdeaPage({ params }: Props) {
  const article = getArticle((await params).slug);
  if (!article || article.kind !== "thesis") notFound();
  return (
    <div className="zone-light zonewrap">
      <ArticleView article={article} />
    </div>
  );
}
