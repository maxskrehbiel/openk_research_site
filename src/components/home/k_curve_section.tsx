import Link from "next/link";
import { KCurveGraph } from "@/components/k_curve_graph";
import { Reveal } from "@/components/reveal";

export function KCurveSection() {
  return (
    <section className="room wrap" id="k-curve">
      <Reveal>
        <div className="roomgrid split">
          <div className="prose">
            <h2>The K curve</h2>
            <p>
              Markets fluctuate around an evolving long-run structure. Short-term information can
              pull price far from that structure, while the structure itself changes gradually over
              time. That reference is not a fixed average or a target price. It shifts as the market
              and the economy evolve.
            </p>
            <p>
              The K curve is OpenK&apos;s model of that moving reference, adapted from a published
              and well-tested idea and now in live testing. Reversion does not mean returning to an
              old price. It means the temporary part of a move has more room to fade as the horizon
              grows.
            </p>
            <p>
              <Link href="/ideas/the-k-curve">
                Read: The K Curve: Where Noise Gives Way to Structure
              </Link>
            </p>
          </div>
          <div className="plate plate-centered">
            <KCurveGraph />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
