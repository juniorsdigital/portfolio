export type ServiceSlug = "graphic-design" | "video-editing" | "marketing";

export type ServicePackage = {
  name: string;
  /** Starting price in USD. Shown as "From $X". */
  price: number;
  /** "per cover", "/ month", "one-time" … */
  unit: string;
  body: string;
  includes: string[];
  turnaround: string;
};

export type Service = {
  slug: ServiceSlug;
  num: string;
  name: string;
  /** <title> — leads with the search term the page should rank for. */
  seoTitle: string;
  /** Meta and social description, ~150 characters. */
  seoDescription: string;
  /** Display headline; `accent` is set in signal orange. */
  headline: { lead: string; accent: string };
  lede: string;
  /** One line for service cards on the home page and the hub. */
  summary: string;
  /** Hourly rate for work that doesn't fit a package. */
  hourly: number;
  packages: ServicePackage[];
  stats: { value: string; label: string }[];
  /** Project ids from lib/projects.ts shown as proof. */
  proof: string[];
  fit: string[];
  faqs: { q: string; a: string }[];
  /** schema.org serviceType values. */
  serviceTypes: string[];
};

export const SERVICES: Service[] = [
  {
    slug: "graphic-design",
    num: "01",
    name: "Graphic design",
    seoTitle: "Freelance graphic designer — covers, ads & posters",
    seoDescription:
      "Freelance graphic design in Philadelphia: product cover design, digital ads, posters and campaign graphics. 75+ covers shipped, from $120 per cover.",
    headline: { lead: "Graphic design", accent: "that sells the thing." },
    lede: "Product covers, digital ads, posters and campaign graphics for brands that sell online, on a shelf or on a street corner. I've shipped 75+ e-commerce covers for OvaniSound — 30 of them in a single week — and a full out-of-home campaign for the Boys & Girls Club of Boston.",
    summary:
      "Product covers, digital ads, posters and campaign graphics built to sell — on the shelf or in the feed.",
    hourly: 35,
    packages: [
      {
        name: "Product cover design",
        price: 120,
        unit: "per cover",
        body: "Cover art for e-commerce, music, game and digital products — built to read as a thumbnail in a crowded store grid.",
        includes: [
          "Original 2D cover art",
          "Two rounds of revisions",
          "Store-ready files at every size you list",
          "Optional 3D box render (+$60)",
        ],
        turnaround: "3–5 days per cover",
      },
      {
        name: "Digital ad & social graphics",
        price: 200,
        unit: "per set of 5",
        body: "Static ads and social posts that stop the scroll, sized for Meta, Google Display, TikTok and LinkedIn.",
        includes: [
          "Five designs on one look",
          "Square, portrait and story sizes",
          "Two rounds of revisions",
          "Editable source files",
        ],
        turnaround: "4–6 days",
      },
      {
        name: "Poster & print design",
        price: 150,
        unit: "per design",
        body: "Posters, flyers, event graphics and billboards that read at a glance — from across a room or at 60 mph.",
        includes: [
          "One print layout",
          "Print-ready PDF with bleed",
          "Web and social versions",
          "Two rounds of revisions",
        ],
        turnaround: "3–5 days",
      },
      {
        name: "Campaign design kit",
        price: 600,
        unit: "per campaign",
        body: "One campaign idea carried across out-of-home, print and digital, so every piece reads as the same brand.",
        includes: [
          "Campaign concept and headline",
          "Key visual and layout system",
          "Billboard, print and social adaptations",
          "Templates your team can reuse",
        ],
        turnaround: "2–3 weeks",
      },
    ],
    stats: [
      { value: "75+", label: "product covers shipped across 32+ genres" },
      { value: "30", label: "distinct covers delivered in a single week" },
      { value: "2D+3D", label: "cover art, box renders and stickers" },
    ],
    proof: ["ovani", "bgcb", "brand-system"],
    fit: [
      "You sell digital or physical products and need covers that work as thumbnails.",
      "You have a launch or release schedule and need designs at volume, on time.",
      "You're running a campaign and want one look across print, outdoor and social.",
    ],
    faqs: [
      {
        q: "What does a product cover cost?",
        a: "Covers start at $120 each, with a 3D box render for $60 more. Series and catalogs of five or more are quoted together, so the per-cover price comes down.",
      },
      {
        q: "Can you work inside my existing brand?",
        a: "Yes. Send your logo, fonts and any brand guide and I'll design inside it. If you don't have one yet, I'll set a simple system up front so every piece matches.",
      },
      {
        q: "Do you use AI-generated art?",
        a: "No. Covers are built from original illustration, licensed stock, compositing and hand-painted light. OvaniSound moved its catalog off AI art with exactly this process.",
      },
      {
        q: "What files do I get?",
        a: "Final files at every size you need — PNG, JPG or print-ready PDF — plus editable source files on request.",
      },
    ],
    serviceTypes: ["Graphic design", "Product cover design", "Advertising design", "Poster design"],
  },
  {
    slug: "video-editing",
    num: "02",
    name: "Video editing",
    seoTitle: "Freelance video editor — social video, ads & trailers",
    seoDescription:
      "Freelance video editing: short-form social video, video ads, trailers and long-form recuts for Reels, TikTok and YouTube. From $60 per clip.",
    headline: { lead: "Video editing", accent: "built to be watched." },
    lede: "Short-form social video, video ads, trailers and recuts of footage you already have. My She Who Flies trailer recut pulled 7.7K organic views with $0 in paid promotion — because it was cut to make people press play and stay to the end.",
    summary:
      "Short-form social edits, video ads and trailers — cut for pace and sized for every channel.",
    hourly: 35,
    packages: [
      {
        name: "Short-form social edit",
        price: 60,
        unit: "per clip",
        body: "Reels, TikToks and YouTube Shorts up to 60 seconds, with a hook in the first second and captions for silent autoplay.",
        includes: [
          "Edit up to 60 seconds",
          "Burned-in captions",
          "Vertical 9:16, plus square on request",
          "Two rounds of revisions",
        ],
        turnaround: "2–3 days",
      },
      {
        name: "Long-form to short-form pack",
        price: 250,
        unit: "per 5 clips",
        body: "Turn one podcast, webinar, vlog or documentary into a run of standalone social clips — no new shoot needed.",
        includes: [
          "Five clips from one source",
          "Each with its own hook and ending",
          "Captions and channel sizing",
          "Two rounds of revisions",
        ],
        turnaround: "4–6 days",
      },
      {
        name: "Video ad",
        price: 200,
        unit: "per ad",
        body: "A 15–30 second ad cut from your footage, structured to land the offer before the skip button does.",
        includes: [
          "15–30 second edit",
          "16:9, 1:1 and 9:16 versions",
          "Captions, titles and end card",
          "Two rounds of revisions",
        ],
        turnaround: "3–5 days",
      },
      {
        name: "Trailer or promo edit",
        price: 400,
        unit: "per edit",
        body: "A one-to-three-minute trailer or brand promo with real story structure, music-led cutting and a custom title.",
        includes: [
          "1–3 minute edit",
          "Custom title treatment",
          "Music edit and sound mix",
          "Two rounds of revisions",
        ],
        turnaround: "1–2 weeks",
      },
    ],
    stats: [
      { value: "7.7K", label: "organic views on the She Who Flies trailer recut" },
      { value: "$0", label: "spent on paid promotion to get them" },
      { value: "1→Many", label: "one documentary recut into a run of social clips" },
    ],
    proof: ["she-who-flies", "winter-heroes"],
    fit: [
      "You have footage — long-form, raw or old — that isn't working as hard as it could.",
      "You post on Reels, TikTok or Shorts and need a steady supply of edits.",
      "You're launching something and need an ad or trailer that holds attention.",
    ],
    faqs: [
      {
        q: "Do you shoot video too?",
        a: "I edit. Send footage you already have — phone, camera, screen recording or an old long-form video — and I'll cut it. If you need a shoot, I'll tell you what to capture so the edit works.",
      },
      {
        q: "How do I send footage?",
        a: "A shared Google Drive, Dropbox or WeTransfer link works. Add it in the Links field when you send the brief.",
      },
      {
        q: "Can you do a monthly batch of social clips?",
        a: "Yes. Ongoing clip work is quoted per batch, and the per-clip price drops as the batch grows.",
      },
      {
        q: "What about music?",
        a: "I'll cut to royalty-free tracks or music you've licensed, so nothing gets muted or claimed after it goes live.",
      },
    ],
    serviceTypes: ["Video editing", "Social media video", "Video advertising", "Trailer editing"],
  },
  {
    slug: "marketing",
    num: "03",
    name: "Marketing",
    seoTitle: "Social media & Google Business Profile management",
    seoDescription:
      "Social media management, Google Business Profile setup and DTC campaign management for small businesses in Philadelphia and beyond. Doubled RyzaGrow's sales.",
    headline: { lead: "Marketing", accent: "without a twelve-person team." },
    lede: "Google Business Profile setup and management, social media management and direct-to-consumer campaigns for small businesses. I ran the RyzaGrow campaign end to end — plan, content and channels — and sales doubled.",
    summary:
      "Google Business Profiles, social accounts and DTC campaigns — set up and run by one accountable person.",
    hourly: 35,
    packages: [
      {
        name: "Google Business Profile setup",
        price: 250,
        unit: "one-time",
        body: "Get found on Google Search and Maps. I create or claim your profile, verify it and fill every field that helps you rank locally.",
        includes: [
          "Create or claim, then verify",
          "Categories, services, hours and service area",
          "Description written for local search",
          "Photos, logo and a review link to share",
        ],
        turnaround: "About 1 week, plus Google's verification",
      },
      {
        name: "Google Business Profile management",
        price: 150,
        unit: "/ month",
        body: "Keep the profile active so it keeps ranking: fresh posts, photos and replies, without you logging in.",
        includes: [
          "Weekly Google posts",
          "Review replies and Q&A",
          "Photo and hours updates",
          "Monthly calls, clicks and views report",
        ],
        turnaround: "Ongoing, month to month",
      },
      {
        name: "Social media management",
        price: 500,
        unit: "/ month",
        body: "Two platforms planned, designed, written and posted for you — so your accounts look alive and sound like you.",
        includes: [
          "12 posts a month across two platforms",
          "Content calendar you approve",
          "Graphics, captions and hashtags",
          "Comment replies and a monthly report",
        ],
        turnaround: "Ongoing, month to month",
      },
      {
        name: "DTC campaign management",
        price: 800,
        unit: "/ month",
        body: "For brands selling direct: the campaign plan, the content and the channels, run by one person accountable for the number.",
        includes: [
          "Campaign plan and creative direction",
          "Product content for web and social",
          "Owned media management",
          "Weekly check-ins and results reporting",
        ],
        turnaround: "From 1 month",
      },
    ],
    stats: [
      { value: "2×", label: "sales for RyzaGrow after the DTC campaign" },
      { value: "1", label: "campaign system across product pages and social" },
      { value: "3", label: "channels coordinated for the Boys & Girls Club of Boston" },
    ],
    proof: ["ryzagrow", "bgcb"],
    fit: [
      "You're a local business that doesn't show up on Google Maps — or shows up with old info.",
      "Your social accounts have gone quiet and you don't have time to run them.",
      "You sell direct to consumers and need a campaign that moves sales, not just likes.",
    ],
    faqs: [
      {
        q: "Do I need to give you my passwords?",
        a: "No. For Google Business Profile and most social platforms you add me as a manager, and you can remove me any time. You always own the accounts.",
      },
      {
        q: "Is there a long contract?",
        a: "No. Monthly management runs month to month. Setup work is a one-time fee.",
      },
      {
        q: "Is ad spend included?",
        a: "No. Prices cover the work. If a campaign uses paid ads, the ad budget is paid directly to the platform, so you see exactly where it goes.",
      },
      {
        q: "Do you only work with Philadelphia businesses?",
        a: "No. I'm based in Philadelphia and work with clients anywhere. Google Business Profiles are local by nature, so I'll set yours up for the area you actually serve.",
      },
    ],
    serviceTypes: [
      "Social media management",
      "Google Business Profile management",
      "Local SEO",
      "Campaign management",
    ],
  },
];

export function serviceHref(service: Pick<Service, "slug">) {
  return `/services/${service.slug}`;
}

export function getService(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}

/** "From $120" — prices are whole dollars. */
export function fromPrice(price: number) {
  return `From $${price.toLocaleString("en-US")}`;
}

/** The lowest package price, for cards and schema. */
export function startingPrice(service: Service) {
  return Math.min(...service.packages.map((p) => p.price));
}

/** Pre-fills the contact form with a service and, optionally, a package. */
export function contactHref(slug: ServiceSlug | "multiple", pkg?: string) {
  const params = new URLSearchParams({ service: slug });
  if (pkg) params.set("need", pkg);
  return `/contact?${params.toString()}`;
}

/** How a project runs, shown on the services and contact pages. */
export const PROCESS = [
  {
    title: "Send the brief",
    body: "What you need, when you need it, and roughly what you want to spend. The form takes about five minutes.",
  },
  {
    title: "Get a fixed quote",
    body: "I reply by email with a scope and a fixed price — or a straight no, if I'm not the right person for it.",
  },
  {
    title: "Approve and start",
    body: "You sign off on the scope and I start. You deal with me from the brief to the final files.",
  },
] as const;
