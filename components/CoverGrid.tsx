import Image from "next/image";
import Link from "next/link";
import { CLIENT_NAME, type HeroCover } from "@/lib/hero-covers";

function coverHref(cover: HeroCover) {
  return `/contact?service=covers&ref=${cover.slug}`;
}

export function CoverGrid({
  covers,
  featuredCount = 3,
}: {
  covers: HeroCover[];
  featuredCount?: number;
}) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {covers.map((cover, i) => {
        const featured = i < featuredCount;
        return (
          <li
            key={cover.id}
            className={featured ? "col-span-2 sm:col-span-1 lg:col-span-1" : ""}
          >
            <article className="group flex h-full flex-col">
              <div className="relative aspect-[1187/1678] transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                <Image
                  src={cover.src}
                  alt={cover.alt}
                  fill
                  priority={i === 0}
                  sizes={
                    featured
                      ? "(max-width: 640px) 92vw, (max-width: 1024px) 30vw, 270px"
                      : "(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 270px"
                  }
                  className="object-contain [filter:drop-shadow(0_14px_22px_rgba(0,0,0,0.5))]"
                />
              </div>
              <h3 className="mt-4 font-display text-lg font-extrabold tracking-tight text-bone">
                {cover.title}
              </h3>
              <p className="mt-1 text-[0.62rem] tracking-[0.16em] text-muted uppercase">
                For {CLIENT_NAME}
              </p>
              {cover.process.trim() ? (
                <details className="mt-3 text-sm text-muted">
                  <summary className="cursor-pointer text-[0.65rem] tracking-[0.16em] uppercase hover:text-bone">
                    How it was made
                  </summary>
                  <p className="mt-2 leading-relaxed">{cover.process}</p>
                </details>
              ) : null}
              <Link
                href={coverHref(cover)}
                className="mt-auto inline-block pt-4 text-[0.68rem] tracking-[0.16em] text-volt uppercase hover:text-bone"
              >
                Get a cover like this →
              </Link>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
