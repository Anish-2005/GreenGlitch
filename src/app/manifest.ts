import type { MetadataRoute } from "next";

import { PROJECT_NAME, TAGLINE } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: PROJECT_NAME,
    short_name: "GreenGlitch",
    description: TAGLINE,
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#10b981",
    lang: "en",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/next.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  };
}
