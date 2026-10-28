export type WorkCategory = "design" | "video" | "marketing";

export type WorkMedia =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; provider: "youtube"; id: string; title: string; start?: number };

export type Project = {
  id: string;
  categories: WorkCategory[];
  client: string;
  title: string;
  description: string;
  tags: string[];
  result?: string;
  /** Shown full-width at the top of the grid. */
  featured?: boolean;
  /** Links to a full case-study page instead of opening the quick-view dialog. */
  href?: string;
  thumbnail: { src: string; alt: string; width: number; height: number };
  media: WorkMedia[];
};

export const PROJECTS: Project[] = [
  {
    id: "ryzagrow",
    featured: true,
    categories: ["design", "marketing"],
    client: "Ryza, LLC.",
    title: "RyzaGrow — DTC campaign",
    description:
      "Campaign management, content, and social direction for a direct-to-consumer mushroom grow kit. Owned media across product and web.",
    tags: ["Graphic Design", "Social", "Campaign"],
    result: "2× sales",
    thumbnail: {
      src: "/images/work-ryzagrow.png",
      alt: "RyzaGrow campaign — split product panels for manure and wood-loving mushroom pods",
      width: 800,
      height: 500,
    },
    media: [
      {
        type: "image",
        src: "/images/work-ryzagrow.png",
        alt: "RyzaGrow campaign — split product panels for manure and wood-loving mushroom pods",
      },
    ],
  },
  {
    id: "ovani",
    categories: ["design"],
    client: "OvaniSound",
    title: "60+ e-commerce product covers",
    description:
      "2D and 3D product cover designs for a sound-design catalog. Thirty distinct covers in one week.",
    tags: ["Product Covers", "3D"],
    result: "30 in 1 week",
    thumbnail: {
      src: "/images/work-ovani.png",
      alt: "Ovani Sound e-commerce product covers — 2D stickers and 3D pack renders",
      width: 600,
      height: 375,
    },
    media: [
      {
        type: "image",
        src: "/images/work-ovani.png",
        alt: "Ovani Sound e-commerce product covers — 2D stickers and 3D pack renders",
      },
    ],
  },
  {
    id: "bgcb",
    categories: ["design"],
    client: "Boys & Girls Club of Boston",
    title: "Teen registration campaign",
    description:
      "OOH, print, and digital assets for a teen registration push. One campaign, coordinated across formats.",
    tags: ["Campaign", "OOH"],
    thumbnail: {
      src: "/images/work-bgcb.png",
      alt: "Boys & Girls Club of Boston teen registration campaign mockup",
      width: 600,
      height: 375,
    },
    media: [
      {
        type: "image",
        src: "/images/work-bgcb.png",
        alt: "Boys & Girls Club of Boston teen registration campaign mockup",
      },
    ],
  },
  {
    id: "she-who-flies",
    categories: ["video"],
    client: "Red Bull (concept)",
    title: "She Who Flies — documentary trailer",
    description:
      "Re-edited documentary trailer with custom title treatment. Cinematic cut, no paid promotion.",
    tags: ["Video Edit", "Trailer"],
    result: "7.7K views",
    thumbnail: {
      src: "/images/work-she-who-flies.png",
      alt: "She Who Flies documentary trailer title treatment over mountain imagery",
      width: 600,
      height: 375,
    },
    media: [
      {
        type: "video",
        provider: "youtube",
        id: "OAVv1vL3SaY",
        title: "She Who Flies — Trailer",
      },
    ],
  },
  {
    id: "winter-heroes",
    categories: ["video"],
    client: "Red Bull (concept)",
    title: "Winter Heroes — multi-format video",
    description:
      "Long-form documentary recut for short-form social. One source, several channels.",
    tags: ["Video Edit", "Social Cuts"],
    thumbnail: {
      src: "/images/work-winter-heroes.png",
      alt: "Winter Heroes title treatment over snow-capped peaks",
      width: 800,
      height: 600,
    },
    media: [
      {
        type: "video",
        provider: "youtube",
        id: "Go_kBKhxUrc",
        start: 7,
        title: "Winter Heroes — Documentary",
      },
    ],
  },
  {
    id: "brand-system",
    featured: true,
    href: "/brand",
    categories: ["design"],
    client: "Own studio",
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
    media: [
      {
        type: "image",
        src: "/images/brand/thumb.webp",
        alt: "Brand system board: the wordmark on ink and paper, color swatches and condensed type",
      },
    ],
  },
];

export const WORK_FILTERS: { id: "all" | WorkCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "design", label: "Design" },
  { id: "video", label: "Video" },
  { id: "marketing", label: "Marketing" },
];
