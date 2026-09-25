import type { Metadata } from "next";
import GameClient from "./GameClient";
import Breadcrumbs from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbSchema, courseSchema } from "@/components/JsonLd";
import { SEO, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: SEO.bird.title,
  description: SEO.bird.description,
  keywords: ["bird coding game", "conditional logic", "if else blocks", "blockly bird"],
  alternates: { canonical: SEO.bird.canonical },
  openGraph: {
    title: SEO.bird.title,
    description: SEO.bird.description,
    url: SEO.bird.canonical,
    images: [{ url: SEO.bird.ogImage!, width: 1200, height: 630, alt: "Bird coding game — catch the worm with if/else blocks" }],
  },
  twitter: { card: "summary_large_image", title: SEO.bird.title, description: SEO.bird.description, images: [SEO.bird.ogImage!] },
};

export default function BirdPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Bird Coding Game", url: SEO.bird.canonical },
  ]);
  const course = courseSchema({
    name: "Bird Coding Game — Conditional Logic",
    url: SEO.bird.canonical,
    description: SEO.bird.description,
    image: SEO.bird.ogImage!,
    totalLevels: 10,
    providerUrl: SITE_URL,
  });
  return (
    <>
      <JsonLd data={[breadcrumb, course]} />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bird Coding Game", href: "/bird", current: true }]} />
      <div className="sr-only"><h1>Bird Coding Game — Conditional Logic Fun</h1></div>
      <GameClient />
      <section className="max-w-6xl mx-auto px-4 pb-8" aria-labelledby="bird-seo">
        <h2 id="bird-seo" className="font-black text-slate-900 mt-4">Learn if/else with Bird</h2>
        <p className="text-sm text-slate-600 mt-1">Fly the bird to worms using directional blocks plus <code>if worm ahead</code> and repeat — the classic Blockly Bird conditional game, now phone-portrait and saved to cache.</p>
      </section>
    </>
  );
}
