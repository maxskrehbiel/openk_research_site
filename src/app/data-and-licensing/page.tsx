import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
export const metadata: Metadata = pageMeta(
  "/data-and-licensing",
  "Data and Licensing",
  "What OpenK publishes, what stays derived and aggregate, and what licensed data restrictions apply.",
);
export default function Page() {
  return (
    <div className="zone-light zonewrap">
      <section className="room wrap column-wide">
        <p className="eyebrow">Governance</p>
        <h1 className="section-h">Data and licensing</h1>
        <div className="prose prose-page">
          <p>
            OpenK studies historical market and options data. Some of that data is licensed and
            cannot be redistributed.
          </p>
          <p>
            Public outputs are limited to derived, aggregate, or illustrative figures. Raw or
            row-level market data, full-resolution derived arrays, and current model outputs are not
            published.
          </p>
          <p>
            Where a figure is illustrative rather than a direct measurement, it is labeled as such.
            Realized outcomes shown on the site use widely available index price levels.
          </p>
          <p>
            The exact construction of the models, their features, and their parameters is not
            disclosed.
          </p>
          <p>
            Index levels shown on this site are widely available historical closing levels used
            illustratively. &ldquo;S&amp;P 500&rdquo; and &ldquo;S&amp;P&rdquo; are trademarks of
            S&amp;P Dow Jones Indices LLC and its affiliates. OpenK Research is not sponsored,
            endorsed, sold, or promoted by S&amp;P Dow Jones Indices, S&amp;P Global, or any of
            their affiliates, and they make no representation regarding the advisability of any
            decision based on this site.
          </p>
          <p className="cap last-updated">Last updated: August 26, 2026.</p>
        </div>
      </section>
    </div>
  );
}
