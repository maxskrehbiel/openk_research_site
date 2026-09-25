// Illustrative diagram of "the wedge": the gap between the market-implied (risk-neutral) distribution and a
// history-conditioned physical view of the same future. Conceptual and clearly labeled illustrative. No data,
// no OpenK model output, no result. Deterministic paths, so it renders identically on server and client.

const WIDTH = 720;
const HEIGHT = 360;
const MARGIN = { left: 24, right: 24, top: 26, bottom: 46 };
const RETURN_MIN = -0.55;
const RETURN_MAX = 0.55;
const SAMPLES = 240;

/** Unnormalized split-normal density: a different spread on each side of the mode gives the skew. */
function splitNormal(x: number, mode: number, leftSpread: number, rightSpread: number) {
  const spread = x < mode ? leftSpread : rightSpread;
  return Math.exp(-0.5 * ((x - mode) / spread) ** 2);
}

/** Both curves on a shared grid, scaled so the taller one peaks at 1. */
function buildCurves() {
  const returns: number[] = [];
  const implied: number[] = [];
  const physical: number[] = [];
  let peak = 0;
  for (let i = 0; i <= SAMPLES; i++) {
    const x = RETURN_MIN + (i / SAMPLES) * (RETURN_MAX - RETURN_MIN);
    const impliedValue = splitNormal(x, -0.02, 0.19, 0.1); // fat left tail: priced fear
    const physicalValue = splitNormal(x, 0.03, 0.12, 0.115); // history says the downside is lighter
    returns.push(x);
    implied.push(impliedValue);
    physical.push(physicalValue);
    peak = Math.max(peak, impliedValue, physicalValue);
  }
  return {
    returns,
    implied: implied.map((v) => v / peak),
    physical: physical.map((v) => v / peak),
  };
}

const { returns, implied, physical } = buildCurves();
const toX = (x: number) =>
  MARGIN.left +
  ((x - RETURN_MIN) / (RETURN_MAX - RETURN_MIN)) * (WIDTH - MARGIN.left - MARGIN.right);
const baseline = HEIGHT - MARGIN.bottom;
const toY = (value: number) => baseline - value * (HEIGHT - MARGIN.top - MARGIN.bottom);
const curvePath = (values: number[]) =>
  values
    .map((v, i) => `${i ? "L" : "M"}${toX(returns[i]).toFixed(1)},${toY(v).toFixed(1)}`)
    .join(" ");

// The wedge: the downside region where the market-implied curve sits above the physical one.
const wedgeIndices = returns
  .map((x, i) => (x < 0.02 && implied[i] > physical[i] ? i : -1))
  .filter((i) => i >= 0);
const wedgePath = wedgeIndices.length
  ? "M" +
    wedgeIndices
      .map((i) => `${toX(returns[i]).toFixed(1)},${toY(implied[i]).toFixed(1)}`)
      .join(" L ") +
    " L " +
    wedgeIndices
      .slice()
      .reverse()
      .map((i) => `${toX(returns[i]).toFixed(1)},${toY(physical[i]).toFixed(1)}`)
      .join(" L ") +
    " Z"
  : "";

export function WedgeDiagram() {
  return (
    <figure className="figure-flush">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width="100%"
        role="img"
        aria-label="Illustrative comparison of the market-implied distribution and a history-conditioned physical view, with the downside gap between them shaded."
        className="chart-svg"
      >
        <line
          x1={toX(0)}
          y1={MARGIN.top}
          x2={toX(0)}
          y2={baseline}
          stroke="var(--hairline)"
          strokeWidth={1}
          opacity={0.7}
        />
        {wedgePath && <path d={wedgePath} fill="var(--realized)" opacity={0.16} />}
        <path
          d={curvePath(implied)}
          fill="none"
          stroke="var(--rn)"
          strokeWidth={2.2}
          strokeDasharray="6 4"
        />
        <path d={curvePath(physical)} fill="none" stroke="var(--model)" strokeWidth={2.6} />
        <g fontFamily="var(--mono)" fontSize={12} fill="var(--ink3)">
          <text x={toX(0)} y={HEIGHT - 26} textAnchor="middle">
            0%
          </text>
          <text x={toX(-0.4)} y={HEIGHT - 26} textAnchor="middle">
            loss
          </text>
          <text x={toX(0.4)} y={HEIGHT - 26} textAnchor="middle">
            gain
          </text>
        </g>
        <g fontFamily="var(--sans)" fontSize={13}>
          <text x={toX(-0.34)} y={toY(0.42)} fill="var(--rn)">
            Market-implied
          </text>
          <text x={toX(0.16)} y={toY(0.78)} fill="var(--model)">
            Physical (history)
          </text>
        </g>
      </svg>
      <figcaption className="cap chart-caption">
        Illustrative. The market prices fear into the downside (gray); a history-conditioned view
        often finds it heavier than warranted (blue). OpenK&apos;s work is to estimate that second
        curve from price and study the difference.
      </figcaption>
    </figure>
  );
}
