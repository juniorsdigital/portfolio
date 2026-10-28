import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Offerings } from "@/components/Offerings";
import { SectionHeader } from "@/components/SectionHeader";
import { WorkGrid } from "@/components/WorkGrid";
import { PROJECTS } from "@/lib/projects";
import { RESULTS, SITE } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <Hero />

      <section aria-label="Results" className="border-y border-line">
        <div className="wrap grid sm:grid-cols-3">
          {RESULTS.map((result, i) => (
            <div
              key={result.value}
              className={`py-9 sm:py-10 ${
                i > 0
                  ? "border-t border-line sm:border-t-0 sm:border-l sm:pl-8"
                  : "sm:pr-8"
              }`}
            >
              <p className="display text-[4.5rem] leading-none text-signal">
                {result.value}
              </p>
              <p className="mt-3 max-w-[30ch] text-soft">{result.label}</p>
            </div>
          ))}
        </div>
      </section>

      <Offerings />

      <section className="section" id="work" aria-labelledby="work-title">
        <div className="wrap">
          <SectionHeader
            kicker="02 / Selected work"
            id="work-title"
            title="Proof, not pitch."
            aside={
              <Link href="/work" className="link inline-flex min-h-11 items-center text-lg">
                All work ({PROJECTS.length}) <span aria-hidden="true">&nbsp;→</span>
              </Link>
            }
          />
          <div className="mt-14">
            <WorkGrid />
          </div>
        </div>
      </section>

      <section
        className="section on-paper bg-paper text-ink"
        id="about"
        aria-labelledby="about-title"
      >
        <div className="wrap grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
          <Image
            src="/images/about-portrait.png"
            alt={`${SITE.name} in ${SITE.location}`}
            width={771}
            height={1024}
            sizes="(max-width: 1024px) 100vw, 520px"
            className="aspect-[4/5] w-full object-cover"
          />
          <div>
            <p className="kicker text-slate">03 / About</p>
            <h2 id="about-title" className="display display-lg mt-4">
              Made in {SITE.location}.
            </h2>
            <p className="mt-8 max-w-[36ch] text-[1.375rem] leading-normal">
              I&apos;m {SITE.name}. I design, edit and run the marketing that
              has to ship — and I&apos;m the one you talk to from brief to final
              files.
            </p>
            <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-slate">
              Sport has been in the background since 2019 — first on the
              water, now racing bikes. It doesn&apos;t show up as a theme. It
              shows up as how I work: show up, go hard, leave it clean.
            </p>
            <Link href="/about" className="link mt-7 inline-flex min-h-11 items-center text-lg">
              More about me <span aria-hidden="true">&nbsp;→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="on-paper bg-signal py-24 text-ink sm:py-28" aria-labelledby="cta-title">
        <div className="wrap flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="cta-title" className="display display-xl">
              Have work?
              <br />
              Send it.
            </h2>
            <p className="mt-6 max-w-[44ch] text-xl leading-relaxed">
              Tell me what you need. I&apos;ll reply with a scope and a fixed
              price — or a no, if I&apos;m not the right person.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4">
            <Link href="/contact" className="btn btn-ink min-h-14 px-8 text-lg">
              Start a project <span aria-hidden="true">→</span>
            </Link>
            <a href={`mailto:${SITE.email}`} className="link font-mono text-[0.9375rem] font-normal">
              {SITE.email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
