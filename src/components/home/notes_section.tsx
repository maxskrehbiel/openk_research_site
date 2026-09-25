import { NewsletterSignup } from "@/components/newsletter_signup";
import { Reveal } from "@/components/reveal";

export function NotesSection() {
  return (
    <section className="room wrap center" id="notes">
      <Reveal>
        <p className="eyebrow">Follow the research</p>
        <h2 className="section-h">Get the research notes as they publish</h2>
        <p className="prose notes-intro">
          New findings and essays, sent when they are ready. No noise, no sales, and no obligation
          to do anything but read.
        </p>
        <NewsletterSignup />
      </Reveal>
    </section>
  );
}
