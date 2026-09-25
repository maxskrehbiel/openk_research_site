import Link from "next/link";
import { Reveal } from "@/components/reveal";

const ENGAGEMENTS = [
  {
    href: "/contact?track=walkthrough",
    audience: "Allocators & desks",
    title: "Request a methodology walkthrough",
    promise: "A private walk through how OpenK builds and validates its distributions.",
  },
  {
    href: "/contact?track=falsification",
    audience: "Researchers & quants",
    title: "Propose a falsification test",
    promise: "Bring a way to break the framework. The result, pass or fail, goes on the record.",
  },
  {
    href: "#notes",
    audience: "Everyone",
    title: "Get the research notes",
    promise: "New findings and essays as they publish. No noise, no sales.",
  },
];

export function EngagementSection() {
  return (
    <section className="room wrap" id="about">
      <Reveal>
        <p className="eyebrow text-center">Work with the research</p>
        <h2 className="section-h text-center">Three ways in</h2>
        <p className="prose engagement-intro">
          OpenK offers no advisory services and takes no clients or compensation for investment
          advice. A methodology walkthrough is a non-advisory research discussion.
        </p>
        <div className="cards engagement-cards">
          {ENGAGEMENTS.map((engagement) => (
            <Link key={engagement.href} className="card card-link" href={engagement.href}>
              <span className="badge">{engagement.audience}</span>
              <h3>{engagement.title}</h3>
              <p className="promise">{engagement.promise}</p>
            </Link>
          ))}
        </div>
        <p className="cap closing-note">
          OpenK Research is led by Max Krehbiel. <Link href="/about">About OpenK</Link> and{" "}
          <Link href="/founder">the founder</Link>.
        </p>
      </Reveal>
    </section>
  );
}
