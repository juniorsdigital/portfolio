"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ShardCaseStudyOverlay,
  type ShardOrigin,
} from "@/components/ShardCaseStudyOverlay";
import { PROJECTS } from "@/lib/projects";

const HERO_SRC = "/images/about-portrait.png";

type Pt = { x: number; y: number };

type Triangle = {
  a: Pt;
  b: Pt;
  c: Pt;
  cx: number;
  cy: number;
  projectId?: string;
};

type HotShard = {
  projectId: string;
  title: string;
  bbox: { x: number; y: number; w: number; h: number };
  clip: string;
};

function hash(x: number, y: number, seed: number) {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 45.164) * 43758.5453;
  return n - Math.floor(n);
}

function triArea(tri: Triangle) {
  return Math.abs(
    (tri.a.x * (tri.b.y - tri.c.y) +
      tri.b.x * (tri.c.y - tri.a.y) +
      tri.c.x * (tri.a.y - tri.b.y)) /
      2,
  );
}

function bboxOf(a: Pt, b: Pt, c: Pt) {
  const minX = Math.min(a.x, b.x, c.x);
  const maxX = Math.max(a.x, b.x, c.x);
  const minY = Math.min(a.y, b.y, c.y);
  const maxY = Math.max(a.y, b.y, c.y);
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

function mid(p: Pt, q: Pt): Pt {
  return { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
}

function polygonClip(points: Pt[], box: { x: number; y: number; w: number; h: number }) {
  return `polygon(${points
    .map((pt) => {
      const x = box.w === 0 ? 0 : ((pt.x - box.x) / box.w) * 100;
      const y = box.h === 0 ? 0 : ((pt.y - box.y) / box.h) * 100;
      return `${x.toFixed(2)}% ${y.toFixed(2)}%`;
    })
    .join(", ")})`;
}

function assignProjects(tris: Triangle[], w: number, h: number) {
  const anchors = [
    [0.56, 0.26],
    [0.8, 0.34],
    [0.66, 0.5],
    [0.84, 0.62],
    [0.52, 0.58],
  ];
  const used = new Set<number>();
  const minArea = (w * h) / 90;

  PROJECTS.forEach((project, i) => {
    const [tx, ty] = anchors[i] ?? [0.5, 0.5];
    let best = -1;
    let bestScore = Infinity;
    tris.forEach((tri, idx) => {
      if (used.has(idx)) return;
      if (triArea(tri) < minArea) return;
      if (
        tri.cx < w * 0.08 ||
        tri.cx > w * 0.92 ||
        tri.cy < h * 0.14 ||
        tri.cy > h * 0.88
      ) {
        return;
      }
      const dist = Math.hypot(tri.cx / w - tx, tri.cy / h - ty);
      const score = dist - triArea(tri) / (w * h);
      if (score < bestScore) {
        bestScore = score;
        best = idx;
      }
    });
    if (best >= 0) {
      used.add(best);
      tris[best].projectId = project.id;
    }
  });
}

function buildMesh(w: number, h: number): Triangle[] {
  const cols = w < 700 ? 5 : 8;
  const rows = w < 700 ? 4 : 5;
  const pts: Pt[][] = [];

  for (let y = 0; y <= rows; y += 1) {
    const row: Pt[] = [];
    for (let x = 0; x <= cols; x += 1) {
      const edgeX = x === 0 || x === cols;
      const edgeY = y === 0 || y === rows;
      const jx = edgeX ? 0 : (hash(x, y, 1) - 0.5) * (w / cols) * 0.62;
      const jy = edgeY ? 0 : (hash(x, y, 2) - 0.5) * (h / rows) * 0.62;
      row.push({ x: (x / cols) * w + jx, y: (y / rows) * h + jy });
    }
    pts.push(row);
  }

  const tris: Triangle[] = [];
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const p00 = pts[y][x];
      const p10 = pts[y][x + 1];
      const p01 = pts[y + 1][x];
      const p11 = pts[y + 1][x + 1];
      const flip = hash(x, y, 3) > 0.5;
      const pair = flip
        ? [
            [p00, p10, p11],
            [p00, p11, p01],
          ]
        : [
            [p00, p10, p01],
            [p10, p11, p01],
          ];

      for (const [a, b, c] of pair) {
        tris.push({
          a,
          b,
          c,
          cx: (a.x + b.x + c.x) / 3,
          cy: (a.y + b.y + c.y) / 3,
        });
      }
    }
  }

  assignProjects(tris, w, h);
  return tris;
}

function coverRect(
  imgW: number,
  imgH: number,
  canvasW: number,
  canvasH: number,
) {
  const scale = Math.max(canvasW / imgW, canvasH / imgH);
  const dw = imgW * scale;
  const dh = imgH * scale;
  return { x: (canvasW - dw) / 2, y: (canvasH - dh) / 2, w: dw, h: dh };
}

function captureShard(
  img: HTMLImageElement,
  tri: Triangle,
  cover: { x: number; y: number; w: number; h: number },
  dpr: number,
) {
  const bbox = bboxOf(tri.a, tri.b, tri.c);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.ceil(bbox.w * dpr));
  canvas.height = Math.max(1, Math.ceil(bbox.h * dpr));
  const ctx = canvas.getContext("2d");
  if (!ctx) return { url: "", bbox };
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.translate(-bbox.x, -bbox.y);
  ctx.beginPath();
  ctx.moveTo(tri.a.x, tri.a.y);
  ctx.lineTo(tri.b.x, tri.b.y);
  ctx.lineTo(tri.c.x, tri.c.y);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img, cover.x, cover.y, cover.w, cover.h);
  return { url: canvas.toDataURL("image/png"), bbox };
}

function hotList(mesh: Triangle[]): HotShard[] {
  return mesh.flatMap((tri) => {
    if (!tri.projectId) return [];
    const project = PROJECTS.find((item) => item.id === tri.projectId);
    if (!project) return [];
    const bbox = bboxOf(tri.a, tri.b, tri.c);
    return [
      {
        projectId: project.id,
        title: project.title,
        bbox,
        clip: polygonClip([tri.a, tri.b, tri.c], bbox),
      },
    ];
  });
}

export function ShatteredHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const meshRef = useRef<Triangle[]>([]);
  const hoverIdRef = useRef<string | null>(null);
  const openIdRef = useRef<string | null>(null);
  const reducedRef = useRef(false);
  const rafRef = useRef<number>(0);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [hotShards, setHotShards] = useState<HotShard[]>([]);
  const [origin, setOrigin] = useState<ShardOrigin | null>(null);
  const sizeRef = useRef({ w: 0, h: 0 });

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const rect = wrap.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    if (w === sizeRef.current.w && h === sizeRef.current.h && meshRef.current.length) {
      return;
    }
    sizeRef.current = { w, h };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    meshRef.current = buildMesh(w, h);
    setHotShards(hotList(meshRef.current));
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      reducedRef.current = media.matches;
      setReduced(media.matches);
    };
    apply();
    media.addEventListener("change", apply);
    return () => {
      media.removeEventListener("change", apply);
    };
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = HERO_SRC;
    const start = () => {
      imgRef.current = img;
      resize();
      setReady(true);
    };
    if (img.complete && img.naturalWidth > 0) start();
    else img.onload = start;

    for (const project of PROJECTS) {
      const preload = new Image();
      preload.src = project.thumbnail.src;
    }

    window.addEventListener("resize", resize);
    const wrap = wrapRef.current;
    const ro = wrap ? new ResizeObserver(resize) : null;
    if (wrap && ro) ro.observe(wrap);
    return () => {
      window.removeEventListener("resize", resize);
      ro?.disconnect();
    };
  }, [resize]);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tick = () => {
      const wrap = wrapRef.current;
      if (!wrap) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const { width, height } = wrap.getBoundingClientRect();
      const img = imgRef.current;
      const mesh = meshRef.current;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#070809";
      ctx.fillRect(0, 0, width, height);

      if (!img || mesh.length === 0) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const cover = coverRect(img.naturalWidth, img.naturalHeight, width, height);
      const hoverId = hoverIdRef.current;
      const openId = openIdRef.current;
      const rest = mesh.filter((tri) => tri.projectId !== hoverId);
      const hovered = mesh.filter((tri) => tri.projectId && tri.projectId === hoverId);

      const drawTri = (tri: Triangle) => {
        const isHot = Boolean(tri.projectId);
        const isHover = isHot && tri.projectId === hoverId && !openId;
        const lifted = isHover && !reducedRef.current;

        ctx.save();
        if (lifted) {
          ctx.translate(tri.cx, tri.cy);
          ctx.scale(1.045, 1.045);
          ctx.translate(-tri.cx, -tri.cy);
        }

        ctx.beginPath();
        ctx.moveTo(tri.a.x, tri.a.y);
        ctx.lineTo(tri.b.x, tri.b.y);
        ctx.lineTo(tri.c.x, tri.c.y);
        ctx.closePath();
        ctx.save();
        ctx.clip();
        ctx.drawImage(img, cover.x, cover.y, cover.w, cover.h);
        if (openId) {
          ctx.fillStyle = "rgba(7, 8, 9, 0.48)";
          ctx.fill();
        } else if (isHover) {
          ctx.fillStyle = "rgba(214, 255, 58, 0.14)";
          ctx.fill();
        } else if (isHot) {
          ctx.fillStyle = "rgba(196, 163, 90, 0.06)";
          ctx.fill();
        }
        ctx.restore();

        ctx.beginPath();
        ctx.moveTo(tri.a.x, tri.a.y);
        ctx.lineTo(tri.b.x, tri.b.y);
        ctx.lineTo(tri.c.x, tri.c.y);
        ctx.closePath();
        if (isHover) {
          ctx.shadowColor = "rgba(214, 255, 58, 0.95)";
          ctx.shadowBlur = 26;
          ctx.strokeStyle = "rgba(214, 255, 58, 0.95)";
          ctx.lineWidth = 2.1;
        } else if (isHot) {
          ctx.shadowColor = "rgba(214, 255, 58, 0.28)";
          ctx.shadowBlur = 8;
          ctx.strokeStyle = "rgba(214, 255, 58, 0.42)";
          ctx.lineWidth = 1.35;
        } else {
          ctx.strokeStyle = "rgba(230, 225, 214, 0.2)";
          ctx.lineWidth = 1;
        }
        ctx.stroke();
        ctx.restore();
      };

      for (const tri of rest) drawTri(tri);
      for (const tri of hovered) drawTri(tri);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [ready]);

  const openProject = (projectId: string) => {
    const tri = meshRef.current.find((item) => item.projectId === projectId);
    const img = imgRef.current;
    const wrap = wrapRef.current;
    const project = PROJECTS.find((item) => item.id === projectId);
    if (!tri || !img || !wrap || !project) return;
    const rect = wrap.getBoundingClientRect();
    const cover = coverRect(
      img.naturalWidth,
      img.naturalHeight,
      rect.width,
      rect.height,
    );
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { url, bbox } = captureShard(img, tri, cover, dpr);
    openIdRef.current = projectId;
    hoverIdRef.current = projectId;
    setOrigin({
      project,
      left: rect.left + bbox.x,
      top: rect.top + bbox.y,
      width: bbox.w,
      height: bbox.h,
      clip: polygonClip([tri.a, mid(tri.a, tri.b), tri.b, mid(tri.b, tri.c), tri.c, mid(tri.c, tri.a)], bbox),
      snapshot: url,
    });
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
      {ready
        ? hotShards.map((shard) => (
            <button
              key={shard.projectId}
              type="button"
              aria-label={`Open case study: ${shard.title}`}
              className="absolute z-[5] cursor-pointer bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt"
              style={{
                left: shard.bbox.x,
                top: shard.bbox.y,
                width: shard.bbox.w,
                height: shard.bbox.h,
                clipPath: shard.clip,
              }}
              onPointerEnter={() => {
                hoverIdRef.current = shard.projectId;
              }}
              onPointerLeave={() => {
                if (hoverIdRef.current === shard.projectId && !openIdRef.current) {
                  hoverIdRef.current = null;
                }
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
          Tap a lit shard to open a project
        </p>
        <p className="mt-8 hidden text-[0.65rem] tracking-[0.2em] text-muted uppercase md:block">
          Hover a lit shard — click to open the work
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
