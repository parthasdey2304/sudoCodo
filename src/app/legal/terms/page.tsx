import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import LegalShell from "@/components/LegalShell";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/seo";

const TITLE = "Terms of Service - Free Kids Coding Games";
const DESC =
  "SudoCodo Terms of Service: free block-coding and math games for kids, fair use rules, learning content and data that stays on your device.";
const CANONICAL = `${SITE_URL}/legal/terms`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: ["terms of service", "kids games terms", "sudocodo legal"],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: CANONICAL,
    images: [{ url: `${SITE_URL}/og/og-home.png`, width: 1200, height: 630, alt: "sudoCodo Terms of Service" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [`${SITE_URL}/og/og-home.png`] },
};

export default function TermsPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Legal", url: `${SITE_URL}/legal` },
    { name: "Terms of Service", url: CANONICAL },
  ]);
  return (
    <>
      <JsonLd data={[breadcrumb]} />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Legal", href: "/legal" },
          { name: "Terms of Service", href: "/legal/terms", current: true },
        ]}
      />
      <LegalShell
        title="Terms of Service"
        intro="The playing rules between SudoCodo and everyone learning with it."
        updated="26 September 2026"
        active="/legal/terms"
        sections={[
          {
            id: "who-this-covers",
            heading: "Who this covers",
            body: (
              <>
                <p>These terms cover players of all ages, and the parents, guardians and teachers who set SudoCodo up for children. If you are under 13, please explore together with a parent, guardian or teacher.</p>
              </>
            ),
          },
          {
            id: "free-no-payments",
            heading: "Free service, no payments, no refunds",
            body: (
              <>
                <p>Every game, duel, daily challenge and level track is free, with no accounts, subscriptions, in-app purchases or ads. Because nothing is sold, there is nothing to refund or cancel — which is why we publish no Refund &amp; Cancellation Policy.</p>
              </>
            ),
          },
          {
            id: "learning-content",
            heading: "Learning content, no guarantees",
            body: (
              <>
                <p>SudoCodo teaches sequencing, loops, conditionals and arithmetic through play. It is a learning aid, not a certified curriculum, and we make no promise about grades, exam outcomes or skill levels. Hints and auto-solvers are teaching tools — struggling through a level first teaches more.</p>
              </>
            ),
          },
          {
            id: "acceptable-use",
            heading: "Acceptable use",
            body: (
              <>
                <p>Play fair and be kind: don&apos;t attempt to disrupt the site, scrape it aggressively, misrepresent other people&apos;s work as your own, or use SudoCodo to collect data about other players. Since all progress lives in your own browser, &quot;cheating&quot; mostly means skipping your own learning.</p>
              </>
            ),
          },
          {
            id: "intellectual-property",
            heading: "Intellectual property",
            body: (
              <>
                <p>Our game code and writing are ours (see <code>LICENSE</code> in the repository). The block-programming ideas are inspired by <a href="https://blockly.games" target="_blank" rel="noopener noreferrer">Blockly Games</a> and <a href="https://app.codemonkey.com" target="_blank" rel="noopener noreferrer">CodeMonkey</a>; our implementation, levels and artwork direction are original. Emoji illustrations belong to their respective creators.</p>
              </>
            ),
          },
          {
            id: "privacy-data",
            heading: "Privacy and your data",
            body: (
              <>
                <p>There are no accounts and no servers receiving your data: levels, stars, ratings and daily progress are stored only in your browser&apos;s <code>localStorage</code>. Clearing site data or tapping Reset progress erases everything. The full story is in our <a href="/legal/privacy">Privacy Policy</a>.</p>
              </>
            ),
          },
          {
            id: "changes-contact",
            heading: "Changes and contact",
            body: (
              <>
                <p>We may update these terms as the app grows; the Last updated date above always shows the current version. Questions, mistakes spotted, or ideas: open an issue at <a href="https://github.com/parthasdey2304/sudoCodo/issues" target="_blank" rel="noopener noreferrer">github.com/parthasdey2304/sudoCodo/issues</a>.</p>
              </>
            ),
          },
        ]}
      />
    </>
  );
}
