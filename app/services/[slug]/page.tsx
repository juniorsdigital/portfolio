import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ProofGrid } from "@/components/ProofGrid";
import { PROJECTS } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";
import {
  PROCESS,
  SERVICES,
  contactHref,
  fromPrice,
  getService,
  serviceHref,
  startingPrice,
} from "@/lib/services";
import { SITE } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return pageMetadata({
    title: service.seoTitle,
    description: service.seoDescription,
    path: serviceHref(service),
  });
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const url = `${SITE.url}${serviceHref(service)}`;
  const proof = service.proof
    .map((id) => PROJECTS.find((p) => p.id === id))
    .filter((p) => p !== undefined);
  const others = SERVICES.filter((s) => s.slug !== service.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: service.name,
        serviceType: service.serviceTypes,
        description: service.seoDescription,
        url,
        provider: { "@id": `${SITE.url}/#service` },
        areaServed: [
          { "@type": "City", name: SITE.location },
          { "@type": "Country", name: "United States" },
        ],
        offers: service.packages.map((p) => ({
          "@type": "Offer",
          name: p.name,
          description: p.body,
          url,
          priceSpecification: {
            "@type": "PriceSpecification",
            minPrice: p.price,
            priceCurrency: "USD",
          },
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: service.faqs.map((f) => ({
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
          { "@type": "ListItem", position: 3, name: service.name, item: url },
        ],
      },
    ],
  };

  const facts = [
    { term: "Starting at", value: fromPrice(startingPrice(service)) },
    { term: "Hourly", value: `$${service.hourly}/hr for one-off tasks` },
    { term: "Based in", value: `${SITE.location} — working with clients anywhere` },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Intro */}
      <section className="pt-12 pb-20 sm:pt-16 sm:pb-24" aria-labelledby="service-title">
        <div className="wrap">
          <nav aria-label="Breadcrumb" className="kicker text-stone">
            <ol className="flex flex-wrap gap-x-2">
              <li>
                <Link href="/services" className="hover:text-paper hover:underline">
                  Services
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{service.name}</li>
            </ol>
          </nav>
          <h1 id="service-title" className="display display-xl mt-4 max-w-[16ch]">
            {service.headline.lead}{" "}
            <span className="text-signal">{service.headline.accent}</span>
          </h1>
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <p className="max-w-[48ch] text-xl leading-relaxed text-soft sm:text-[1.375rem]">
                {service.lede}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href={contactHref(service.slug)} className="btn btn-signal">
                  Get a quote <span aria-hidden="true">→</span>
                </Link>
                <Link href="#pricing" className="btn btn-ghost">
                  See pricing
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

          <ul className="mt-12 grid grid-cols-3 border-y border-line sm:mt-16">
            {service.stats.map((r, i) => (
              <li
                key={r.label}
                className={`py-6 sm:py-9 ${i > 0 ? "border-l border-line pl-3 sm:pl-8" : "pr-3 sm:pr-8"}`}
              >
                <p className="display text-[2.25rem] leading-none text-signal sm:text-[4.5rem]">{r.value}</p>
                <p className="mt-2 max-w-[30ch] text-[0.8125rem] leading-snug text-soft sm:mt-3 sm:text-base">{r.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pricing */}
      <section
        className="section on-paper bg-paper text-ink"
        id="pricing"
        aria-labelledby="pricing-title"
      >
        <div className="wrap">
          <p className="kicker text-slate">01 / Packages &amp; pricing</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
            <h2 id="pricing-title" className="display display-lg">
              {service.name} pricing.
            </h2>
            <p className="max-w-[48ch] text-lg text-slate">
              Starting prices for the most common jobs. Every project gets a
              fixed quote before work starts — no hourly surprises.
            </p>
          </div>
          <ul className="mt-14 grid gap-6 md:grid-cols-2">
            {service.packages.map((p) => (
              <li key={p.name} className="flex flex-col border border-rule bg-card p-7 sm:p-9">
                <h3 className="text-[1.625rem] leading-tight font-bold tracking-tight">{p.name}</h3>
                <p className="mt-4 flex flex-wrap items-baseline gap-x-2.5">
                  <span className="display text-[3rem] leading-none">{fromPrice(p.price)}</span>
                  <span className="text-slate">{p.unit}</span>
                </p>
                <p className="mt-4 leading-relaxed text-slate">{p.body}</p>
                <ul className="mt-6 space-y-2.5 border-t border-rule-soft pt-5">
                  {p.includes.map((item) => (
                    <li key={item} className="flex items-baseline gap-3">
                      <span
                        className="h-1.5 w-1.5 shrink-0 translate-y-[-0.15em] bg-signal"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pt-8">
                  <p className="kicker font-normal text-slate">{p.turnaround}</p>
                  <Link
                    href={contactHref(service.slug, p.name)}
                    className="link inline-flex min-h-11 items-center text-lg"
                    aria-label={`Get a quote for ${p.name.toLowerCase()}`}
                  >
                    Get a quote <span aria-hidden="true">&nbsp;→</span>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-slate">
            Something that doesn&apos;t fit a package? One-off tasks run $
            {service.hourly}/hr.{" "}
            <Link href={contactHref(service.slug)} className="link text-ink">
              Send the brief
            </Link>{" "}
            and I&apos;ll quote it.
          </p>
        </div>
      </section>

      {/* Proof */}
      <section className="section" aria-labelledby="proof-title">
        <div className="wrap">
          <p className="kicker text-stone">02 / Proof</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
            <h2 id="proof-title" className="display display-lg">
              Work that already did it.
            </h2>
            <p className="max-w-[46ch] text-lg text-soft">
              Each case study shows the brief, the approach and the result.
            </p>
          </div>
          <div className="mt-14">
            <ProofGrid projects={proof} />
          </div>
        </div>
      </section>

      {/* Fit + process */}
      <section className="section on-paper bg-paper text-ink" aria-labelledby="fit-title">
        <div className="wrap grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="kicker text-slate">03 / Good fit</p>
            <h2 id="fit-title" className="display display-lg mt-4">
              Is this for you?
            </h2>
            <ul className="mt-10 border-t border-rule">
              {service.fit.map((item) => (
                <li key={item} className="flex gap-4 border-b border-rule py-5 text-lg leading-normal">
                  <span
                    className="mt-[0.6em] h-1.5 w-1.5 shrink-0 bg-signal"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="kicker text-slate">04 / How it works</p>
            <h2 className="display display-lg mt-4">Brief to files.</h2>
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
            {service.faqs.map((f) => (
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

      {/* CTA */}
      <section className="on-paper bg-signal py-24 text-ink sm:py-28" aria-labelledby="service-cta-title">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <h2 id="service-cta-title" className="display display-xl">
              Get a fixed quote.
            </h2>
            <p className="mt-6 max-w-[48ch] text-xl leading-relaxed">
              Send the brief and I&apos;ll reply with a scope and a price. No
              calls required, no obligation.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4">
            <Link href={contactHref(service.slug)} className="btn btn-ink min-h-14 px-8 text-lg">
              Start a {service.name.toLowerCase()} project <span aria-hidden="true">→</span>
            </Link>
            <p className="text-lg">
              Also:{" "}
              {others.map((s, i) => (
                <span key={s.slug}>
                  {i > 0 ? " · " : null}
                  <Link href={serviceHref(s)} className="link">
                    {s.name}
                  </Link>
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
