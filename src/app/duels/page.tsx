import type { Metadata } from "next";
import DuelsClient from "./DuelsClient";
import Breadcrumbs from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbSchema, softwareAppSchema } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/seo";

const TITLE = "Duels Arena - Math, Memory, Puzzle Battles | SudoCodo";
const DESC =
  "Battle in Math, Memory, Puzzle & Logic duels — speed arithmetic, grid flash, truth tables. Win rating points, all saved locally, no login.";
const CANONICAL = `${SITE_URL}/duels`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: ["math duels", "memory games", "puzzle battles", "kids competition"],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: CANONICAL,
    images: [{ url: `${SITE_URL}/og/og-home.png`, width: 1200, height: 630, alt: "Duels Arena — math, memory and puzzle battles" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [`${SITE_URL}/og/og-home.png`] },
};

export default function DuelsPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Duels Arena", url: CANONICAL },
  ]);
  const app = softwareAppSchema({
    name: "Duels Arena",
    url: CANONICAL,
    description: DESC,
    image: `${SITE_URL}/og/og-home.png`,
    applicationCategory: "GameApplication",
    operatingSystem: "Any",
    offersPrice: "0",
  });
  return (
    <>
      <JsonLd data={[breadcrumb, app]} />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Duels Arena", href: "/duels", current: true }]} />
      <div className="sr-only"><h1>Duels Arena — Math, Memory, Puzzle & Logic Battles</h1></div>
      <DuelsClient />
    </>
  );
}
