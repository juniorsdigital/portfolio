/** Canonical origin. Used by metadataBase, robots, sitemap, canonical/OG URLs and JSON-LD. */
export const SITE_URL = "https://www.johnswanson.co";

/** A value wrapped in [BRACKETS] is an owner placeholder that still needs real copy. */
export function isPlaceholder(value: string | undefined | null) {
  return !value || /^\[[A-Z0-9_ ]+\]$/.test(value.trim());
}

export const SITE = {
  name: "John Swanson",
  url: SITE_URL,
  /** Used by footer, contact page and form fallback. Swap for the johnswanson.co address once mail is set up. */
  email: "johnreidswanson@gmail.com",
  /** Only shown on the About page. Everywhere else uses `remoteLabel`. */
  location: "Philadelphia",
  remoteLabel: "US-based, working remotely",
  /** Completes "I'll reply within …" on the contact form. */
  replyTime: "2 hours during normal business hours",
  /**
   * Resend sender. Must be on a domain verified in Resend, which today is juniors.digital.
   * Override with CONTACT_FROM_EMAIL once johnswanson.co is verified in Resend.
   */
  fromEmail:
    process.env.CONTACT_FROM_EMAIL || "John Swanson <hello@juniors.digital>",
} as const;

/** Location label for everything except the About page. */
export const PLACE_LABEL = SITE.remoteLabel;

export const DESCRIPTIONS = {
  home: `Graphic design, video, and marketing by ${SITE.name}. Pack covers, product art, social video, and campaigns that ship.`,
  work: "Selected covers, campaigns, and video edits — including 60+ pack covers for OvaniSound.",
  about: `About ${SITE.name} — designer, editor, and marketer based in ${SITE.location}.`,
  contact: `Start a project with ${SITE.name}. Pack covers, design, video, and marketing.`,
  covers:
    "AI-free pack covers with 3D renders for sample, preset, and music-pack sellers. $50 a cover, about a day to deliver. 60+ covers shipped.",
} as const;
