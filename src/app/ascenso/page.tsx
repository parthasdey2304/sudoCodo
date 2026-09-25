import type { Metadata } from "next";
import AscensoClient from "./AscensoClient";
import Breadcrumbs from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbSchema, courseSchema } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/seo";

const TITLE = "Ascenso Nivel Ruta - 10-Level Coding Climb | SudoCodo";
const DESC =
  "Climb the Ascenso Nivel Ruta — 10 gamified coding levels from Puzzle to Pond Champion. Unlock nodes, earn pi, play free with no login.";
const CANONICAL = `${SITE_URL}/ascenso`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: ["level track", "coding progression", "nivel ruta", "kids coding levels"],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: CANONICAL,
    images: [{ url: `${SITE_URL}/og/og-home.png`, width: 1200, height: 630, alt: "Ascenso Nivel Ruta — 10-level coding climb" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [`${SITE_URL}/og/og-home.png`] },
};

export default function AscensoPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Ascenso Nivel Ruta", url: CANONICAL },
  ]);
  const course = courseSchema({
    name: "Ascenso Nivel Ruta — 10-Level Coding Climb",
    url: CANONICAL,
    description: DESC,
    image: `${SITE_URL}/og/og-home.png`,
    totalLevels: 10,
    providerUrl: SITE_URL,
  });
  return (
    <>
      <JsonLd data={[breadcrumb, course]} />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Ascenso Nivel Ruta", href: "/ascenso", current: true }]} />
      <div className="sr-only"><h1>Ascenso Nivel Ruta — 10-Level Coding Climb</h1></div>
      <AscensoClient />
    </>
  );
}
