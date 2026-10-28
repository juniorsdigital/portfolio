import Image from "next/image";
import Link from "next/link";
import { Monogram, Wordmark } from "@/components/Wordmark";
import { pageMetadata } from "@/lib/seo";
import { contactHref } from "@/lib/services";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Brand system — identity & design system case study",
  description: `How ${SITE.name} rebuilt his own brand as a system: wordmark, color, type and components, applied across his portfolio.`,
  path: "/brand",
  type: "article",
  image: {
    url: "/images/brand/og.jpg",
    alt: "Brand system board: the wordmark on ink and paper, color swatches and condensed type",
  },
});

const PROBLEMS = [
  {
    stat: "4",
    label: "accent colors",
    detail:
      "Ember, lime, gold and steel each did a different job, so none of them meant anything.",
  },
  {
    stat: "3",
    label: "typefaces",
    detail:
      "A wide display face, an italic serif and a monospace for body text competed in every heading.",
  },
  {
    stat: "10px",
    label: "smallest labels",
    detail:
      "Spaced-out monospace capitals carried navigation, kickers and hints at 10–11px.",
  },
  {
    stat: "2.2:1",
    label: "lowest contrast",
    detail:
      "Hint text failed WCAG AA, and light text on the orange buttons only reached 2.7:1.",
  },
];

const PRINCIPLES = [
  {
    title: "Two grounds, one accent",
    body: "Ink is for showing work, paper is for reading. Signal orange is the only color that asks for attention, so it goes on calls to action, results and the dot.",
  },
  {
    title: "One family, one utility",
    body: "Archivo does everything from 130px condensed headlines to 17px body text. A monospace is kept for metadata only, in sentence case.",
  },
  {
    title: "Proof up front",
    body: "Results are set as large as headlines. A client should see what the work did before reading what it was.",
  },
  {
    title: "Readable by default",
    body: "Every text pairing passes WCAG AA, body text never drops below 17px, and every target is at least 44px.",
  },
];

const COLORS = [
  { name: "Ink", hex: "#0F0F0D", token: "--ink", use: "Showcase ground; text on paper", ratio: "16.9:1 on Paper", swatch: "bg-ink", ring: true },
  { name: "Ink 2", hex: "#1A1A17", token: "--ink-2", use: "Cards on ink", ratio: "Line #2E2D29", swatch: "bg-ink-2", ring: true },
  { name: "Paper", hex: "#F3F0E9", token: "--paper", use: "Reading ground; text on ink", ratio: "Line #D3CEC2", swatch: "bg-paper" },
  { name: "Signal", hex: "#FF5A1F", token: "--signal", use: "Calls to action, results, the dot", ratio: "6.2:1 with Ink", swatch: "bg-signal" },
  { name: "Stone", hex: "#A9A59C", token: "--stone", use: "Secondary text on ink", ratio: "7.8:1 on Ink", swatch: "bg-stone" },
  { name: "Slate", hex: "#55534D", token: "--slate", use: "Secondary text on paper", ratio: "6.8:1 on Paper", swatch: "bg-slate" },
];

const TYPE = [
  {
    spec: "Display",
    detail: "Archivo 800 · 72% width · caps\n56–132px · line height 0.9",
    sample: (
      <p className="display text-[clamp(3rem,7vw,6.5rem)] leading-[0.9]">
        Proof, not pitch.
      </p>
    ),
  },
  {
    spec: "Title",
    detail: "Archivo 700\n28–40px · line height 1.1",
    sample: (
      <p className="text-[2.5rem] leading-[1.1] font-bold tracking-tight">
        RyzaGrow — DTC campaign
      </p>
    ),
  },
  {
    spec: "Body",
    detail: "Archivo 400\n17–22px · line height 1.55",
    sample: (
      <p className="max-w-[62ch] text-lg leading-relaxed text-body">
        Campaign management, content and social direction for a
        direct-to-consumer mushroom grow kit. Owned media across product and
        web.
      </p>
    ),
  },
  {
    spec: "Meta",
    detail: "IBM Plex Mono 400–500\n13–15px · sentence case",
    sample: (
      <p className="kicker text-slate">02 / Selected work · Ryza, LLC · Design + Marketing</p>
    ),
  },
];

const DELIVERABLES = [
  "Wordmark, jrs. mark and favicon",
  "Color tokens with contrast ratios",
  "Type scale",
  "Buttons, filters, cards and forms",
  "Website, desktop and mobile",
];

export default function BrandCaseStudyPage() {
  return (
    <>
      {/* Intro */}
      <section className="pt-16 pb-20 sm:pt-24 sm:pb-24" aria-labelledby="brand-title">
        <div className="wrap">
          <p className="kicker text-stone">
            Case study / Brand system
          </p>
          <h1 id="brand-title" className="display display-xl mt-4 max-w-[14ch]">
            One system. <span className="text-signal">Every surface.</span>
          </h1>
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
            <p className="max-w-[46ch] text-xl leading-relaxed text-soft sm:text-[1.375rem]">
              This is the brand system I use for my own work. I rebuilt it
              from a site that looked busy and read badly into a small kit — one
              wordmark, six colors, one type family and a handful of
              components — that every page, file and post is built from.
            </p>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-6 text-[0.9375rem]">
              <div>
                <dt className="kicker text-stone">Client</dt>
                <dd className="mt-1.5">Self-initiated</dd>
              </div>
              <div>
                <dt className="kicker text-stone">Year</dt>
                <dd className="mt-1.5">2026</dd>
              </div>
              <div>
                <dt className="kicker text-stone">Role</dt>
                <dd className="mt-1.5">Identity, design system, web build</dd>
              </div>
              <div>
                <dt className="kicker text-stone">Built in</dt>
                <dd className="mt-1.5">Next.js, Tailwind CSS</dd>
              </div>
              <div className="col-span-2">
                <dt className="kicker text-stone">Delivered</dt>
                <dd className="mt-1.5">{DELIVERABLES.join(" · ")}</dd>
              </div>
            </dl>
          </div>

          <figure className="mt-16">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Image
                  src="/images/brand/before-home.webp"
                  alt="The old home page: a wide display name over a blurred video, small spaced-out labels, and lime, gold and orange accents"
                  width={1440}
                  height={900}
                  preload
                  sizes="(max-width: 768px) 100vw, 620px"
                  className="w-full border border-line"
                />
                <p className="kicker mt-3 font-normal text-stone">Before</p>
              </div>
              <div>
                <Image
                  src="/images/brand/after-home.webp"
                  alt="The new home page: a condensed headline stating the offer, one orange accent, and the cover shelf above the fold"
                  width={1440}
                  height={900}
                  preload
                  sizes="(max-width: 768px) 100vw, 620px"
                  className="w-full border border-line"
                />
                <p className="kicker mt-3 font-normal text-signal">After</p>
              </div>
            </div>
          </figure>
        </div>
      </section>

      {/* Problem */}
      <section className="section on-paper bg-paper text-ink" aria-labelledby="problem-title">
        <div className="wrap">
          <p className="kicker text-slate">01 / The problem</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
            <h2 id="problem-title" className="display display-lg">
              Loud, but hard to read.
            </h2>
            <p className="max-w-[46ch] text-lg text-slate">
              The old site had plenty of personality and no system. Each page
              made its own choices, so nothing looked related and the work
              competed with the decoration around it.
            </p>
          </div>
          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROBLEMS.map((p) => (
              <li key={p.label} className="flex flex-col border border-rule bg-card p-7">
                <p className="display text-[3.5rem] leading-none normal-case">{p.stat}</p>
                <p className="mt-2 font-semibold">{p.label}</p>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-slate">{p.detail}</p>
              </li>
            ))}
          </ul>
          <figure className="mt-12">
            <Image
              src="/images/brand/before-services.webp"
              alt="The old services section: three cards with 11px monospace text, a wide display heading and a gold italic serif"
              width={1440}
              height={700}
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="w-full border border-rule"
            />
            <figcaption className="kicker mt-3 font-normal text-slate">
              Before — services set in 11px monospace, with three typefaces in one heading row.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Principles */}
      <section className="section" aria-labelledby="principles-title">
        <div className="wrap">
          <p className="kicker text-stone">02 / Principles</p>
          <h2 id="principles-title" className="display display-lg mt-4">
            Four rules, written down.
          </h2>
          <ol className="mt-14 grid gap-px bg-line sm:grid-cols-2">
            {PRINCIPLES.map((p, i) => (
              <li key={p.title} className="bg-ink p-8 sm:p-10">
                <p className="font-mono text-sm text-signal">0{i + 1}</p>
                <h3 className="mt-6 text-[1.75rem] font-bold tracking-tight">{p.title}</h3>
                <p className="mt-3 max-w-[48ch] text-soft">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* The system */}
      <section className="section on-paper bg-paper text-ink" aria-labelledby="system-title">
        <div className="wrap">
          <p className="kicker text-slate">03 / The system</p>
          <h2 id="system-title" className="display display-lg mt-4">
            Small enough to remember.
          </h2>

          <h3 className="mt-16 text-2xl font-bold tracking-tight">Name &amp; mark</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-[2fr_2fr_1fr]">
            <div className="grid min-h-56 place-items-center bg-ink px-6 text-paper">
              <Wordmark className="text-[clamp(2.25rem,4.2vw,4rem)]" />
            </div>
            <div className="grid min-h-56 place-items-center border border-rule bg-card px-6">
              <Monogram className="text-[clamp(3.5rem,7vw,6.5rem)]" />
            </div>
            <div className="flex min-h-56 items-center justify-center gap-6 border border-rule bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon.svg" alt="Favicon: jrs. in ink on signal orange" width={96} height={96} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon.svg" alt="" width={32} height={32} />
            </div>
          </div>
          <p className="mt-5 max-w-[70ch] text-slate">
            The wordmark is my name, set in Archivo Condensed and closed with
            the orange dot. It matches johnswanson.co, and it&apos;s what
            clients search for and pass on. My initials, jrs., are the mark:
            the favicon, profile images and the signature on files. I tried a
            studio name built from those initials first and dropped it — people
            hire a person, and a name that looks like a web address has to be
            one you own. The dot carries across all of it, plus active
            navigation and numbered sections.
          </p>

          <h3 className="mt-16 text-2xl font-bold tracking-tight">Color</h3>
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-6">
            {COLORS.map((c) => (
              <li key={c.name}>
                <div className={`h-32 ${c.swatch} ${c.ring ? "" : "border border-rule"}`} />
                <p className="mt-3 font-bold">{c.name}</p>
                <p className="mt-1 font-mono text-[0.8125rem] leading-relaxed text-slate">
                  {c.hex}
                  <br />
                  {c.use}
                  <br />
                  {c.ratio}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-[70ch] text-slate">
            Each color is a CSS token with its contrast ratio written next to
            it. Orange is never used for small text on paper; a darker{" "}
            <span className="font-mono text-[0.9375rem] text-signal-ink">#B83D0E</span>{" "}
            (5.0:1) covers that case.
          </p>

          <h3 className="mt-16 text-2xl font-bold tracking-tight">Type</h3>
          <div className="mt-6 border-t border-rule">
            {TYPE.map((t) => (
              <div
                key={t.spec}
                className="grid gap-3 border-b border-rule py-6 md:grid-cols-[14rem_minmax(0,1fr)] md:items-baseline md:gap-8"
              >
                <p className="font-mono text-[0.8125rem] leading-relaxed whitespace-pre-line text-slate">
                  <span className="font-medium text-ink">{t.spec}</span>
                  {"\n"}
                  {t.detail}
                </p>
                {t.sample}
              </div>
            ))}
          </div>

          <h3 className="mt-16 text-2xl font-bold tracking-tight">Components</h3>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="flex flex-col gap-6 bg-ink p-8 text-paper sm:p-10">
              <div className="flex flex-wrap gap-3">
                <span className="btn btn-signal">
                  Start a project <span aria-hidden="true">→</span>
                </span>
                <span className="btn btn-ghost">See the work</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex min-h-11 items-center gap-2 border border-paper bg-paper px-5 font-semibold text-ink">
                  All <span className="font-mono text-[0.8125rem] font-normal opacity-75">6</span>
                </span>
                <span className="inline-flex min-h-11 items-center gap-2 border border-slate px-5 font-semibold">
                  Design <span className="font-mono text-[0.8125rem] font-normal opacity-75">4</span>
                </span>
              </div>
              <div className="border border-line bg-ink-2 p-7">
                <p className="flex justify-between gap-4 font-mono text-sm text-stone">
                  <span>OvaniSound · Design</span>
                  <span className="text-signal">30 in 1 week</span>
                </p>
                <p className="mt-3 text-[1.75rem] leading-tight font-bold tracking-tight">
                  75+ music pack covers
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-6 border border-rule bg-card p-8 sm:p-10">
              <div className="flex flex-col gap-2 text-[0.9375rem] font-semibold">
                <span>Email</span>
                <span className="flex min-h-13 items-center border border-field px-4 text-[1.0625rem] font-normal text-slate">
                  you@studio.com
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex min-h-11 items-center border border-signal bg-signal px-4 text-[0.9375rem] font-medium">
                  Product covers
                </span>
                <span className="inline-flex min-h-11 items-center border border-field px-4 text-[0.9375rem] font-medium">
                  Poster designs
                </span>
              </div>
              <span className="btn btn-ink self-start">Send brief</span>
            </div>
          </div>
          <p className="mt-5 max-w-[70ch] text-slate">
            Square corners and one-pixel rules instead of the old angled
            corners. Video is marked with a “Play” tag rather than a second
            color, so the accent keeps one meaning.
          </p>
        </div>
      </section>

      {/* Applied */}
      <section className="section" aria-labelledby="applied-title">
        <div className="wrap">
          <p className="kicker text-stone">04 / Applied</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
            <h2 id="applied-title" className="display display-lg">
              Same kit, desktop to phone.
            </h2>
            <p className="max-w-[46ch] text-lg text-soft">
              The phone layout isn&apos;t a separate design. It uses the same
              tokens and components, and the headline still leads with the
              offer.
            </p>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-8 md:max-w-3xl">
            <figure>
              <Image
                src="/images/brand/before-mobile.webp"
                alt="Old mobile home page: covers above a wide display name and small spaced-out hint text"
                width={390}
                height={844}
                sizes="(max-width: 768px) 46vw, 360px"
                className="w-full border border-line"
              />
              <figcaption className="kicker mt-3 font-normal text-stone">Before</figcaption>
            </figure>
            <figure>
              <Image
                src="/images/brand/after-mobile.webp"
                alt="New mobile home page: condensed headline, readable body text and full-width buttons"
                width={390}
                height={844}
                sizes="(max-width: 768px) 46vw, 360px"
                className="w-full border border-line"
              />
              <figcaption className="kicker mt-3 font-normal text-signal">After</figcaption>
            </figure>
          </div>

          <ul className="mt-16 grid border-y border-line sm:grid-cols-3">
            {[
              { v: "1", l: "accent color, down from four" },
              { v: "2", l: "type families, down from three — one for everything you read" },
              { v: "AA", l: "contrast on every text pairing, from 2.2:1 at the lowest" },
            ].map((r, i) => (
              <li
                key={r.v}
                className={`py-9 ${i > 0 ? "border-t border-line sm:border-t-0 sm:border-l sm:pl-8" : "sm:pr-8"}`}
              >
                <p className="display text-[4.5rem] leading-none text-signal">{r.v}</p>
                <p className="mt-3 max-w-[30ch] text-soft">{r.l}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pitch */}
      <section className="on-paper bg-signal py-24 text-ink sm:py-28" aria-labelledby="pitch-title">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <h2 id="pitch-title" className="display display-xl">
              Want a system like this?
            </h2>
            <p className="mt-6 max-w-[48ch] text-xl leading-relaxed">
              I build the same kit for brands: a wordmark, a palette that
              passes contrast, a type scale and the components to use them —
              handed over as files and tokens your team can actually use.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4">
            <Link href={contactHref("graphic-design")} className="btn btn-ink min-h-14 px-8 text-lg">
              Start a brand project <span aria-hidden="true">→</span>
            </Link>
            <Link href="/services/graphic-design" className="link text-lg">
              See graphic design pricing
            </Link>
            <Link href="/work" className="link text-lg">
              See the rest of the work
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
