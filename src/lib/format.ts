/** Number formatting shared by the chart components. */

/** A return as a signed percentage with one decimal, e.g. 0.0454 -> "+4.5%" and -0.2 -> "-20.0%". */
export function formatSignedPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${(value * 100).toFixed(1)}%`;
}

/** An index level for an axis label: 500 -> "500", 2000 -> "2k", 1500 -> "1.5k". */
export function formatIndexLevel(level: number): string {
  return level >= 1000 ? `${(level / 1000).toFixed(level % 1000 ? 1 : 0)}k` : `${level}`;
}
