import { PROJECTS } from "@/lib/projects";

export type Pt = { x: number; y: number };

export type BBox = { x: number; y: number; w: number; h: number };

export type Shard = {
  id: string;
  points: Pt[];
  cx: number;
  cy: number;
  seed: number;
  area: number;
  projectId?: string;
};

export type ProjectHit = {
  projectId: string;
  title: string;
  bbox: BBox;
  clip: string;
};

export type ShardPose = {
  ox: number;
  oy: number;
  rot: number;
  scale: number;
  reach: number;
  rx: number;
  ry: number;
  float: number;
  tilt: number;
};

export const IDENTITY_POSE: ShardPose = {
  ox: 0,
  oy: 0,
  rot: 0,
  scale: 1,
  reach: 0,
  rx: 0,
  ry: 0,
  float: 0,
  tilt: 0,
};

/** Keep in sync with the vertex shader in hero-glass-gl.ts */
export const GLASS = {
  deadzone: 10,
  tiltIn: 40,
  maxTilt: 0.72,
  maxFloat: 24,
  focal: 250,
  edgePop: 11,
} as const;

function hermite(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

const EPS = 1e-8;

export function hash(x: number, y: number, seed: number) {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 45.164) * 43758.5453;
  return n - Math.floor(n);
}

export function bboxOfPoints(points: Pt[]): BBox {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const pt of points) {
    if (pt.x < minX) minX = pt.x;
    if (pt.y < minY) minY = pt.y;
    if (pt.x > maxX) maxX = pt.x;
    if (pt.y > maxY) maxY = pt.y;
  }
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

export function polygonClip(points: Pt[], box: BBox) {
  return `polygon(${points
    .map((pt) => {
      const x = box.w === 0 ? 0 : ((pt.x - box.x) / box.w) * 100;
      const y = box.h === 0 ? 0 : ((pt.y - box.y) / box.h) * 100;
      return `${x.toFixed(2)}% ${y.toFixed(2)}%`;
    })
    .join(", ")})`;
}

export function originClip(points: Pt[], box: BBox) {
  return polygonClip(points, box);
}

export function expandedClip(points: Pt[], cx: number, cy: number) {
  const grown = points.map((pt) => ({
    x: cx + (pt.x - cx) * 1.52,
    y: cy + (pt.y - cy) * 1.52,
  }));
  const box = bboxOfPoints(grown);
  const padX = box.w * 0.04;
  const padY = box.h * 0.04;
  return polygonClip(grown, {
    x: box.x - padX,
    y: box.y - padY,
    w: box.w + padX * 2,
    h: box.h + padY * 2,
  });
}

function shoelace(points: Pt[]) {
  let area = 0;
  for (let i = 0; i < points.length; i += 1) {
    const p = points[i];
    const q = points[(i + 1) % points.length];
    area += p.x * q.y - q.x * p.y;
  }
  return area / 2;
}

function centroidOf(points: Pt[]): Pt {
  let area = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < points.length; i += 1) {
    const p = points[i];
    const q = points[(i + 1) % points.length];
    const cross = p.x * q.y - q.x * p.y;
    area += cross;
    cx += (p.x + q.x) * cross;
    cy += (p.y + q.y) * cross;
  }
  area *= 0.5;
  if (Math.abs(area) < 1e-6) {
    let sx = 0;
    let sy = 0;
    for (const pt of points) {
      sx += pt.x;
      sy += pt.y;
    }
    return { x: sx / points.length, y: sy / points.length };
  }
  return { x: cx / (6 * area), y: cy / (6 * area) };
}

function insideHalf(p: Pt, mx: number, my: number, nx: number, ny: number) {
  return (p.x - mx) * nx + (p.y - my) * ny >= -1e-9;
}

function lineIntersect(
  a: Pt,
  b: Pt,
  mx: number,
  my: number,
  nx: number,
  ny: number,
): Pt {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const denom = dx * nx + dy * ny;
  if (Math.abs(denom) < 1e-12) return { x: a.x, y: a.y };
  const t = ((mx - a.x) * nx + (my - a.y) * ny) / denom;
  return { x: a.x + t * dx, y: a.y + t * dy };
}

function clipHalfPlane(
  poly: Pt[],
  mx: number,
  my: number,
  nx: number,
  ny: number,
): Pt[] {
  if (poly.length === 0) return poly;
  const out: Pt[] = [];
  for (let i = 0; i < poly.length; i += 1) {
    const cur = poly[i];
    const prev = poly[(i + poly.length - 1) % poly.length];
    const curIn = insideHalf(cur, mx, my, nx, ny);
    const prevIn = insideHalf(prev, mx, my, nx, ny);
    if (curIn) {
      if (!prevIn) out.push(lineIntersect(prev, cur, mx, my, nx, ny));
      out.push(cur);
    } else if (prevIn) {
      out.push(lineIntersect(prev, cur, mx, my, nx, ny));
    }
  }
  return out;
}

function dedupe(points: Pt[]) {
  const out: Pt[] = [];
  for (const pt of points) {
    const prev = out[out.length - 1];
    if (prev && Math.hypot(pt.x - prev.x, pt.y - prev.y) < 0.4) continue;
    out.push(pt);
  }
  if (
    out.length > 2 &&
    Math.hypot(out[0].x - out[out.length - 1].x, out[0].y - out[out.length - 1].y) <
      0.4
  ) {
    out.pop();
  }
  return out;
}

function voronoiCell(site: Pt, sites: Pt[], w: number, h: number): Pt[] {
  let poly: Pt[] = [
    { x: 0, y: 0 },
    { x: w, y: 0 },
    { x: w, y: h },
    { x: 0, y: h },
  ];
  for (const other of sites) {
    const dx = site.x - other.x;
    const dy = site.y - other.y;
    if (dx * dx + dy * dy < EPS) continue;
    poly = clipHalfPlane(
      poly,
      (site.x + other.x) / 2,
      (site.y + other.y) / 2,
      dx,
      dy,
    );
    if (poly.length < 3) return [];
  }
  poly = dedupe(poly);
  if (poly.length < 3) return [];
  if (shoelace(poly) < 0) poly.reverse();
  return poly;
}

function assignProjects(shards: Shard[], w: number, h: number) {
  const anchors = [
    [0.64, 0.22],
    [0.84, 0.26],
    [0.72, 0.44],
    [0.9, 0.52],
    [0.78, 0.68],
  ];
  const minArea = (w * h) / 90;
  const minDist = Math.min(w, h) * 0.14;
  const used = new Set<number>();

  const pick = (tx: number, ty: number, requireSpread: boolean) => {
    let best = -1;
    let bestScore = Infinity;
    shards.forEach((shard, idx) => {
      if (used.has(idx)) return;
      if (shard.area < minArea) return;
      if (shard.cx < w * 0.58 || shard.cx > w * 0.96) return;
      if (shard.cy < h * 0.12 || shard.cy > h * 0.78) return;
      if (requireSpread) {
        for (const other of used) {
          const prev = shards[other];
          if (Math.hypot(shard.cx - prev.cx, shard.cy - prev.cy) < minDist) return;
        }
      }
      const dist = Math.hypot(shard.cx / w - tx, shard.cy / h - ty);
      const score = dist - shard.area / (w * h);
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
      shards[best].projectId = project.id;
    }
  });
}

export function buildMesh(w: number, h: number): Shard[] {
  const cols = w < 700 ? 6 : 10;
  const rows = w < 700 ? 5 : 6;
  const cellW = w / cols;
  const cellH = h / rows;
  const sites: Pt[] = [];

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const jx = (hash(x, y, 1) - 0.5) * cellW * 0.5;
      const jy = (hash(x, y, 2) - 0.5) * cellH * 0.5;
      sites.push({
        x: (x + 0.5) * cellW + jx,
        y: (y + 0.5) * cellH + jy,
      });
    }
  }

  const shards: Shard[] = [];
  sites.forEach((site, i) => {
    const points = voronoiCell(site, sites, w, h);
    if (points.length < 3) return;
    const area = Math.abs(shoelace(points));
    if (area < 8) return;
    const c = centroidOf(points);
    shards.push({
      id: `s${i}`,
      points,
      cx: c.x,
      cy: c.y,
      seed: hash(site.x * 0.01, site.y * 0.01, 9),
      area,
    });
  });

  assignProjects(shards, w, h);
  return shards;
}

export function projectHits(mesh: Shard[]): ProjectHit[] {
  return mesh.flatMap((shard) => {
    if (!shard.projectId) return [];
    const project = PROJECTS.find((item) => item.id === shard.projectId);
    if (!project) return [];
    const bbox = bboxOfPoints(shard.points);
    return [
      {
        projectId: project.id,
        title: project.title,
        bbox,
        clip: polygonClip(shard.points, bbox),
      },
    ];
  });
}

export function pointInConvex(p: Pt, points: Pt[]) {
  let sign = 0;
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    const cross = (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
    if (Math.abs(cross) < 1e-8) continue;
    const next = cross > 0 ? 1 : -1;
    if (sign === 0) sign = next;
    else if (next !== sign) return false;
  }
  return sign !== 0;
}

export function transformPoint(p: Pt, shard: Shard, pose: ShardPose): Pt {
  const dx = p.x - shard.cx;
  const dy = p.y - shard.cy;
  const c = Math.cos(pose.rot);
  const s = Math.sin(pose.rot);
  let sx = (dx * c - dy * s) * pose.scale;
  let sy = (dx * s + dy * c) * pose.scale;
  let z = pose.float * GLASS.maxFloat;

  const dirLen = Math.hypot(pose.rx, pose.ry);
  if (pose.tilt > 0.001 && dirLen > 0.001) {
    const dirx = pose.rx / dirLen;
    const diry = pose.ry / dirLen;
    const perpx = -diry;
    const perpy = dirx;
    const along = dx * dirx + dy * diry;
    const across = dx * perpx + dy * perpy;
    const tc = Math.cos(pose.tilt);
    const ts = Math.sin(pose.tilt);
    z += along * ts;
    sx = (dirx * along * tc + perpx * across) * pose.scale;
    sy = (diry * along * tc + perpy * across) * pose.scale;
  }

  const radial = Math.hypot(dx, dy);
  if (radial > 0.001) {
    const lift = Math.min(Math.max(z / GLASS.maxFloat, 0), 1.5);
    const lip = GLASS.edgePop * (0.25 + 0.75 * lift);
    sx += (dx / radial) * lip;
    sy += (dy / radial) * lip;
  }

  const persp = GLASS.focal / Math.max(GLASS.focal - z, GLASS.focal * 0.35);
  return {
    x: shard.cx + pose.ox + sx * persp,
    y: shard.cy + pose.oy + sy * persp,
  };
}

export function transformedPoints(shard: Shard, pose: ShardPose) {
  return shard.points.map((pt) => transformPoint(pt, shard, pose));
}

function hoverScale(shard: Shard, hovered: boolean) {
  if (!hovered) return 1;
  return shard.projectId ? 1.035 : 1.02;
}

export function poseForShard(
  shard: Shard,
  cursor: Pt | null,
  view: { w: number; h: number },
  opts: { reduced: boolean; hoverId: string | null; openId: string | null },
): ShardPose {
  if (opts.reduced || opts.openId || !cursor) return IDENTITY_POSE;

  const hovered = opts.hoverId === shard.id;
  const dx = cursor.x - shard.cx;
  const dy = cursor.y - shard.cy;
  const dist = Math.hypot(dx, dy) || 1;
  const radius = view.w < 700 ? 120 : 188;
  const scale = hoverScale(shard, hovered);
  const maxTilt = view.w < 700 ? GLASS.maxTilt * 0.82 : GLASS.maxTilt;

  if (dist > radius) {
    if (hovered) {
      return { ...IDENTITY_POSE, scale: shard.projectId ? 1.04 : 1.025 };
    }
    return IDENTITY_POSE;
  }

  const t = 1 - dist / radius;
  const ease = t * t * (3 - 2 * t);
  const float = Math.min(1, ease * (hovered ? 1.12 : 1));
  const tiltRamp = hermite(GLASS.deadzone, GLASS.tiltIn, dist);
  const hasDir = dist >= GLASS.deadzone;

  return {
    ox: 0,
    oy: 0,
    rot: 0,
    scale,
    reach: ease,
    rx: hasDir ? dx / dist : 0,
    ry: hasDir ? dy / dist : 0,
    float,
    tilt: hasDir ? ease * tiltRamp * maxTilt * (hovered ? 1.18 : 1) : 0,
  };
}

export function hitShard(
  mesh: Shard[],
  p: Pt,
  poseOf: (shard: Shard) => ShardPose,
) {
  for (let i = mesh.length - 1; i >= 0; i -= 1) {
    const shard = mesh[i];
    const pts = transformedPoints(shard, poseOf(shard));
    if (pointInConvex(p, pts)) return shard;
  }
  return null;
}

export function localPoint(
  e: { clientX: number; clientY: number },
  wrap: HTMLElement,
) {
  const rect = wrap.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}
