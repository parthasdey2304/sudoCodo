import type { Metadata } from "next";
import GameClient from "./GameClient";
import Breadcrumbs from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbSchema, courseSchema, softwareAppSchema } from "@/components/JsonLd";
import { SEO, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: SEO.maze.title,
  description: SEO.maze.description,
  keywords: ["maze coding game", "blockly maze", "loops for kids", "learn to code maze"],
  alternates: { canonical: SEO.maze.canonical },
  openGraph: {
    title: SEO.maze.title,
    description: SEO.maze.description,
    url: SEO.maze.canonical,
    images: [{ url: SEO.maze.ogImage!, width: 1200, height: 630, alt: "Maze coding game — guide the astronaut with block loops" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.maze.title,
    description: SEO.maze.description,
    images: [SEO.maze.ogImage!],
  },
};

export default function MazePage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Maze Coding Game", url: SEO.maze.canonical },
  ]);

  const course = courseSchema({
    name: "Maze Coding Game — Loops & Logic Puzzles",
    url: SEO.maze.canonical,
    description: SEO.maze.description,
    image: SEO.maze.ogImage!,
    totalLevels: 10,
    providerUrl: SITE_URL,
  });

  const app = softwareAppSchema({
    name: "Maze Coding Game",
    url: SEO.maze.canonical,
    description: SEO.maze.description,
    image: SEO.maze.ogImage!,
    applicationCategory: "GameApplication",
    operatingSystem: "Any",
    offersPrice: "0",
  });

  return (
    <>
      <JsonLd data={[breadcrumb, course, app]} />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Maze Coding Game", href: "/maze", current: true },
        ]}
      />
      {/* Single H1 lives in GameShell (SSR'd) — no duplicate needed */}
      <GameClient />
      <section className="max-w-6xl mx-auto px-4 pb-8" aria-labelledby="maze-seo">
        <h2 id="maze-seo" className="font-black text-slate-900 mt-4">About this maze game</h2>
        <p className="text-sm text-slate-600 mt-1">
          This Blockly Maze clone teaches sequencing, loops (<code>repeat</code>) and <code>if path ahead</code>. Each of 10 levels increases difficulty — from straight paths to branching mazes. Runs fully in the browser, progress saved to <code>localStorage</code>, no login.
        </p>
      </section>
    </>
  );
}
