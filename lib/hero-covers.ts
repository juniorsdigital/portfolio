export const OVANI_STORE_URL = "https://ovanisound.com";
export const CLIENT_NAME = "OvaniSound";

export type HeroCover = {
  id: string;
  /** URL-safe name, used in /contact?ref=<slug>. */
  slug: string;
  title: string;
  /** Alt for the cover face. */
  alt: string;
  /** Alt for the side-panel art. */
  insideAlt: string;
  src: string;
  insideSrc: string;
  width: number;
  height: number;
  /** How the cover was made. Leave "" to hide the paragraph; never ship placeholder copy. */
  process: string;
  storeHref: string;
};

/** Edit pack copy in COVERS below (title, theme, process).
 *  Art: replace files in public/images/hero-covers/ — cover-01.png … cover-11.png
 *  and inside-01.jpg … inside-11.jpg.
 *  Hero footage: overwrite public/videos/she-who-flies-hero.mp4 (muted H.264, 16:9).
 *  `npm run check:content` (also run before every build) fails if a process note is empty or a placeholder.
 */
const SIZE = { width: 1187, height: 1678 };

type PackCopy = {
  title: string;
  /** Short visual description for alt text, e.g. "graffiti-themed artwork". */
  theme: string;
  process: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function cover(n: number, copy: PackCopy): HeroCover {
  const pad = String(n).padStart(2, "0");
  const id = `cover-${pad}`;
  return {
    id,
    slug: slugify(copy.title),
    title: copy.title,
    alt: `${copy.title} pack cover — ${copy.theme}`,
    insideAlt: `${copy.title} side panel`,
    src: `/images/hero-covers/${id}.png`,
    insideSrc: `/images/hero-covers/inside-${pad}.jpg`,
    ...SIZE,
    process: copy.process,
    storeHref: OVANI_STORE_URL,
  };
}

/** Every cover, keyed by number to match the art files. */
export const COVERS: HeroCover[] = [
  cover(1, {
    title: "Ambient Vol. 13",
    theme: "grungy packaging over a forest scene",
    process: "When a new volume comes around it is my job to create a new sticker. With the last few stickers being more shiny and polished I wanted to go for more of a grungy packaging theme. Cover is a slightly edited stock image of a forest, and the side-panel is various glyphs.",
  }),
  cover(2, {
    title: "Ambient Fantasy",
    theme: "castle landscape artwork",
    process: "This was the first cover to pitch a more detailed side-panel. The goal with them is to create a separate piece of art to expand on the world from the cover. This cover features a castle in Germany, and the side-panel consists of (from top to bottom): Ice Caves, Stones by a lake, a Sword from a battle, Clouds from various sky pictures, a Dragon render, and a knight sitting in a field stock image.",
  }),
  cover(3, {
    title: "Casual Vol. 8",
    theme: "a man fishing on a mountain lake",
    process: "How do you express casual activities in one image? Previously we used AI, but having pivoted away since, I added a man fishing to this serene lake in the mountains. This included painting on light, outlining the fishing rod, and adding subtle reflections on the water.",
  }),
  cover(4, {
    title: "Dark Fantasy Vol. 3",
    theme: "dark red duo-tone fantasy artwork",
    process: "Volume 3 packs have a theme for duo-tone side-panels. This posed a challenge for a pack that thematically takes very dark and red tones easily because of readability and being able to understand the side-panel imagery. This took a long time of blending Color Overlays to avoid a 'negative' effect while still keeping a duo-tone theme.",
  }),
  cover(5, {
    title: "Epic Vol. 5",
    theme: "cataclysmic fantasy landscape",
    process: "Epic was one of the first packs I rebuilt from AI-generated art into hand-made art. The pack took inspiration from Zelda games. Difficulty for this was being able to create a 'cataclysmic' event with purely stock imagery. Quite a bit of editing went into making sure every layer and object of the image worked together.",
  }),
  cover(6, {
    title: "Funk Vol. 3",
    theme: "disco and 70s interior artwork",
    process: "The Funk cover was very difficult to imagine. What even really is funk? A time? A sound? A lifestyle? The answer is just about all of that. Utilizing 'Disco' imagery and 70's themed interior decorating I believe this is a well done take on 'Funk'.",
  }),
  cover(7, {
    title: "Heavy Electronic Vol. 5",
    theme: "concert photography artwork",
    process: `Heavy Electronic historically (in the realm of ${CLIENT_NAME}) has been mainly concert photos. This made the cover somewhat easy to pick out, but the side-panel took much longer to figure out. A lot of reference for this side-panel was taken from the music of the artist Puppet and the art style of Casiel Checoni.`,
  }),
  cover(8, {
    title: "Hip Hop Vol. 4",
    theme: "graffiti-themed artwork",
    process: "As an avid Hip Hop fan I wanted to do 'more' with the cover, but the theme for this series is graffiti, so I stuck to the side-panel to give a flair to it. This involves a statue of liberty referencing New York City, the ever-present graffiti crown, some glyphs, the Ovani logo in graffiti, and a teddy bear to pay homage to the album 'Graduation'.",
  }),
  cover(9, {
    title: "Horror Vol. 9",
    theme: "moonlit horror artwork",
    process: "Horror is one of my favourite packs to design. The side panels always fall together nicely, the ability to lean on the uniformity of religion, teeth, moons, skulls, knives, doors ajar just lets the side-panel feel free. The hard part is tuning down the horror for the cover to convey the theme of the packs music.",
  }),
  cover(10, {
    title: "Magical Vol. 5",
    theme: "a wizard's castle under siege",
    process: "Magical is very difficult to depict with stock imagery, so I leaned on an artist who posts their work on Adobe Stock to license the image. It worked nicely with the theme I was going for which is: Storming the wizards castle. The side-panel is an expansion of the covers scene.",
  }),
  cover(11, {
    title: "Spooky",
    theme: "goofy Halloween skeletons and jack-o'-lanterns",
    process: "The revision after my first submission for 'Spooky' was 'This is great, but we were thinking something more goofy'- so goofy it became. Skeletons dancing on their graves, Jack-o-Lanterns wearing witch hats, Cats hanging out with brooms, and ghosts with sunglasses. This cover has a special place in my heart.",
  }),
];

/** Covers that fit music-producer buyers best. Lead with these. */
export const FEATURED_SLUGS = ["hip-hop-vol-4", "funk-vol-3", "heavy-electronic-vol-5"];

const bySlug = (slug: string) => COVERS.find((c) => c.slug === slug)!;
const featured = FEATURED_SLUGS.map(bySlug);
const rest = COVERS.filter((c) => !FEATURED_SLUGS.includes(c.slug));

/** Reading order for grids (/covers): featured first, then the rest. */
export const COVERS_FEATURED_FIRST: HeroCover[] = [...featured, ...rest];

/**
 * Homepage stack order. Each cover in the fan sits on top of the one before it,
 * so only the LAST cover shows its full face; earlier ones show a spine strip.
 * Featured covers go at the end (Hip Hop last = fully visible), so they get the most visibility.
 */
export const HERO_COVERS: HeroCover[] = [...rest, ...[...featured].reverse()];

export function findCover(slug: string | null | undefined) {
  if (!slug) return undefined;
  return COVERS.find((c) => c.slug === slug);
}
