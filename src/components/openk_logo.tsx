/* eslint-disable @next/next/no-img-element -- small static logo PNGs served as-is; the site does not use the image optimizer. */
export function OpenKMark({ size = 34 }: { size?: number }) {
  return (
    <img
      src="/openk_badge.png"
      alt="OpenK Research mark"
      width={size * 0.75}
      height={size}
      style={{ display: "block", borderRadius: size * 0.16 }}
    />
  );
}
export function OpenKMarkLarge({ height = 150 }: { height?: number }) {
  return (
    <img
      src="/openk_mark_lg.png"
      alt="OpenK Research, three distribution curves resolving into a K"
      style={{ height, width: "auto", display: "block" }}
    />
  );
}
export function OpenKWordmark({
  size = 20,
  color = "#E8ECF2",
  muted = "#9AA3B2",
}: {
  size?: number;
  color?: string;
  muted?: string;
}) {
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", lineHeight: 1 }}>
      <span
        style={{
          fontFamily: "var(--serif)",
          fontWeight: 700,
          fontSize: size,
          color,
          letterSpacing: "-0.01em",
        }}
      >
        Open<span style={{ color: "#4C8DF6" }}>K</span>
      </span>
      <span
        style={{
          fontFamily: "var(--sans)",
          fontSize: size * 0.4,
          letterSpacing: "0.34em",
          color: muted,
          marginTop: size * 0.18,
        }}
      >
        RESEARCH
      </span>
    </span>
  );
}
export function OpenKLogo({
  markSize = 30,
  wordSize = 20,
}: {
  markSize?: number;
  wordSize?: number;
}) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: markSize * 0.4 }}>
      <OpenKMark size={markSize} />
      <OpenKWordmark size={wordSize} />
    </span>
  );
}
