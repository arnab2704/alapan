import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Alapon | আলাপন",
    short_name: "আলাপন",
    description: "A few minutes with Bengal, every day.",
    start_url: "/bn",
    scope: "/",
    display: "standalone",
    background_color: "#fffaf2",
    theme_color: "#bf2f3a",
    lang: "bn",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }]
  };
}
