export const SITE = {
  brand: "John Swanson",
  /** The mark: initials, used for the favicon and small spaces. */
  mark: "jrs.",
  name: "John Swanson",
  byline: "Freelance design, video and marketing.",
  email: "johnreidswanson@gmail.com",
  location: "Philadelphia",
  url: "https://www.johnswanson.co",
  description:
    "John Swanson — freelance graphic design, video editing, and marketing in Philadelphia.",
  fromEmail: "John Swanson <hello@juniors.digital>",
} as const;

export const NAV_LINKS = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

/** Routes whose top of page sits on the paper ground. */
export const PAPER_ROUTES = ["/about", "/contact"] as const;

/** Headline results pulled from the project list, shown on the home page. */
export const RESULTS = [
  { value: "2×", label: "sales for RyzaGrow after the direct-to-consumer campaign" },
  { value: "30", label: "distinct product covers for OvaniSound in a single week" },
  { value: "7.7K", label: "organic views on the She Who Flies trailer recut" },
] as const;
