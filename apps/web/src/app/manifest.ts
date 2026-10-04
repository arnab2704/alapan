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
    icons: [
      { src: "/favicon-32.png", sizes: "32x32", type: "image/png", purpose: "any" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
    ]
  };
}
