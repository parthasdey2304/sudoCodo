import type { Metadata } from "next";
import MonkeyCodeClient from "./MonkeyCodeClient";
import Breadcrumbs from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbSchema, courseSchema } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/seo";

const TITLE = "CodeMonkey Jr: Visual Block Sequencing & Python";
const DESC =
  "Learn block sequencing, loops, and Python code transitions with interactive monkey adventure puzzles on sudoCodo.";
const CANONICAL = `${SITE_URL}/monkey-code`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: ["codemonkey jr", "block sequencing", "loops for kids", "python for kids", "monkey coding game"],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: CANONICAL,
    images: [{ url: `${SITE_URL}/og/og-sequencing.png`, width: 1200, height: 630, alt: "Monkey Coding Jr. — visual block sequencing with live Python code" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [`${SITE_URL}/og/og-sequencing.png`] },
};

export default function MonkeyCodePage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Monkey Coding Jr.", url: CANONICAL },
  ]);
  const course = courseSchema({
    name: "Monkey Coding Jr. — Visual Block Sequencing & Python",
    url: CANONICAL,
    description: DESC,
    image: `${SITE_URL}/og/og-sequencing.png`,
    totalLevels: 6,
    providerUrl: SITE_URL,
  });
  return (
    <>
      <JsonLd data={[breadcrumb, course]} />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Monkey Coding Jr.", href: "/monkey-code", current: true }]} />
      <MonkeyCodeClient />
      <section className="max-w-6xl mx-auto px-4 pb-8" aria-labelledby="monkey-seo">
        <h2 id="monkey-seo" className="font-black text-slate-900 dark:text-white mt-4">Blocks today, Python tomorrow 🐍</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Every block mirrors a real Python call — <code className="px-1 rounded bg-slate-100 dark:bg-slate-800 font-mono">hero.move_right()</code>, loops become <code className="px-1 rounded bg-slate-100 dark:bg-slate-800 font-mono">for _ in range(n):</code>. Progress and stars save to <code className="px-1 rounded bg-slate-100 dark:bg-slate-800 font-mono">sudocodo_monkey_progress</code> on this device.</p>
      </section>
    </>
  );
}
