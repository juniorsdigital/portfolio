import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeader } from "@/components/SectionHeader";
import { pageMetadata } from "@/lib/seo";
import {
  PROCESS,
  SERVICES,
  contactHref,
  fromPrice,
  serviceHref,
  startingPrice,
} from "@/lib/services";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Services & pricing — design, video & marketing",
  description: `Cover art and graphic design, video editing and marketing from a freelancer in ${SITE.location}. Starting prices listed, a fixed quote within ${SITE.replyTime}.`,
  path: "/services",
});

export default function ServicesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: "Services",
        itemListElement: SERVICES.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.name,
          url: `${SITE.url}${serviceHref(s)}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
          { "@type": "ListItem", position: 2, name: "Services", item: `${SITE.url}/services` },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <section className="pt-16 pb-20 sm:pt-24 sm:pb-24" aria-labelledby="services-title">
        <div className="wrap">
          <SectionHeader
            as="h1"
            id="services-title"
            kicker={`Services / ${SERVICES.length} services`}
            title={
              <>
                Services <span className="text-signal">&amp; pricing.</span>
              </>
            }
            aside={
              <p className="text-xl leading-relaxed text-soft">
                Cover art and graphic design, video editing and marketing.
                Starting prices are listed; every project gets a fixed quote
                before it starts. Selling packs?{" "}
                <Link href="/cover-art" className="link text-paper">
                  See cover art for packs
                </Link>
                .
              </p>
            }
          />
        </div>
      </section>

      <section className="section on-paper bg-paper text-ink" aria-label="Services">
        <div className="wrap space-y-6">
          {SERVICES.map((service) => (
            <article
              key={service.slug}
              className="grid gap-10 border border-rule bg-card p-7 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-16"
              aria-labelledby={`${service.slug}-title`}
            >
              <div className="flex flex-col">
                <p className="font-mono text-sm text-signal-ink">{service.num}</p>
                <h2
                  id={`${service.slug}-title`}
                  className="display mt-6 text-[clamp(2.5rem,4.5vw,3.75rem)]"
                >
                  {service.name}
                </h2>
                <p className="mt-4 max-w-[40ch] text-lg text-slate">{service.summary}</p>
                <p className="mt-6 font-mono text-[0.9375rem]">
                  {fromPrice(startingPrice(service))} · fixed quote on every job
                </p>
                <div className="mt-auto flex flex-wrap gap-3 pt-8">
                  <Link href={serviceHref(service)} className="btn btn-ink">
                    {service.name} services <span aria-hidden="true">→</span>
                  </Link>
                  <Link
                    href={contactHref(service.slug)}
                    className="btn border border-ink font-semibold hover:bg-ink hover:text-paper"
                  >
                    Get a quote
                  </Link>
                </div>
              </div>
              <ul className="border-t border-rule-soft">
                {service.packages.map((p) => (
                  <li
                    key={p.name}
                    className="flex flex-col gap-1 border-b border-rule-soft py-4.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                  >
                    <span className="text-lg font-semibold">{p.name}</span>
                    <span className="shrink-0 font-mono text-[0.9375rem] text-slate">
                      {fromPrice(p.price)} {p.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
          <p className="pt-2 text-slate">
            Need more than one service?{" "}
            <Link href={contactHref("multiple")} className="link text-ink">
              Send one brief
            </Link>{" "}
            and I&apos;ll scope it together.
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="process-title">
        <div className="wrap">
          <SectionHeader kicker="How it works" id="process-title" title="Three steps to a start date." />
          <ol className="mt-14 grid gap-px bg-line sm:grid-cols-3">
            {PROCESS.map((step, i) => (
              <li key={step.title} className="bg-ink p-8 sm:p-10">
                <p className="font-mono text-sm text-signal">0{i + 1}</p>
                <h3 className="mt-6 text-[1.75rem] leading-tight font-bold tracking-tight">{step.title}</h3>
                <p className="mt-3 max-w-[40ch] text-soft">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="on-paper bg-signal py-24 text-ink sm:py-28" aria-labelledby="services-cta-title">
        <div className="wrap flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="services-cta-title" className="display display-xl">
              Get a fixed
              <br />
              quote.
            </h2>
            <p className="mt-6 max-w-[44ch] text-xl leading-relaxed">
              Send the brief. Within {SITE.replyTime} you&apos;ll have a scope
              and a price — or a no, if I&apos;m not the right person.
            </p>
          </div>
          <Link href="/contact" className="btn btn-ink min-h-14 px-8 text-lg">
            Send the brief <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
