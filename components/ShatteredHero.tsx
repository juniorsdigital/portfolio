"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ShardCaseStudyOverlay,
  type ShardOrigin,
} from "@/components/ShardCaseStudyOverlay";
import { PROJECTS } from "@/lib/projects";

const HERO_SRC = "/images/about-portrait.png";
const LIGHT = { x: -0.45, y: -0.89 };

type Pt = { x: number; y: number };

type Triangle = {
  id: string;
  a: Pt;
  b: Pt;
  c: Pt;
  cx: number;
  cy: number;
  projectId?: string;
};

type ProjectHit = {
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

function bboxOfPoints(points: Pt[]) {
  const xs = points.map((pt) => pt.x);
  const ys = points.map((pt) => pt.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  return {
    x: minX,
    y: minY,
    w: Math.max(...xs) - minX,
    h: Math.max(...ys) - minY,
  };
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

function outwardMid(p: Pt, q: Pt, centroid: Pt, amount: number): Pt {
  const mx = (p.x + q.x) / 2;
  const my = (p.y + q.y) / 2;
  let nx = q.y - p.y;
  let ny = p.x - q.x;
  const len = Math.hypot(nx, ny) || 1;
  nx /= len;
  ny /= len;
  if ((mx - centroid.x) * nx + (my - centroid.y) * ny < 0) {
    nx = -nx;
    ny = -ny;
  }
  return { x: mx + nx * amount, y: my + ny * amount };
}

function shardHex(tri: Triangle, midOutset: number): Pt[] {
  const centroid = { x: tri.cx, y: tri.cy };
  return [
    tri.a,
    outwardMid(tri.a, tri.b, centroid, midOutset),
    tri.b,
    outwardMid(tri.b, tri.c, centroid, midOutset),
    tri.c,
    outwardMid(tri.c, tri.a, centroid, midOutset),
  ];
}

function originClip(tri: Triangle, box: { x: number; y: number; w: number; h: number }) {
  return polygonClip(shardHex(tri, 0), box);
}

function expandedClip(tri: Triangle) {
  const span = Math.min(bboxOf(tri.a, tri.b, tri.c).w, bboxOf(tri.a, tri.b, tri.c).h);
  const points = shardHex(tri, span * 0.42);
  const box = bboxOfPoints(points);
  const padX = box.w * 0.04;
  const padY = box.h * 0.04;
  return polygonClip(points, {
    x: box.x - padX,
    y: box.y - padY,
    w: box.w + padX * 2,
    h: box.h + padY * 2,
  });
}

function projectHits(mesh: Triangle[]): ProjectHit[] {
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

function pointInTri(p: Pt, tri: Triangle) {
  const { a, b, c } = tri;
  const d = (b.y - c.y) * (a.x - c.x) + (c.x - b.x) * (a.y - c.y);
  if (d === 0) return false;
  const u = ((b.y - c.y) * (p.x - c.x) + (c.x - b.x) * (p.y - c.y)) / d;
  const v = ((c.y - a.y) * (p.x - c.x) + (a.x - c.x) * (p.y - c.y)) / d;
  const w = 1 - u - v;
  return u >= 0 && v >= 0 && w >= 0;
}

function hitTriangle(mesh: Triangle[], p: Pt) {
  for (let i = mesh.length - 1; i >= 0; i -= 1) {
    if (pointInTri(p, mesh[i])) return mesh[i];
  }
  return null;
}

function lightVertex(tri: Triangle) {
  let best = tri.a;
  let bestDot = -Infinity;
  for (const v of [tri.a, tri.b, tri.c]) {
    const d = (v.x - tri.cx) * LIGHT.x + (v.y - tri.cy) * LIGHT.y;
    if (d > bestDot) {
      bestDot = d;
      best = v;
    }
  }
  return best;
}

function assignProjects(tris: Triangle[], w: number, h: number) {
  const anchors = [
    [0.64, 0.22],
    [0.84, 0.26],
    [0.72, 0.44],
    [0.9, 0.52],
    [0.78, 0.68],
  ];
  const minArea = (w * h) / 140;
  const minDist = Math.min(w, h) * 0.14;
  const used = new Set<number>();

  const pick = (tx: number, ty: number, requireSpread: boolean) => {
    let best = -1;
    let bestScore = Infinity;
    tris.forEach((tri, idx) => {
      if (used.has(idx)) return;
      if (triArea(tri) < minArea) return;
      if (tri.cx < w * 0.58 || tri.cx > w * 0.96) return;
      if (tri.cy < h * 0.12 || tri.cy > h * 0.78) return;
      if (requireSpread) {
        for (const other of used) {
          const prev = tris[other];
          if (Math.hypot(tri.cx - prev.cx, tri.cy - prev.cy) < minDist) return;
        }
      }
      const dist = Math.hypot(tri.cx / w - tx, tri.cy / h - ty);
      const score = dist - triArea(tri) / (w * h);
      if (score < bestScore) {
        bestScore = score;
        best = idx;
      }
    });
    return best;
  };

  PROJECTS.forEach((project, i) => {
    const [tx, ty] = anchors[i] ?? [0.7, 0.45];
    let best = pick(tx, ty, true);
    if (best < 0) best = pick(tx, ty, false);
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
          id: `s${tris.length}`,
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

function pathTri(ctx: CanvasRenderingContext2D, tri: Triangle) {
  ctx.beginPath();
  ctx.moveTo(tri.a.x, tri.a.y);
  ctx.lineTo(tri.b.x, tri.b.y);
  ctx.lineTo(tri.c.x, tri.c.y);
  ctx.closePath();
}

function localPoint(e: { clientX: number; clientY: number }, wrap: HTMLElement) {
  const rect = wrap.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
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
  const cursorRef = useRef<"default" | "pointer">("default");
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [cursor, setCursor] = useState<"default" | "pointer">("default");
  const [hits, setHits] = useState<ProjectHit[]>([]);
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
      const now = performance.now();
      let hovered: Triangle | null = null;

      const drawTri = (tri: Triangle) => {
        const isHot = Boolean(tri.projectId);
        const isHover = tri.id === hoverId && !openId;
        const lifted = isHover && !reducedRef.current;
        const dimmed = Boolean(openId) && tri.projectId !== openId;
        const hoverScale = isHot ? 1.05 : 1.07;

        ctx.save();
        if (lifted) {
          ctx.translate(tri.cx, tri.cy);
          ctx.scale(hoverScale, hoverScale);
          ctx.translate(-tri.cx, -tri.cy);
        }

        pathTri(ctx, tri);
        ctx.save();
        ctx.clip();

        if (lifted) {
          ctx.translate(LIGHT.x * 5, LIGHT.y * 5);
        }
        ctx.drawImage(img, cover.x, cover.y, cover.w, cover.h);
        if (lifted) {
          ctx.translate(-LIGHT.x * 5, -LIGHT.y * 5);
        }

        const lit = lightVertex(tri);
        const wash = ctx.createLinearGradient(lit.x, lit.y, tri.cx, tri.cy);
        if (isHover) {
          wash.addColorStop(0, "rgba(255, 255, 255, 0.38)");
          wash.addColorStop(0.28, "rgba(122, 168, 196, 0.2)");
          wash.addColorStop(0.7, "rgba(255, 255, 255, 0.04)");
          wash.addColorStop(1, "rgba(255, 255, 255, 0)");
        } else if (isHot) {
          wash.addColorStop(0, "rgba(214, 255, 58, 0.12)");
          wash.addColorStop(0.4, "rgba(196, 163, 90, 0.06)");
          wash.addColorStop(1, "rgba(255, 255, 255, 0)");
        } else {
          wash.addColorStop(0, "rgba(230, 225, 214, 0.1)");
          wash.addColorStop(0.45, "rgba(122, 168, 196, 0.05)");
          wash.addColorStop(1, "rgba(255, 255, 255, 0)");
        }
        ctx.fillStyle = wash;
        ctx.fill();

        if (dimmed) {
          ctx.fillStyle = "rgba(7, 8, 9, 0.48)";
          ctx.fill();
        } else if (isHot && !isHover) {
          ctx.fillStyle = "rgba(214, 255, 58, 0.045)";
          ctx.fill();
        }

        if (isHover && !reducedRef.current) {
          const box = bboxOf(tri.a, tri.b, tri.c);
          const span = Math.max(box.w, box.h) * 1.35;
          const s = (now / 1600) % 1;
          const dx = LIGHT.y;
          const dy = -LIGHT.x;
          const gx = tri.cx + dx * (s * 2 - 1) * span;
          const gy = tri.cy + dy * (s * 2 - 1) * span;
          const glint = ctx.createLinearGradient(
            gx - dx * 28,
            gy - dy * 28,
            gx + dx * 28,
            gy + dy * 28,
          );
          glint.addColorStop(0, "rgba(255, 255, 255, 0)");
          glint.addColorStop(0.42, "rgba(255, 255, 255, 0)");
          glint.addColorStop(0.5, "rgba(255, 255, 255, 0.42)");
          glint.addColorStop(
            0.54,
            isHot ? "rgba(214, 255, 58, 0.22)" : "rgba(122, 168, 196, 0.16)",
          );
          glint.addColorStop(0.62, "rgba(255, 255, 255, 0)");
          glint.addColorStop(1, "rgba(255, 255, 255, 0)");
          ctx.fillStyle = glint;
          ctx.fill();
        }
        ctx.restore();

        const edges: [Pt, Pt][] = [
          [tri.a, tri.b],
          [tri.b, tri.c],
          [tri.c, tri.a],
        ];
        for (const [p, q] of edges) {
          const mx = (p.x + q.x) / 2;
          const my = (p.y + q.y) / 2;
          let nx = q.y - p.y;
          let ny = p.x - q.x;
          const len = Math.hypot(nx, ny) || 1;
          nx /= len;
          ny /= len;
          if ((mx - tri.cx) * nx + (my - tri.cy) * ny < 0) {
            nx = -nx;
            ny = -ny;
          }
          const facing = Math.max(0, nx * LIGHT.x + ny * LIGHT.y);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.shadowColor = "rgba(0, 0, 0, 0)";
          ctx.shadowBlur = 0;
          if (isHover) {
            if (isHot) {
              ctx.strokeStyle = `rgba(214, 255, 58, ${0.5 + facing * 0.5})`;
              ctx.shadowColor = "rgba(214, 255, 58, 0.9)";
              ctx.shadowBlur = 16 + facing * 14;
            } else {
              ctx.strokeStyle = `rgba(245, 248, 255, ${0.55 + facing * 0.45})`;
              ctx.shadowColor = `rgba(180, 220, 255, ${0.4 + facing * 0.5})`;
              ctx.shadowBlur = 14 + facing * 18;
            }
            ctx.lineWidth = 1.6 + facing * 1.2;
          } else if (isHot) {
            ctx.strokeStyle = `rgba(214, 255, 58, ${0.38 + facing * 0.38})`;
            ctx.shadowColor = "rgba(214, 255, 58, 0.42)";
            ctx.shadowBlur = 10;
            ctx.lineWidth = 1.35;
          } else {
            ctx.strokeStyle = `rgba(230, 225, 214, ${0.12 + facing * 0.32})`;
            ctx.lineWidth = 0.85 + facing * 0.55;
          }
          ctx.stroke();
        }
        ctx.restore();
      };

      for (const tri of mesh) {
        if (tri.id === hoverId) {
          hovered = tri;
          continue;
        }
        drawTri(tri);
      }
      if (hovered) drawTri(hovered);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [ready]);

  const setHoverCursor = (next: "default" | "pointer") => {
    if (cursorRef.current === next) return;
    cursorRef.current = next;
    setCursor(next);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const hit = hitTriangle(meshRef.current, localPoint(e, wrap));
    if (openIdRef.current) {
      setHoverCursor(hit?.projectId ? "pointer" : "default");
      return;
    }
    hoverIdRef.current = hit?.id ?? null;
    setHoverCursor(hit?.projectId ? "pointer" : "default");
  };

  const onPointerLeave = () => {
    if (!openIdRef.current) hoverIdRef.current = null;
    setHoverCursor("default");
  };

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
    hoverIdRef.current = tri.id;
    setOrigin({
      project,
      left: rect.left + bbox.x,
      top: rect.top + bbox.y,
      width: bbox.w,
      height: bbox.h,
      clip: originClip(tri, bbox),
      openClip: expandedClip(tri),
      snapshot: url,
    });
  };

  const onLayerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const hit = hitTriangle(meshRef.current, localPoint(e, wrap));
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
          Tap any shard — a lit pane opens the work
        </p>
        <p className="mt-8 hidden text-[0.65rem] tracking-[0.2em] text-muted uppercase md:block">
          Hover any shard — click a lit pane to open the work
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
