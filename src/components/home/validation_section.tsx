import Link from "next/link";
import { Reveal } from "@/components/reveal";

export function ValidationSection() {
  return (
    <section className="room wrap" id="validation">
      <Reveal>
        <div className="roomgrid split">
          <div className="prose">
            <h2>Every result must beat an honest baseline before it is shown</h2>
            <p>
              Results are validated chronologically, against real baselines, with controls for
              leakage and hindsight. Work that only looks good because of a subtle error does not
              survive, and the failures stay on the record. That discipline is the difference
              between a real finding and a lucky backtest.
            </p>
            <p>
              <Link href="/methods">Read the research methods</Link>
            </p>
          </div>
          <div className="colophon">
            <p>
              <b className="colophon-lead">Where the work stands.</b> OpenK is a research program in
              live testing, not a signal service or a fund. The distribution visuals on this page
              are illustrative; the models, parameters, and current outputs stay private.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
