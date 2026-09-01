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
  thumbnail: { src: string; alt: string; width: number; height: number };
  media: WorkMedia[];
};

export const PROJECTS: Project[] = [
  {
    id: "ryzagrow",
    categories: ["design", "marketing"],
    client: "Ryza, LLC.",
    title: "RyzaGrow — DTC Campaign",
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
    title: "60+ E-Commerce Product Covers",
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
    title: "Teen Registration Campaign",
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
    client: "Red Bull (Mock)",
    title: "She Who Flies — Documentary",
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
    client: "Red Bull (Mock)",
    title: "Winter Heroes — Multi-Format Video",
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
];

export const WORK_FILTERS: { id: "all" | WorkCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "design", label: "Design" },
  { id: "video", label: "Video" },
  { id: "marketing", label: "Marketing" },
];
