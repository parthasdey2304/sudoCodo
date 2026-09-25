import type { Metadata } from "next";
import GameClient from "./GameClient";
import Breadcrumbs from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbSchema, softwareAppSchema } from "@/components/JsonLd";
import { SEO, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: SEO.turtle.title,
  description: SEO.turtle.description,
  keywords: ["turtle coding", "turtle graphics", "loops geometry", "blockly turtle"],
  alternates: { canonical: SEO.turtle.canonical },
  openGraph: {
    title: SEO.turtle.title,
    description: SEO.turtle.description,
    url: SEO.turtle.canonical,
    images: [{ url: SEO.turtle.ogImage!, width: 1200, height: 630, alt: "Turtle draw with code — loops and geometry" }],
  },
  twitter: { card: "summary_large_image", title: SEO.turtle.title, description: SEO.turtle.description, images: [SEO.turtle.ogImage!] },
};

export default function TurtlePage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Turtle Draw — Loops & Geometry", url: SEO.turtle.canonical },
  ]);
  const app = softwareAppSchema({
    name: "Turtle Draw with Code",
    url: SEO.turtle.canonical,
    description: SEO.turtle.description,
    image: SEO.turtle.ogImage!,
    applicationCategory: "DesignApplication",
    operatingSystem: "Any",
    offersPrice: "0",
  });
  return (
    <>
      <JsonLd data={[breadcrumb, app]} />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Turtle Draw", href: "/turtle", current: true }]} />
      <GameClient />
      <section className="max-w-6xl mx-auto px-4 pb-8" aria-labelledby="turtle-seo">
        <h2 id="turtle-seo" className="font-black text-slate-900 mt-4">Loops that draw</h2>
        <p className="text-sm text-slate-600 mt-1">Move, turn &amp; repeat — create squares, stars &amp; spirals. Infinite canvas uses HTML5 Canvas and saves your last drawing to localStorage.</p>
      </section>
    </>
  );
}
