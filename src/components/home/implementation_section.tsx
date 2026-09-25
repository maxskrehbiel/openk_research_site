import Link from "next/link";
import { Reveal } from "@/components/reveal";

const RESEARCH_LAYERS: [string, string][] = [
  ["Elastic field", "Where the market sits relative to many historical scales."],
  ["Path field", "How the market arrived at its current state."],
  ["Forward distributions", "A physical estimate of the range of future outcomes."],
  ["Market-Implied distributions", "The distribution the options market is pricing."],
  ["Comparison research", "Where the two views disagree, and what that may mean."],
];

export function ImplementationSection() {
  return (
    <section className="room wrap" id="implementation">
      <Reveal>
        <p className="eyebrow">Research implementation</p>
        <h2 className="section-h">How my intuition became a model.</h2>
        <p className="prose section-lede">
          OpenK began as an attempt to show a computer what I was seeing, starting from price
          history.
        </p>
        <div className="cards implementation-cards">
          {RESEARCH_LAYERS.map(([title, description]) => (
            <div className="card" key={title}>
              <h3 className="card-title-flush">{title}</h3>
              <p className="promise">{description}</p>
            </div>
          ))}
        </div>
        <p className="cap section-link">
          <Link href="/research">See the research programs</Link>
        </p>
      </Reveal>
    </section>
  );
}
