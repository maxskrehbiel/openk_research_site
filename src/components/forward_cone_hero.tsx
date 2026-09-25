"use client";
import { useEffect, useRef, type RefObject } from "react";
import Link from "next/link";
import { OpenKMarkLarge } from "@/components/openk_logo";

// The hero backdrop: OpenK's forward-distribution cone. Quantile bands fan forward from "now" and a sample
// path threads through them. Smooth, self-animating, illustrative (no data, no claim). No scroll pinning.

/** Points along the horizon for every band and line. */
const HORIZON_SAMPLES = 180;
/** Nested bands as [z-score, fill alpha], outermost first so the inner bands read brighter. */
const BANDS: [number, number][] = [
  [1.645, 0.07],
  [1.04, 0.1],
  [0.674, 0.13],
  [0.319, 0.16],
];
const OUTER_Z = 1.645;
/** Under reduced motion the cone is drawn once, frozen at this animation time (ms). */
const STILL_FRAME_TIME = 2600;

type ConeColors = { model: string; gold: string; hairline: string };

/**
 * The cone at one moment. `u` runs from 0 ("now") to 1 (the far horizon); values are return-like
 * numbers centered near 0, and the downside widens with the horizon (negative skew).
 */
type ConeFrame = {
  ctx: CanvasRenderingContext2D;
  time: number;
  toX: (u: number) => number;
  toY: (value: number) => number;
  median: (u: number) => number;
  spread: (u: number) => number;
  downsideStretch: (u: number) => number;
  /** Adds a path through `value(u)` across the horizon to the current canvas path. */
  trace: (value: (u: number) => number) => void;
};

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** "#rrggbb" plus an alpha as an rgba() string; other color formats pass through unchanged. */
function withAlpha(hex: string, alpha: number) {
  const digits = hex.replace("#", "");
  if (digits.length < 6) return hex;
  return `rgba(${parseInt(digits.slice(0, 2), 16)},${parseInt(digits.slice(2, 4), 16)},${parseInt(digits.slice(4, 6), 16)},${alpha})`;
}

function coneFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
): ConeFrame {
  const left = width * 0.05;
  const right = width * 0.985;
  const centerY = height * 0.5;
  const verticalScale = height * 0.72;
  const toX = (u: number) => left + u * (right - left);
  const toY = (value: number) => centerY - value * verticalScale;
  const drift = 0.11;
  const baseSpread = 0.33;
  const breathe = 1 + 0.07 * Math.sin(time * 0.00028);
  return {
    ctx,
    time,
    toX,
    toY,
    median: (u) => drift * u + 0.015 * Math.sin(time * 0.0004 + u * 2.2),
    spread: (u) => baseSpread * Math.sqrt(u) * breathe,
    downsideStretch: (u) => 1 + 0.9 * u,
    trace: (value) => {
      for (let i = 0; i <= HORIZON_SAMPLES; i++) {
        const u = i / HORIZON_SAMPLES;
        (i === 0 ? ctx.moveTo : ctx.lineTo).call(ctx, toX(u), toY(value(u)));
      }
    },
  };
}

/** Filled quantile bands, then the faint outer edges and the median line. */
function drawBands(frame: ConeFrame, model: string) {
  const { ctx, toX, toY, median, spread, downsideStretch, trace } = frame;
  for (const [z, alpha] of BANDS) {
    ctx.beginPath();
    for (let i = 0; i <= HORIZON_SAMPLES; i++) {
      const u = i / HORIZON_SAMPLES;
      ctx.lineTo(toX(u), toY(median(u) + z * spread(u)));
    }
    for (let i = HORIZON_SAMPLES; i >= 0; i--) {
      const u = i / HORIZON_SAMPLES;
      ctx.lineTo(toX(u), toY(median(u) - z * spread(u) * downsideStretch(u)));
    }
    ctx.closePath();
    ctx.fillStyle = withAlpha(model, alpha);
    ctx.fill();
  }
  ctx.lineWidth = 1;
  ctx.strokeStyle = withAlpha(model, 0.28);
  for (const sign of [1, -1]) {
    ctx.beginPath();
    trace((u) => median(u) + sign * OUTER_Z * spread(u) * (sign < 0 ? downsideStretch(u) : 1));
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.lineWidth = 2.4;
  ctx.strokeStyle = withAlpha(model, 0.95);
  trace(median);
  ctx.stroke();
}

/** A gold sample path threading through the cone, with a dot at its leading edge. */
function drawSamplePath(frame: ConeFrame, gold: string) {
  const { ctx, time, toX, toY, median, spread, downsideStretch, trace } = frame;
  const samplePath = (u: number) => {
    const wave =
      0.62 * Math.sin(5.5 * u + time * 0.00045) + 0.32 * Math.sin(11 * u + 1.3 + time * 0.00031);
    return median(u) + spread(u) * (wave < 0 ? wave * downsideStretch(u) : wave);
  };
  ctx.save();
  ctx.shadowColor = gold;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = withAlpha(gold, 0.9);
  trace(samplePath);
  ctx.stroke();
  ctx.restore();
  ctx.fillStyle = gold;
  ctx.beginPath();
  ctx.arc(toX(1), toY(samplePath(1)), 3.4, 0, 7);
  ctx.fill();
}

/** A short vertical tick marking "now". */
function drawOrigin({ ctx, toX, toY, median }: ConeFrame, hairline: string) {
  ctx.strokeStyle = hairline;
  ctx.globalAlpha = 0.6;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(toX(0), toY(median(0)) - 26);
  ctx.lineTo(toX(0), toY(median(0)) + 26);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

/** Draws one frame at animation time `time` (ms) into a canvas of `width` x `height` CSS pixels. */
function drawCone(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  colors: ConeColors,
) {
  ctx.clearRect(0, 0, width, height);
  const frame = coneFrame(ctx, width, height, time);
  drawBands(frame, colors.model);
  drawSamplePath(frame, colors.gold);
  drawOrigin(frame, colors.hairline);
}

/** Matches the canvas backing store to its CSS box at the device pixel ratio (capped at 2). */
function fitCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const rect = canvas.getBoundingClientRect();
  const pixelRatio = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.round(rect.width * pixelRatio);
  canvas.height = Math.round(rect.height * pixelRatio);
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  return { width: rect.width, height: rect.height };
}

/**
 * Sizes the canvas to its box and animates the cone while the hero is on screen. Under reduced motion
 * it draws one still frame instead, and redraws it after a resize (resizing clears the canvas).
 */
function useConeAnimation(
  sectionRef: RefObject<HTMLElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d")!;
    let { width, height } = fitCanvas(canvas, ctx);
    function resize() {
      ({ width, height } = fitCanvas(canvas!, ctx));
    }
    const styles = getComputedStyle(document.documentElement);
    const cssVar = (name: string) => styles.getPropertyValue(name).trim();
    const colors = {
      model: cssVar("--model"),
      gold: cssVar("--realized"),
      hairline: cssVar("--hairline"),
    };
    const reducedMotion = prefersReducedMotion();
    const drawStill = () => drawCone(ctx, width, height, STILL_FRAME_TIME, colors);

    let frameRequest = 0;
    let onScreen = true;
    const start = performance.now();
    function animate(now: number) {
      if (!onScreen) {
        frameRequest = 0;
        return;
      }
      drawCone(ctx, width, height, now - start, colors);
      frameRequest = requestAnimationFrame(animate);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen && !frameRequest && !reducedMotion)
          frameRequest = requestAnimationFrame(animate);
      },
      { threshold: 0 },
    );
    observer.observe(section);
    function onResize() {
      resize();
      if (reducedMotion) drawStill();
    }
    window.addEventListener("resize", onResize);
    if (reducedMotion) drawStill();
    else frameRequest = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frameRequest);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [sectionRef, canvasRef]);
}

export function ForwardConeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useConeAnimation(sectionRef, canvasRef);

  return (
    <section ref={sectionRef} className="conehero">
      <canvas ref={canvasRef} className="conehero-canvas" aria-hidden="true" />
      <div className="conehero-scrim" aria-hidden="true" />
      <div className="conehero-inner">
        <span className="markpanel">
          <OpenKMarkLarge height={104} />
        </span>
        <p className="eyebrow conehero-eyebrow">OpenK Research</p>
        <h1 className="pillhead conehero-title">Uncertainty has shape.</h1>
        <p className="prose conehero-lede">
          OpenK seeks to provide broader context for equity decisions. It reads decades of price
          behavior to find where fear and liquidity have stretched expectations past what the
          economy can deliver, and where that gap becomes opportunity.
        </p>
        <div className="ctl ctl-centered">
          <Link className="btn" href="#three-views">
            See the distribution comparison
          </Link>
          <Link className="btn ghost" href="/ideas">
            Explore the ideas
          </Link>
        </div>
      </div>
    </section>
  );
}
