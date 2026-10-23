export const OFFERINGS = [
  {
    num: "01",
    title: "Graphic design",
    summary:
      "Covers, posters and ads built to sell the thing — on the shelf or in the feed.",
    items: [
      "Product covers",
      "Digital art",
      "Poster designs",
      "Digital advertising",
    ],
  },
  {
    num: "02",
    title: "Video editing",
    summary:
      "Social cuts and video ads, recut from long-form and sized for every channel.",
    items: ["Social media edits", "Video advertising"],
  },
  {
    num: "03",
    title: "Marketing",
    summary:
      "Google Business pages and social accounts, set up and run without a twelve-person team.",
    items: [
      "Google Business page management",
      "Google Business page creation",
      "Social media management",
    ],
  },
] as const;

export const SERVICE_OPTIONS = [
  { value: "graphic-design", label: "Graphic design" },
  { value: "video-editing", label: "Video editing" },
  { value: "marketing", label: "Marketing" },
  { value: "multiple", label: "More than one" },
] as const;

export type ServiceValue = (typeof SERVICE_OPTIONS)[number]["value"];

export const SERVICE_NEEDS: Record<ServiceValue, string[]> = {
  "graphic-design": [
    "Product covers",
    "Digital art",
    "Poster designs",
    "Digital advertising",
  ],
  "video-editing": ["Social media edits", "Video advertising"],
  marketing: [
    "Google Business page management",
    "Google Business page creation",
    "Social media management",
  ],
  multiple: [
    "Product covers",
    "Digital art",
    "Poster designs",
    "Digital advertising",
    "Social media edits",
    "Video advertising",
    "Google Business page management",
    "Google Business page creation",
    "Social media management",
  ],
};

export const TIMELINE_OPTIONS = [
  "ASAP",
  "1–2 weeks",
  "About a month",
  "Flexible",
] as const;

export const BUDGET_OPTIONS = [
  "Under $500",
  "$500–1.5k",
  "$1.5k–5k",
  "$5k+",
  "Not sure yet",
] as const;
