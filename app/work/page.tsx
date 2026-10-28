import { SectionHeader } from "@/components/SectionHeader";
import { WorkGrid } from "@/components/WorkGrid";
import Link from "next/link";
import { PROJECTS } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";
import { SERVICES, serviceHref } from "@/lib/services";

export const metadata = pageMetadata({
  title: "Portfolio — design, video & marketing case studies",
  description:
    "Portfolio of John Swanson: case studies in product cover design, campaign marketing and video editing — what was made, for whom, and what it did.",
  path: "/work",
});

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
        <div className="mt-20 flex flex-col gap-6 border-t border-line pt-10 md:flex-row md:items-center md:justify-between">
          <p className="max-w-[40ch] text-xl leading-relaxed text-soft">
            Want results like these? See what each service includes and what it
            costs.
          </p>
          <div className="flex flex-wrap gap-3">
            {SERVICES.map((s) => (
              <Link key={s.slug} href={serviceHref(s)} className="btn btn-ghost">
                {s.name}
              </Link>
            ))}
            <Link href="/contact" className="btn btn-signal">
              Get a quote <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
