"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import {
  BookCaseStudyOverlay,
  type BookOrigin,
} from "@/components/BookCaseStudyOverlay";
import { HERO_BOXES, type HeroBox } from "@/lib/hero-boxes";
import { PROJECTS } from "@/lib/projects";

const OVANI = PROJECTS.find((project) => project.id === "ovani");

export function BookshelfHero() {
  const caseRef = useRef<HTMLDivElement>(null);
  const pulledRef = useRef<string | null>(null);
  const pointerTypeRef = useRef<string>("mouse");
  const [pulledId, setPulledId] = useState<string | null>(null);
  const [origin, setOrigin] = useState<BookOrigin | null>(null);
  const [reduced, setReduced] = useState(false);

  const setPulled = (id: string | null) => {
    pulledRef.current = id;
    setPulledId(id);
  };

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      pointerTypeRef.current = e.pointerType;
      if (origin) return;
      const node = e.target as Node | null;
      if (node && caseRef.current?.contains(node)) return;
      setPulled(null);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [origin]);

  const openBook = (box: HeroBox, el: HTMLElement) => {
    if (!OVANI) return;
    const rect = el.getBoundingClientRect();
    setOrigin({
      box,
      project: OVANI,
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    });
  };

  const closeBook = useCallback(() => {
    setOrigin(null);
  }, []);

  const onBoxClick = (
    e: MouseEvent<HTMLButtonElement>,
    box: HeroBox,
  ) => {
    if (origin) return;
    if (pointerTypeRef.current === "touch" && pulledRef.current !== box.id) {
      setPulled(box.id);
      return;
    }
    openBook(box, e.currentTarget);
  };

  const shelves: { shelf: 0 | 1; items: ReactNode[] }[] = [
    {
      shelf: 0,
      items: [
        <Plant key="plant" />,
        <ShelfBox
          key="ambient-fantasy"
          box={HERO_BOXES[0]}
          pulled={pulledId === "ambient-fantasy"}
          hidden={origin?.box.id === "ambient-fantasy"}
          priority
          reduced={reduced}
          onClick={onBoxClick}
          onPull={setPulled}
        />,
        <ShelfBox
          key="horror-vol-9"
          box={HERO_BOXES[1]}
          pulled={pulledId === "horror-vol-9"}
          hidden={origin?.box.id === "horror-vol-9"}
          priority
          reduced={reduced}
          onClick={onBoxClick}
          onPull={setPulled}
        />,
        <Candle key="candle" />,
        <ShelfBox
          key="epic-vol-5"
          box={HERO_BOXES[2]}
          pulled={pulledId === "epic-vol-5"}
          hidden={origin?.box.id === "epic-vol-5"}
          priority
          reduced={reduced}
          onClick={onBoxClick}
          onPull={setPulled}
        />,
        <ShelfBox
          key="magical-vol-5"
          box={HERO_BOXES[3]}
          pulled={pulledId === "magical-vol-5"}
          hidden={origin?.box.id === "magical-vol-5"}
          reduced={reduced}
          onClick={onBoxClick}
          onPull={setPulled}
        />,
        <Sculpture key="sculpture" />,
      ],
    },
    {
      shelf: 1,
      items: [
        <VinylStack key="vinyl" />,
        <ShelfBox
          key="ambient-vol-13"
          box={HERO_BOXES[4]}
          pulled={pulledId === "ambient-vol-13"}
          hidden={origin?.box.id === "ambient-vol-13"}
          reduced={reduced}
          onClick={onBoxClick}
          onPull={setPulled}
        />,
        <ShelfBox
          key="dark-fantasy-vol-3"
          box={HERO_BOXES[5]}
          pulled={pulledId === "dark-fantasy-vol-3"}
          hidden={origin?.box.id === "dark-fantasy-vol-3"}
          reduced={reduced}
          onClick={onBoxClick}
          onPull={setPulled}
        />,
        <ShelfBox
          key="spooky"
          box={HERO_BOXES[6]}
          pulled={pulledId === "spooky"}
          hidden={origin?.box.id === "spooky"}
          reduced={reduced}
          onClick={onBoxClick}
          onPull={setPulled}
        />,
        <Frame key="frame" />,
      ],
    },
  ];

  return (
    <section
      className="relative h-dvh min-h-[640px] overflow-hidden bg-bg"
      aria-label="Introduction"
    >
      <div
        ref={caseRef}
        className="bookcase-scene absolute inset-0"
        onPointerLeave={(e) => {
          if (e.pointerType === "touch" || origin) return;
          setPulled(null);
        }}
      >
        <div className="bookcase">
          <div className="bookcase-back" aria-hidden="true" />
          <div className="bookcase-rail bookcase-rail-left" aria-hidden="true" />
          <div className="bookcase-rail bookcase-rail-right" aria-hidden="true" />
          <div className="bookcase-shelves">
            {shelves.map((row) => (
              <div key={row.shelf} className="shelf">
                <div className="shelf-items">{row.items}</div>
                <div className="shelf-plank" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-r from-bg/80 via-bg/25 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-bg/85 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col justify-end px-[clamp(1.25rem,4vw,3.5rem)] pt-28 pb-16 pointer-events-none">
        <p className="label-kicker mb-5">Philadelphia</p>
        <h1 className="font-display text-[clamp(3.4rem,12vw,8.5rem)] font-extrabold leading-[0.86] tracking-[-0.04em] text-bone">
          JOHN
          <br />
          SWANSON
        </h1>
        <p className="mt-6 max-w-xl text-base text-bone/80 sm:text-lg">
          Graphic design, video,{" "}
          <em className="font-serif not-italic text-volt">and</em> marketing.
        </p>
        <div className="pointer-events-auto mt-8 flex flex-wrap gap-3">
          <Link
            href="#work"
            className="clip-shard-sm bg-ember px-5 py-3 text-[0.72rem] font-medium tracking-[0.18em] text-bone uppercase transition-colors hover:bg-ember/85"
          >
            View work
          </Link>
          <Link
            href="/contact"
            className="clip-shard-sm hairline bg-bg/40 px-5 py-3 text-[0.72rem] font-medium tracking-[0.18em] text-bone uppercase backdrop-blur-sm transition-colors hover:border-volt hover:text-volt"
          >
            Start a project
          </Link>
        </div>
        <p className="mt-8 text-[0.65rem] tracking-[0.2em] text-muted uppercase md:hidden">
          Tap a box to pull it — tap again to open
        </p>
        <p className="mt-8 hidden text-[0.65rem] tracking-[0.2em] text-muted uppercase md:block">
          Pull a box — click to open
        </p>
      </div>

      {origin ? (
        <BookCaseStudyOverlay
          origin={origin}
          reduced={reduced}
          onClose={closeBook}
        />
      ) : null}
    </section>
  );
}

function ShelfBox({
  box,
  pulled,
  hidden,
  priority = false,
  reduced,
  onClick,
  onPull,
}: {
  box: HeroBox;
  pulled: boolean;
  hidden: boolean;
  priority?: boolean;
  reduced: boolean;
  onClick: (e: MouseEvent<HTMLButtonElement>, box: HeroBox) => void;
  onPull: (id: string | null) => void;
}) {
  return (
    <button
      type="button"
      className={`hero-box ${pulled ? "is-pulled" : ""} ${hidden ? "is-opening" : ""}`}
      style={
        {
          "--box-scale": box.scale,
          "--art-ratio": box.width / box.height,
        } as CSSProperties
      }
      aria-label={`Open case study: ${box.title}`}
      aria-expanded={pulled}
      onClick={(e) => onClick(e, box)}
      onPointerEnter={(e) => {
        if (e.pointerType === "touch") return;
        onPull(box.id);
      }}
      onFocus={() => {
        if (reduced) return;
        onPull(box.id);
      }}
    >
      <Image
        src={box.src}
        alt=""
        fill
        priority={priority}
        sizes="(max-width: 768px) 45vw, 240px"
        className="hero-box-art"
      />
    </button>
  );
}

function Plant() {
  return (
    <div className="knick knick-plant" aria-hidden="true">
      <svg viewBox="0 0 64 84" className="h-full w-full">
        <ellipse cx="32" cy="78" rx="16" ry="5" fill="#c4a35a" opacity="0.55" />
        <path d="M18 78h28l-3-16H21z" fill="#c4a35a" />
        <path d="M21 78h22l-2-14H23z" fill="#8a6a32" />
        <path
          d="M32 62C26 40 8 38 16 18c10 14 14 28 16 44Z"
          fill="#5d7a62"
        />
        <path
          d="M32 62C36 36 54 34 48 14c-12 16-14 30-16 48Z"
          fill="#6f9174"
        />
        <path
          d="M32 62c-2-18 8-32 2-48 8 10 6 32-2 48Z"
          fill="#4a6550"
        />
      </svg>
    </div>
  );
}

function Candle() {
  return (
    <div className="knick knick-candle" aria-hidden="true">
      <span className="candle-flame" />
      <span className="candle-wick" />
      <span className="candle-body" />
      <span className="candle-base" />
    </div>
  );
}

function VinylStack() {
  return (
    <div className="knick knick-vinyl" aria-hidden="true">
      <span className="vinyl vinyl-a" />
      <span className="vinyl vinyl-b" />
      <span className="vinyl vinyl-c" />
    </div>
  );
}

function Sculpture() {
  return (
    <div className="knick knick-sculpture clip-shard" aria-hidden="true">
      <span className="h-3 w-3 bg-ember" />
    </div>
  );
}

function Frame() {
  return (
    <div className="knick knick-frame" aria-hidden="true">
      <span />
    </div>
  );
}
