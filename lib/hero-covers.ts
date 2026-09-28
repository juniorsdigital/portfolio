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
    process: "Epic was one of the first packs I remade from AI to art. The pack took inspiration from Zelda games. Difficulty for this was being able to create a 'cataclysmic' event with purely stock imagery. Quite a bit of editing went into making sure every layer and object of the image worked together.",
    contactHref: "/contact",
    storeHref: OVANI_STORE_URL,
  }),
  cover(6, {
    title: "Funk Vol. 3",
    process: "The Funk cover was very difficult to imagine. What even really is funk? A time? A sound? A lifestyle? The answer is just about all of that. Utilizing 'Disco' imagery and 70's themed interior decorating I believe this is a well done take on 'Funk'.",
    contactHref: "/contact",
    storeHref: OVANI_STORE_URL,
  }),
  cover(7, {
    title: "Heavy Electronic Vol. 5",
    process: "Heavy Electronic historically (in the realm of OvaniSound) has been mainly concert photos. This made the cover somewhat easy to pick out, but the side-panel took much longer to figure out. A lot of reference for this side-panel was taken from Puppet Music and the Casiel Checoni art stlye.",
    contactHref: "/contact",
    storeHref: OVANI_STORE_URL,
  }),
  cover(8, {
    title: "Hip Hop Vol. 4",
    process: "As an avid Hip Hop fan I wanted to do 'more' with the cover, but the theme for this series is graffiti, so I stuck to the side-panel to give a flair to it. This involves a statue of liberty referencing New York City, the ever-present graffiti crown, some glyphs, the Ovani logo in graffiti, and a teddy bear to pay homage to the album 'Graduation'",
    contactHref: "/contact",
    storeHref: OVANI_STORE_URL,
  }),
  cover(9, {
    title: "Horror Vol. 9",
    process: "Horror is one of my favourite packs to design. The side panels always fall together nicely, the ability to lean on the uniformity of religion, teeth, moons, skulls, knives, doors ajar just lets the side-panel feel free. The hard part is tuning down the horror for the cover to convey the theme of the packs music.",
    contactHref: "/contact",
    storeHref: OVANI_STORE_URL,
  }),
  cover(10, {
    title: "Magical Vol. 5",
    process: "Magical is very difficult to depict with stock imagery, so I leaned on an artist who posts their work on Adobe Stock to license the image. It worked nicely with the theme I was going for which is: Storming the wizards castle. The side-panel is an expansion of the covers scene.",
    contactHref: "/contact",
    storeHref: OVANI_STORE_URL,
  }),
  cover(11, {
    title: "Spooky",
    process: "The revision after my first submission for 'Spooky' was 'This is great, but we were thinking something more goofy'- so goofy it became. Skeletons dancing on their graves, Jack-o-Lanterns wearing witch hats, Cats hanging out with brooms, and ghosts with sunglasses. This cover has a special place in my heart.",
    contactHref: "/contact",
    storeHref: OVANI_STORE_URL,
  }),
];
