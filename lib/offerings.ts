export const OFFERINGS = [
  {
    num: "01",
    title: "Graphic Design",
    items: [
      "Product covers",
      "Digital art",
      "Poster designs",
      "Digital advertising",
    ],
  },
  {
    num: "02",
    title: "Video Editing",
    items: ["Social media edits", "Video advertising"],
  },
  {
    num: "03",
    title: "Marketing",
    items: [
      "Google Business page management",
      "Google Business page creation",
      "Social media management",
    ],
  },
] as const;

export const SERVICE_OPTIONS = [
  { value: "covers", label: "Pack / product covers" },
  { value: "graphic-design", label: "Graphic Design" },
  { value: "video-editing", label: "Video Editing" },
  { value: "marketing", label: "Marketing" },
  { value: "multiple", label: "Multiple" },
] as const;

export type ServiceValue = (typeof SERVICE_OPTIONS)[number]["value"];

export function isServiceValue(value: string | null | undefined): value is ServiceValue {
  return SERVICE_OPTIONS.some((s) => s.value === value);
}

export const SERVICE_NEEDS: Record<ServiceValue, string[]> = {
  covers: [
    "Store cover",
    "Side panel",
    "3D pack render",
    "Animated cover",
  ],
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
  "Under $150",
  "$150–500",
  "$500–1.5k",
  "$1.5k–5k",
  "$5k+",
  "Not sure yet",
] as const;

/** Shown only when "Pack / product covers" is selected. */
export const COVER_COUNT_OPTIONS = ["1", "2–5", "6+", "Ongoing series"] as const;

/** Offering items that have their own page. */
export const OFFERING_LINKS: Partial<Record<string, string>> = {
  "Product covers": "/covers",
};
