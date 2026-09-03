import { PROJECTS } from "@/lib/projects";
import {
  GLASS,
  type Pt,
  type Shard,
  type ShardPose,
  bboxOfPoints,
} from "@/lib/hero-shards";

const MAX_VERTS = 16;

const VERT = `#version 300 es
in vec2 aPos;
in float aEdge;

uniform vec2 uResolution;
uniform vec2 uCentroid;
uniform vec2 uOffset;
uniform float uScale;
uniform float uRotation;
uniform float uFloat;
uniform float uTilt;
uniform vec2 uReachDir;

out vec2 vRest;
out vec2 vWorld;
out float vEdge;
out float vLift;

void main() {
  vec2 d = aPos - uCentroid;
  float c = cos(uRotation);
  float s = sin(uRotation);
  vec2 r = vec2(d.x * c - d.y * s, d.x * s + d.y * c) * uScale;
  float z = uFloat * ${GLASS.maxFloat.toFixed(1)};
  float dirLen = length(uReachDir);
  if (uTilt > 0.001 && dirLen > 0.001) {
    vec2 dir = uReachDir / dirLen;
    vec2 perp = vec2(-dir.y, dir.x);
    float along = dot(d, dir);
    float across = dot(d, perp);
    float tc = cos(uTilt);
    float ts = sin(uTilt);
    z += along * ts;
    r = (dir * (along * tc) + perp * across) * uScale;
  }
  float radial = length(d);
  float lift = clamp(z / ${GLASS.maxFloat.toFixed(1)}, 0.0, 1.5);
  if (radial > 0.001) {
    float lip = ${GLASS.edgePop.toFixed(1)} * (0.25 + 0.75 * lift) * (1.0 - aEdge);
    r += (d / radial) * lip;
  }
  float persp = ${GLASS.focal.toFixed(1)} / max(${GLASS.focal.toFixed(1)} - z, ${GLASS.focal.toFixed(1)} * 0.35);
  r *= persp;
  vec2 world = uCentroid + uOffset + r;
  vRest = aPos;
  vWorld = world;
  vEdge = aEdge;
  vLift = lift;
  vec2 clip = vec2(
    world.x / uResolution.x * 2.0 - 1.0,
    1.0 - world.y / uResolution.y * 2.0
  );
  gl_Position = vec4(clip, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform sampler2D uPortrait;
uniform sampler2D uScratch;
uniform sampler2D uProject;
uniform vec2 uResolution;
uniform vec2 uImageSize;
uniform vec2 uProjectSize;
uniform vec2 uCentroid;
uniform vec2 uBBox;
uniform vec2 uBBoxSize;
uniform vec2 uLight;
uniform vec2 uOffset;
uniform float uTime;
uniform float uSeed;
uniform float uHasProject;
uniform float uHover;
uniform float uDim;
uniform float uReduced;
uniform float uHasCursor;
uniform int uVertCount;
uniform vec2 uVerts[16];

in vec2 vRest;
in vec2 vWorld;
in float vEdge;
in float vLift;
out vec4 fragColor;

vec2 coverUv(vec2 px, vec2 canvas, vec2 img) {
  float scale = max(canvas.x / max(img.x, 1.0), canvas.y / max(img.y, 1.0));
  vec2 drawn = img * scale;
  vec2 origin = (canvas - drawn) * 0.5;
  return (px - origin) / drawn;
}

float distPointSeg(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  float denom = dot(ab, ab);
  float t = denom < 1e-6 ? 0.0 : clamp(dot(p - a, ab) / denom, 0.0, 1.0);
  return length(p - a - ab * t);
}

float edgeDist(vec2 p) {
  float d = 1e6;
  for (int i = 0; i < 16; i++) {
    if (i >= uVertCount) break;
    vec2 a = uVerts[i];
    vec2 b = uVerts[i + 1 == uVertCount ? 0 : i + 1];
    d = min(d, distPointSeg(p, a, b));
  }
  return d;
}

void main() {
  vec2 outward = vRest - uCentroid;
  float olen = length(outward);
  vec2 nOut = olen > 0.001 ? outward / olen : vec2(0.0, -1.0);

  vec2 keyLight = vec2(uResolution.x * 0.16, uResolution.y * 0.1);
  vec2 lightPos = mix(keyLight, uLight, uHasCursor);
  vec2 toLight = lightPos - vWorld;
  float lightDist = length(toLight);
  vec2 ldir = lightDist > 0.001 ? toLight / lightDist : vec2(-0.45, -0.89);
  float lightRad = min(uResolution.x, uResolution.y) * 0.24;
  float prox = uHasCursor * (1.0 - smoothstep(0.0, lightRad, lightDist));

  vec2 suv = vRest / 210.0 + vec2(uSeed * 5.17, uSeed * 3.91);
  float scratch = texture(uScratch, suv).r;
  float scratch2 = texture(uScratch, suv.yx * 0.61 + vec2(0.18, uSeed)).g;
  vec3 sn = texture(uScratch, suv + 0.13).rgb;
  vec2 bump = (sn.rg - 0.5) * 2.0;

  float rimPx = edgeDist(vRest);
  float edge = 1.0 - smoothstep(0.0, 8.5, rimPx);
  float interior = smoothstep(0.0, 26.0, rimPx);

  vec2 fromC = (vRest - uCentroid) / max(uBBoxSize, vec2(1.0));
  float r2 = dot(fromC, fromC);
  float ior = 0.03 + prox * 0.045 + uHover * 0.016;
  vec2 warp = (bump * 0.85 + nOut * 0.16) * ior * (0.45 + interior * 1.05) * uResolution.y;
  warp += fromC * r2 * (0.35 + prox * 0.8);

  vec2 samplePx = vRest + warp;
  vec2 caDir = normalize(vec2(ldir.y, -ldir.x) * 0.45 + nOut * 0.55 + bump * 0.2);
  float ca = (0.001 + prox * 0.011 + edge * 0.002 + uHover * 0.004) * uResolution.y;

  vec3 portrait;
  portrait.r = texture(uPortrait, coverUv(samplePx + caDir * ca, uResolution, uImageSize)).r;
  portrait.g = texture(uPortrait, coverUv(samplePx, uResolution, uImageSize)).g;
  portrait.b = texture(uPortrait, coverUv(samplePx - caDir * ca, uResolution, uImageSize)).b;
  vec3 col = portrait;

  if (uHasProject > 0.5) {
    float ps = max(uBBoxSize.x / max(uProjectSize.x, 1.0), uBBoxSize.y / max(uProjectSize.y, 1.0));
    vec2 pd = uProjectSize * ps;
    vec2 po = uBBox + (uBBoxSize - pd) * 0.5;
    vec2 puv = (samplePx - po) / pd;
    vec2 puvR = (samplePx + caDir * ca * 0.45 - po) / pd;
    vec2 puvB = (samplePx - caDir * ca * 0.45 - po) / pd;
    vec3 proj;
    proj.r = texture(uProject, puvR).r;
    proj.g = texture(uProject, puv).g;
    proj.b = texture(uProject, puvB).b;
    float glimpse = smoothstep(0.08, 0.55, interior);
    col = mix(col, proj, glimpse * 0.9);
    col = mix(col, col * vec3(0.96, 1.02, 0.88), glimpse * 0.1);
  }

  float hair = smoothstep(0.5, 0.86, scratch);
  float dust = smoothstep(0.78, 0.96, scratch2);
  float chip = smoothstep(0.88, 0.98, scratch) * edge;
  col = mix(col, col * vec3(0.62, 0.66, 0.7), hair * 0.5);
  col += vec3(0.9, 0.94, 1.0) * hair * 0.12;
  col += vec3(1.0) * dust * 0.07;
  col = mix(col, col * 0.5, chip * 0.55);

  float lift = clamp(vLift, 0.0, 1.5);
  float hairline = 1.0 - smoothstep(0.0, 2.2, rimPx);
  float bevel = smoothstep(0.0, 2.8, rimPx) * (1.0 - smoothstep(2.8, 12.0, rimPx));
  float glassEdge = max(pow(clamp(edge, 0.0, 1.0), 1.25), bevel * 0.95);
  col *= 1.0 - glassEdge * (0.1 + 0.34 * lift) * (1.0 - prox * 0.35);
  col = mix(col, col * 0.48 + vec3(0.8, 0.92, 1.0) * 0.52, glassEdge * (0.12 + lift * 0.55));
  vec3 rim = vec3(0.94, 0.98, 1.0) * glassEdge * (0.08 + prox * 0.55 + lift * 1.2 + uHover * 0.38);
  rim += vec3(0.62, 0.82, 0.96) * glassEdge * (0.04 + lift * 0.32);
  rim += vec3(0.84, 1.0, 0.23) * glassEdge * uHasProject * (0.04 + uHover * 0.16 + lift * 0.14);
  rim += vec3(0.97, 0.99, 1.0) * hairline * (0.1 + lift * 1.15 + prox * 0.4);
  rim += vec3(0.76, 0.9, 1.0) * bevel * lift * (0.4 + prox * 0.35);
  col += rim;

  vec2 glassN = normalize(bump * 1.4 + vec2(-0.2, -0.9));
  float facing = max(0.0, dot(glassN, ldir));
  float spec = pow(facing, 40.0) * (0.16 + prox * 0.55 + uHover * 0.18 + lift * 0.22);
  spec *= 0.45 + edge * 0.7 + lift * 0.2;
  float glint = 0.0;
  if (uReduced < 0.5) {
    float g = fract(uTime * 0.11 + uSeed * 2.3);
    vec2 gdir = vec2(-0.32, 0.95);
    float stripe = abs(dot((vWorld / uResolution - 0.5), gdir) - (g * 1.6 - 0.8));
    glint = smoothstep(0.07, 0.0, stripe) * (0.12 + prox * 0.16);
  }
  col += vec3(1.0) * (spec * 0.7 + glint);
  col += vec3(0.84, 1.0, 0.32) * spec * uHasProject * 0.18;

  col = mix(col, col + vec3(0.06, 0.08, 0.11), 0.14 * interior);
  float luma = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(luma), col, 1.06);

  if (uDim > 0.5) col *= 0.4;

  fragColor = vec4(clamp(col, 0.0, 1.5), 1.0);
}
`;

type GpuShard = {
  vao: WebGLVertexArrayObject;
  vbo: WebGLBuffer;
  count: number;
  shard: Shard;
  bbox: { x: number; y: number; w: number; h: number };
  verts: Float32Array;
};

export type DrawState = {
  time: number;
  cursor: Pt | null;
  hoverId: string | null;
  openId: string | null;
  reduced: boolean;
  poseOf: (shard: Shard) => ShardPose;
};

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Failed to create shader");
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) ?? "compile error";
    gl.deleteShader(shader);
    throw new Error(log);
  }
  return shader;
}

function makeScratchCanvas() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const img = ctx.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = 124 + Math.random() * 22;
    img.data[i] = n + Math.random() * 18;
    img.data[i + 1] = n;
    img.data[i + 2] = n - Math.random() * 12;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);

  ctx.globalCompositeOperation = "overlay";
  for (let i = 0; i < 110; i += 1) {
    const bright = Math.random() > 0.35;
    ctx.strokeStyle = bright
      ? `rgba(255,255,255,${0.1 + Math.random() * 0.22})`
      : `rgba(12,14,18,${0.16 + Math.random() * 0.24})`;
    ctx.lineWidth = Math.random() < 0.75 ? 0.35 : 1.05;
    const x = Math.random() * size;
    const y = Math.random() * size;
    const a = Math.random() * Math.PI;
    const len = 18 + Math.random() * 190;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(
      x + Math.cos(a) * len * 0.5 + (Math.random() - 0.5) * 18,
      y + Math.sin(a) * len * 0.5 + (Math.random() - 0.5) * 18,
      x + Math.cos(a) * len,
      y + Math.sin(a) * len,
    );
    ctx.stroke();
  }

  ctx.globalCompositeOperation = "source-over";
  for (let i = 0; i < 28; i += 1) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 1.2 + Math.random() * 4.5;
    const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.35, 0, x, y, r);
    g.addColorStop(0, "rgba(255,255,255,0.38)");
    g.addColorStop(0.45, "rgba(170,200,220,0.1)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 160; i += 1) {
    ctx.fillStyle = `rgba(255,255,255,${0.04 + Math.random() * 0.12})`;
    ctx.fillRect(Math.random() * size, Math.random() * size, 1, 1);
  }
  return canvas;
}

function bindImage(
  gl: WebGL2RenderingContext,
  tex: WebGLTexture,
  source: TexImageSource,
) {
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
}

export class HeroGlassGL {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  private loc: Record<string, WebGLUniformLocation | null>;
  private gpu: GpuShard[] = [];
  private portrait: WebGLTexture;
  private scratch: WebGLTexture;
  private fallback: WebGLTexture;
  private projects: (WebGLTexture | null)[];
  private projectSizes: { w: number; h: number }[];
  private imageSize = { w: 1, h: 1 };
  private view = { w: 1, h: 1 };
  private aPos: number;
  private aEdge: number;

  constructor(private canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: true,
    });
    if (!gl) throw new Error("WebGL2 is required for the glass hero");
    this.gl = gl;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!program) throw new Error("Failed to create program");
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.bindAttribLocation(program, 0, "aPos");
    gl.bindAttribLocation(program, 1, "aEdge");
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) ?? "link error");
    }
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    this.program = program;
    this.aPos = 0;
    this.aEdge = 1;

    const names = [
      "uResolution",
      "uCentroid",
      "uOffset",
      "uScale",
      "uRotation",
      "uFloat",
      "uTilt",
      "uReachDir",
      "uPortrait",
      "uScratch",
      "uProject",
      "uImageSize",
      "uProjectSize",
      "uBBox",
      "uBBoxSize",
      "uLight",
      "uTime",
      "uSeed",
      "uHasProject",
      "uHover",
      "uDim",
      "uReduced",
      "uHasCursor",
      "uVertCount",
      "uVerts[0]",
    ];
    this.loc = {};
    for (const name of names) {
      this.loc[name] = gl.getUniformLocation(program, name);
    }

    this.portrait = gl.createTexture()!;
    this.scratch = gl.createTexture()!;
    this.fallback = gl.createTexture()!;
    this.projects = PROJECTS.map(() => null);
    this.projectSizes = PROJECTS.map(() => ({ w: 1, h: 1 }));

    const pixel = new Uint8Array([32, 34, 38, 255]);
    gl.bindTexture(gl.TEXTURE_2D, this.fallback);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      pixel,
    );
    bindImage(gl, this.scratch, makeScratchCanvas());
    bindImage(gl, this.portrait, makeScratchCanvas());

    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.BLEND);
  }

  resize(w: number, h: number, dpr: number) {
    this.view = { w, h };
    this.canvas.width = Math.max(1, Math.floor(w * dpr));
    this.canvas.height = Math.max(1, Math.floor(h * dpr));
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  setPortrait(img: HTMLImageElement) {
    this.imageSize = { w: img.naturalWidth || 1, h: img.naturalHeight || 1 };
    bindImage(this.gl, this.portrait, img);
  }

  setProject(index: number, img: HTMLImageElement) {
    if (index < 0 || index >= PROJECTS.length) return;
    let tex = this.projects[index];
    if (!tex) {
      tex = this.gl.createTexture();
      this.projects[index] = tex;
    }
    if (!tex) return;
    this.projectSizes[index] = {
      w: img.naturalWidth || 1,
      h: img.naturalHeight || 1,
    };
    bindImage(this.gl, tex, img);
  }

  setMesh(shards: Shard[]) {
    const gl = this.gl;
    for (const item of this.gpu) {
      gl.deleteBuffer(item.vbo);
      gl.deleteVertexArray(item.vao);
    }
    this.gpu = shards.map((shard) => {
      const ring = shard.points;
      const data: number[] = [shard.cx, shard.cy, 1];
      for (const pt of ring) {
        data.push(pt.x, pt.y, 0);
      }
      data.push(ring[0].x, ring[0].y, 0);
      const verts = new Float32Array(data);
      const vao = gl.createVertexArray()!;
      const vbo = gl.createBuffer()!;
      gl.bindVertexArray(vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(this.aPos);
      gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 12, 0);
      gl.enableVertexAttribArray(this.aEdge);
      gl.vertexAttribPointer(this.aEdge, 1, gl.FLOAT, false, 12, 8);
      gl.bindVertexArray(null);
      const packed = new Float32Array(MAX_VERTS * 2);
      for (let i = 0; i < Math.min(ring.length, MAX_VERTS); i += 1) {
        packed[i * 2] = ring[i].x;
        packed[i * 2 + 1] = ring[i].y;
      }
      return {
        vao,
        vbo,
        count: ring.length + 2,
        shard,
        bbox: bboxOfPoints(ring),
        verts: packed,
      };
    });
  }

  draw(state: DrawState) {
    const gl = this.gl;
    const { w, h } = this.view;
    gl.clearColor(0.02745, 0.03137, 0.03529, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.program);

    gl.uniform2f(this.loc.uResolution, w, h);
    gl.uniform2f(this.loc.uImageSize, this.imageSize.w, this.imageSize.h);
    gl.uniform1f(this.loc.uTime, state.time * 0.001);
    gl.uniform1f(this.loc.uReduced, state.reduced ? 1 : 0);
    gl.uniform1f(this.loc.uHasCursor, state.cursor ? 1 : 0);
    gl.uniform2f(
      this.loc.uLight,
      state.cursor?.x ?? w * 0.16,
      state.cursor?.y ?? h * 0.1,
    );

    gl.uniform1i(this.loc.uPortrait, 0);
    gl.uniform1i(this.loc.uScratch, 1);
    gl.uniform1i(this.loc.uProject, 2);

    const posed = this.gpu.map((item) => ({
      item,
      pose: state.poseOf(item.shard),
    }));
    posed.sort((a, b) => {
      const la = a.pose.float + Math.abs(a.pose.tilt);
      const lb = b.pose.float + Math.abs(b.pose.tilt);
      return la - lb;
    });

    let hovered: (typeof posed)[number] | null = null;
    for (const entry of posed) {
      if (entry.item.shard.id === state.hoverId && !state.openId) {
        hovered = entry;
        continue;
      }
      this.drawShard(entry.item, state, entry.pose);
    }
    if (hovered) this.drawShard(hovered.item, state, hovered.pose);
  }

  private drawShard(item: GpuShard, state: DrawState, pose: ShardPose) {
    const gl = this.gl;
    const shard = item.shard;
    const projectIndex = shard.projectId
      ? PROJECTS.findIndex((p) => p.id === shard.projectId)
      : -1;
    const hasProject = projectIndex >= 0 && Boolean(this.projects[projectIndex]);
    const projectTex =
      (hasProject ? this.projects[projectIndex] : this.fallback) ??
      this.fallback;
    const projectSize = hasProject
      ? this.projectSizes[projectIndex]
      : { w: 1, h: 1 };

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.portrait);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.scratch);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, projectTex);

    gl.uniform2f(this.loc.uCentroid, shard.cx, shard.cy);
    gl.uniform2f(this.loc.uOffset, pose.ox, pose.oy);
    gl.uniform1f(this.loc.uScale, pose.scale);
    gl.uniform1f(this.loc.uRotation, pose.rot);
    gl.uniform1f(this.loc.uFloat, pose.float);
    gl.uniform1f(this.loc.uTilt, pose.tilt);
    gl.uniform2f(this.loc.uReachDir, pose.rx, pose.ry);
    gl.uniform2f(this.loc.uBBox, item.bbox.x, item.bbox.y);
    gl.uniform2f(this.loc.uBBoxSize, item.bbox.w, item.bbox.h);
    gl.uniform2f(this.loc.uProjectSize, projectSize.w, projectSize.h);
    gl.uniform1f(this.loc.uSeed, shard.seed);
    gl.uniform1f(this.loc.uHasProject, hasProject ? 1 : 0);
    gl.uniform1f(
      this.loc.uHover,
      shard.id === state.hoverId && !state.openId ? 1 : 0,
    );
    gl.uniform1f(
      this.loc.uDim,
      state.openId && shard.projectId !== state.openId ? 1 : 0,
    );
    gl.uniform1i(this.loc.uVertCount, Math.min(shard.points.length, MAX_VERTS));
    gl.uniform2fv(this.loc["uVerts[0]"], item.verts);

    gl.bindVertexArray(item.vao);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, item.count);
    gl.bindVertexArray(null);
  }

  capture(bbox: { x: number; y: number; w: number; h: number }, dpr: number) {
    const sw = Math.max(1, Math.ceil(bbox.w * dpr));
    const sh = Math.max(1, Math.ceil(bbox.h * dpr));
    const out = document.createElement("canvas");
    out.width = sw;
    out.height = sh;
    const ctx = out.getContext("2d");
    if (!ctx) return "";
    ctx.drawImage(
      this.canvas,
      bbox.x * dpr,
      bbox.y * dpr,
      bbox.w * dpr,
      bbox.h * dpr,
      0,
      0,
      sw,
      sh,
    );
    return out.toDataURL("image/png");
  }

  destroy() {
    const gl = this.gl;
    for (const item of this.gpu) {
      gl.deleteBuffer(item.vbo);
      gl.deleteVertexArray(item.vao);
    }
    this.gpu = [];
    gl.deleteTexture(this.portrait);
    gl.deleteTexture(this.scratch);
    gl.deleteTexture(this.fallback);
    for (const tex of this.projects) {
      if (tex) gl.deleteTexture(tex);
    }
    gl.deleteProgram(this.program);
  }
}
