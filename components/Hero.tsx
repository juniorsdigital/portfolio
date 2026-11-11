import Link from "next/link";
import { CoverShelf } from "@/components/CoverShelf";
import { contactHref } from "@/lib/services";
import { SITE } from "@/lib/site";

/**
 * Home page hero: who it's for, the proof, two CTAs and the OvaniSound cover
 * shelf. On phones the shelf sits straight under the headline so the work is
 * on the first screen; from lg up it spans the row below the pitch.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="pt-10 pb-14 sm:pt-16 sm:pb-16">
      <div className="wrap">
        {/* minmax(0,1fr) keeps the scrolling shelf from widening the column on phones. */}
        <div className="grid grid-cols-[minmax(0,1fr)] items-end gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          <div className="lg:col-start-1 lg:row-start-1">
            <p className="kicker mb-5 text-stone sm:mb-6">
              <span className="sm:hidden">Cover artist — {SITE.location}</span>
              <span className="hidden sm:inline">
                Cover art, 3D packaging &amp; trailers — {SITE.location}, working worldwide
              </span>
            </p>
            <h1 id="hero-title" className="display display-xl text-[clamp(3rem,6.8vw,6.75rem)]">
              Cover art that sells <span className="text-signal">the pack.</span>
            </h1>
          </div>

          <div className="-mt-2 lg:col-span-2 lg:row-start-2 lg:mt-4">
            <CoverShelf />
            <div className="mt-5 flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-line pt-4 font-mono text-sm text-stone">
              <span>OvaniSound — 75+ music pack covers across 32+ genres, since 2025</span>
              <span className="hidden sm:inline">Pick a box to see how it was made</span>
            </div>
          </div>

          <div className="lg:col-start-2 lg:row-start-1 lg:pb-2">
            <p className="max-w-[36ch] text-xl leading-relaxed text-soft">
              Covers, 3D box renders and trailers for music, sample and
              sound-effect packs. 75+ covers shipped for OvaniSound — 30 of
              them in a single week.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={contactHref("graphic-design")} className="btn btn-signal">
                Get a quote <span aria-hidden="true">→</span>
              </Link>
              <Link href="/cover-art" className="btn btn-ghost">
                Cover art pricing
              </Link>
            </div>
            <p className="mt-4 text-[0.9375rem] text-stone">
              Fixed price up front · Reply within {SITE.replyTime}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
