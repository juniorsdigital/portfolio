"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ShardCaseStudyOverlay,
  type ShardOrigin,
} from "@/components/ShardCaseStudyOverlay";
import { HeroGlassGL } from "@/lib/hero-glass-gl";
import {
  IDENTITY_POSE,
  bboxOfPoints,
  buildMesh,
  expandedClip,
  hitShard,
  localPoint,
  originClip,
  poseForShard,
  projectHits,
  transformedPoints,
  type ProjectHit,
  type Pt,
  type Shard,
  type ShardPose,
} from "@/lib/hero-shards";
import { PROJECTS } from "@/lib/projects";

const HERO_SRC = "/images/about-portrait.png";

export function ShatteredHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLElement>(null);
  const glRef = useRef<HeroGlassGL | null>(null);
  const meshRef = useRef<Shard[]>([]);
  const hoverIdRef = useRef<string | null>(null);
  const openIdRef = useRef<string | null>(null);
  const cursorRef = useRef<Pt | null>(null);
  const reducedRef = useRef(false);
  const visibleRef = useRef(true);
  const rafRef = useRef<number>(0);
  const cursorStyleRef = useRef<"default" | "pointer">("default");
  const sizeRef = useRef({ w: 0, h: 0 });
  const posesRef = useRef<Map<string, ShardPose>>(new Map());
  const kickRef = useRef<() => void>(() => {});
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [cursor, setCursor] = useState<"default" | "pointer">("default");
  const [hits, setHits] = useState<ProjectHit[]>([]);
  const [origin, setOrigin] = useState<ShardOrigin | null>(null);

  const poseOf = useCallback((shard: Shard) => {
    return poseForShard(shard, cursorRef.current, sizeRef.current, {
      reduced: reducedRef.current,
      hoverId: hoverIdRef.current,
      openId: openIdRef.current,
    });
  }, []);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const gl = glRef.current;
    if (!canvas || !wrap || !gl) return;
    const rect = wrap.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    if (w === sizeRef.current.w && h === sizeRef.current.h && meshRef.current.length) {
      return;
    }
    sizeRef.current = { w, h };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    gl.resize(w, h, dpr);
    meshRef.current = buildMesh(w, h);
    gl.setMesh(meshRef.current);
    posesRef.current.clear();
    setHits(projectHits(meshRef.current));
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      reducedRef.current = media.matches;
      setReduced(media.matches);
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let gl: HeroGlassGL;
    try {
      gl = new HeroGlassGL(canvas);
    } catch {
      return;
    }
    glRef.current = gl;

    const img = new Image();
    img.src = HERO_SRC;
    const start = () => {
      gl.setPortrait(img);
      resize();
      setReady(true);
    };
    if (img.complete && img.naturalWidth > 0) start();
    else img.onload = start;

    PROJECTS.forEach((project, index) => {
      const preload = new Image();
      preload.src = project.thumbnail.src;
      const upload = () => gl.setProject(index, preload);
      if (preload.complete && preload.naturalWidth > 0) upload();
      else preload.onload = upload;
    });

    window.addEventListener("resize", resize);
    const wrap = wrapRef.current;
    const ro = wrap ? new ResizeObserver(resize) : null;
    if (wrap && ro) ro.observe(wrap);

    const io = wrap
      ? new IntersectionObserver(
          ([entry]) => {
            visibleRef.current = entry.isIntersecting;
            if (entry.isIntersecting) kickRef.current();
          },
          { threshold: 0.01 },
        )
      : null;
    if (wrap && io) io.observe(wrap);

    return () => {
      window.removeEventListener("resize", resize);
      ro?.disconnect();
      io?.disconnect();
      gl.destroy();
      glRef.current = null;
    };
  }, [resize]);

  useEffect(() => {
    if (!ready) return;
    let running = true;

    const poseOfSmoothed = (shard: Shard) => {
      const target = poseOf(shard);
      if (reducedRef.current) {
        posesRef.current.set(shard.id, target);
        return target;
      }
      const prev = posesRef.current.get(shard.id) ?? IDENTITY_POSE;
      const next: ShardPose = {
        ox: prev.ox + (target.ox - prev.ox) * 0.2,
        oy: prev.oy + (target.oy - prev.oy) * 0.2,
        rot: prev.rot + (target.rot - prev.rot) * 0.2,
        scale: prev.scale + (target.scale - prev.scale) * 0.2,
        reach: prev.reach + (target.reach - prev.reach) * 0.2,
        rx: prev.rx + (target.rx - prev.rx) * 0.2,
        ry: prev.ry + (target.ry - prev.ry) * 0.2,
        float: prev.float + (target.float - prev.float) * 0.2,
        tilt: prev.tilt + (target.tilt - prev.tilt) * 0.2,
      };
      posesRef.current.set(shard.id, next);
      return next;
    };

    const tick = () => {
      if (!running) return;
      const gl = glRef.current;
      if (gl && visibleRef.current) {
        gl.draw({
          time: performance.now(),
          cursor: openIdRef.current ? null : cursorRef.current,
          hoverId: hoverIdRef.current,
          openId: openIdRef.current,
          reduced: reducedRef.current,
          poseOf: poseOfSmoothed,
        });
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = 0;
      }
    };

    kickRef.current = () => {
      if (!running || rafRef.current) return;
      rafRef.current = requestAnimationFrame(tick);
    };
    kickRef.current();

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      kickRef.current = () => {};
    };
  }, [ready, poseOf]);

  const setHoverCursor = (next: "default" | "pointer") => {
    if (cursorStyleRef.current === next) return;
    cursorStyleRef.current = next;
    setCursor(next);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const point = localPoint(e, wrap);
    if (!openIdRef.current) cursorRef.current = point;
    const hit = hitShard(meshRef.current, point, poseOf);
    if (openIdRef.current) {
      setHoverCursor(hit?.projectId ? "pointer" : "default");
      return;
    }
    hoverIdRef.current = hit?.id ?? null;
    setHoverCursor(hit?.projectId ? "pointer" : "default");
  };

  const onPointerLeave = () => {
    if (!openIdRef.current) {
      hoverIdRef.current = null;
      cursorRef.current = null;
    }
    setHoverCursor("default");
  };

  const openProject = (projectId: string) => {
    const shard = meshRef.current.find((item) => item.projectId === projectId);
    const gl = glRef.current;
    const wrap = wrapRef.current;
    const project = PROJECTS.find((item) => item.id === projectId);
    if (!shard || !gl || !wrap || !project) return;
    const rect = wrap.getBoundingClientRect();
    const pose = poseOf(shard);
    const pts = transformedPoints(shard, pose);
    const bbox = bboxOfPoints(pts);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    gl.draw({
      time: performance.now(),
      cursor: cursorRef.current,
      hoverId: shard.id,
      openId: null,
      reduced: reducedRef.current,
      poseOf,
    });
    openIdRef.current = projectId;
    hoverIdRef.current = shard.id;
    setOrigin({
      project,
      left: rect.left + bbox.x,
      top: rect.top + bbox.y,
      width: bbox.w,
      height: bbox.h,
      clip: originClip(pts, bbox),
      openClip: expandedClip(shard.points, shard.cx, shard.cy),
      snapshot: gl.capture(bbox, dpr),
    });
  };

  const onLayerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const hit = hitShard(meshRef.current, localPoint(e, wrap), poseOf);
    if (hit?.projectId) openProject(hit.projectId);
  };

  const closeProject = useCallback(() => {
    openIdRef.current = null;
    setOrigin(null);
  }, []);

  return (
    <section
      ref={wrapRef}
      className="relative h-dvh min-h-[640px] overflow-hidden bg-bg"
      aria-label="Introduction"
      style={{ cursor }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_SRC}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          ready ? "opacity-0" : "opacity-50"
        }`}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      />
      {ready ? (
        <div
          className="absolute inset-0 z-[5]"
          style={{ cursor }}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          onClick={onLayerClick}
        />
      ) : null}
      {ready
        ? hits.map((shard) => (
            <button
              key={shard.projectId}
              type="button"
              aria-label={`Open case study: ${shard.title}`}
              className="pointer-events-none absolute z-[6] bg-transparent focus-visible:pointer-events-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt"
              style={{
                left: shard.bbox.x,
                top: shard.bbox.y,
                width: shard.bbox.w,
                height: shard.bbox.h,
                clipPath: shard.clip,
              }}
              onClick={() => openProject(shard.projectId)}
            />
          ))
        : null}

      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-r from-bg/65 via-bg/15 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-bg/80 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full max-w-6xl flex-col justify-end px-[clamp(1.25rem,4vw,3.5rem)] pb-16 pt-28 mx-auto w-full pointer-events-none">
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
          Tap a glass shard — a lit pane opens the work
        </p>
        <p className="mt-8 hidden text-[0.65rem] tracking-[0.2em] text-muted uppercase md:block">
          Hover the glass — click a lit pane to open the work
        </p>
      </div>

      {origin ? (
        <ShardCaseStudyOverlay
          origin={origin}
          reduced={reduced}
          onClose={closeProject}
        />
      ) : null}
    </section>
  );
}
