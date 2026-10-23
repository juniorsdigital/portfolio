import { PROJECTS } from "@/lib/projects";
import { SITE_URL } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/covers",
    "/work",
    ...PROJECTS.map((p) => `/work/${p.id}`),
    "/about",
    "/contact",
  ];
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));
}
