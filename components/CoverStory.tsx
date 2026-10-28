import Image from "next/image";
import Link from "next/link";
import { Dialog } from "@/components/Dialog";
import { INSIDE_SIZE, type HeroCover } from "@/lib/hero-covers";

/** The dialog behind a shelf box: side-panel art next to how the cover was made. */
export function CoverStory({
  cover,
  onClose,
}: {
  cover: HeroCover;
  onClose: () => void;
}) {
  return (
    <Dialog onClose={onClose} label={cover.title} wide>
      {(titleId) => (
        <div className="grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div
            className="relative bg-ink"
            style={{ aspectRatio: `${INSIDE_SIZE.width} / ${INSIDE_SIZE.height}` }}
          >
            <Image
              src={cover.insideSrc}
              alt={`${cover.title} — side-panel artwork`}
              fill
              sizes="(max-width: 768px) 92vw, 420px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col p-7 sm:p-10">
            <p className="kicker text-stone">OvaniSound · Music pack cover</p>
            <h2
              id={titleId}
              className="mt-3 pr-10 text-3xl font-bold tracking-tight sm:text-4xl"
            >
              {cover.title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-soft">{cover.process}</p>
            <div className="mt-auto flex flex-wrap gap-3 pt-8">
              <Link href={cover.contactHref} className="btn btn-sm btn-signal">
                Get covers like this <span aria-hidden="true">→</span>
              </Link>
              <a
                href={cover.storeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-ghost"
              >
                See it in the Ovani store <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}
