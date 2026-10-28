export type WorkCategory = "design" | "video" | "marketing";

export type WorkImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

export type WorkVideo = {
  provider: "youtube";
  id: string;
  title: string;
  start?: number;
  /** Shown until the viewer presses play, so the page never waits on YouTube. */
  poster: WorkImage;
};

export type CaseStudy = {
  /** <title> — leads with the client and the search term the page should rank for. */
  seoTitle: string;
  /** Meta and social description, ~150 characters. */
  seoDescription: string;
  /** Display headline; `accent` is set in signal orange. */
  headline: { lead: string; accent: string };
  lede: string;
  year?: string;
  role: string;
  delivered: string[];
  hero: WorkImage | { video: WorkVideo };
  brief: { title: string; body: string; points: { title: string; body: string }[] };
  approach: { title: string; intro: string; steps: { title: string; body: string }[] };
  gallery?: { title: string; intro?: string; images: WorkImage[] };
  outcome: { title: string; body: string; stats: { value: string; label: string }[] };
  pitch: { title: string; body: string; cta: string };
  external?: { href: string; label: string };
};

export type Project = {
  id: string;
  /** Short name for breadcrumbs and footer links. */
  name: string;
  categories: WorkCategory[];
  client: string;
  title: string;
  description: string;
  tags: string[];
  result?: string;
  /** Shown full-width at the top of the grid. */
  featured?: boolean;
  /** A page outside /work/[id] that holds this project's case study. */
  href?: string;
  /** Cards for video projects carry a Play tag. */
  video?: boolean;
  thumbnail: { src: string; alt: string; width: number; height: number };
  caseStudy?: CaseStudy;
};

const RYZA_COVER = {
  src: "/images/work/ryzagrow.webp",
  alt: "RyzaPod grow kits for manure-loving and wood-loving mushrooms, styled on terracotta with wheat and on cream with birch and moss",
  width: 951,
  height: 594,
};

const OVANI_COVER = {
  src: "/images/work/ovani.webp",
  alt: "Five OvaniSound music pack boxes rendered in 3D — Ambient, Dark Fantasy, Ambient Fantasy, Horror and Spooky",
  width: 1600,
  height: 1000,
};

const BGCB_COVER = {
  src: "/images/work/bgcb.webp",
  alt: "Billboard for the Boys & Girls Club of Boston teen center: “Put your passion into action” beside a teen playing bass guitar",
  width: 951,
  height: 594,
};

const SWF_COVER = {
  src: "/images/work/she-who-flies.webp",
  alt: "She Who Flies title treatment: flowing script over heavy block capitals, a skier cut through the type above snowy peaks",
  width: 951,
  height: 594,
};

const WH_COVER = {
  src: "/images/work/winter-heroes.webp",
  alt: "Winter Heroes title card in heavy white capitals over snow-capped peaks rising above the clouds",
  width: 1024,
  height: 576,
};

export const PROJECTS: Project[] = [
  {
    id: "ryzagrow",
    name: "RyzaGrow",
    featured: true,
    categories: ["design", "marketing"],
    client: "Ryza, LLC.",
    title: "RyzaGrow — DTC campaign",
    description:
      "Campaign management, content, and social direction for a direct-to-consumer mushroom grow kit. Owned media across product and web.",
    tags: ["Graphic Design", "Social", "Campaign"],
    result: "2× sales",
    thumbnail: RYZA_COVER,
    caseStudy: {
      seoTitle: "RyzaGrow DTC campaign — grow kit marketing",
      seoDescription:
        "How a direct-to-consumer campaign for RyzaGrow's mushroom grow kits doubled sales: campaign management, product content and social media across web and social.",
      headline: { lead: "Two pods.", accent: "Twice the sales." },
      lede: "Ryza sells mushroom grow kits straight to the people who use them. I ran the direct-to-consumer campaign end to end — the plan, the content and the social direction — and managed the owned media that carried it across the product pages and the feed. Sales doubled.",
      role: "Campaign management, content creation, social media direction",
      delivered: [
        "Campaign plan",
        "Product content for web and social",
        "Social media direction",
        "Owned media management",
      ],
      hero: RYZA_COVER,
      brief: {
        title: "A grow kit is a hard sell in a scroll.",
        body: "Most people have never grown a mushroom. A grow kit asks them to picture the harvest before they've seen it — and to pick the right kit for the species they want. The campaign had to make two products easy to tell apart and easy to want, on a product page and in a two-second scroll.",
        points: [
          {
            title: "Two pods, one jar",
            body: "The RyzaPod comes in two versions: one for manure-loving species, one for wood-loving ones. Same jar, different substrate — and buyers had to know which was which at a glance.",
          },
          {
            title: "No shelf to lean on",
            body: "No retailer, no store display, no sales rep. Every sale started on owned media, so the content had to do the selling on its own.",
          },
          {
            title: "Web and social at once",
            body: "The same assets had to work as product imagery on the site and as posts in the feed, without reading as two different campaigns.",
          },
        ],
      },
      approach: {
        title: "Let the substrate tell the story.",
        intro:
          "The difference between the pods is what the mushrooms grow on. So that became the creative: each pod gets the world it belongs to.",
        steps: [
          {
            title: "Give each pod its own world",
            body: "Manure-loving gets terracotta, wheat and river stone. Wood-loving gets cream, birch and moss. The set tells you which pod you need before you read the label.",
          },
          {
            title: "One system, every channel",
            body: "The same split layout, color pairing and product framing run across product pages and social posts, so every touchpoint reads as one campaign.",
          },
          {
            title: "Run the channels directly",
            body: "I managed the owned media myself — planning, posting and adjusting — so what worked in the feed fed straight back into the next round of content.",
          },
        ],
      },
      gallery: {
        title: "Two looks, one brand.",
        images: [
          {
            src: "/images/work/ryzagrow-manure.webp",
            alt: "RyzaPod for manure-loving mushrooms on terracotta with wheat stalks and river stones",
            width: 474,
            height: 610,
            caption: "Manure-loving — terracotta, wheat and stone.",
          },
          {
            src: "/images/work/ryzagrow-wood.webp",
            alt: "RyzaPod for wood-loving mushrooms on cream with birch logs and moss",
            width: 473,
            height: 610,
            caption: "Wood-loving — cream, birch and moss.",
          },
        ],
      },
      outcome: {
        title: "Sales doubled.",
        body: "The campaign doubled RyzaGrow's sales. Just as useful: Ryza now has a campaign look it can keep using. New species, new pods and new posts slot into the same system instead of starting from scratch.",
        stats: [
          { value: "2×", label: "sales after the direct-to-consumer campaign" },
          { value: "2", label: "product lines, each with a look you can read at a glance" },
          { value: "1", label: "campaign system across product pages and social" },
        ],
      },
      pitch: {
        title: "Selling direct?",
        body: "I'll plan the campaign, make the content and run the channels — one person, accountable for the number.",
        cta: "Start a campaign",
      },
    },
  },
  {
    id: "ovani",
    name: "OvaniSound",
    categories: ["design"],
    client: "OvaniSound",
    title: "75+ music pack covers",
    description:
      "2D and 3D covers for a sound-design catalog: five projects since 2025 and 32+ genres, from pirate and chiptune to Japanese and comedy. Thirty distinct covers in one week, and a move from AI art to original, hand-made covers.",
    tags: ["Product Covers", "3D"],
    result: "30 in 1 week",
    thumbnail: OVANI_COVER,
    caseStudy: {
      seoTitle: "OvaniSound music pack covers & 3D packaging",
      seoDescription:
        "75+ e-commerce product covers for OvaniSound's music and sound-effect packs across 32+ genres: cover art, 3D box renders and side-panels — 30 in one week.",
      headline: { lead: "75 covers.", accent: "One shelf." },
      lede: "OvaniSound sells music and sound-effect packs for game developers and creators. Every pack needs a cover that sells a sound you can't hear yet. Since 2025 I've designed more than 75 of them across 32+ genres, from pirate and chiptune to Japanese and comedy — 2D cover art, 3D box renders and the illustrated side-panels that make the store read as a collection.",
      role: "Product cover design, 3D renders, packaging art",
      delivered: [
        "75+ product covers",
        "3D box renders",
        "Side-panel illustration",
        "Volume stickers",
      ],
      hero: OVANI_COVER,
      brief: {
        title: "Sell a sound with a picture.",
        body: "A music pack is invisible until someone presses play. On a store page the cover does all the selling, and it sits in a grid next to every other pack in the catalog. Each one has to name its genre in a glance and still look like part of the same family.",
        points: [
          {
            title: "Genre at a glance",
            body: "Funk, Horror, Ambient, Epic. Each cover has to say its sound before the title is read. (What even is “funk” as a picture? A time, a sound, a lifestyle — all of it.)",
          },
          {
            title: "A catalog, not a one-off",
            body: "Series run past volume 13. New covers fit a series theme — graffiti for Hip Hop, duo-tone side-panels for every Vol. 3 — without repeating the last one.",
          },
          {
            title: "Moving off AI",
            body: "Earlier covers leaned on AI imagery. The catalog moved away from it, so covers were rebuilt as real art: licensed stock, compositing and hand-painted light.",
          },
          {
            title: "Release-day pace",
            body: "At the peak, 30 distinct covers had to ship in a single week — each one finished, rendered and store-ready.",
          },
        ],
      },
      approach: {
        title: "The cover sells. The side-panel tells.",
        intro:
          "Every box has two jobs. The front stops the scroll; the side rewards the people who look closer.",
        steps: [
          {
            title: "One scene that reads small",
            body: "The front is the hook: a single strong image that still works as a thumbnail in a store grid.",
          },
          {
            title: "A side-panel that builds the world",
            body: "The spine is a second piece of art. Ambient Fantasy's stacks ice caves, a lakeside, a sword, a dragon and a knight under the German castle on the front.",
          },
          {
            title: "Composite, then paint",
            body: "Most covers start as several licensed images. I blend them, paint in light, outline details and add reflections until they read as one scene — like the fisherman added to the Casual Vol. 8 mountain lake.",
          },
          {
            title: "Render it as a product",
            body: "Each cover is wrapped onto a 3D box so the store shows something that feels physical, not a flat square. 2D volume stickers cover drops and promos.",
          },
        ],
      },
      gallery: {
        title: "Inside the box.",
        intro:
          "Side-panels from three packs. The covers on the shelf at the top of the home page are the real ones — pick any to read how it was made.",
        images: [
          {
            src: "/images/hero-covers/inside-02.jpg",
            alt: "Ambient Fantasy side-panel: ice caves, a lakeside, a sword, clouds, a dragon and a knight in a field",
            width: 1080,
            height: 1536,
            caption: "Ambient Fantasy — the first cover to pitch a detailed side-panel.",
          },
          {
            src: "/images/hero-covers/inside-08.jpg",
            alt: "Hip Hop Vol. 4 side-panel: the Statue of Liberty, a graffiti crown, glyphs and a teddy bear",
            width: 1080,
            height: 1536,
            caption: "Hip Hop Vol. 4 — New York, the graffiti crown and a nod to Graduation.",
          },
          {
            src: "/images/hero-covers/inside-11.jpg",
            alt: "Spooky side-panel: dancing skeletons, a Jack-o'-lantern in a witch hat and a cat with a broom",
            width: 1080,
            height: 1536,
            caption: "Spooky — the brief came back “more goofy”. So, ghosts in sunglasses.",
          },
          {
            src: "/images/work/ovani-board.webp",
            alt: "OvaniSound 2D volume stickers beside 3D renders of the Analog Gear, Ambient and Ambient Fantasy boxes",
            width: 951,
            height: 610,
            caption: "2D volume stickers and 3D box renders, side by side.",
          },
        ],
      },
      outcome: {
        title: "A store that reads like a collection.",
        body: "Every box is different, and every box is clearly Ovani. The covers hold together across genres and volumes, the side-panels give fans something to collect, and the catalog no longer depends on AI imagery.",
        stats: [
          { value: "75+", label: "product covers across 32+ genres" },
          { value: "30", label: "distinct covers shipped in a single week" },
          { value: "2D+3D", label: "cover art, box renders and stickers for every pack" },
        ],
      },
      pitch: {
        title: "Need covers that sell?",
        body: "Product covers, packaging renders and series systems for e-commerce catalogs — at the pace a release schedule needs.",
        cta: "Start a cover project",
      },
      external: { href: "https://ovanisound.com", label: "See the covers in the Ovani store" },
    },
  },
  {
    id: "bgcb",
    name: "Boys & Girls Club of Boston",
    categories: ["design"],
    client: "Boys & Girls Club of Boston",
    title: "Teen registration campaign",
    description:
      "OOH, print, and digital assets for a teen registration push. One campaign, coordinated across formats.",
    tags: ["Campaign", "OOH"],
    thumbnail: BGCB_COVER,
    caseStudy: {
      seoTitle: "Boys & Girls Club of Boston teen campaign",
      seoDescription:
        "A nonprofit marketing campaign to grow teen registration at the Boys & Girls Club of Boston: billboard and out-of-home design, print and digital on one system.",
      headline: { lead: "Put your passion", accent: "into action." },
      lede: "The Boys & Girls Club of Boston wanted more teens through the doors of its teen center. As an internship project, I built a full-service marketing campaign to drive teen registration — one idea, carried across billboards, print and digital.",
      role: "Campaign concept, art direction, out-of-home, print and digital design",
      delivered: [
        "Campaign concept and line",
        "Billboard / out-of-home",
        "Print collateral",
        "Digital and social assets",
      ],
      hero: BGCB_COVER,
      brief: {
        title: "Teens can smell an ad.",
        body: "A teen program competes with everything else a teenager could be doing after school. A campaign that sounds like a parent, or like an institution, gets ignored. This one had to sound like an invitation — and keep signing up one step away.",
        points: [
          {
            title: "Speak to teens, not about them",
            body: "The voice had to feel like theirs — loud, handmade, a little messy — while still coming from a nonprofit parents trust.",
          },
          {
            title: "Every format, one campaign",
            body: "A billboard gets three seconds from a passing car. A flyer gets read up close. Social gets a thumb-scroll. The same idea had to survive all three.",
          },
          {
            title: "End in a registration",
            body: "Awareness only counts if it turns into sign-ups, so the campaign needed a direct path from seeing it to joining.",
          },
        ],
      },
      approach: {
        title: "Sell the passion, not the program.",
        intro:
          "Teens don't sign up for a facility. They sign up for the thing they already love — and the people they'll do it with.",
        steps: [
          {
            title: "One line that does the work",
            body: "Instead of listing activities, “Put your passion into action” sells what teens already care about — music, sport, art — and makes the Club the place to do it.",
          },
          {
            title: "A handmade visual system",
            body: "Torn paper, kraft textures, marker headlines and cut-out photography give the campaign zine energy. A lime grid accent and the Club mark anchor it to the brand.",
          },
          {
            title: "Built for the billboard",
            body: "The out-of-home layout sets the rules — a short headline, one hero photo, the logo — and the print and digital pieces are built from the same parts.",
          },
          {
            title: "A QR code to registration",
            body: "The path from seeing the campaign to signing up is a phone camera away: scan, land on registration, done.",
          },
        ],
      },
      gallery: {
        title: "Readable at 60 mph.",
        intro:
          "A four-word headline, one face and a clear call to join. Everything on the board earns its space.",
        images: [
          {
            src: "/images/work/bgcb-detail.webp",
            alt: "Close-up of the billboard: marker headline, torn-paper microphone, the teen bassist and the QR code beside the Club Teen Center logo",
            width: 730,
            height: 380,
            caption: "Headline, hero photo, logo, QR. Nothing else.",
          },
        ],
      },
      outcome: {
        title: "A campaign that scales.",
        body: "The Club gets a campaign it can run at any size — one board or a citywide run — with a voice teens will actually stop for, and a registration path built into every piece.",
        stats: [
          { value: "1", label: "campaign idea carried across every format" },
          { value: "3", label: "channels — out-of-home, print and digital" },
          { value: "QR", label: "a direct path from the street to registration" },
        ],
      },
      pitch: {
        title: "Running a nonprofit campaign?",
        body: "Campaign concepts, billboards, print and social assets that sound like the people you're trying to reach.",
        cta: "Start a campaign",
      },
    },
  },
  {
    id: "she-who-flies",
    name: "She Who Flies",
    video: true,
    categories: ["video"],
    client: "Red Bull (concept)",
    title: "She Who Flies — documentary trailer",
    description:
      "Re-edited documentary trailer with custom title treatment. Cinematic cut, no paid promotion.",
    tags: ["Video Edit", "Trailer"],
    result: "7.7K views",
    thumbnail: SWF_COVER,
    caseStudy: {
      seoTitle: "She Who Flies — documentary trailer edit",
      seoDescription:
        "A re-edited documentary trailer concept for Red Bull's She Who Flies: story structure, music-led cutting and a custom title treatment. 7.7K organic views.",
      headline: { lead: "A new cut.", accent: "7.7K views." },
      lede: "She Who Flies is a Red Bull documentary about a skier. I took the footage and recut it as a trailer of my own — new structure, new pacing and a custom title treatment. It's a self-initiated concept, not a Red Bull commission, and it found 7.7K views without a dollar of paid promotion.",
      role: "Video editing, trailer structure, title design",
      delivered: ["Documentary trailer", "Custom title treatment"],
      hero: {
        video: {
          provider: "youtube",
          id: "OAVv1vL3SaY",
          title: "She Who Flies — trailer recut",
          poster: SWF_COVER,
        },
      },
      brief: {
        title: "Make a stranger care in two minutes.",
        body: "A trailer has a couple of minutes to make someone care about a person they've never heard of. The footage was already beautiful. The job was structure: what to show, what to hold back, and where the music hits.",
        points: [
          {
            title: "Story in seconds",
            body: "Introduce the athlete, the stakes and the feeling — without giving the film away.",
          },
          {
            title: "Cut to the music",
            body: "Big-mountain footage lives or dies on rhythm. Every cut had to land with the sound.",
          },
          {
            title: "A title that earns the name",
            body: "The title card had to feel like flight — light and sweeping — and still read over moving snow.",
          },
        ],
      },
      approach: {
        title: "Hold back. Then let it fly.",
        intro:
          "A good trailer is mostly restraint. It sells the feeling of the film, then gets out of the way.",
        steps: [
          {
            title: "Rebuild the arc",
            body: "I pulled the strongest moments and rebuilt them as a trailer arc — setup, build, release — so the viewer gets the shape of the film in miniature.",
          },
          {
            title: "Edit to the beat",
            body: "Cuts follow the music, not the other way round. Quiet holds before the drop make the airtime hit harder.",
          },
          {
            title: "Weight and lightness",
            body: "The title sets a flowing script — “She who flies” — over heavy block capitals, with the skier cut through the type. Grounded and airborne in one frame.",
          },
        ],
      },
      outcome: {
        title: "Watched, not served.",
        body: "7.7K people chose to watch it with no ad spend behind it. That's the real test of a trailer: does it make you press play, and does it make you stay to the end.",
        stats: [
          { value: "7.7K", label: "organic views on the recut" },
          { value: "$0", label: "spent on paid promotion" },
          { value: "1", label: "custom title treatment, built for the cut" },
        ],
      },
      pitch: {
        title: "Footage that deserves a better cut?",
        body: "Trailers, promos and social edits — cut for pace, and built to be watched to the end.",
        cta: "Start a video project",
      },
    },
  },
  {
    id: "winter-heroes",
    name: "Winter Heroes",
    video: true,
    categories: ["video"],
    client: "Red Bull (concept)",
    title: "Winter Heroes — multi-format video",
    description:
      "Long-form documentary recut for short-form social. One source, several channels.",
    tags: ["Video Edit", "Social Cuts"],
    thumbnail: WH_COVER,
    caseStudy: {
      seoTitle: "Winter Heroes — short-form social video",
      seoDescription:
        "Winter Heroes, a winter sports documentary concept from Red Bull Media House footage, edited long-form and recut into short-form social video.",
      headline: { lead: "One film.", accent: "Every feed." },
      lede: "Winter Heroes is a winter sports documentary concept built from Red Bull Media House footage. I edited and directed the long-form film, then broke it down into short-form social cuts — so one source feeds several channels instead of living in a single upload.",
      year: "2025",
      role: "Editing, direction, short-form social cutdowns",
      delivered: ["Long-form documentary edit", "Title design", "Short-form social cuts"],
      hero: {
        video: {
          provider: "youtube",
          id: "Go_kBKhxUrc",
          start: 7,
          title: "Winter Heroes — documentary",
          poster: WH_COVER,
        },
      },
      brief: {
        title: "Long-form doesn't travel.",
        body: "A documentary earns its runtime on YouTube. In a social feed it gets a second, maybe two. Most long-form video never makes it to the feed at all — and the best moments stay buried in the middle of the film.",
        points: [
          {
            title: "Hook in the first second",
            body: "A social cut can't build slowly. It has to open on the moment, not the setup.",
          },
          {
            title: "Stand on its own",
            body: "Every clip has to make sense to someone who has never seen the film around it.",
          },
          {
            title: "Point back to the film",
            body: "The short cuts are the trailer for the long one. Each should leave people wanting the full story.",
          },
        ],
      },
      approach: {
        title: "Cut once. Publish many.",
        intro:
          "Repurposing isn't trimming. Each short cut is edited as its own piece, from the same footage.",
        steps: [
          {
            title: "Cut the film first",
            body: "The long-form edit sets the story, the title and the look. The opening card — Winter Heroes over peaks above the clouds — sets the scale.",
          },
          {
            title: "Mine it for moments",
            body: "Then I went back through for the moments that work alone: a run, a fall, a line of dialogue, a view.",
          },
          {
            title: "Re-pace for the feed",
            body: "Each moment gets its own hook, its own pacing and its own ending, sized for the channel it's going to.",
          },
        ],
      },
      outcome: {
        title: "The cheapest content you'll ever make.",
        body: "It's already shot. Recutting long-form for social turns one upload into a run of posts, each one pointing back to the full film — no new shoot, no new budget line.",
        stats: [
          { value: "1", label: "source documentary, edited and directed end to end" },
          { value: "0", label: "new shoots — every cut comes from the original footage" },
          { value: "Many", label: "short-form social cuts from one long-form film" },
        ],
      },
      pitch: {
        title: "Sitting on long-form footage?",
        body: "I'll recut it into short-form social video that works in the feed — and sends people back to the full piece.",
        cta: "Start a video project",
      },
    },
  },
  {
    id: "brand-system",
    name: "Brand system",
    featured: true,
    href: "/brand",
    categories: ["design"],
    client: "Self-initiated",
    title: "Brand system — case study",
    description:
      "A wordmark, six color tokens, one type family and a set of components, rebuilt from a busy site into one system that every page is made from.",
    tags: ["Identity", "Design system", "Web"],
    thumbnail: {
      src: "/images/brand/thumb.webp",
      alt: "Brand system board: the wordmark on ink and paper, color swatches and condensed type",
      width: 1440,
      height: 900,
    },
  },
];

export function projectHref(project: Project) {
  return project.href ?? `/work/${project.id}`;
}

/** Projects with a /work/[id] page. */
export const CASE_STUDIES = PROJECTS.filter(
  (p): p is Project & { caseStudy: CaseStudy } => Boolean(p.caseStudy),
);

export const WORK_FILTERS: { id: "all" | WorkCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "design", label: "Design" },
  { id: "video", label: "Video" },
  { id: "marketing", label: "Marketing" },
];
