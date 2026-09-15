export const OVANI_STORE_URL = "https://ovanisound.com";

export type HeroCover = {
  id: string;
  title: string;
  alt: string;
  src: string;
  width: number;
  height: number;
  process: string;
  contactHref: string;
  storeHref: string;
};

type CoverCopy = {
  title?: string;
  process?: string;
  contactHref?: string;
  storeHref?: string;
};

/** Drop-in slots: replace the PNG in public/images/hero-covers/ with the same name.
 *  Hero footage: overwrite public/videos/she-who-flies-hero.mp4 (muted H.264, 16:9).
 *
 *  Pack copy: pass a second argument to cover(), e.g.
 *  cover(1, { title: "Ambient Vol. 13", process: "How it was made.", storeHref: "https://…" })
 */
const SIZE = { width: 1187, height: 1678 };

const PROCESS_STUB = "Add how this cover was made.";

function cover(n: number, copy: CoverCopy = {}): HeroCover {
  const id = `cover-${String(n).padStart(2, "0")}`;
  const title = copy.title ?? `Cover ${String(n).padStart(2, "0")}`;
  return {
    id,
    title,
    alt: `${title} — 3D product box art`,
    src: `/images/hero-covers/${id}.png`,
    ...SIZE,
    process: copy.process ?? PROCESS_STUB,
    contactHref: copy.contactHref ?? "/contact",
    storeHref: copy.storeHref ?? OVANI_STORE_URL,
  };
}

export const HERO_COVERS: HeroCover[] = [
  cover(1),
  cover(2),
  cover(3),
  cover(4),
  cover(5),
  cover(6),
  cover(7),
  cover(8),
  cover(9),
  cover(10),
  cover(11),
];
