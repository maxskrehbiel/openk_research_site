import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta(
  "/privacy",
  "Privacy",
  "How OpenK Research handles data: no advertising trackers, minimal contact and subscription data, processed only to reply to you and to send the research notes you request.",
);

export default function Privacy() {
  return (
    <div className="zone-light zonewrap">
      <section className="room wrap column-narrow">
        <p className="eyebrow">Privacy</p>
        <h1 className="section-h">Privacy Policy</h1>

        <div className="level">
          <h2>Who we are</h2>
          <p>
            This site is operated by OpenK Research, an independent research program of Max
            Krehbiel, based in the Dallas and Fort Worth, Texas area, United States. OpenK Research
            is the controller of the personal information described here. To reach us about your
            data, or to make any request in this policy, use our{" "}
            <Link href="/contact">contact form</Link>.
          </p>
        </div>

        <div className="level">
          <h2>What is collected</h2>
          <p>
            OpenK Research runs no advertising trackers and sets no advertising cookies. We collect
            only what you choose to submit:
          </p>
          <p>
            <b>Contact form:</b> your name, email address, and message. You may also optionally
            provide the nature of your inquiry, whether you are an allocator or desk, researcher, or
            otherwise, and your firm or organization. These optional fields are used only to route
            and prioritize your inquiry; you can leave them blank.
          </p>
          <p>
            <b>Research notes signup:</b> your email address, so we can send the research notes you
            request.
          </p>
        </div>

        <div className="level">
          <h2>Why we use it, and our legal basis</h2>
          <p>
            We use contact-form data solely to respond to you, on the basis of our legitimate
            interest in replying to inquiries. We use your signup email solely to send the research
            notes, on the basis of your consent, which you can withdraw at any time by
            unsubscribing. We do not use your information for advertising or profiling, and we do
            not make automated decisions about you.
          </p>
        </div>

        <div className="level">
          <h2>Service providers</h2>
          <p>
            Email you submit is processed on our behalf by Resend, Inc. and, for delivery, Amazon
            Web Services (Amazon SES), acting as our processors under written terms and only to
            deliver your message or the research notes you requested. They are not permitted to use
            your information for their own purposes. See the{" "}
            <a
              href="https://resend.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Resend privacy policy
            </a>{" "}
            and the{" "}
            <a href="https://aws.amazon.com/privacy/" target="_blank" rel="noopener noreferrer">
              AWS privacy notice
            </a>
            .
          </p>
        </div>

        <div className="level">
          <h2>International transfers</h2>
          <p>
            OpenK Research operates in the United States, and the providers above process data in
            the United States (Amazon SES, region us-east-1). If you contact us from outside the
            United States, your information will be transferred to and processed in the United
            States. Where required, we rely on our providers&apos; approved transfer safeguards for
            such processing.
          </p>
        </div>

        <div className="level">
          <h2>Analytics and cookies</h2>
          <p>
            This site currently sets no cookies and uses no analytics or tracking. If we ever enable
            analytics, it will be cookieless and aggregate, with no fingerprinting and no visitor
            identification, and this policy will be updated to describe it before it is turned on.
          </p>
        </div>

        <div className="level">
          <h2>Retention</h2>
          <p>
            We keep contact messages for up to 24 months after our last correspondence with you, and
            we keep your research-notes email address until you unsubscribe or ask us to remove it.
            We then delete the data or retain only what any law requires.
          </p>
        </div>

        <div className="level">
          <h2>Your rights</h2>
          <p>
            You may ask us to access, correct, or delete the personal information you have
            submitted, or to stop contacting you, by using our{" "}
            <Link href="/contact">contact form</Link>. Depending on where you live, you may have
            additional rights under laws such as the EU/UK GDPR or the California Consumer Privacy
            Act.
          </p>
          <p>
            <b>California residents:</b> the categories of personal information we collect are
            identifiers (name and email) and, if you provide them, professional or employment
            information (role and firm). You have the right to know, delete, and correct this
            information, and to opt out of its sale or sharing.{" "}
            <b>We do not sell or share your personal information, and we never have.</b>
          </p>
        </div>

        <div className="level">
          <h2>Children</h2>
          <p>
            OpenK Research is not directed to children under 16 and does not knowingly collect
            personal information from them. If you believe a child has provided us information,
            contact us and we will remove it.
          </p>
        </div>

        <p className="cap last-updated">Last updated: August 26, 2026.</p>
      </section>
    </div>
  );
}
