import type { Metadata } from "next";
import { SITE } from "@/lib/site";

/**
 * Page metadata with a canonical URL and Open Graph tags that point at the
 * page itself. A page-level `openGraph` replaces the layout's whole object,
 * so site name, locale and the default share card are set here on every page.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: { url: string; alt: string };
  type?: "website" | "article";
  /** Skip the "— John Swanson" suffix when the title already names him. */
  absoluteTitle?: boolean;
}): Metadata {
  // Defaults to the generated card in app/opengraph-image.tsx.
  const card = image ?? { url: "/opengraph-image", alt: `${SITE.name} — design, video & marketing that ships` };
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      siteName: SITE.brand,
      locale: "en_US",
      type,
      url: path,
      title,
      description,
      images: [{ url: card.url, width: 1200, height: 630, alt: card.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [card.url],
    },
  };
}
