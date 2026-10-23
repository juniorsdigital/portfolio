import Link from "next/link";
import { CoverGrid } from "@/components/CoverGrid";
import {
  BOOK_DIRECT_PERK,
  COMMERCIAL_USE_NOTE,
  COVERS_CTA_HREF,
  DELIVERABLES,
  FAQ,
  NO_AI_LINE,
  PACKAGES,
  SHOW_NO_AI_LINE,
  STEPS,
} from "@/lib/covers";
import { CLIENT_NAME, COVERS_FEATURED_FIRST } from "@/lib/hero-covers";
import { jsonLd, pageMeta } from "@/lib/seo";
import { DESCRIPTIONS, SITE, SITE_URL } from "@/lib/site";

export const metadata = pageMeta({
  title: `Pack Covers for Sample & Music Sellers — ${SITE.name}`,
  absoluteTitle: true,
  description: DESCRIPTIONS.covers,
  path: "/covers",
  image: "covers",
});

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: `${SITE.name} — Pack Covers`,
  url: `${SITE_URL}/covers`,
  description: DESCRIPTIONS.covers,
  image: `${SITE_URL}/og/covers.jpg`,
  provider: { "@type": "Person", name: SITE.name, url: SITE_URL },
  serviceType: "Product cover design",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Pack cover services",
    itemListElement: PACKAGES.map((p) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: p.name, description: p.summary },
    })),
  },
};

function CtaButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href={COVERS_CTA_HREF}
      className={`inline-flex clip-shard-sm bg-ember px-6 py-3 text-[0.72rem] font-medium tracking-[0.18em] text-bone uppercase transition-colors hover:bg-ember/85 ${className}`}
    >
      Start a cover brief
    </Link>
  );
}

function SectionHead({ kicker, children }: { kicker: string; children: React.ReactNode }) {
  return (
    <>
      <p className="label-kicker">{kicker}</p>
      <h2 className="mt-4 max-w-2xl font-display text-4xl font-extrabold tracking-tight text-bone sm:text-5xl">
        {children}
      </h2>
    </>
  );
}

export default function CoversPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structuredData)} />

      {/* 1 · Hero */}
      <section className="section-pad pt-32">
        <div className="mx-auto max-w-6xl">
          <p className="label-kicker">Pack covers</p>
          <h1 className="mt-4 max-w-4xl font-display text-[clamp(2.4rem,6vw,4.6rem)] font-extrabold leading-[0.92] tracking-[-0.03em] text-bone">
            Pack covers for sample, preset,{" "}
            <em className="font-serif font-normal text-gilt">and music sellers.</em>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Covers, side panels, and 3D pack renders, designed to sell on a
            store page. 60+ shipped for {CLIENT_NAME}, 30 in a single week.
          </p>
          {SHOW_NO_AI_LINE ? (
            <p className="mt-4 text-sm text-bone">{NO_AI_LINE}</p>
          ) : null}
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <CtaButton />
            <a
              href="#packages"
              className="text-xs tracking-[0.18em] text-muted uppercase hover:text-volt"
            >
              See packages ↓
            </a>
          </div>
        </div>
      </section>

      {/* 2 · Featured covers */}
      <section className="section-pad border-t border-gilt/20" aria-labelledby="covers-work">
        <div className="mx-auto max-w-6xl">
          <p className="label-kicker">Shipped covers</p>
          <h2
            id="covers-work"
            className="mt-4 max-w-2xl font-display text-4xl font-extrabold tracking-tight text-bone sm:text-5xl"
          >
            On the shelf,{" "}
            <em className="font-serif font-normal text-gilt">selling.</em>
          </h2>
          <div className="mt-12">
            <CoverGrid covers={COVERS_FEATURED_FIRST} />
          </div>
        </div>
      </section>

      {/* 3–4 · Packages + book-direct perk */}
      <section id="packages" className="section-pad scroll-mt-20 border-t border-gilt/20">
        <div className="mx-auto max-w-6xl">
          <SectionHead kicker="Packages">
            Pick a size.{" "}
            <em className="font-serif font-normal text-gilt">Add depth.</em>
          </SectionHead>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {PACKAGES.map((pkg) => (
              <article
                key={pkg.name}
                className="clip-shard hairline flex flex-col bg-bg-elev p-7"
              >
                <p className="font-mono text-[0.65rem] tracking-[0.22em] text-ember uppercase">
                  {pkg.addOn ? "Add-on" : "Package"}
                </p>
                <h3 className="mt-5 font-display text-2xl font-extrabold tracking-tight">
                  {pkg.name}
                </h3>
                <p className="mt-2 text-sm text-muted">{pkg.summary}</p>
                <p className="mt-6 font-display text-3xl font-extrabold text-bone">
                  <span className="mr-1 align-middle font-mono text-[0.65rem] font-normal tracking-[0.18em] text-muted uppercase">
                    from
                  </span>
                  ${pkg.price}
                </p>
                <ul className="mt-6 space-y-2 text-sm text-muted">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 bg-volt" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="mt-8 text-sm text-bone">
            Booking here directly includes {BOOK_DIRECT_PERK}.
          </p>
        </div>
      </section>

      {/* 5 · How it works */}
      <section className="section-pad border-t border-gilt/20">
        <div className="mx-auto max-w-6xl">
          <SectionHead kicker="How it works">
            Brief to{" "}
            <em className="font-serif font-normal text-gilt">final files.</em>
          </SectionHead>
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <li key={step.title} className="clip-shard hairline bg-bg-elev p-6">
                <p className="font-mono text-[0.65rem] tracking-[0.22em] text-ember uppercase">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-display text-xl font-extrabold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6 · What you get */}
      <section className="section-pad border-t border-gilt/20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <div>
            <SectionHead kicker="What you get">
              Files that{" "}
              <em className="font-serif font-normal text-gilt">upload clean.</em>
            </SectionHead>
          </div>
          <div>
            <ul className="space-y-3 text-base text-muted">
              {DELIVERABLES.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2.5 h-1 w-1 shrink-0 bg-volt" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-bone">{COMMERCIAL_USE_NOTE}</p>
          </div>
        </div>
      </section>

      {/* 7 · FAQ */}
      <section className="section-pad border-t border-gilt/20">
        <div className="mx-auto max-w-3xl">
          <SectionHead kicker="FAQ">Questions.</SectionHead>
          <div className="mt-10 divide-y divide-gilt/20 border-y border-gilt/20">
            {FAQ.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-extrabold tracking-tight text-bone hover:text-volt [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span
                    aria-hidden
                    className="text-gilt transition-transform group-open:rotate-45 motion-reduce:transition-none"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 8 · Final CTA */}
      <section className="section-pad border-t border-gilt/20">
        <div className="mx-auto max-w-6xl">
          <p className="label-kicker">Next</p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
            Got a pack?{" "}
            <em className="font-serif font-normal text-ember">Send it.</em>
          </h2>
          <p className="mt-5 max-w-lg text-muted">
            Tell me the pack, the genre, and the feeling. I&apos;ll reply with a
            scope and a price.
          </p>
          <CtaButton className="mt-8" />
        </div>
      </section>
    </>
  );
}
