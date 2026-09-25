import type { Metadata } from "next";
import GameClient from "./GameClient";
import Breadcrumbs from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbSchema, courseSchema } from "@/components/JsonLd";
import { SEO, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: SEO.puzzle.title,
  description: SEO.puzzle.description,
  keywords: ["puzzle coding game", "block shapes", "learn blockly puzzle"],
  alternates: { canonical: SEO.puzzle.canonical },
  openGraph: {
    title: SEO.puzzle.title,
    description: SEO.puzzle.description,
    url: SEO.puzzle.canonical,
    images: [{ url: SEO.puzzle.ogImage!, width: 1200, height: 630, alt: "Puzzle coding game — snap blocks like puzzle pieces" }],
  },
  twitter: { card: "summary_large_image", title: SEO.puzzle.title, description: SEO.puzzle.description, images: [SEO.puzzle.ogImage!] },
};

export default function PuzzlePage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Puzzle Coding Game", url: SEO.puzzle.canonical },
  ]);
  const course = courseSchema({
    name: "Puzzle Coding Game — Learn Block Shapes",
    url: SEO.puzzle.canonical,
    description: SEO.puzzle.description,
    image: SEO.puzzle.ogImage!,
    totalLevels: 4,
    providerUrl: SITE_URL,
  });
  return (
    <>
      <JsonLd data={[breadcrumb, course]} />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Puzzle Coding Game", href: "/puzzle", current: true }]} />
      <GameClient />
      <section className="max-w-6xl mx-auto px-4 pb-8" aria-labelledby="puzzle-seo">
        <h2 id="puzzle-seo" className="font-black text-slate-900 mt-4">Why start with Puzzle?</h2>
        <p className="text-sm text-slate-600 mt-1">Puzzle teaches that blocks have shapes — only matching notches and plugs connect. The first Blockly game shows syntax-free coding visually, perfect for ages 5+.</p>
      </section>
    </>
  );
}
