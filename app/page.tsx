import Image from "next/image";
import Link from "next/link";
import { Offerings } from "@/components/Offerings";
import { ShatteredHero } from "@/components/ShatteredHero";
import { WorkGrid } from "@/components/WorkGrid";
import { SITE } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <ShatteredHero />
      <Offerings />

      <section className="section-pad border-t border-gilt/20" id="work">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="label-kicker">Selected work</p>
              <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                Proof,{" "}
                <em className="font-serif font-normal text-gilt">not pitch.</em>
              </h2>
            </div>
            <Link
              href="/work"
              className="text-xs tracking-[0.18em] text-muted uppercase hover:text-volt"
            >
              All work →
            </Link>
          </div>
          <WorkGrid />
        </div>
      </section>

      <section className="section-pad border-t border-gilt/20" id="about">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="label-kicker">About</p>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              Made in{" "}
              <em className="font-serif font-normal text-gilt">
                {SITE.location}.
              </em>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
              I design, edit, and run the marketing that has to ship. Tight
              briefs, hard effort, files you can actually use.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-block text-xs tracking-[0.18em] text-bone uppercase underline decoration-gilt/50 underline-offset-4 hover:text-volt"
            >
              More about me
            </Link>
          </div>
          <div className="clip-shard hairline overflow-hidden">
            <Image
              src="/images/about-portrait.png"
              alt={`${SITE.name} in ${SITE.location}`}
              className="h-full w-full object-cover"
              width={800}
              height={1000}
            />
          </div>
        </div>
      </section>

      <section className="section-pad border-t border-gilt/20">
        <div className="mx-auto max-w-6xl">
          <p className="label-kicker">Next</p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
            Have work.{" "}
            <em className="font-serif font-normal text-ember">Send it.</em>
          </h2>
          <p className="mt-5 max-w-lg text-muted">
            Tell me what you need. I&apos;ll reply with a scope — or a no, if
            I&apos;m not the right person.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex clip-shard bg-ember px-6 py-3 text-[0.72rem] font-medium tracking-[0.18em] text-bone uppercase hover:bg-ember/85"
          >
            Start a project
          </Link>
        </div>
      </section>
    </>
  );
}
