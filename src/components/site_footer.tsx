import { Fragment } from "react";
import Link from "next/link";
import { OpenKWordmark } from "@/components/openk_logo";

const FOOTER_COLUMNS: { heading: string; links: [string, string][] }[] = [
  {
    heading: "Research",
    links: [
      ["/research", "Research"],
      ["/ideas", "Ideas"],
      ["/methods", "Methods"],
    ],
  },
  {
    heading: "OpenK",
    links: [
      ["/about", "About OpenK"],
      ["/founder", "Founder"],
      ["/contact", "Contact"],
    ],
  },
  {
    heading: "Legal",
    links: [
      ["/disclosures", "Research Disclosures"],
      ["/data-and-licensing", "Data and Licensing"],
      ["/privacy", "Privacy Policy"],
      ["/terms", "Terms of Use"],
      ["/accessibility", "Accessibility"],
    ],
  },
];

const DISCLAIMER =
  "OpenK Research is independent research, not investment advice, and is not a registered " +
  "investment adviser. Nothing on this site is an offer, solicitation, or recommendation to buy or " +
  "sell any security. Illustrative research only; past or hypothetical results do not indicate " +
  "future outcomes. See our";

export function SiteFooter() {
  return (
    <footer className="zone-light">
      <div className="footer">
        <div className="wrap">
          <div className="footer-columns">
            {FOOTER_COLUMNS.map(({ heading, links }) => (
              <nav key={heading} aria-label={heading}>
                <b className="footer-heading">{heading}</b>
                {links.map(([href, label]) => (
                  <Fragment key={href}>
                    <br />
                    <Link href={href}>{label}</Link>
                  </Fragment>
                ))}
              </nav>
            ))}
          </div>
          <p className="cap footer-disclaimer">
            {DISCLAIMER} <Link href="/disclosures">Disclosures</Link> and{" "}
            <Link href="/terms">Terms of Use</Link>.
          </p>
          <div className="footer-bottom">
            <OpenKWordmark size={18} color="var(--ink)" muted="var(--ink3)" />
            <p className="mono footer-note">
              Distribution curves use curated, downsampled, rounded historical data. No live
              forecasts served. Copyright 2026 OpenK Research.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
