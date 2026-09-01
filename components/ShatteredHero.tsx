"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type Pt = { x: number; y: number };

type Triangle = {
  a: Pt;
  b: Pt;
  c: Pt;
  cx: number;
  cy: number;
  dx: number;
  dy: number;
  rot: number;
  assemble: number;
};

function hash(x: number, y: number, seed: number) {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 45.164) * 43758.5453;
  return n - Math.floor(n);
}

function buildMesh(w: number, h: number): Triangle[] {
  const cols = w < 700 ? 6 : 9;
  const rows = w < 700 ? 5 : 6;
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
        const cx = (a.x + b.x + c.x) / 3;
        const cy = (a.y + b.y + c.y) / 3;
        const ang = hash(cx, cy, 4) * Math.PI * 2;
        const dist = 36 + hash(cx, cy, 5) * 70;
        tris.push({
          a,
          b,
          c,
          cx,
          cy,
          dx: Math.cos(ang) * dist + (cx - w / 2) * 0.1,
          dy: Math.sin(ang) * dist + (cy - h / 2) * 0.1,
          rot: (hash(cx, cy, 6) - 0.5) * 0.55,
          assemble: 0,
        });
      }
    }
  }
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

export function ShatteredHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const meshRef = useRef<Triangle[]>([]);
  const pointerRef = useRef<{ x: number; y: number; inside: boolean }>({
    x: 0,
    y: 0,
    inside: false,
  });
  const lockedRef = useRef(false);
  const reducedRef = useRef(false);
  const rafRef = useRef<number>(0);
  const [ready, setReady] = useState(false);
  const [locked, setLocked] = useState(false);
  const [reduced, setReduced] = useState(false);

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
    img.src = "/images/about-portrait.png";
    const start = () => {
      imgRef.current = img;
      resize();
      setReady(true);
    };
    if (img.complete && img.naturalWidth > 0) start();
    else img.onload = start;

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
    if (!ready || reduced) return;
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
      const pointer = pointerRef.current;
      const hovering = lockedRef.current || pointer.inside;

      for (const tri of mesh) {
        const dist = Math.hypot(tri.cx - pointer.x, tri.cy - pointer.y);
        const target = hovering ? 1 : 0;
        const speed = hovering
          ? 0.16 / (1 + dist / 280)
          : 0.09 / (1 + dist / 420);
        tri.assemble += (target - tri.assemble) * speed;
        if (Math.abs(target - tri.assemble) < 0.002) tri.assemble = target;

        const t = tri.assemble;
        const ease = t * t * (3 - 2 * t);
        const scale = 0.82 + 0.18 * ease;
        ctx.save();
        ctx.translate(tri.cx + tri.dx * (1 - ease), tri.cy + tri.dy * (1 - ease));
        ctx.rotate(tri.rot * (1 - ease));
        ctx.scale(scale, scale);
        ctx.translate(-tri.cx, -tri.cy);
        ctx.beginPath();
        ctx.moveTo(tri.a.x, tri.a.y);
        ctx.lineTo(tri.b.x, tri.b.y);
        ctx.lineTo(tri.c.x, tri.c.y);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, cover.x, cover.y, cover.w, cover.h);
        ctx.strokeStyle = `rgba(230, 225, 214, ${0.72 * (1 - ease)})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [ready, reduced]);

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    pointerRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      inside: true,
    };
  };

  const onPointerLeave = () => {
    pointerRef.current.inside = false;
  };

  const onToggleLock = () => {
    lockedRef.current = !lockedRef.current;
    pointerRef.current.inside = lockedRef.current;
    setLocked(lockedRef.current);
  };

  return (
    <section
      ref={wrapRef}
      className="relative h-dvh min-h-[640px] overflow-hidden bg-bg"
      aria-label="Introduction"
      onPointerMove={reduced ? undefined : onPointerMove}
      onPointerEnter={reduced ? undefined : onPointerMove}
      onPointerLeave={reduced ? undefined : onPointerLeave}
      onClick={reduced ? undefined : onToggleLock}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/about-portrait.png"
        alt=""
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          reduced ? "opacity-100" : ready ? "opacity-0" : "opacity-50"
        }`}
      />
      {reduced ? null : (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full cursor-crosshair"
          aria-hidden="true"
        />
      )}

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
            onClick={(e) => e.stopPropagation()}
          >
            View work
          </Link>
          <Link
            href="/contact"
            className="clip-shard-sm hairline bg-bg/40 px-5 py-3 text-[0.72rem] font-medium tracking-[0.18em] text-bone uppercase backdrop-blur-sm transition-colors hover:border-volt hover:text-volt"
            onClick={(e) => e.stopPropagation()}
          >
            Start a project
          </Link>
        </div>
        {!reduced ? (
          <p className="mt-8 text-[0.65rem] tracking-[0.2em] text-muted uppercase md:hidden">
            {locked ? "Tap to shatter" : "Tap to rebuild the pane"}
          </p>
        ) : null}
        {!reduced ? (
          <p className="mt-8 hidden text-[0.65rem] tracking-[0.2em] text-muted uppercase md:block">
            {locked
              ? "Click to shatter"
              : "Hover a shard — the pane rebuilds. Click to lock."}
          </p>
        ) : null}
      </div>
    </section>
  );
}
