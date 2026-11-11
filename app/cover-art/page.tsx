import Link from "next/link";
import { CoverShelf } from "@/components/CoverShelf";
import { JsonLd } from "@/components/JsonLd";
import { ProofGrid } from "@/components/ProofGrid";
import { Testimonials } from "@/components/Testimonials";
import { PROJECTS } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";
import { COMMON_FAQS, PROCESS, contactHref, fromPrice, getService } from "@/lib/services";
import { SITE } from "@/lib/site";

const PATH = "/cover-art";
const TITLE = "Music, sample & sound pack cover art";

export const metadata = pageMetadata({
  title: `${TITLE} — ${SITE.name}`,
  description:
    "Cover art for music packs, sample packs and sound libraries: original 2D covers, 3D box renders and side-panels. 75+ covers for OvaniSound, from $120 per cover.",
  path: PATH,
  absoluteTitle: true,
  image: {
    url: "/images/work/ovani-og.jpg",
    alt: "OvaniSound music pack boxes rendered in 3D",
  },
});

// Prices come from the graphic design service so the two pages never disagree.
const design = getService("graphic-design")!;
const cover = design.packages.find((p) => p.name === "Product cover design")!;

const DELIVERABLES = [
  {
    title: "Front cover art",
    body: "One strong scene that names the genre at a glance and still reads as a thumbnail in a crowded store grid. Original art — no AI imagery.",
  },
  {
    title: "3D box render",
    body: "The cover wrapped onto a box, so your store page shows a product that feels physical instead of a flat square.",
  },
  {
    title: "Side-panel art",
    body: "A second illustrated panel that builds the world of the pack and gives collectors a reason to look closer.",
  },
  {
    title: "Store-ready sizes",
    body: "Every size your store and socials ask for, plus volume stickers for series and promo drops.",
  },
];

const FIT = [
  "Sample pack and sound library publishers releasing on a schedule.",
  "Game-audio, music and sound-effect sellers whose catalog has to read as one family.",
  "Preset, loop and plugin makers who need a cover that looks as good as the product sounds.",
  "Labels and artists putting out a numbered series and want each volume to match.",
];

const FAQS = [
  {
    q: "Do you use AI-generated art?",
    a: "No. Covers are built from original illustration, licensed stock, compositing and hand-painted light. OvaniSound moved its catalog off AI art with exactly this process.",
  },
  {
    q: "Can you match my existing covers?",
    a: "Yes. Send a few current covers and I'll design new volumes inside that look — or set up a series system first so every future volume slots in.",
  },
  {
    q: "How fast can you deliver a batch?",
    a: `A single cover takes ${cover.turnaround.replace(" per cover", "")}. Batches are scheduled together; at the peak I shipped 30 distinct covers for OvaniSound in one week.`,
  },
  {
    q: "How does pricing work for a catalog?",
    a: `Covers start at ${fromPrice(cover.price).replace("From ", "")} each, with a 3D box render for $60 more. Catalogs of 5+ covers are quoted together at a lower per-cover rate.`,
  },
  ...COMMON_FAQS,
];

export default function CoverArtPage() {
  const url = `${SITE.url}${PATH}`;
  const ovani = PROJECTS.filter((p) => p.id === "ovani");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: TITLE,
        serviceType: ["Music pack cover art", "Sample pack cover art", "Sound library cover design", "3D packaging renders"],
        description: metadata.description,
        url,
        provider: { "@id": `${SITE.url}/#service` },
        areaServed: { "@type": "Country", name: "United States" },
        offers: {
          "@type": "Offer",
          name: cover.name,
          url,
          priceSpecification: { "@type": "PriceSpecification", minPrice: cover.price, priceCurrency: "USD" },
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
          { "@type": "ListItem", position: 2, name: "Services", item: `${SITE.url}/services` },
          { "@type": "ListItem", position: 3, name: "Cover art", item: url },
        ],
      },
    ],
  };

  const facts = [
    { term: "Covers", value: `${fromPrice(cover.price)} ${cover.unit}` },
    { term: "3D box render", value: "+$60 per cover" },
    { term: "Catalogs", value: "5+ covers quoted together at a lower rate" },
    { term: "Turnaround", value: cover.turnaround },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Intro */}
      <section className="pt-12 pb-16 sm:pt-16 sm:pb-20" aria-labelledby="cover-title">
        <div className="wrap">
          <nav aria-label="Breadcrumb" className="kicker text-stone">
            <ol className="flex flex-wrap gap-x-2">
              <li>
                <Link href="/services" className="hover:text-paper hover:underline">
                  Services
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">Cover art</li>
            </ol>
          </nav>
          <h1 id="cover-title" className="display display-xl mt-4 max-w-[14ch]">
            Music, sample &amp; sound pack <span className="text-signal">cover art.</span>
          </h1>
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <p className="max-w-[48ch] text-xl leading-relaxed text-soft sm:text-[1.375rem]">
                A pack is invisible until someone presses play, so the cover does
                the selling. I design covers, 3D box renders and side-panels for
                music packs, sample packs and sound libraries — 75+ of them for
                OvaniSound across 32+ genres since 2025.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href={contactHref("graphic-design", cover.name)} className="btn btn-signal">
                  Get a cover quote <span aria-hidden="true">→</span>
                </Link>
                <Link href="/work/ovani" className="btn btn-ghost">
                  Read the OvaniSound case study
                </Link>
              </div>
            </div>
            <dl className="grid content-start gap-y-4 border-t border-line pt-6 text-[0.9375rem] sm:gap-y-6">
              {facts.map((f) => (
                <div key={f.term}>
                  <dt className="kicker text-stone">{f.term}</dt>
                  <dd className="mt-1.5">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-14">
            <CoverShelf />
            <p className="mt-5 border-t border-line pt-4 font-mono text-sm text-stone">
              Real OvaniSound covers. Pick a box to see how it was made.
            </p>
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="section on-paper bg-paper text-ink" aria-labelledby="deliver-title">
        <div className="wrap">
          <p className="kicker text-slate">01 / What you get</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
            <h2 id="deliver-title" className="display display-lg">
              The cover sells. The side-panel tells.
            </h2>
            <p className="max-w-[48ch] text-lg text-slate">
              Every cover includes two rounds of revisions and final files at
              every size you list. Add the rest per pack or per series.
            </p>
          </div>
          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DELIVERABLES.map((d) => (
              <li key={d.title} className="flex flex-col border border-rule bg-card p-7">
                <h3 className="text-[1.375rem] leading-tight font-bold tracking-tight">{d.title}</h3>
                <p className="mt-3 leading-relaxed text-slate">{d.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Proof */}
      <section className="section" aria-labelledby="catalog-title">
        <div className="wrap">
          <p className="kicker text-stone">02 / Built for catalogs</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
            <h2 id="catalog-title" className="display display-lg">
              One look. Every volume.
            </h2>
            <p className="max-w-[46ch] text-lg text-soft">
              A catalog sells better when it reads as a collection. Series run
              on shared themes — graffiti for Hip Hop, duo-tone side-panels for
              every Vol. 3 — so each new volume is new without breaking the set.
            </p>
          </div>
          <ul className="mt-14 grid border-y border-line sm:grid-cols-3">
            {[
              { value: "75+", label: "covers shipped for OvaniSound since 2025" },
              { value: "32+", label: "genres, from chiptune and pirate to horror and comedy" },
              { value: "30", label: "distinct covers delivered in a single week" },
            ].map((r, i) => (
              <li
                key={r.value}
                className={`py-9 ${i > 0 ? "border-t border-line sm:border-t-0 sm:border-l sm:pl-8" : "sm:pr-8"}`}
              >
                <p className="display text-[4.5rem] leading-none text-signal">{r.value}</p>
                <p className="mt-3 max-w-[30ch] text-soft">{r.label}</p>
              </li>
            ))}
          </ul>
          <div className="mt-14 max-w-2xl">
            <ProofGrid projects={ovani} />
          </div>
        </div>
      </section>

      {/* Fit + process */}
      <section className="section on-paper bg-paper text-ink" aria-labelledby="fit-title">
        <div className="wrap grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="kicker text-slate">03 / Good fit</p>
            <h2 id="fit-title" className="display display-lg mt-4">
              Who this is for.
            </h2>
            <ul className="mt-10 border-t border-rule">
              {FIT.map((item) => (
                <li key={item} className="flex gap-4 border-b border-rule py-5 text-lg leading-normal">
                  <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 bg-signal" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="kicker text-slate">04 / How it works</p>
            <h2 className="display display-lg mt-4">Three steps to a start date.</h2>
            <ol className="mt-10 border-t border-rule">
              {PROCESS.map((step, i) => (
                <li key={step.title} className="flex gap-5 border-b border-rule py-5">
                  <span className="pt-1 font-mono text-sm text-signal-ink">0{i + 1}</span>
                  <span>
                    <span className="block text-xl font-bold tracking-tight">{step.title}</span>
                    <span className="mt-1.5 block leading-relaxed text-slate">{step.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" aria-labelledby="faq-title">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-20">
          <div>
            <p className="kicker text-stone">05 / Questions</p>
            <h2 id="faq-title" className="display display-lg mt-4">
              Before you ask.
            </h2>
          </div>
          <div className="border-t border-line">
            {FAQS.map((f) => (
              <details key={f.q} className="faq group border-b border-line">
                <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-6 py-6 text-xl font-bold tracking-tight">
                  {f.q}
                  <span
                    className="font-mono text-2xl font-normal text-signal transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-[60ch] pb-7 leading-relaxed text-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Testimonials service="graphic-design" />

      {/* CTA */}
      <section className="on-paper bg-signal py-24 text-ink sm:py-28" aria-labelledby="cover-cta-title">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <h2 id="cover-cta-title" className="display display-xl">
              Next release coming?
            </h2>
            <p className="mt-6 max-w-[48ch] text-xl leading-relaxed">
              Send the pack names, genres and dates. Within {SITE.replyTime}{" "}
              you&apos;ll have a fixed price for the batch.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4">
            <Link href={contactHref("graphic-design", cover.name)} className="btn btn-ink min-h-14 px-8 text-lg">
              Get a cover quote <span aria-hidden="true">→</span>
            </Link>
            <Link href="/services/graphic-design" className="link text-lg">
              Other graphic design work
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
