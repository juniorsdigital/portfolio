"use client";

import Image from "next/image";
import { useCallback, useState, type CSSProperties } from "react";
import { CoverStory } from "@/components/CoverStory";
import { COVER_SIZE, HERO_COVERS, type HeroCover } from "@/lib/hero-covers";

const SHELF_STYLE = {
  "--count": HERO_COVERS.length,
  "--cover-ratio": COVER_SIZE.width / COVER_SIZE.height,
} as CSSProperties;

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
        style={SHELF_STYLE}
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

      {active ? <CoverStory cover={active} onClose={close} /> : null}
    </>
  );
}
