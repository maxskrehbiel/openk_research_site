import spx from "@/data/spx.json";
import { formatIndexLevel } from "@/lib/format";

// Illustrative: real S&P 500 monthly closes on a log scale, with a smooth evolving long-run reference the price
// oscillates around. This is a concept illustration of the K curve's ROLE (a moving reference), built from public
// index levels. It is not OpenK's model; the exact construction of the K curve is private. Deterministic paths.

/** One month: `t` is the fractional year, `p` the closing level and `r` the illustrative reference level. */
type MonthPoint = { t: number; p: number; r: number };
const SERIES: MonthPoint[] = spx.series;

const WIDTH = 620;
const HEIGHT = 340;
const MARGIN = { left: 40, right: 16, top: 22, bottom: 30 };
const LEVEL_TICKS = [200, 500, 1000, 2000, 5000];
const YEAR_TICKS = [1980, 1990, 2000, 2010, 2020];

const firstYear = SERIES[0].t;
const lastYear = SERIES[SERIES.length - 1].t;
let logMin = Infinity;
let logMax = -Infinity;
for (const point of SERIES) {
  logMin = Math.min(logMin, Math.log(point.p), Math.log(point.r));
  logMax = Math.max(logMax, Math.log(point.p), Math.log(point.r));
}
// Four percent headroom above and below the data.
const logPad = (logMax - logMin) * 0.04;
logMin -= logPad;
logMax += logPad;

const toX = (year: number) =>
  MARGIN.left +
  ((year - firstYear) / (lastYear - firstYear)) * (WIDTH - MARGIN.left - MARGIN.right);
const toY = (level: number) =>
  MARGIN.top +
  (1 - (Math.log(level) - logMin) / (logMax - logMin)) * (HEIGHT - MARGIN.top - MARGIN.bottom);
const seriesPath = (key: "p" | "r") =>
  SERIES.map(
    (point, i) => `${i ? "L" : "M"}${toX(point.t).toFixed(1)},${toY(point[key]).toFixed(1)}`,
  ).join(" ");

/** Horizontal gridlines with index-level labels, and year labels along the bottom. */
function Axes() {
  return (
    <>
      {LEVEL_TICKS.map((level) => (
        <g key={level}>
          <line
            x1={MARGIN.left}
            y1={toY(level)}
            x2={WIDTH - MARGIN.right}
            y2={toY(level)}
            stroke="var(--hairline)"
            strokeWidth={1}
            opacity={0.4}
          />
          <text
            x={MARGIN.left - 6}
            y={toY(level) + 3}
            textAnchor="end"
            fontFamily="var(--mono)"
            fontSize={10}
            fill="var(--ink3)"
          >
            {formatIndexLevel(level)}
          </text>
        </g>
      ))}
      {YEAR_TICKS.map((year) => (
        <text
          key={year}
          x={toX(year)}
          y={HEIGHT - 12}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize={10}
          fill="var(--ink3)"
        >{`'${String(year).slice(2)}`}</text>
      ))}
    </>
  );
}

export function KCurveGraph() {
  return (
    <figure className="figure-flush">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width="100%"
        role="img"
        aria-label="Real S&P 500 monthly closes from 1979 to 2025 on a logarithmic scale, with a smooth evolving long-run reference line that the price oscillates above and below."
        className="chart-svg"
      >
        <Axes />
        <path
          d={seriesPath("p")}
          fill="none"
          stroke="var(--realized)"
          strokeWidth={1.1}
          opacity={0.85}
        />
        <path
          d={seriesPath("r")}
          fill="none"
          stroke="var(--model)"
          strokeWidth={2.6}
          strokeLinejoin="round"
        />
        <g fontFamily="var(--sans)" fontSize={12}>
          <text x={MARGIN.left + 6} y={MARGIN.top + 12} fill="var(--realized)">
            S&amp;P 500 (log scale)
          </text>
          <text x={MARGIN.left + 6} y={MARGIN.top + 30} fill="var(--model)">
            Evolving long-run reference
          </text>
        </g>
      </svg>
      <figcaption className="cap chart-caption">
        Illustrative. Real S&amp;P 500 monthly closes on a log scale (1979 to 2025), with a smooth
        evolving long-run reference the price moves around. The K curve is OpenK&apos;s model of
        that moving reference; the exact construction is private.
      </figcaption>
    </figure>
  );
}
