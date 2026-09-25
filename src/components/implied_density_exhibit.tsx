"use client";
import { useEffect, useRef, useState } from "react";
import data from "@/data/implied.json";
import { formatSignedPercent } from "@/lib/format";
import { densityGrid, impliedCdf, type DensityGrid } from "@/lib/implied_density";

// Flagship exhibit: the market-implied (risk-neutral) return distribution the options market priced on real
// historical dates, with the realized outcome marked and the market-implied percentile of that outcome shown.
// Data is curated, downsampled, and rounded market-implied quantiles (recovered from option prices via the
// textbook Breeden-Litzenberger relation) plus realized index returns. No OpenK model output is shown.

/** Return quantiles the options market priced on one date for one horizon, and the return that followed. */
type HorizonView = { quantiles: number[]; realized: number };
type Episode = { date: string; label: string; horizons: Record<string, HorizonView> };

const KNOTS: number[] = data.knots;
const MEDIAN_INDEX = KNOTS.indexOf(0.5);
const FIFTH_PERCENTILE_INDEX = KNOTS.indexOf(0.05);
const EPISODES: Episode[] = data.examples.map((episode) => ({
  date: episode.date,
  label: episode.label,
  horizons: Object.fromEntries(
    Object.entries(episode.horizons).map(([days, view]) => [
      days,
      { quantiles: view.rn, realized: view.realized },
    ]),
  ),
}));
/** The exhibit opens on the COVID crash. */
const DEFAULT_EPISODE = EPISODES.findIndex((episode) => episode.date === "2020-03-16");
/** Horizons are keyed by trading days. */
const HORIZON_LABELS: Record<string, string> = {
  "21": "1 month",
  "63": "3 months",
  "126": "6 months",
  "252": "1 year",
};
const HORIZON_ORDER = ["21", "63", "126", "252"];
const DEFAULT_HORIZON = "63";
/** Label for the realized return, on the chart and in the readout below it. */
const REALIZED_LABEL = "realized";

const CANVAS_WIDTH = 940;
const CANVAS_HEIGHT = 440;
const MARGIN = { left: 24, right: 24, top: 30, bottom: 54 };
const GRID_POINTS = 300;

type Plot = {
  ctx: CanvasRenderingContext2D;
  colors: { model: string; realized: string; muted: string; grid: string };
  xMin: number;
  xMax: number;
  baseline: number;
  toX: (x: number) => number;
  toY: (density: number) => number;
};

/** Vertical grid lines with percentage labels, then the axis caption. */
function drawGrid({ ctx, colors, xMin, xMax, baseline, toX }: Plot, span: number, caption: string) {
  ctx.font = "12px ui-monospace, monospace";
  ctx.textAlign = "center";
  const step = span > 0.6 ? 0.2 : span > 0.3 ? 0.1 : 0.05;
  for (let x = Math.ceil(xMin / step) * step; x <= xMax + 1e-9; x += step) {
    ctx.strokeStyle = colors.grid;
    ctx.globalAlpha = Math.abs(x) < 1e-9 ? 0.85 : 0.25;
    ctx.beginPath();
    ctx.moveTo(toX(x), MARGIN.top);
    ctx.lineTo(toX(x), baseline);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = colors.muted;
    ctx.fillText(`${x >= 0 ? "+" : ""}${Math.round(x * 100)}%`, toX(x), CANVAS_HEIGHT - 32);
  }
  ctx.fillStyle = colors.muted;
  ctx.fillText(caption, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 12);
}

/** Shades the mass at or below the realized return, then fills and strokes the whole density. */
function drawDensity(plot: Plot, { density, gridX }: DensityGrid, realized: number) {
  const { ctx, colors, xMin, xMax, baseline, toX, toY } = plot;
  ctx.beginPath();
  ctx.moveTo(toX(xMin), baseline);
  for (let j = 0; j <= GRID_POINTS; j++) {
    const x = gridX(j);
    if (x <= realized) ctx.lineTo(toX(x), toY(density[j]));
  }
  ctx.lineTo(toX(Math.min(realized, xMax)), baseline);
  ctx.closePath();
  ctx.fillStyle = colors.model;
  ctx.globalAlpha = 0.16;
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.beginPath();
  ctx.moveTo(toX(xMin), baseline);
  for (let j = 0; j <= GRID_POINTS; j++) ctx.lineTo(toX(gridX(j)), toY(density[j]));
  ctx.lineTo(toX(xMax), baseline);
  ctx.closePath();
  const gradient = ctx.createLinearGradient(0, MARGIN.top, 0, baseline);
  gradient.addColorStop(0, colors.model + "1f");
  gradient.addColorStop(1, colors.model + "00");
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.beginPath();
  for (let j = 0; j <= GRID_POINTS; j++)
    (j === 0 ? ctx.moveTo : ctx.lineTo).call(ctx, toX(gridX(j)), toY(density[j]));
  ctx.strokeStyle = colors.model;
  ctx.lineWidth = 2.4;
  ctx.lineJoin = "round";
  ctx.stroke();
}

/** A dashed line at the implied median and a gold line, dot and label at the realized return. */
function drawMarkers(
  plot: Plot,
  median: number,
  realized: number,
  densityAt: (x: number) => number,
) {
  const { ctx, colors, xMin, xMax, baseline, toX, toY } = plot;
  ctx.setLineDash([5, 4]);
  ctx.strokeStyle = colors.muted;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(toX(median), toY(densityAt(median)));
  ctx.lineTo(toX(median), baseline);
  ctx.stroke();
  ctx.setLineDash([]);

  const markerX = Math.max(xMin, Math.min(xMax, realized));
  ctx.strokeStyle = colors.realized;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(toX(markerX), MARGIN.top);
  ctx.lineTo(toX(markerX), baseline);
  ctx.stroke();
  ctx.fillStyle = colors.realized;
  ctx.beginPath();
  ctx.arc(toX(markerX), toY(densityAt(markerX)), 4.5, 0, 7);
  ctx.fill();
  const labelOnLeft = markerX > (xMin + xMax) / 2;
  ctx.textAlign = labelOnLeft ? "right" : "left";
  ctx.font = "600 13px ui-sans-serif, system-ui, sans-serif";
  ctx.fillStyle = colors.realized;
  ctx.fillText(
    `${REALIZED_LABEL} ${formatSignedPercent(realized)}`,
    toX(markerX) + (labelOnLeft ? -8 : 8),
    MARGIN.top + 12,
  );
}

/** Draws one episode and horizon onto the canvas at the device pixel ratio (capped at 2). */
function drawExhibit(canvas: HTMLCanvasElement, view: HorizonView, horizonLabel: string) {
  const pixelRatio = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = CANVAS_WIDTH * pixelRatio;
  canvas.height = CANVAS_HEIGHT * pixelRatio;
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  const styles = getComputedStyle(document.documentElement);
  const cssVar = (name: string) => styles.getPropertyValue(name).trim();
  const colors = {
    model: cssVar("--model"),
    realized: cssVar("--realized"),
    muted: cssVar("--ink3"),
    grid: cssVar("--hairline"),
  };
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const { quantiles, realized } = view;
  const low = quantiles[0];
  const high = quantiles[quantiles.length - 1];
  const span = high - low;
  const xMin = Math.min(low - span * 0.1, realized - span * 0.06);
  const xMax = Math.max(high + span * 0.1, realized + span * 0.06);
  const grid = densityGrid(quantiles, KNOTS, xMin, xMax, GRID_POINTS);
  let peak = 0;
  for (const value of grid.density) if (value > peak) peak = value;
  const baseline = CANVAS_HEIGHT - MARGIN.bottom;
  const plot: Plot = {
    ctx,
    colors,
    xMin,
    xMax,
    baseline,
    toX: (x) =>
      MARGIN.left + ((x - xMin) / (xMax - xMin)) * (CANVAS_WIDTH - MARGIN.left - MARGIN.right),
    toY: (density) =>
      baseline - (density / (peak || 1)) * (CANVAS_HEIGHT - MARGIN.top - MARGIN.bottom),
  };
  const densityAt = (x: number) => {
    const j = Math.round(((x - xMin) / (xMax - xMin)) * GRID_POINTS);
    return grid.density[Math.max(0, Math.min(GRID_POINTS, j))];
  };

  drawGrid(plot, span, `return over ${horizonLabel}`);
  drawDensity(plot, grid, realized);
  drawMarkers(plot, quantiles[MEDIAN_INDEX], realized, densityAt);
}

/** One line of numbers under the chart for the selected episode and horizon. */
function EpisodeReadout({
  episode,
  view,
  realizedPercentile,
}: {
  episode: Episode;
  view: HorizonView;
  realizedPercentile: number;
}) {
  const median = formatSignedPercent(view.quantiles[MEDIAN_INDEX]);
  const fifthPercentile = formatSignedPercent(view.quantiles[FIFTH_PERCENTILE_INDEX]);
  const realized = formatSignedPercent(view.realized);
  const worseOutcomeOdds = Math.round(realizedPercentile * 100);
  return (
    <div className="readout exhibit-readout">
      <span>
        {episode.date} <b>{episode.label}</b>
      </span>
      <span>
        implied median <b className="mono">{median}</b>
      </span>
      <span>
        implied 5th pct <b className="mono">{fifthPercentile}</b>
      </span>
      <span>
        {REALIZED_LABEL} <b className="mono realized-value">{realized}</b>
      </span>
      <span>
        implied odds of a worse outcome <b className="mono">{worseOutcomeOdds}%</b>
      </span>
    </div>
  );
}

export function ImpliedDensityExhibit() {
  const [episodeIndex, setEpisodeIndex] = useState(DEFAULT_EPISODE);
  const [horizonDays, setHorizonDays] = useState(DEFAULT_HORIZON);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const episode = EPISODES[episodeIndex];
  const view = episode.horizons[horizonDays];
  const horizonLabel = HORIZON_LABELS[horizonDays];
  // Market-implied probability of an outcome at or below the realized return.
  const realizedPercentile = impliedCdf(view.quantiles, KNOTS, view.realized);
  const realized = formatSignedPercent(view.realized);
  const worseOutcomeOdds = Math.round(realizedPercentile * 100);

  useEffect(() => {
    if (canvasRef.current) drawExhibit(canvasRef.current, view, horizonLabel);
  }, [view, horizonLabel]);

  return (
    <figure className="figure-flush">
      <div className="ctl ctl-centered exhibit-episodes">
        {EPISODES.map((e, i) => (
          <button
            key={e.date}
            className="chip"
            aria-pressed={i === episodeIndex}
            onClick={() => setEpisodeIndex(i)}
          >
            {e.label}
          </button>
        ))}
      </div>
      <canvas
        ref={canvasRef}
        className="exhibit-canvas"
        role="img"
        aria-label={`Market-implied return distribution on ${episode.date} over ${horizonLabel}, with the realized outcome of ${realized} marked. The options market implied a ${worseOutcomeOdds} percent chance of an outcome at or below what happened.`}
      />
      <div className="ctl ctl-centered exhibit-horizons">
        {HORIZON_ORDER.map((days) => (
          <button
            key={days}
            className="chip"
            aria-pressed={days === horizonDays}
            onClick={() => setHorizonDays(days)}
          >
            {HORIZON_LABELS[days]}
          </button>
        ))}
      </div>
      <EpisodeReadout episode={episode} view={view} realizedPercentile={realizedPercentile} />
      <p className="cap exhibit-caption">
        Real market-implied distributions recovered from option prices (curated, downsampled, and
        rounded), with realized index returns. The shaded region is the probability the market
        assigned to an outcome at or below what happened. These are selected illustrative episodes,
        not a sample of all periods, and are not indicative of any trading result or future outcome.
      </p>
    </figure>
  );
}
