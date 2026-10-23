#!/usr/bin/env node
/**
 * Builds the 1200×630 share images in public/og/ from the site's own art.
 * Run after changing covers: `npm run og`. Output is committed; this doesn't run at build time.
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const root = new URL("..", import.meta.url).pathname;
const out = join(root, "public/og");
mkdirSync(out, { recursive: true });

const W = 1200;
const H = 630;
const BG = { r: 7, g: 8, b: 9, alpha: 1 }; // --bg

const cover = (n) => join(root, `public/images/hero-covers/cover-${String(n).padStart(2, "0")}.png`);

async function collage(file, covers, { coverH = 520, gap = 40 } = {}) {
  const coverW = Math.round(coverH * (1187 / 1678));
  const total = covers.length * coverW + (covers.length - 1) * gap;
  const left = Math.round((W - total) / 2);
  const top = Math.round((H - coverH) / 2);
  const layers = await Promise.all(
    covers.map(async (src, i) => ({
      input: await sharp(src).resize(coverW, coverH, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer(),
      left: left + i * (coverW + gap),
      top,
    })),
  );
  await sharp({ create: { width: W, height: H, channels: 4, background: BG } })
    .composite(layers)
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(join(out, file));
  console.log(`wrote public/og/${file}`);
}

async function workImage(file) {
  const src = join(root, "public/images/work-ovani.png");
  await sharp(src)
    .resize(W, H, { fit: "cover", position: "centre" })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(join(out, file));
  console.log(`wrote public/og/${file}`);
}

// Featured for music-producer buyers: Hip Hop Vol. 4, Funk Vol. 3, Heavy Electronic Vol. 5.
await collage("covers.jpg", [cover(8), cover(6), cover(7)]);
// Home: a wider fan of five.
await collage("home.jpg", [cover(4), cover(6), cover(8), cover(7), cover(10)], { coverH: 440, gap: 24 });
await workImage("work.jpg");
