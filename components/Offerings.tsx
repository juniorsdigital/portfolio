import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { SERVICES, contactHref, fromPrice, serviceHref, startingPrice } from "@/lib/services";

export function Offerings() {
  return (
    <section
      className="section on-paper bg-paper text-ink"
      id="services"
      aria-labelledby="services-title"
    >
      <div className="wrap">
        <SectionHeader
          tone="paper"
          kicker="01 / Services"
          id="services-title"
          title="Three lanes. One person."
          aside={
            <p className="text-lg text-slate">
              Hire one lane or all three. Either way you deal with the person
              doing the work — and you see the price before it starts.
            </p>
          }
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <article
              key={service.slug}
              className="group relative flex flex-col border border-rule bg-card p-8 transition-colors hover:border-ink sm:p-9"
            >
              <p className="flex items-baseline justify-between font-mono text-sm">
                <span className="text-signal-ink">{service.num}</span>
                <span className="text-slate">{fromPrice(startingPrice(service))}</span>
              </p>
              <h3 className="mt-10 text-[1.875rem] leading-tight font-bold tracking-tight">
                <Link
                  href={serviceHref(service)}
                  className="after:absolute after:inset-0 after:content-['']"
                >
                  {service.name}
                </Link>
              </h3>
              <p className="mt-3 text-slate">{service.summary}</p>
              <ul className="mt-7 space-y-2.5 border-t border-rule-soft pt-5">
                {service.packages.map((p) => (
                  <li key={p.name} className="flex items-baseline gap-3">
                    <span
                      className="h-1.5 w-1.5 shrink-0 translate-y-[-0.15em] bg-signal"
                      aria-hidden="true"
                    />
                    {p.name}
                  </li>
                ))}
              </ul>
              <span
                className="mt-auto inline-flex items-center gap-2 pt-8 text-lg font-semibold underline decoration-1 underline-offset-[0.3em] group-hover:decoration-signal group-hover:decoration-2"
                aria-hidden="true"
              >
                Pricing &amp; details <span>→</span>
              </span>
            </article>
          ))}
        </div>
        <p className="mt-8 text-slate">
          Need more than one lane?{" "}
          <Link href={contactHref("multiple")} className="link text-ink">
            Send one brief
          </Link>{" "}
          and I&apos;ll scope it together. Or{" "}
          <Link href="/services" className="link text-ink">
            compare all services
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
