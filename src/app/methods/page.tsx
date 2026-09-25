import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
export const metadata: Metadata = pageMeta(
  "/methods",
  "Research Methods",
  "How OpenK forms questions, constrains information to prediction time, validates chronologically, and separates statistical fit from economic value.",
);
export default function Page() {
  return (
    <div className="zone-light zonewrap">
      <section className="room wrap column-wide">
        <p className="eyebrow">Methods</p>
        <h1 className="section-h">How OpenK Works</h1>
        <div className="prose prose-page">
          <p>
            An impressive result is not automatically a useful one. OpenK is built around research
            standards, not marketing claims. Every comparison is tested chronologically, against
            honest baselines, with controls for information leakage, overfitting, and selecting the
            best-looking result after the fact.
          </p>
          <p>
            Time integrity. A model can use only the information available at the historical
            decision point. No future normalization. No revised data unless it is clearly disclosed.
          </p>
          <p>
            Chronological validation. Models are tested across ordered train, validation, embargo,
            and test periods. Data is never randomly shuffled, and the final test period is not used
            for tuning.
          </p>
          <p>
            Baseline comparison. Complexity has to earn its place. A model must outperform simple,
            relevant alternatives across the same sample and horizons before it deserves attention.
          </p>
          <p>
            Economic separation. Better statistical performance does not automatically mean a
            strategy is profitable, realistic, or implementable. Forecast quality and economic value
            are tested separately.
          </p>
          <p>
            Failure preservation. Negative and rejected results remain part of the research record.
            A result only becomes public once it survives the level of scrutiny I would expect from
            someone trying to prove it wrong.
          </p>
          <p>
            Publication boundaries. Private model logic, current predictions, licensed data, and
            sensitive implementation details remain private.
          </p>
        </div>
      </section>
    </div>
  );
}
