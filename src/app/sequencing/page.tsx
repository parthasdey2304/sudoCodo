import type { Metadata } from "next";
import GameClient from "./GameClient";
import Breadcrumbs from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbSchema, courseSchema, softwareAppSchema } from "@/components/JsonLd";
import { SEO, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: SEO.sequencing.title,
  description: SEO.sequencing.description,
  keywords: ["sequencing game", "codemonkey junior", "order code blocks", "coding for kids sequencing"],
  alternates: { canonical: SEO.sequencing.canonical },
  openGraph: {
    title: SEO.sequencing.title,
    description: SEO.sequencing.description,
    url: SEO.sequencing.canonical,
    images: [{ url: SEO.sequencing.ogImage!, width: 1200, height: 630, alt: "Sequencing game — order blocks like CodeMonkey to collect bananas" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: SEO.sequencing.title, description: SEO.sequencing.description, images: [SEO.sequencing.ogImage!] },
};

export default function SequencingPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Sequencing Game", url: SEO.sequencing.canonical },
  ]);
  const course = courseSchema({
    name: "Sequencing Game — CodeMonkey Style",
    url: SEO.sequencing.canonical,
    description: SEO.sequencing.description,
    image: SEO.sequencing.ogImage!,
    totalLevels: 8,
    providerUrl: SITE_URL,
  });
  const app = softwareAppSchema({
    name: "Sequencing Coding Game",
    url: SEO.sequencing.canonical,
    description: SEO.sequencing.description,
    image: SEO.sequencing.ogImage!,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any",
    offersPrice: "0",
  });

  return (
    <>
      <JsonLd data={[breadcrumb, course, app]} />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Sequencing Game", href: "/sequencing", current: true }]} />
      {/* Single H1 lives in GameShell (SSR'd) — no duplicate needed */}
      <GameClient />
      <section className="max-w-6xl mx-auto px-4 pb-8" aria-labelledby="seq-seo">
        <h2 id="seq-seo" className="font-black text-slate-900 mt-4">How sequencing teaches coding</h2>
        <p className="text-sm text-slate-600 mt-1">CodeMonkey Junior sequencing is about putting steps in exact order. This clone uses a 5×5–6×6 grid, monkey &amp; bananas, walls (trees) and repeat blocks. Mirrors the official CodeMonkey sequencing chapter 1 but runs offline with Tailwind portrait UI.</p>
      </section>
    </>
  );
}
