import Link from "next/link";
import { CoverShelf } from "@/components/CoverShelf";
import { SITE } from "@/lib/site";

/** Home page hero: the pitch, the two CTAs, and the OvaniSound cover shelf. */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="pt-14 pb-14 sm:pt-16 sm:pb-16">
      <div className="wrap">
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-14">
          <div>
            <p className="kicker mb-6 text-stone">
              Freelance designer, editor &amp; marketer — {SITE.location}
            </p>
            <h1 id="hero-title" className="display display-xl text-[clamp(3.25rem,6.8vw,6.75rem)]">
              Design, video &amp; marketing that{" "}
              <span className="text-signal">ships.</span>
            </h1>
          </div>
          <div className="lg:pb-2">
            <p className="max-w-[34ch] text-xl leading-relaxed text-soft">
              Product covers, campaigns, social video and the marketing that
              keeps them moving. Tight briefs, hard effort, files you can
              actually use.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-signal">
                Start a project <span aria-hidden="true">→</span>
              </Link>
              <Link href="#work" className="btn btn-ghost">
                See the work
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <CoverShelf />
        </div>
        <div className="mt-5 flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-line pt-4 font-mono text-sm text-stone">
          <span>OvaniSound — music pack covers, 2D + 3D</span>
          <span>Pick a box to see how it was made</span>
        </div>
      </div>
    </section>
  );
}
