import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta(
  "/founder",
  "Max Krehbiel, Founder",
  "Max Krehbiel founded OpenK Research to translate a long-term, historically contextual view of markets into measurable and testable systems.",
);

export default function Page() {
  return (
    <div className="zone-light zonewrap">
      <section className="room wrap column-wide">
        <p className="eyebrow">Founder</p>
        <h1 className="section-h">Max Krehbiel</h1>
        <div className="prose prose-page">
          <p>
            I built OpenK. I study the intersection of options markets, price behavior, and human
            psychology, and I started this because I wanted to know whether the way I view markets
            could be made precise enough to test.
          </p>
          <p>
            The origin was literal. I set out to show a computer the same things I look at when I
            make an investment decision: where the market sits, how it got there, where it is in the
            cycle, and whether the current level of fear or optimism is unusual in historical
            context. After years of research, that intuition had become a model. A model with
            infrastructure that reconstructs historical option-implied distributions, describes
            market state and path from price alone, and rigorously rejects results that do not
            survive honest testing.
          </p>
          <p>
            I am completing an M.S. in Business Analytics at TCU&apos;s Neeley School of Business,
            where I was named a Neeley Senior Finance Scholar. My background is in finance and
            analytics, and this research is independent. OpenK is not a fund and does not accept
            outside investment. It is the work of turning a long-term, historically contextual view
            of markets into systems that can be measured and falsified.
          </p>
          <p>
            What I care about is honest research under real constraints: only using information
            available at the decision time, with chronological validation, real baselines, and
            failures kept on the record. The distribution-reconstruction infrastructure and a
            methods article are available to serious inquiries. If that is the kind of work you take
            seriously, I would like to hear from you.
          </p>
          <p>
            <Link href="/contact">Get in touch</Link>, or read{" "}
            <Link href="/ideas/the-k-curve">the idea the research is built on</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
