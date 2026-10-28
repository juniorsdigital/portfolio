import { SITE } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.mark,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0f0f0d",
    theme_color: "#0f0f0d",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
