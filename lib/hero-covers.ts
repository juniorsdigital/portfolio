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

/** Edit pack copy in HERO_COVERS below (title, process, contactHref, storeHref).
 *  Art: replace files in public/images/hero-covers/ — cover-01.png … cover-11.png
 *  and inside-01.jpg … inside-11.jpg.
 *  Hero footage: overwrite public/videos/she-who-flies-hero.mp4 (muted H.264, 16:9).
 */
const SIZE = { width: 1187, height: 1678 };

type PackCopy = {
  title: string;
  process: string;
  contactHref: string;
  storeHref: string;
};

function cover(n: number, copy: PackCopy): HeroCover {
  const pad = String(n).padStart(2, "0");
  const id = `cover-${pad}`;
  return {
    id,
    title: copy.title,
    alt: `${copy.title} — 3D product box art`,
    src: `/images/hero-covers/${id}.png`,
    insideSrc: `/images/hero-covers/inside-${pad}.jpg`,
    ...SIZE,
    process: copy.process,
    contactHref: copy.contactHref,
    storeHref: copy.storeHref,
  };
}

export const HERO_COVERS: HeroCover[] = [
  cover(1, {
    title: "Ambient Vol. 13",
    process: "When a new volume comes around it is my job to create a new sticker. With the last few stickers being more shiny and polished I wanted to go for more of a grungy packaging theme. Cover is a slightly edited stock image of a forest, and the side-panel is various glyphs.",
    contactHref: "/contact",
    storeHref: OVANI_STORE_URL,
  }),
  cover(2, {
    title: "Ambient Fantasy",
    process: "This was the first cover to pitch a more detailed side-panel. The goal with them is to create a separate piece of art to expand on the world from the cover. This cover features a castle in Germany, and the side-panel consists of (from top to bottom): Ice Caves, Stones by a lake, a Sword from a battle, Clouds from various sky pictures, a Dragon render, and a knight sitting in a field stock image.", 
    contactHref: "/contact",
    storeHref: OVANI_STORE_URL,
  }),
  cover(3, {
    title: "Casual Vol. 8",
    process: "How do you express casual activities in one image? Previously we used AI, but having pivoted away since, I added a man fishing to this serene lake in the mountains. This included painting on light, outlining the fishing rod, and adding subtle reflections on the water.",
    contactHref: "/contact",
    storeHref: OVANI_STORE_URL,
  }),
  cover(4, {
    title: "Dark Fantasy Vol. 3",
    process: "Volume 3 packs have a theme for duo-tone side-panels. This posed a challenge for a pack that thematically takes very dark and red tones easily because of readability and being able to understand the side-panel imagery. This took a long time of blending Color Overlay's to avoid a 'negative' effect while still keeping a duo-tone theme.",
    contactHref: "/contact",
    storeHref: OVANI_STORE_URL,
  }),
  cover(5, {
    title: "Epic Vol. 5",
    process: "Add how this cover was made.",
    contactHref: "/contact",
    storeHref: OVANI_STORE_URL,
  }),
  cover(6, {
    title: "Funk Vol. 3",
    process: "Add how this cover was made.",
    contactHref: "/contact",
    storeHref: OVANI_STORE_URL,
  }),
  cover(7, {
    title: "Heavy Electronic Vol. 5",
    process: "Add how this cover was made.",
    contactHref: "/contact",
    storeHref: OVANI_STORE_URL,
  }),
  cover(8, {
    title: "Hip Hop Vol. 4",
    process: "Add how this cover was made.",
    contactHref: "/contact",
    storeHref: OVANI_STORE_URL,
  }),
  cover(9, {
    title: "Horror Vol. 9",
    process: "Add how this cover was made.",
    contactHref: "/contact",
    storeHref: OVANI_STORE_URL,
  }),
  cover(10, {
    title: "Magical Vol. 5",
    process: "Add how this cover was made.",
    contactHref: "/contact",
    storeHref: OVANI_STORE_URL,
  }),
  cover(11, {
    title: "Spooky",
    process: "Add how this cover was made.",
    contactHref: "/contact",
    storeHref: OVANI_STORE_URL,
  }),
];
