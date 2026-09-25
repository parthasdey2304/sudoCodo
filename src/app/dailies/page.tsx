import type { Metadata } from "next";
import DailiesClient from "./DailiesClient";
import Breadcrumbs from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbSchema, softwareAppSchema } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/seo";

const TITLE = "Daily Challenges - Sudoku, KenKen & Quizzes | SudoCodo";
const DESC =
  "New boards every midnight — Sudoku, Cross Math, KenKen, Math Maze, Divisions & Pin Ball Recall. Earn pi, keep streaks, free with no login.";
const CANONICAL = `${SITE_URL}/dailies`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: ["daily challenges", "sudoku kids", "kenken", "math maze", "division quiz"],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: CANONICAL,
    images: [{ url: `${SITE_URL}/og/og-home.png`, width: 1200, height: 630, alt: "Daily Challenges — fresh boards every midnight" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [`${SITE_URL}/og/og-home.png`] },
};

export default function DailiesPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Daily Challenges", url: CANONICAL },
  ]);
  const app = softwareAppSchema({
    name: "Daily Challenges",
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
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Daily Challenges", href: "/dailies", current: true }]} />
      <div className="sr-only"><h1>Daily Challenges — Sudoku, KenKen, Divisions & Memory</h1></div>
      <DailiesClient />
    </>
  );
}
