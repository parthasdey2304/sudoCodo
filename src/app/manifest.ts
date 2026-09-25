import type { MetadataRoute } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Learn to Code with Blocks`,
    short_name: SITE_NAME,
    description: "8 block-coding games for kids — Puzzle, Maze, Bird, Turtle, Movie, Music, Pond & CodeMonkey sequencing. No login, portrait-first.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8f9ff",
    theme_color: "#6366f1",
    lang: "en",
    dir: "ltr",
    orientation: "portrait-primary",
    scope: SITE_URL,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
    categories: ["education", "games", "kids"],
  };
}
