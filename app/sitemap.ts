import { CASE_STUDIES } from "@/lib/projects";
import { SERVICES, serviceHref } from "@/lib/services";
import { SITE } from "@/lib/site";
import type { MetadataRoute } from "next";

/**
 * When each page's content last changed. Google ignores `lastmod` on sites
 * where it is always "now", so bump a date only when that page's copy or
 * work actually changes. Routes not listed fall back to SITE_UPDATED.
 */
const SITE_UPDATED = "2026-11-11";
const UPDATED: Record<string, string> = {
  "/brand": "2026-11-05",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { route: string; priority: number }[] = [
    { route: "", priority: 1 },
    { route: "/cover-art", priority: 0.9 },
    { route: "/services", priority: 0.9 },
    ...SERVICES.map((s) => ({ route: serviceHref(s), priority: 0.8 })),
    { route: "/work", priority: 0.8 },
    ...CASE_STUDIES.map((p) => ({ route: `/work/${p.id}`, priority: 0.7 })),
    { route: "/about", priority: 0.6 },
    { route: "/contact", priority: 0.6 },
    { route: "/brand", priority: 0.4 },
  ];
  return pages.map(({ route, priority }) => ({
    url: `${SITE.url}${route}`,
    lastModified: UPDATED[route] ?? SITE_UPDATED,
    changeFrequency: "monthly",
    priority,
  }));
}
