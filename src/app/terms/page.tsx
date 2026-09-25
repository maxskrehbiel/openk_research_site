import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta(
  "/terms",
  "Terms of Use",
  "The terms that govern your use of the OpenK Research website: informational research only, no investment advice, no warranty, limitation of liability, and Texas governing law.",
);

export default function Terms() {
  return (
    <div className="zone-light zonewrap">
      <section className="room wrap column-narrow">
        <p className="eyebrow">Legal</p>
        <h1 className="section-h">Terms of Use</h1>

        <div className="level">
          <h2>Acceptance</h2>
          <p>
            These Terms of Use govern your access to and use of the OpenK Research website at
            openkresearch.com (the &ldquo;Site&rdquo;), operated by OpenK Research, an independent
            research program of Max Krehbiel (&ldquo;OpenK,&rdquo; &ldquo;we,&rdquo; or
            &ldquo;us&rdquo;). By accessing or using the Site, you agree to these Terms. If you do
            not agree, do not use the Site.
          </p>
        </div>

        <div className="level">
          <h2>Research only, not advice</h2>
          <p>
            The Site is for general informational and educational purposes only. Its content is
            independent research and commentary. It is not, and must not be relied on as,
            investment, financial, legal, tax, or other professional advice, and it is not
            individualized to your circumstances. OpenK is not a registered investment adviser and
            does not provide advisory services, manage money, or accept clients or compensation for
            advice. Nothing on the Site is an offer, solicitation, or recommendation to buy, sell,
            or hold any security or to pursue any strategy. See our{" "}
            <Link href="/disclosures">Research Disclosures</Link>.
          </p>
        </div>

        <div className="level">
          <h2>No reliance and assumption of risk</h2>
          <p>
            You are solely responsible for your own decisions. You should obtain independent
            professional advice before acting on anything you read here. Investing involves risk,
            including the possible loss of principal. Any illustrative, historical, or hypothetical
            figures shown are not a track record and do not indicate future results. You use the
            Site and rely on its content entirely at your own risk.
          </p>
        </div>

        <div className="level">
          <h2>No warranty</h2>
          <p>
            The Site and its content are provided &ldquo;as is&rdquo; and &ldquo;as
            available,&rdquo; without warranties of any kind, whether express, implied, or
            statutory, including any implied warranties of merchantability, fitness for a particular
            purpose, non-infringement, accuracy, or availability. We do not warrant that the Site
            will be uninterrupted, error-free, secure, or that any information is current, complete,
            or reliable.
          </p>
        </div>

        <div className="level">
          <h2>Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, OpenK and Max Krehbiel will not be liable for
            any indirect, incidental, special, consequential, exemplary, or punitive damages, or for
            any loss of profits, investment losses, trading losses, lost data, or lost goodwill,
            arising out of or relating to your use of or inability to use the Site or its content,
            whether based in contract, tort, strict liability, or otherwise, even if advised of the
            possibility of such damages. To the fullest extent permitted by law, our total aggregate
            liability for all claims relating to the Site will not exceed one hundred U.S. dollars
            (US$100). Some jurisdictions do not allow certain of these limitations, so parts of this
            section may not apply to you.
          </p>
        </div>

        <div className="level">
          <h2>Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless OpenK and Max Krehbiel from any claims, losses,
            liabilities, and expenses (including reasonable legal fees) arising out of your use of
            the Site, your violation of these Terms, or your violation of any rights of another.
          </p>
        </div>

        <div className="level">
          <h2>Intellectual property and permitted use</h2>
          <p>
            The Site and its content, including text, essays, graphics, exhibits, data
            visualizations, the OpenK name, wordmark, and logos, are owned by OpenK Research and Max
            Krehbiel and are protected by intellectual property laws. You may view and share links
            to the Site for personal, non-commercial use. You may not, without our prior written
            permission, copy, reproduce, republish, redistribute, sell, or create derivative works
            from the content, nor use it to train, fine-tune, or ground any machine-learning or
            artificial intelligence system. You may not scrape, crawl, harvest, or use automated
            means to access or collect the Site or its content except as permitted by our robots
            directives.
          </p>
        </div>

        <div className="level">
          <h2>Third-party references and links</h2>
          <p>
            The Site may reference or link to third-party materials. Those are provided for
            convenience only; we do not endorse and are not responsible for third-party content,
            sites, or services. Product and index names, including &ldquo;S&amp;P 500,&rdquo; are
            trademarks of their respective owners; see our{" "}
            <Link href="/data-and-licensing">Data and Licensing</Link> page.
          </p>
        </div>

        <div className="level">
          <h2>Governing law and venue</h2>
          <p>
            These Terms are governed by the laws of the State of Texas, without regard to
            conflict-of-laws rules. You agree that the exclusive venue for any dispute relating to
            the Site or these Terms will be the state or federal courts located in Tarrant County,
            Texas, and you consent to their jurisdiction.
          </p>
        </div>

        <div className="level">
          <h2>Changes, severability, and entire agreement</h2>
          <p>
            We may update these Terms at any time by posting a revised version with a new date; your
            continued use of the Site means you accept the changes. If any provision is held
            unenforceable, the rest remains in effect. These Terms, together with our{" "}
            <Link href="/privacy">Privacy Policy</Link> and{" "}
            <Link href="/disclosures">Disclosures</Link>, are the entire agreement between you and
            OpenK regarding the Site.
          </p>
        </div>

        <div className="level">
          <h2>Contact</h2>
          <p>
            Questions about these Terms, or intellectual-property or takedown notices, can be sent
            through our <Link href="/contact">contact form</Link>.
          </p>
        </div>

        <p className="cap last-updated">Effective: August 26, 2026.</p>
      </section>
    </div>
  );
}
