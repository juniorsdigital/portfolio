import { CASE_STUDIES } from "@/lib/projects";
import { SERVICES, serviceHref } from "@/lib/services";
import { SITE } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const pages: { route: string; priority: number }[] = [
    { route: "", priority: 1 },
    { route: "/services", priority: 0.9 },
    ...SERVICES.map((s) => ({ route: serviceHref(s), priority: 0.9 })),
    { route: "/work", priority: 0.9 },
    ...CASE_STUDIES.map((p) => ({ route: `/work/${p.id}`, priority: 0.8 })),
    { route: "/brand", priority: 0.8 },
    { route: "/about", priority: 0.7 },
    { route: "/contact", priority: 0.7 },
  ];
  return pages.map(({ route, priority }) => ({
    url: `${SITE.url}${route}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}
