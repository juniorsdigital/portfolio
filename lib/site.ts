export const SITE = {
  brand: "John Swanson",
  /** The mark: initials, used for the favicon and small spaces. */
  mark: "jrs.",
  name: "John Swanson",
  byline: "Cover art, 3D packaging and trailers for people who sell digital products.",
  email: "johnreidswanson@gmail.com",
  location: "Philadelphia",
  url: "https://www.johnswanson.co",
  description:
    "John Swanson is a freelance cover artist in Philadelphia: music, sample and sound pack covers, 3D box renders and trailer edits. 75+ covers shipped for OvaniSound.",
  /** The headline promise on every page that shows the default share card. */
  tagline: "Cover art that sells the pack.",
  /** How fast a brief gets an answer. Shown in the hero, process and contact page. */
  replyTime: "1 business day",
  /** Sends from the johnswanson.co domain verified in Resend. */
  fromEmail: "John Swanson <hello@johnswanson.co>",
} as const;

export const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

/** Routes whose top of page sits on the paper ground. */
export const PAPER_ROUTES = ["/about", "/contact"] as const;

/** Headline results pulled from the project list, shown on the home page. */
export const RESULTS = [
  { value: "75+", label: "music and sound pack covers for OvaniSound, across 32+ genres" },
  { value: "30", label: "distinct covers shipped in a single week" },
  { value: "2×", label: "sales for RyzaGrow after the direct-to-consumer campaign" },
] as const;

/**
 * Profiles that belong to John: shown in the footer and sent to Google as the
 * Person's `sameAs`. Nothing renders until at least one is filled in.
 *
 *   { label: "Instagram", href: "https://www.instagram.com/…" },
 *   { label: "Behance", href: "https://www.behance.net/…" },
 *   { label: "LinkedIn", href: "https://www.linkedin.com/in/…" },
 */
export const SOCIAL_LINKS: { label: string; href: string }[] = [];

export type Testimonial = {
  /** The client's words, without quote marks. Real quotes only. */
  quote: string;
  name: string;
  /** "Founder, OvaniSound" */
  role: string;
  /** Optional case study id from lib/projects.ts to link to. */
  project?: string;
};

/**
 * Client quotes for the home page and service pages. The section stays hidden
 * until at least one is added. Ask permission before publishing a name.
 */
export const TESTIMONIALS: Testimonial[] = [];

/** Working terms, shown on the contact page and in every service FAQ. */
export const TERMS = {
  reply: `I reply to every brief within ${SITE.replyTime}, with a scope and a fixed price — or a straight no if I'm not the right fit.`,
  payment:
    "Fixed-price projects are 50% up front and 50% on delivery. Monthly work is billed at the start of each month.",
  rights:
    "Once the invoice is paid, the final work is yours with full commercial rights. I may show it in my portfolio unless you ask me not to.",
} as const;
