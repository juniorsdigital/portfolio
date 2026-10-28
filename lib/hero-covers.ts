export const OVANI_STORE_URL = "https://ovanisound.com";

/** Pixel sizes of the art files — CSS and the dialog derive their aspect ratios from these. */
export const COVER_SIZE = { width: 1187, height: 1678 };
export const INSIDE_SIZE = { width: 1080, height: 1536 };

export type HeroCover = {
  id: string;
  title: string;
  process: string;
  src: string;
  insideSrc: string;
  contactHref: string;
  storeHref: string;
};

/** Edit pack copy in HERO_COVERS below: each pack needs a title and process.
 *  contactHref and storeHref are optional — leave them out to use the defaults
 *  (/contact and the Ovani store).
 *  Art: replace files in public/images/hero-covers/ — cover-01.png … cover-11.png
 *  and inside-01.jpg … inside-11.jpg. The number passed to cover() picks the files.
 */
type PackCopy = {
  title: string;
  process: string;
  contactHref?: string;
  storeHref?: string;
};

function cover(n: number, {
  title,
  process,
  contactHref = "/contact",
  storeHref = OVANI_STORE_URL,
}: PackCopy): HeroCover {
  const pad = String(n).padStart(2, "0");
  return {
    id: `cover-${pad}`,
    title,
    process,
    src: `/images/hero-covers/cover-${pad}.png`,
    insideSrc: `/images/hero-covers/inside-${pad}.jpg`,
    contactHref,
    storeHref,
  };
}

export const HERO_COVERS: HeroCover[] = [
  cover(1, {
    title: "Ambient Vol. 13",
    process: "Thirteen volumes into a series, the hard part isn't making a good cover. It's making one that still feels new. The last few labels had gone shiny and polished, so I pushed this one the other way: grungy, worn packaging. The cover is a lightly edited forest stock image, and the side-panel is built from glyphs. The lesson I keep coming back to: a long-running series stays fresh by changing its texture, not its identity. The client gets a Vol. 13 that sits right next to Vol. 12 and still stands out.",
  }),
  cover(2, {
    title: "Ambient Fantasy",
    process: "This was the first cover where I pitched a fully illustrated side-panel. Not just a label, but a separate piece of art that expands on the world from the cover. The front is a castle in Germany. The side-panel stacks a whole journey, top to bottom: ice caves, stones by a lake, a sword left from a battle, clouds pulled from several skies, a dragon render, and a knight resting in a field. Pitching it taught me to sell an idea before it exists. It gave the client's boxes a second surface worth looking at, and it's the approach I've built on ever since.",
  }),
  cover(3, {
    title: "Casual Vol. 8",
    process: "How do you show \"casual\" in one image? We'd used AI art for this in the past, but since moving away from it I built the scene by hand: a man fishing on a calm mountain lake. Dropping him in was the easy part. Making him belong was the work. I painted in the light, outlined the fishing rod, and added subtle reflections on the water. That's where I learned that compositing lives in the small details. The client got a cover that's fully human-made and still feels effortless, which is exactly what the music is meant to feel like.",
  }),
  cover(4, {
    title: "Dark Fantasy Vol. 3",
    process: "Every Vol. 3 pack shares a duo-tone side-panel, and that rule ran straight into a pack that lives in deep blacks and reds. Push the two tones too far and the imagery turns unreadable or flips into something that looks like a photo negative. I spent a long time layering and blending color overlays until the side-panel read clearly and still held the duo-tone theme. It taught me to treat a series rule as a design problem to solve, not an excuse to compromise. The client kept their system intact without losing the mood of the pack.",
  }),
  cover(5, {
    title: "Epic Vol. 5",
    process: "Epic was one of the first packs I rebuilt from AI art into a hand-made composite, with Zelda games as the inspiration. The challenge was building a cataclysmic event entirely from stock imagery, where nothing was shot to fit together. A lot of editing went into making sure every layer and object shared the same light, scale, and story. This is where my compositing went from adding one element to a scene to building a whole world from parts. For the client, it showed that original, human-made art could carry their biggest, most dramatic packs too.",
  }),
  cover(6, {
    title: "Funk Vol. 3",
    process: "Funk was hard to picture. What even is funk? A time? A sound? A lifestyle? The answer turned out to be all of the above, so instead of picking one I built a visual vocabulary for it: disco imagery and '70s interior design. I'm proud of how well it lands. It taught me how to approach an abstract brief: define the feeling first, then find the concrete objects that carry it. The client got a cover that says \"funk\" at a glance, even for a genre that's hard to put into words.",
  }),
  cover(7, {
    title: "Heavy Electronic Vol. 5",
    process: "Heavy Electronic covers have traditionally been concert photos, so the front was the easy part. The side-panel took much longer. With no established look to lean on, I went looking outside the series, taking a lot of reference from Puppet Music and the art style of Casiel Checoni. Doing that research is now a step in my process whenever a brief is wide open. It gave the client a side-panel with real character on a pack whose cover follows a familiar formula.",
  }),
  cover(8, {
    title: "Hip Hop Vol. 4",
    process: "As a big hip hop fan, I wanted to do more with this cover, but the series theme is graffiti, and that's the client's to keep. So I put my energy into the side-panel: the Statue of Liberty for New York City, the ever-present graffiti crown, a few glyphs, the Ovani logo redone in graffiti, and a teddy bear as a nod to Kanye West's Graduation. The lesson was restraint. Respect the system, and put the personality where it adds to it instead of fighting it. The client got a consistent series with a box that still rewards a closer look.",
  }),
  cover(9, {
    title: "Horror Vol. 9",
    process: "Horror is one of my favorite packs to design. The side-panels come together naturally: religious imagery, teeth, moons, skulls, knives, doors left ajar. That shared language lets the side-panel run free. The hard part is the cover. The music isn't pure terror, so I had to tune the horror down until the art matched what you actually hear. That's the lesson I bring to every cover now: design for the product, not for the genre cliché. The client gets a box that sets the right expectations for the pack inside.",
  }),
  cover(10, {
    title: "Magical Vol. 5",
    process: "Magic is hard to fake with stock photos, and I could tell that building this scene from parts wouldn't hold up. So I found an artist who sells their work on Adobe Stock and licensed the piece that fit the theme: storming the wizard's castle. The side-panel then expands that scene beyond the cover. Knowing when to license instead of build is a skill of its own. The client got a stronger cover faster, with art they're properly licensed to use.",
  }),
  cover(11, {
    title: "Spooky",
    process: "Spooky shows how cover work really happens: I often design alongside the sound designers while the pack is still being written, so the art has to follow the music as it changes. My first take leaned eerie. Once the tracks were finalized, the note came back: \"This is great, but we were thinking something more goofy.\" So goofy it became: skeletons dancing on their graves, jack-o'-lanterns in witch hats, cats hanging out with brooms, and ghosts in sunglasses. With two separate pieces of art on every box, one or two rounds of revisions is a really good result, and this one landed the cover on the music the client actually shipped. It has a special place in my heart.",
  }),
];
