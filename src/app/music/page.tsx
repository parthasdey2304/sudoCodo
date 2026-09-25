import type { Metadata } from "next";
import GameClient from "./GameClient";
import Breadcrumbs from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbSchema, softwareAppSchema } from "@/components/JsonLd";
import { SEO, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: SEO.music.title,
  description: SEO.music.description,
  keywords: ["music coding game", "compose with blocks", "notes C D E"],
  alternates: { canonical: SEO.music.canonical },
  openGraph: {
    title: SEO.music.title,
    description: SEO.music.description,
    url: SEO.music.canonical,
    images: [{ url: SEO.music.ogImage!, width: 1200, height: 630, alt: "Music coding game — compose with block notes" }],
  },
  twitter: { card: "summary_large_image", title: SEO.music.title, description: SEO.music.description, images: [SEO.music.ogImage!] },
};

export default function MusicPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Music Coding Game", url: SEO.music.canonical },
  ]);
  const app = softwareAppSchema({
    name: "Music Coding Game",
    url: SEO.music.canonical,
    description: SEO.music.description,
    image: SEO.music.ogImage!,
    applicationCategory: "MusicApplication",
    operatingSystem: "Any",
    offersPrice: "0",
  });
  return (
    <>
      <JsonLd data={[breadcrumb, app]} />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Music Coding", href: "/music", current: true }]} />
      <GameClient />
      <section className="max-w-6xl mx-auto px-4 pb-8" aria-labelledby="music-seo">
        <h2 id="music-seo" className="font-black text-slate-900 mt-4">Code your melody</h2>
        <p className="text-sm text-slate-600 mt-1">Each block is a note. Order = melody. Adjust tempo &amp; volume, hear via Web Audio API. Songs saved to localStorage — Twinkle demo included.</p>
      </section>
    </>
  );
}
