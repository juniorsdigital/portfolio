import { WorkGrid } from "@/components/WorkGrid";
import { pageMeta } from "@/lib/seo";
import { DESCRIPTIONS } from "@/lib/site";

export const metadata = pageMeta({
  title: "Work",
  description: DESCRIPTIONS.work,
  path: "/work",
  image: "work",
});

export default function WorkPage() {
  return (
    <div className="section-pad pt-28">
      <div className="mx-auto max-w-6xl">
        <p className="label-kicker">Archive</p>
        <h1 className="mt-4 font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
          Work
        </h1>
        <p className="mt-4 max-w-lg text-muted">
          Design, cuts, and campaigns. Click a piece to open it.
        </p>
        <div className="mt-12">
          <WorkGrid showFilters />
        </div>
      </div>
    </div>
  );
}
