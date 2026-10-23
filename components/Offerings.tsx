import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { OFFERINGS } from "@/lib/offerings";

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
              doing the work.
            </p>
          }
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {OFFERINGS.map((offering) => (
            <article
              key={offering.num}
              className="flex flex-col border border-rule bg-card p-8 sm:p-9"
            >
              <p className="font-mono text-sm text-signal-ink">{offering.num}</p>
              <h3 className="mt-10 text-[1.875rem] leading-tight font-bold tracking-tight">
                {offering.title}
              </h3>
              <p className="mt-3 text-slate">{offering.summary}</p>
              <ul className="mt-7 space-y-2.5 border-t border-rule-soft pt-5">
                {offering.items.map((item) => (
                  <li key={item} className="flex items-baseline gap-3">
                    <span
                      className="h-1.5 w-1.5 shrink-0 translate-y-[-0.15em] bg-signal"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="mt-8 text-slate">
          Need more than one lane?{" "}
          <Link href="/contact" className="link text-ink">
            Send one brief
          </Link>{" "}
          and I&apos;ll scope it together.
        </p>
      </div>
    </section>
  );
}
