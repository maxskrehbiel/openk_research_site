import { ForwardConeHero } from "@/components/forward_cone_hero";
import { CycleLoopSection } from "@/components/home/cycle_loop_section";
import { EngagementSection } from "@/components/home/engagement_section";
import { IdeasSection } from "@/components/home/ideas_section";
import { ImplementationSection } from "@/components/home/implementation_section";
import { InvestmentProblemSection } from "@/components/home/investment_problem_section";
import { KCurveSection } from "@/components/home/k_curve_section";
import { NotesSection } from "@/components/home/notes_section";
import { ThreeViewsSection } from "@/components/home/three_views_section";
import { ValidationSection } from "@/components/home/validation_section";

// Two zones: dark for the thesis and the charts, light for the ideas and the ways to engage.
export default function Home() {
  return (
    <>
      <div className="zone-dark">
        <ForwardConeHero />
        <InvestmentProblemSection />
        <KCurveSection />
        <ThreeViewsSection />
        <CycleLoopSection />
      </div>
      <div className="zone-light zonewrap">
        <IdeasSection />
        <ImplementationSection />
        <ValidationSection />
        <NotesSection />
        <EngagementSection />
      </div>
    </>
  );
}
