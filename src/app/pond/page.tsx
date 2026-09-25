import type { Metadata } from "next";
import GameClient from "./GameClient";
import Breadcrumbs from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbSchema, softwareAppSchema } from "@/components/JsonLd";
import { SEO, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: SEO.pond.title,
  description: SEO.pond.description,
  keywords: ["pond coding game", "duck battle AI", "blockly pond", "code duel"],
  alternates: { canonical: SEO.pond.canonical },
  openGraph: {
    title: SEO.pond.title,
    description: SEO.pond.description,
    url: SEO.pond.canonical,
    images: [{ url: SEO.pond.ogImage!, width: 1200, height: 630, alt: "Pond battle — code your duck vs AI" }],
  },
  twitter: { card: "summary_large_image", title: SEO.pond.title, description: SEO.pond.description, images: [SEO.pond.ogImage!] },
};

export default function PondPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Pond Battle Game", url: SEO.pond.canonical },
  ]);
  const app = softwareAppSchema({
    name: "Pond Battle Game",
    url: SEO.pond.canonical,
    description: SEO.pond.description,
    image: SEO.pond.ogImage!,
    applicationCategory: "GameApplication",
    operatingSystem: "Any",
    offersPrice: "0",
  });
  return (
    <>
      <JsonLd data={[breadcrumb, app]} />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Pond Battle", href: "/pond", current: true }]} />
      <GameClient />
      <section className="max-w-6xl mx-auto px-4 pb-8" aria-labelledby="pond-seo">
        <h2 id="pond-seo" className="font-black text-slate-900 mt-4">Strategy beats syntax</h2>
        <p className="text-sm text-slate-600 mt-1">Pond is the capstone: combine <code>scan, if enemy → fire, swim &amp; turn</code> in a loop. Your program runs against a simple AI — first to hit wins. No backend needed.</p>
      </section>
    </>
  );
}
