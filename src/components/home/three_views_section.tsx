import { ImpliedDensityExhibit } from "@/components/implied_density_exhibit";
import { Reveal } from "@/components/reveal";
import { WedgeDiagram } from "@/components/wedge_diagram";

export function ThreeViewsSection() {
  return (
    <section className="room wrap center" id="three-views">
      <Reveal>
        <p className="eyebrow">Anticipation vs Realized Outcomes</p>
        <h2 className="section-h">
          Uncertainty has consequences, and the market prices them consistently
        </h2>
        <p className="prose section-intro">
          On any date, the options market implies a full distribution of where the index could go.
          These are real market-implied distributions on historical dates, recovered from option
          prices, compared to the outcome that arrived. The distance between the priced fear and the
          realized result is the gap OpenK studies.
        </p>
        <div className="exhibit-frame">
          <ImpliedDensityExhibit />
        </div>
        <p className="prose section-outro">
          Look a year out and a pattern appears: on four of these five dates, the center of the
          distribution sat below the outcome that arrived. The exception, the top before the 2022
          bear market, is a reminder that it is a tendency, not a rule. Whether that gap is
          systematic, and whether it can be turned into anything reliable, is exactly the question
          we want to answer.
        </p>
        <div className="wedge-frame">
          <WedgeDiagram />
        </div>
      </Reveal>
    </section>
  );
}
