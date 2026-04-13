/**
 * Responsive hero WebPs from images/hero-laptop-master.png (e.g. 4000×6000).
 * npm run generate:hero
 * Replaces __HERO_IMG_*__ tokens in juniors-digital.html and portfolio.html
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const input = path.join(root, "images", "hero-laptop-master.png");
const targets = [480, 640, 960, 1280, 1600, 1920, 2560, 3200, 4000];

async function main() {
  if (!fs.existsSync(input)) {
    console.error("Missing:", input);
    console.error("Save your full-resolution Pexels export as hero-laptop-master.png, then re-run.");
    process.exit(1);
  }

  const meta = await sharp(input).metadata();
  const W = meta.width;
  const H = meta.height;
  console.log("Source:", `${W}x${H}`);

  const outWidths = new Set();
  for (const t of targets) {
    if (t < W) outWidths.add(t);
  }
  outWidths.add(W);

  const sorted = [...outWidths].sort((a, b) => a - b);

  for (const w of sorted) {
    const out = path.join(root, "images", `hero-laptop-${w}w.webp`);
    await sharp(input)
      .resize(w, null, { withoutEnlargement: true, fit: "inside" })
      .webp({ quality: 86, effort: 6 })
      .toFile(out);
    console.log("Wrote", path.basename(out));
  }

  const prefer = [1920, 1600, 1280, 960, 640, 480].find((p) => sorted.includes(p)) || sorted[sorted.length - 1];
  fs.copyFileSync(
    path.join(root, "images", `hero-laptop-${prefer}w.webp`),
    path.join(root, "images", "hero-laptop.webp")
  );
  console.log("hero-laptop.webp ->", `hero-laptop-${prefer}w.webp`);

  const srcset = sorted.map((w) => `images/hero-laptop-${w}w.webp ${w}w`).join(", ");

  for (const name of ["juniors-digital.html", "portfolio.html"]) {
    const fp = path.join(root, name);
    let html = fs.readFileSync(fp, "utf8");
    if (!html.includes("__HERO_IMG_SRCSET__")) {
      console.warn("No __HERO_IMG_SRCSET__ in", name, "- skip patch");
      continue;
    }
    html = html.replace(/__HERO_IMG_SRCSET__/g, srcset);
    html = html.replace(/__HERO_IMG_W__/g, String(W));
    html = html.replace(/__HERO_IMG_H__/g, String(H));
    fs.writeFileSync(fp, html);
    console.log("Patched", name);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
