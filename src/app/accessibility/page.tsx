import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta(
  "/accessibility",
  "Accessibility",
  "OpenK Research is committed to making this site accessible and to meeting WCAG 2.1 AA as an ongoing effort. Report any barrier and we will address it.",
);

export default function Accessibility() {
  return (
    <div className="zone-light zonewrap">
      <section className="room wrap column-narrow">
        <p className="eyebrow">Accessibility</p>
        <h1 className="section-h">Accessibility Statement</h1>

        <div className="level">
          <h2>Our commitment</h2>
          <p>
            OpenK Research wants everyone to be able to use this site. We aim to conform to the Web
            Content Accessibility Guidelines (WCAG) 2.1 at Level AA, and we treat accessibility as
            an ongoing effort rather than a one-time task.
          </p>
        </div>

        <div className="level">
          <h2>What we do</h2>
          <p>
            The site is built with semantic HTML and landmark regions, a keyboard-accessible skip
            link, labeled form controls, visible focus indicators, text that reflows and resizes,
            and support for reduced-motion preferences. Data visualizations include text
            descriptions, and we test color contrast against WCAG thresholds.
          </p>
        </div>

        <div className="level">
          <h2>Known limitations</h2>
          <p>
            Some complex data exhibits convey detail visually. We provide text summaries and
            captions for these, and we continue to improve their non-visual descriptions. If any
            part of the site is difficult to use, we want to know.
          </p>
        </div>

        <div className="level">
          <h2>Report a barrier</h2>
          <p>
            If you encounter an accessibility barrier, please tell us through our{" "}
            <Link href="/contact">contact form</Link> and describe the page and the problem. We will
            work to resolve it and can provide the information you need in another format on
            request.
          </p>
        </div>

        <p className="cap last-updated">Last updated: August 26, 2026.</p>
      </section>
    </div>
  );
}
