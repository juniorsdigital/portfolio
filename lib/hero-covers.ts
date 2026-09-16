export const OVANI_STORE_URL = "https://ovanisound.com";

export type HeroCover = {
  id: string;
  title: string;
  alt: string;
  src: string;
  insideSrc: string;
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
 *  Inside covers: replace inside-01.jpg … inside-11.jpg in the same folder.
 *  Hero footage: overwrite public/videos/she-who-flies-hero.mp4 (muted H.264, 16:9).
 *
 *  Pack copy: pass a second argument to cover(), e.g.
 *  cover(1, { title: "Ambient Vol. 13", process: "How it was made.", storeHref: "https://…" })
 */
const SIZE = { width: 1187, height: 1678 };

const PROCESS_STUB = "Add how this cover was made.";

function cover(n: number, copy: CoverCopy = {}): HeroCover {
  const pad = String(n).padStart(2, "0");
  const id = `cover-${pad}`;
  const title = copy.title ?? `Cover ${pad}`;
  return {
    id,
    title,
    alt: `${title} — 3D product box art`,
    src: `/images/hero-covers/${id}.png`,
    insideSrc: `/images/hero-covers/inside-${pad}.jpg`,
    ...SIZE,
    process: copy.process ?? PROCESS_STUB,
    contactHref: copy.contactHref ?? "/contact",
    storeHref: copy.storeHref ?? OVANI_STORE_URL,
  };
}

export const HERO_COVERS: HeroCover[] = [
  cover(1, { title: "Ambient Vol. 13" }),
  cover(2, { title: "Ambient Fantasy" }),
  cover(3, { title: "Casual Vol. 8" }),
  cover(4, { title: "Dark Fantasy Vol. 3" }),
  cover(5, { title: "Epic Vol. 5" }),
  cover(6, { title: "Funk Vol. 3" }),
  cover(7, { title: "Heavy Electronic Vol. 5" }),
  cover(8, { title: "Hip Hop Vol. 4" }),
  cover(9, { title: "Horror Vol. 9" }),
  cover(10, { title: "Magical Vol. 5" }),
  cover(11, { title: "Spooky" }),
];
