import { describe, expect, it } from "vitest";
import { densityGrid, impliedCdf } from "@/lib/implied_density";

// Synthetic ground truth: a uniform distribution on [-0.2, 0.2], whose quantiles are linear in the
// probability, so its CDF is exactly (x + 0.2) / 0.4 and its density is exactly 2.5 on the support.
const KNOTS = [0.01, 0.05, 0.1, 0.25, 0.5, 0.75, 0.9, 0.95, 0.99];
const UNIFORM = KNOTS.map((p) => -0.2 + 0.4 * p);
const uniformCdf = (x: number) => (x + 0.2) / 0.4;

/** Trapezoid-rule integral of a density sampled on the grid. */
function integrate(density: number[], xMin: number, xMax: number) {
  const step = (xMax - xMin) / (density.length - 1);
  let total = 0;
  for (let j = 1; j < density.length; j++) total += ((density[j - 1] + density[j]) / 2) * step;
  return total;
}

describe("impliedCdf", () => {
  it("returns the knot probability at each quantile", () => {
    UNIFORM.forEach((q, i) => expect(impliedCdf(UNIFORM, KNOTS, q)).toBeCloseTo(KNOTS[i], 12));
  });

  it("interpolates linearly between quantiles", () => {
    for (const x of [-0.19, -0.1, 0, 0.07, 0.19]) {
      expect(impliedCdf(UNIFORM, KNOTS, x)).toBeCloseTo(uniformCdf(x), 12);
    }
  });

  it("is flat outside the quantile range", () => {
    expect(impliedCdf(UNIFORM, KNOTS, -5)).toBe(0.01);
    expect(impliedCdf(UNIFORM, KNOTS, 5)).toBe(0.99);
  });

  it("jumps to the upper knot across duplicated quantiles", () => {
    const clamped = [-0.3, -0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4];
    expect(impliedCdf(clamped, KNOTS, -0.3)).toBe(0.01);
    expect(impliedCdf(clamped, KNOTS, -0.25)).toBeCloseTo(0.075, 12);
  });

  it("is non-decreasing", () => {
    let previous = -Infinity;
    for (let x = -0.3; x <= 0.3; x += 0.001) {
      const p = impliedCdf(UNIFORM, KNOTS, x);
      expect(p).toBeGreaterThanOrEqual(previous);
      previous = p;
    }
  });
});

describe("densityGrid", () => {
  const xMin = -0.4;
  const xMax = 0.4;
  const points = 400;

  it("places the grid evenly across the range", () => {
    const { density, gridX } = densityGrid(UNIFORM, KNOTS, xMin, xMax, points);
    expect(density).toHaveLength(points + 1);
    expect(gridX(0)).toBe(xMin);
    expect(gridX(points)).toBeCloseTo(xMax, 12);
    expect(gridX(points / 2)).toBeCloseTo(0, 12);
  });

  it("recovers the uniform density away from the support edges", () => {
    const { density, gridX } = densityGrid(UNIFORM, KNOTS, xMin, xMax, points);
    for (let j = 0; j <= points; j++) {
      if (Math.abs(gridX(j)) < 0.05) expect(density[j]).toBeCloseTo(2.5, 6);
    }
  });

  it("carries the probability mass between the outer knots", () => {
    const { density } = densityGrid(UNIFORM, KNOTS, xMin, xMax, points);
    // 0.99 - 0.01 = 0.98; each support edge can be off by at most one grid step of density 2.5.
    const edgeError = 2 * ((xMax - xMin) / points) * 2.5;
    expect(Math.abs(integrate(density, xMin, xMax) - 0.98)).toBeLessThanOrEqual(edgeError);
  });

  it("is essentially zero well outside the quantile range", () => {
    const { density, gridX } = densityGrid(UNIFORM, KNOTS, xMin, xMax, points);
    for (let j = 0; j <= points; j++) {
      if (Math.abs(gridX(j)) > 0.35) expect(density[j]).toBeLessThan(1e-6);
    }
  });

  it("peaks near the center of a symmetric, peaked distribution", () => {
    const normalLike = [-2.326, -1.645, -1.282, -0.674, 0, 0.674, 1.282, 1.645, 2.326].map(
      (z) => z * 0.1,
    );
    const { density, gridX } = densityGrid(normalLike, KNOTS, xMin, xMax, points);
    const peak = density.indexOf(Math.max(...density));
    expect(Math.abs(gridX(peak))).toBeLessThan(0.01);
    expect(density[peak]).toBeGreaterThan(density[peak + 100]);
  });

  it("merges duplicated quantiles instead of creating an infinite spike", () => {
    const clamped = [-0.2, -0.2, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4];
    const { density } = densityGrid(clamped, KNOTS, xMin, xMax, points);
    expect(density.every(Number.isFinite)).toBe(true);
    expect(Math.max(...density)).toBeLessThan(5);
  });
});
