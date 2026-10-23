/**
 * Everything editable on /covers lives here.
 * `npm run check:content` lists any [PLACEHOLDER] values left in the source.
 */

export const COVERS_CTA_HREF = "/contact?service=covers";

/** Price per cover in USD, number only. */
export const PRICE_PER_COVER = 50;

export const REVISIONS_PER_COVER = 2;

/** Short turnaround line, used in the hero, steps and FAQ. */
export const TURNAROUND = "about a day";

/** How turnaround scales with order size. */
export const TURNAROUND_SCALING =
  "Bigger orders take longer, at roughly five covers a day.";

export const PAYMENT_TERMS =
  "Payment is due when the project starts. Larger projects can be paid in installments, with the final payment on completion.";

/** What's included with every cover. */
export const DELIVERABLES = [
  "Final cover in high resolution",
  "3D rendering of the cover",
  "Reasonable extra assets on request, like a side panel",
  `${REVISIONS_PER_COVER} rounds of revisions`,
];

export const RIGHTS_NOTE =
  "All rights to the cover transfer to you. I keep the right to show it in my portfolio and advertising, unless you ask me not to.";

export const STEPS = [
  {
    title: "Brief",
    body: "Send the pack name, genre, mood, and a few covers you like. Previous volumes help if it's a series.",
  },
  {
    title: "Pay & start",
    body: "Payment at the start. Bigger projects can be split into installments.",
  },
  {
    title: "Draft",
    body: `A first cover in ${TURNAROUND}. ${TURNAROUND_SCALING}`,
  },
  {
    title: "Revisions & files",
    body: `${REVISIONS_PER_COVER} rounds of revisions, then the high-res cover and its 3D render.`,
  },
];

export const FAQ = [
  {
    q: "How long does a cover take?",
    a: `${TURNAROUND.charAt(0).toUpperCase()}${TURNAROUND.slice(1)} for one cover. ${TURNAROUND_SCALING} If you have a launch date, put it in the brief.`,
  },
  {
    q: "How many revisions do I get?",
    a: `${REVISIONS_PER_COVER} rounds of revisions per cover.`,
  },
  {
    q: "Can you keep a series consistent across volumes?",
    a: "Yes. Most of my covers are numbered volumes in a running series. I keep the layout, type, and side-panel system consistent so new volumes sit together on the shelf.",
  },
  {
    q: "What should I include in a brief?",
    a: "Pack name, genre, the feeling you want, where it's being sold, and links to covers you like (yours or anyone's). If it's a new volume, link the earlier ones.",
  },
  {
    q: "Is any of it AI-generated?",
    a: "No. Every cover on this site is built from licensed stock photography, 3D renders, and paint-over work.",
  },
  {
    q: "Who owns the cover?",
    a: RIGHTS_NOTE,
  },
  {
    q: "How does payment work?",
    a: PAYMENT_TERMS,
  },
];

export const SHOW_NO_AI_LINE = true;
export const NO_AI_LINE =
  "Every cover here is hand-built from photography, 3D, and paint-over. No AI-generated imagery.";
