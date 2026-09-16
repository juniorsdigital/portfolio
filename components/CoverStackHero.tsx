"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { HERO_COVERS, type HeroCover } from "@/lib/hero-covers";

export function CoverStackHero() {
  const stackRef = useRef<HTMLDivElement>(null);
  const pulledRef = useRef<string | null>(null);
  const openRef = useRef<string | null>(null);
  const pointerTypeRef = useRef<string>("mouse");
  const [pulledId, setPulledId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [reduced, setReduced] = useState(false);

  const setPulled = (id: string | null) => {
    pulledRef.current = id;
    setPulledId(id);
  };

  const setOpen = (id: string | null) => {
    openRef.current = id;
    setOpenId(id);
  };

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  const closeBook = useCallback(() => {
    setOpen(null);
  }, []);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      pointerTypeRef.current = e.pointerType;
      const node = e.target as Node | null;
      if (node && stackRef.current?.contains(node)) return;
      setOpen(null);
      setPulled(null);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onCoverClick = (cover: HeroCover) => {
    if (openRef.current === cover.id) {
      closeBook();
      return;
    }
    const twoStep =
      pointerTypeRef.current === "touch" || window.innerWidth < 720;
    if (twoStep && pulledRef.current !== cover.id) {
      setOpen(null);
      setPulled(cover.id);
      return;
    }
    setPulled(cover.id);
    setOpen(cover.id);
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
        {/* Drop-in: overwrite public/videos/she-who-flies-hero.mp4 */}
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
          if (e.pointerType === "touch" || openRef.current) return;
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
              open={openId === cover.id}
              priority={index === 0 || index >= HERO_COVERS.length - 3}
              reduced={reduced}
              onClick={onCoverClick}
              onClose={closeBook}
              onPull={setPulled}
              anotherOpen={openId !== null && openId !== cover.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StackCover({
  cover,
  index,
  pulled,
  open,
  priority,
  reduced,
  onClick,
  onClose,
  onPull,
  anotherOpen,
}: {
  cover: HeroCover;
  index: number;
  pulled: boolean;
  open: boolean;
  priority: boolean;
  reduced: boolean;
  onClick: (cover: HeroCover) => void;
  onClose: () => void;
  onPull: (id: string | null) => void;
  anotherOpen: boolean;
}) {
  const pageId = useId();

  return (
    <article
      className={`hero-book ${pulled ? "is-pulled" : ""} ${open ? "is-open" : ""}`}
      style={
        {
          "--art-ratio": cover.width / cover.height,
          "--z": index + 1,
        } as CSSProperties
      }
    >
      <div className="hero-book-stage">
        <div
          className="hero-book-page"
          id={pageId}
          aria-hidden={!open}
          inert={!open}
        >
          <button
            type="button"
            className="hero-book-close"
            onClick={onClose}
            aria-label={`Close ${cover.title}`}
          >
            ×
          </button>
          <p className="label-kicker">Pack</p>
          <h3 className="hero-book-title font-display">{cover.title}</h3>
          <p className="hero-book-process">{cover.process}</p>
          <div className="hero-book-links">
            <Link href={cover.contactHref} className="hero-book-link">
              Contact
            </Link>
            <a
              href={cover.storeHref}
              className="hero-book-link is-store"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ovani store
            </a>
          </div>
        </div>
        <div
          className="hero-book-cover"
          role="button"
          tabIndex={0}
          aria-label={open ? `Close pack: ${cover.title}` : `Open pack: ${cover.title}`}
          aria-expanded={open}
          aria-controls={pageId}
          onClick={() => onClick(cover)}
          onKeyDown={(e) => {
            if (e.key !== "Enter" && e.key !== " ") return;
            e.preventDefault();
            onClick(cover);
          }}
          onPointerEnter={(e) => {
            if (e.pointerType === "touch" || window.innerWidth < 720) return;
            if (anotherOpen) return;
            onPull(cover.id);
          }}
          onFocus={() => {
            if (reduced || anotherOpen) return;
            onPull(cover.id);
          }}
        >
          <span className="hero-book-cover-front">
            <Image
              src={cover.src}
              alt=""
              fill
              priority={priority}
              sizes="(max-width: 768px) 42vw, 280px"
              className="hero-cover-art"
            />
          </span>
          <span className="hero-book-cover-inside" aria-hidden="true">
            <Image
              src={cover.insideSrc}
              alt=""
              fill
              sizes="(max-width: 768px) 42vw, 280px"
              className="hero-inside-art"
            />
          </span>
        </div>
      </div>
    </article>
  );
}
