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
} from "react";
import {
  BookCaseStudyOverlay,
  type BookOrigin,
} from "@/components/BookCaseStudyOverlay";
import { HERO_COVERS, type HeroCover } from "@/lib/hero-covers";
import { PROJECTS } from "@/lib/projects";

const OVANI = PROJECTS.find((project) => project.id === "ovani");

export function CoverStackHero() {
  const stackRef = useRef<HTMLDivElement>(null);
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
      if (node && stackRef.current?.contains(node)) return;
      setPulled(null);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [origin]);

  const openCover = (cover: HeroCover, el: HTMLElement) => {
    if (!OVANI) return;
    const rect = el.getBoundingClientRect();
    setOrigin({
      cover,
      project: OVANI,
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    });
  };

  const closeCover = useCallback(() => {
    setOrigin(null);
  }, []);

  const onCoverClick = (
    e: MouseEvent<HTMLButtonElement>,
    cover: HeroCover,
  ) => {
    if (origin) return;
    const twoStep =
      pointerTypeRef.current === "touch" || window.innerWidth < 720;
    if (twoStep && pulledRef.current !== cover.id) {
      setPulled(cover.id);
      return;
    }
    openCover(cover, e.currentTarget);
  };

  return (
    <section
      className="cover-hero"
      aria-label="Introduction"
    >
      <div className="hero-footage" aria-hidden="true">
        <Image
          src="/images/hero-she-who-flies-poster.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero-footage-media"
        />
        <video
          className="hero-footage-media hero-footage-video"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/images/hero-she-who-flies-poster.jpg"
        >
          <source src="/videos/she-who-flies-hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-footage-veil" />
      </div>
      <div className="hero-copy pointer-events-none relative z-10 flex h-full w-full flex-col justify-center px-[clamp(1.25rem,4vw,3.5rem)] pt-28 pb-16">
        <p className="label-kicker mb-5">Philadelphia</p>
        <h1 className="font-display text-[clamp(2.4rem,6vw,5.2rem)] font-extrabold leading-[0.86] tracking-[-0.04em] text-bone">
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
          Tap a cover to pull it — tap again to open
        </p>
        <p className="mt-8 hidden text-[0.65rem] tracking-[0.2em] text-muted uppercase md:block">
          Pull a cover — click to open
        </p>
      </div>

      <div
        ref={stackRef}
        className="cover-stack"
        onPointerLeave={(e) => {
          if (e.pointerType === "touch" || origin) return;
          setPulled(null);
        }}
      >
        <div
          className="cover-stack-fan"
          style={{ "--count": HERO_COVERS.length } as CSSProperties}
        >
          {HERO_COVERS.map((cover, index) => (
            <StackCover
              key={cover.id}
              cover={cover}
              index={index}
              pulled={pulledId === cover.id}
              hidden={origin?.cover.id === cover.id}
              priority={index === 0 || index >= HERO_COVERS.length - 3}
              reduced={reduced}
              onClick={onCoverClick}
              onPull={setPulled}
            />
          ))}
        </div>
      </div>

      {origin ? (
        <BookCaseStudyOverlay
          origin={origin}
          reduced={reduced}
          onClose={closeCover}
        />
      ) : null}
    </section>
  );
}

function StackCover({
  cover,
  index,
  pulled,
  hidden,
  priority,
  reduced,
  onClick,
  onPull,
}: {
  cover: HeroCover;
  index: number;
  pulled: boolean;
  hidden: boolean;
  priority: boolean;
  reduced: boolean;
  onClick: (e: MouseEvent<HTMLButtonElement>, cover: HeroCover) => void;
  onPull: (id: string | null) => void;
}) {
  return (
    <button
      type="button"
      className={`hero-cover ${pulled ? "is-pulled" : ""} ${hidden ? "is-opening" : ""}`}
      style={
        {
          "--art-ratio": cover.width / cover.height,
          "--z": index + 1,
        } as CSSProperties
      }
      aria-label={`Open case study: ${cover.title}`}
      aria-expanded={pulled}
      onClick={(e) => onClick(e, cover)}
      onPointerEnter={(e) => {
        if (e.pointerType === "touch" || window.innerWidth < 720) return;
        onPull(cover.id);
      }}
      onFocus={() => {
        if (reduced) return;
        onPull(cover.id);
      }}
    >
      <Image
        src={cover.src}
        alt=""
        fill
        priority={priority}
        sizes="(max-width: 768px) 42vw, 280px"
        className="hero-cover-art"
      />
    </button>
  );
}
