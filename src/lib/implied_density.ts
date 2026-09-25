/**
 * Distribution math for the market-implied exhibit. Each episode is a set of return quantiles at fixed
 * cumulative probabilities (the knots); these functions turn them into a CDF and a smooth density.
 */

/** Quantile gaps at or below this width are treated as a single point. */
const DEGENERATE_GAP = 1e-9;
/** Quantiles closer than this are merged into one breakpoint before building the density. */
const DUPLICATE_QUANTILE_GAP = 1e-6;
/** The Gaussian smoothing kernel's standard deviation is the plotted range divided by this. */
const KERNEL_WIDTHS_PER_RANGE = 17;
/** The kernel is truncated at this many standard deviations. */
const KERNEL_RADIUS_SIGMAS = 3;
/** Smallest kernel half-width in grid steps, so very wide plots are still smoothed. */
const MIN_KERNEL_RADIUS = 2;

/**
 * Cumulative probability at return `x`, interpolating linearly between (quantile, knot) pairs and flat
 * outside the quantile range. A zero-width gap (clamped or duplicated quantiles) jumps to the upper knot.
 */
export function impliedCdf(
  quantiles: readonly number[],
  knots: readonly number[],
  x: number,
): number {
  if (x <= quantiles[0]) return knots[0];
  if (x >= quantiles[quantiles.length - 1]) return knots[knots.length - 1];
  for (let i = 0; i < quantiles.length - 1; i++) {
    if (x <= quantiles[i + 1]) {
      const gap = quantiles[i + 1] - quantiles[i];
      if (gap <= DEGENERATE_GAP) return knots[i + 1];
      return knots[i] + ((knots[i + 1] - knots[i]) * (x - quantiles[i])) / gap;
    }
  }
  return knots[knots.length - 1];
}

export type DensityGrid = {
  /** Smoothed density at each of the `points + 1` grid positions. */
  density: number[];
  /** Return value at grid position `index`. */
  gridX: (index: number) => number;
};

/**
 * Density on an even grid over [xMin, xMax]. Between neighboring quantiles the probability mass is
 * spread evenly (mass divided by width), outside them the density is zero, and the result is smoothed
 * with a truncated Gaussian kernel. Duplicate quantiles are merged first so they cannot create spikes.
 */
export function densityGrid(
  quantiles: readonly number[],
  knots: readonly number[],
  xMin: number,
  xMax: number,
  points: number,
): DensityGrid {
  const breakX: number[] = [];
  const breakProb: number[] = [];
  for (let i = 0; i < quantiles.length; i++) {
    if (breakX.length === 0 || quantiles[i] - breakX[breakX.length - 1] > DUPLICATE_QUANTILE_GAP) {
      breakX.push(quantiles[i]);
      breakProb.push(knots[i]);
    } else {
      // Keep the higher cumulative probability of the merged pair.
      breakProb[breakProb.length - 1] = knots[i];
    }
  }

  const gridX = (index: number) => xMin + (index / points) * (xMax - xMin);
  const slab = new Array<number>(points + 1).fill(0);
  for (let j = 0; j <= points; j++) {
    const x = gridX(j);
    if (x < breakX[0] || x > breakX[breakX.length - 1]) continue;
    let i = 0;
    while (i < breakX.length - 2 && x > breakX[i + 1]) i++;
    const width = breakX[i + 1] - breakX[i];
    slab[j] = width > DEGENERATE_GAP ? (breakProb[i + 1] - breakProb[i]) / width : 0;
  }

  return { density: gaussianSmooth(slab, xMax - xMin), gridX };
}

/** Convolves evenly spaced samples spanning `range` with a normalized, truncated Gaussian kernel. */
function gaussianSmooth(samples: readonly number[], range: number): number[] {
  const points = samples.length - 1;
  const step = range / points;
  const sigma = range / KERNEL_WIDTHS_PER_RANGE;
  const radius = Math.max(MIN_KERNEL_RADIUS, Math.round((KERNEL_RADIUS_SIGMAS * sigma) / step));
  const kernel: number[] = [];
  let kernelSum = 0;
  for (let k = -radius; k <= radius; k++) {
    const weight = Math.exp(-0.5 * ((k * step) / sigma) ** 2);
    kernel.push(weight);
    kernelSum += weight;
  }
  const smoothed = new Array<number>(points + 1).fill(0);
  for (let j = 0; j <= points; j++) {
    let sum = 0;
    for (let k = -radius; k <= radius; k++) {
      const jj = j + k;
      if (jj >= 0 && jj <= points) sum += samples[jj] * kernel[k + radius];
    }
    smoothed[j] = sum / kernelSum;
  }
  return smoothed;
}
