/**
 * Everything editable on /covers lives here.
 *
 * 🔒 OWNER INPUT: every value in [BRACKETS] is a placeholder John needs to fill.
 * `npm run check:content` lists any that remain. Prices render as "from $X" —
 * enter just the number, e.g. price: "120".
 */

export const COVERS_CTA_HREF = "/contact?service=covers";

export type CoverPackage = {
  name: string;
  /** Number only, e.g. "120". 🔒 OWNER INPUT */
  price: string;
  summary: string;
  includes: string[];
  addOn?: boolean;
};

export const PACKAGES: CoverPackage[] = [
  {
    name: "Sound-pack cover",
    price: "[PRICE]",
    summary: "One store-ready cover for a sample, preset, or loop pack.",
    includes: [
      "1000×1000 store cover",
      "[N] rounds of revisions",
      "Source files",
    ],
  },
  {
    name: "Music-pack cover + side panel",
    price: "[PRICE]",
    summary: "A cover plus matching side-panel art that expands the scene.",
    includes: [
      "1000×1000 store cover",
      "Matching side-panel art",
      "[N] rounds of revisions",
      "Source files",
    ],
  },
  {
    name: "3D pack render / animated cover",
    price: "[PRICE]",
    summary: "Turn a flat cover into a boxed 3D render or a short animated loop.",
    includes: ["3D box render (Blender)", "Animated cover (After Effects)"],
    addOn: true,
  },
];

/** One line shown under the packages. 🔒 OWNER INPUT, e.g. "an extra revision round". */
export const BOOK_DIRECT_PERK = "[PERK]";

/** 🔒 OWNER INPUT, e.g. "5–7 days". */
export const TURNAROUND = "[TURNAROUND]";

export const STEPS = [
  {
    title: "Brief",
    body: "Send the pack name, genre, mood, and a few covers you like. Previous volumes help if it's a series.",
  },
  {
    title: "Draft",
    body: `A first cover comes back in ${TURNAROUND}.`,
  },
  {
    title: "Revisions",
    body: "Tell me what to push or pull. Changes go back and forth until it's right for the store page.",
  },
  {
    title: "Final files",
    body: "Store-sized exports plus source files, ready to upload.",
  },
];

/** 🔒 OWNER INPUT (P1-1 §6): confirm this list. */
export const DELIVERABLES = [
  "1000×1000 cover, PNG and JPG",
  "Side-panel art, when included",
  "Layered PSD on request",
  "3D render or animated loop, when added",
];

/** 🔒 OWNER INPUT: confirm commercial-use terms. */
export const COMMERCIAL_USE_NOTE =
  "Final covers are yours to use commercially on your store pages and marketing.";

/** Drafts for John to edit. Anything in [BRACKETS] needs a real answer. */
export const FAQ = [
  {
    q: "How long does a cover take?",
    a: `A first draft lands in ${TURNAROUND}. If you have a launch date, put it in the brief.`,
  },
  {
    q: "How many revisions do I get?",
    a: "[N] rounds are included in each package.",
  },
  {
    q: "Can you keep a series consistent across volumes?",
    a: "Yes. Most of my covers are numbered volumes in a running series — I keep the layout, type, and side-panel system consistent so new volumes sit together on the shelf.",
  },
  {
    q: "What should I include in a brief?",
    a: "Pack name, genre, the feeling you want, where it's being sold, and links to covers you like (yours or anyone's). If it's a new volume, link the earlier ones.",
  },
  {
    q: "Where does the imagery come from?",
    // 🔒 OWNER INPUT: confirm licensing wording before launch.
    a: "Licensed stock photography, 3D renders, and paint-over work. I'll tell you what's in your cover and how it's licensed.",
  },
  {
    q: "How does payment work?",
    a: "[PAYMENT_TERMS]",
  },
];

/**
 * 🔒 OWNER INPUT (P2-5): set to true ONLY if every cover John sells is made
 * without AI-generated imagery. When false the trust line is not shown.
 */
export const SHOW_NO_AI_LINE = false;
export const NO_AI_LINE =
  "Hand-built from photography, 3D, and paint-over. No AI-generated imagery.";
