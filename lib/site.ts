/** Canonical origin. Used by metadataBase, robots, sitemap, canonical/OG URLs and JSON-LD. */
export const SITE_URL = "https://www.johnswanson.co";

/** A value wrapped in [BRACKETS] is an owner placeholder that still needs real copy. */
export function isPlaceholder(value: string | undefined | null) {
  return !value || /^\[[A-Z0-9_ ]+\]$/.test(value.trim());
}

export const SITE = {
  name: "John Swanson",
  url: SITE_URL,
  /** 🔒 OWNER ACTION (P2-6): swap for hello@johnswanson.co once domain mail exists. Used by footer, contact page and form fallback. */
  email: "johnreidswanson@gmail.com",
  location: "Philadelphia",
  /**
   * 🔒 OWNER INPUT (P2-3): set to false to remove Philadelphia from the hero eyebrow,
   * About eyebrow/copy, "Made in…" heading, footer, portrait alt text and meta descriptions.
   * Left true so nothing changes until John confirms.
   */
  showLocation: true,
  /** Shown instead of the city when showLocation is false. */
  remoteLabel: "US-based, working remotely",
  /** 🔒 OWNER INPUT (P0-5): reply-time promise, e.g. "2 business days". Hidden while it's a placeholder. */
  replyTime: "[REPLY_TIME]",
  /**
   * Resend sender. Must be on a domain verified in Resend, which today is juniors.digital.
   * Override with CONTACT_FROM_EMAIL once johnswanson.co is verified in Resend.
   */
  fromEmail:
    process.env.CONTACT_FROM_EMAIL || "John Swanson <hello@juniors.digital>",
} as const;

/** City when shown, otherwise the remote label. */
export const PLACE_LABEL = SITE.showLocation ? SITE.location : SITE.remoteLabel;

const locationSuffix = SITE.showLocation ? ` Based in ${SITE.location}.` : "";

export const DESCRIPTIONS = {
  home: `Graphic design, video, and marketing by ${SITE.name}. Pack covers, product art, social video, and campaigns that ship.${locationSuffix}`,
  work: "Selected covers, campaigns, and video edits — including 60+ pack covers for Ovani Sound.",
  about: SITE.showLocation
    ? `About ${SITE.name} — designer, editor, and marketer in ${SITE.location}.`
    : `About ${SITE.name} — designer, editor, and marketer working remotely.`,
  contact: `Start a project with ${SITE.name}. Pack covers, design, video, and marketing.`,
  covers:
    "Store-ready pack covers, side panels, and 3D renders for sample, preset, and music-pack sellers. 60+ covers shipped. Send a brief.",
} as const;
