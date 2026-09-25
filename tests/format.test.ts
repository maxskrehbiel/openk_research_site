import { describe, expect, it } from "vitest";
import { formatIndexLevel, formatSignedPercent } from "@/lib/format";

describe("formatSignedPercent", () => {
  it.each([
    [0.0454, "+4.5%"],
    [0, "+0.0%"],
    [-0.2, "-20.0%"],
    [1.5, "+150.0%"],
  ])("formats %d as %s", (value, text) => {
    expect(formatSignedPercent(value)).toBe(text);
  });
});

describe("formatIndexLevel", () => {
  it.each([
    [200, "200"],
    [500, "500"],
    [1000, "1k"],
    [1500, "1.5k"],
    [5000, "5k"],
  ])("formats %d as %s", (level, text) => {
    expect(formatIndexLevel(level)).toBe(text);
  });
});
