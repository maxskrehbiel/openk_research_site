import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { ContactForm } from "@/components/contact_form";

export const metadata: Metadata = pageMeta(
  "/contact",
  "Contact",
  "Contact OpenK Research about the quantitative research program, roles, or collaboration.",
);

export default function ContactPage() {
  return (
    <div className="zone-light zonewrap">
      <section className="room wrap column-narrow">
        <p className="eyebrow">Contact</p>
        <h1 className="section-h">Get in touch</h1>
        <p className="lede">
          Say which fits: a methodology walkthrough for allocators and desks, a falsification test
          you want to run against the framework, or the research notes as they publish. Name it in
          your message and I will reply directly.
        </p>
        <ContactForm />
      </section>
    </div>
  );
}
