import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
export const metadata: Metadata = pageMeta(
  "/about",
  "About OpenK",
  "OpenK Research is an independent quantitative research program studying market distributions, historical state and path, options-implied probabilities, portfolio risk, and research validation.",
);
export default function Page() {
  return (
    <div className="zone-light zonewrap">
      <section className="room wrap column-wide">
        <p className="eyebrow">About OpenK</p>
        <h1 className="section-h">An independent research program</h1>
        <div className="prose prose-page">
          <p>
            OpenK Research is an independent quantitative research program focused on market
            distributions, historical state and path, options-implied probabilities, portfolio risk,
            and research validation.
          </p>
          <p>
            The work rests on a single idea. Markets are hard to predict because future information
            is unknown, and in the short term investors can overreact to current events without
            enough historical context. OpenK studies whether price history alone contains enough
            information about market state, path, and cycle to improve estimates of future-return
            distributions.
          </p>
          <p>
            OpenK does not sell signals, does not manage money, and does not claim live
            profitability. It studies questions, tests them honestly, and reports what survives and
            what does not.
          </p>
          <p>
            OpenK was founded by Max Krehbiel as an attempt to translate a long-term, historically
            contextual view of markets into measurable and testable systems.
          </p>
        </div>
      </section>
    </div>
  );
}
