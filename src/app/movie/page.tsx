import type { Metadata } from "next";
import GameClient from "./GameClient";
import Breadcrumbs from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbSchema, softwareAppSchema } from "@/components/JsonLd";
import { SEO, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: SEO.movie.title,
  description: SEO.movie.description,
  keywords: ["movie animation coding", "math animation", "sine cosine blocks"],
  alternates: { canonical: SEO.movie.canonical },
  openGraph: {
    title: SEO.movie.title,
    description: SEO.movie.description,
    url: SEO.movie.canonical,
    images: [{ url: SEO.movie.ogImage!, width: 1200, height: 630, alt: "Movie animation game — code with math and time" }],
  },
  twitter: { card: "summary_large_image", title: SEO.movie.title, description: SEO.movie.description, images: [SEO.movie.ogImage!] },
};

export default function MoviePage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Movie Animation Game", url: SEO.movie.canonical },
  ]);
  const app = softwareAppSchema({
    name: "Movie Animation Game",
    url: SEO.movie.canonical,
    description: SEO.movie.description,
    image: SEO.movie.ogImage!,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    offersPrice: "0",
  });
  return (
    <>
      <JsonLd data={[breadcrumb, app]} />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Movie Animation", href: "/movie", current: true }]} />
      <GameClient />
      <section className="max-w-6xl mx-auto px-4 pb-8" aria-labelledby="movie-seo">
        <h2 id="movie-seo" className="font-black text-slate-900 mt-4">Animate with formulas</h2>
        <p className="text-sm text-slate-600 mt-1">Blockly Movie teaches variables &amp; math: set <code>x, y, scale</code> each frame using <code>sin, cos, t</code>. 4 scenes (bounce, orbit, wave, spiral) with speed/scale controls.</p>
      </section>
    </>
  );
}
