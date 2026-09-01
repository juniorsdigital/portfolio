import Link from "next/link";
import { OFFERINGS } from "@/lib/offerings";

export function Offerings() {
  return (
    <section className="section-pad border-t border-gilt/20" id="offerings">
      <div className="mx-auto max-w-6xl">
        <p className="label-kicker">Offerings</p>
        <h2 className="mt-4 max-w-2xl font-display text-4xl font-extrabold tracking-tight text-bone sm:text-5xl">
          Three lanes.{" "}
          <em className="font-serif font-normal text-gilt">One person.</em>
        </h2>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {OFFERINGS.map((offering) => (
            <article
              key={offering.num}
              className="clip-shard hairline bg-bg-elev p-7 transition-colors hover:border-ember/60"
            >
              <p className="font-mono text-[0.65rem] tracking-[0.22em] text-ember uppercase">
                {offering.num}
              </p>
              <h3 className="mt-6 font-display text-2xl font-extrabold tracking-tight">
                {offering.title}
              </h3>
              <ul className="mt-6 space-y-2 text-sm text-muted">
                {offering.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 bg-volt" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted">
          Need something in more than one lane?{" "}
          <Link href="/contact" className="text-bone underline decoration-gilt/50 underline-offset-4 hover:text-volt">
            Send a brief
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
