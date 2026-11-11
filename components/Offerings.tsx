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
          title="Covers first. Then the launch."
          aside={
            <p className="text-lg text-slate">
              Cover art is the specialty. Trailers, ads and marketing are there
              when the release needs them, and every job gets a fixed price
              before it starts.
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
          Selling music, sample or sound packs?{" "}
          <Link href="/cover-art" className="link text-ink">
            See cover art for packs
          </Link>
          . Need more than one service?{" "}
          <Link href={contactHref("multiple")} className="link text-ink">
            Send one brief
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
