import { Reveal } from "@/components/reveal";

const CYCLE_STAGES = [
  "Price bottoms",
  "Fear dissipates",
  "Liquidity injected",
  "Economic activity explodes",
  "Valuation outpaces growth",
  "Fragility builds",
  "Assumptions fail",
  "Trend breaks",
];

export function CycleLoopSection() {
  return (
    <section className="room wrap center">
      <Reveal>
        <p className="eyebrow">The economic-cycle feedback loop</p>
        <h2 className="section-h">Markets respond to the cycle, and help create it</h2>
        <div className="cycle-loop">
          {CYCLE_STAGES.map((stage, i) => (
            <span key={stage} className="cycle-step">
              <span className="mono cycle-stage">{stage}</span>
              <span className="cycle-arrow">{i < CYCLE_STAGES.length - 1 ? "→" : "↺"}</span>
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
