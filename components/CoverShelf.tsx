"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState, type CSSProperties } from "react";
import { Dialog } from "@/components/Dialog";
import { HERO_COVERS, type HeroCover } from "@/lib/hero-covers";

/** The OvaniSound covers as a shelf: hover or focus pulls a box, click opens its story. */
export function CoverShelf() {
  const [active, setActive] = useState<HeroCover | null>(null);
  const close = useCallback(() => setActive(null), []);

  return (
    <>
      <div
        className="shelf"
        role="group"
        aria-label="OvaniSound music pack covers"
        style={{ "--count": HERO_COVERS.length } as CSSProperties}
      >
        {HERO_COVERS.map((cover, index) => (
          <button
            key={cover.id}
            type="button"
            className="shelf-item"
            style={{ zIndex: index + 1 }}
            onClick={() => setActive(cover)}
            aria-label={`${cover.title} — see how it was made`}
          >
            <Image
              src={cover.src}
              alt=""
              fill
              preload={index === 0 || index >= HERO_COVERS.length - 2}
              sizes="(max-width: 768px) 40vw, 260px"
              className="pointer-events-none object-contain object-left"
            />
          </button>
        ))}
      </div>

      {active ? (
        <Dialog onClose={close} label={active.title} wide>
          {(titleId) => (
            <div className="grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
              <div className="relative aspect-[1080/1536] bg-ink">
                <Image
                  src={active.insideSrc}
                  alt={`${active.title} — side-panel artwork`}
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
                  {active.title}
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-soft">
                  {active.process}
                </p>
                <div className="mt-auto flex flex-wrap gap-3 pt-8">
                  <a
                    href={active.storeHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-signal"
                  >
                    See it in the Ovani store <span aria-hidden="true">↗</span>
                  </a>
                  <Link href={active.contactHref} className="btn btn-sm btn-ghost">
                    Want covers like this?
                  </Link>
                </div>
              </div>
            </div>
          )}
        </Dialog>
      ) : null}
    </>
  );
}
