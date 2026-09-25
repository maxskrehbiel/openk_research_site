import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
export const metadata: Metadata = pageMeta(
  "/disclosures",
  "Research Disclosures",
  "Historical research is not live performance. Backtests involve assumptions, costs can change results, and models can fail.",
);
export default function Page() {
  return (
    <div className="zone-light zonewrap">
      <section className="room wrap column-wide">
        <p className="eyebrow">Disclosures</p>
        <h1 className="section-h">Research disclosures</h1>
        <div className="prose prose-page">
          <p>
            OpenK Research publishes historical and conceptual research. It does not provide
            investment advice, does not manage money, and does not claim live performance.
          </p>
          <p>
            Historical results are not live performance. Backtests involve assumptions about
            execution, costs, and data that can materially change outcomes.
          </p>
          <p>
            Models can and do fail. Research presented here may be revised or retracted as new tests
            are run.
          </p>
          <p>
            Nothing on this site is individualized investment advice, and no result should be read
            as a guarantee of future outcomes.
          </p>
          <p>
            OpenK Research is not registered as an investment adviser with the U.S. Securities and
            Exchange Commission or the Texas State Securities Board, and nothing on this site should
            be construed as investment advice.
          </p>
          <p>
            No content on this site is a recommendation, offer, or solicitation to buy, sell, or
            hold any security or to pursue any investment strategy. You are solely responsible for
            your own decisions and should consult a licensed professional before acting.
          </p>
          <p>
            Forward-looking statements, including any reference to a possible pattern, gap, or
            opportunity, are inherently uncertain, reflect current views only, and may prove wrong.
            Past or hypothetical results do not indicate future performance.
          </p>
          <p className="cap last-updated">Last updated: August 26, 2026.</p>
        </div>
      </section>
    </div>
  );
}
