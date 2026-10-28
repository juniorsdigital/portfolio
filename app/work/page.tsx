import type { Metadata } from "next";
import { SectionHeader } from "@/components/SectionHeader";
import { WorkGrid } from "@/components/WorkGrid";
import { PROJECTS } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work — design, video & marketing case studies",
  description:
    "Case studies in product cover design, campaign marketing and video editing by John Swanson: what was made, for whom, and what it did.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <div className="pt-16 pb-28 sm:pt-24">
      <div className="wrap">
        <SectionHeader
          as="h1"
          kicker={`Work / ${PROJECTS.length} projects`}
          title="The work."
          aside={
            <p className="text-xl leading-relaxed text-soft">
              Covers, cuts and campaigns. Each one lists what was made, for
              whom, and what it did. Pick one for the full case study.
            </p>
          }
        />
        <div className="mt-14">
          <WorkGrid showFilters detailed eagerFirst />
        </div>
      </div>
    </div>
  );
}
