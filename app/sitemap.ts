import { SITE } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/work", "/brand", "/about", "/contact"];
  return routes.map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified: new Date(),
  }));
}
