import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import LegalShell from "@/components/LegalShell";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/seo";

const TITLE = "Privacy Policy - Your Data Stays on Device";
const DESC =
  "SudoCodo Privacy Policy: no accounts, no tracking, no servers receiving data. Game progress lives only in your browser localStorage.";
const CANONICAL = `${SITE_URL}/legal/privacy`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: ["privacy policy", "kids privacy", "localStorage data", "no tracking"],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: CANONICAL,
    images: [{ url: `${SITE_URL}/og/og-home.png`, width: 1200, height: 630, alt: "sudoCodo Privacy Policy" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [`${SITE_URL}/og/og-home.png`] },
};

export default function PrivacyPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Legal", url: `${SITE_URL}/legal` },
    { name: "Privacy Policy", url: CANONICAL },
  ]);
  return (
    <>
      <JsonLd data={[breadcrumb]} />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Legal", href: "/legal" },
          { name: "Privacy Policy", href: "/legal/privacy", current: true },
        ]}
      />
      <LegalShell
        title="Privacy Policy"
        intro="What SudoCodo collects, where it lives, and how to erase it — the short version: nothing leaves your device."
        updated="26 September 2026"
        active="/legal/privacy"
        sections={[
          {
            id: "our-role",
            heading: "Our role",
            body: (
              <>
                <p>There are no accounts, so there is no personal data held about you on any server. Your browser is the only place your activity exists, which means you — or the parent/guardian managing the device — are fully in control of it.</p>
              </>
            ),
          },
          {
            id: "what-we-collect",
            heading: "What we collect",
            body: (
              <>
                <p>Nothing on our servers. On your device, the app stores game progress in <code>localStorage</code>: levels and stars (<code>sudocodo_progress</code>), duel ratings (<code>sudocodo_duels_rating</code>), daily completions (<code>sudocodo_dailies_v1</code>), Ascenso nodes (<code>sudocodo_ascenso_v1</code>), π balance (<code>sudocodo_pi_bank</code>) and theme choice (<code>sudocodo_theme</code>).</p>
              </>
            ),
          },
          {
            id: "what-we-never-do",
            heading: "What we never do",
            body: (
              <>
                <p>We run no analytics, no advertising, no tracking cookies and no behavioural profiling — for children or anyone else. We do not sell data, because there is no data to sell, and we share nothing with advertisers, insurers or data brokers.</p>
              </>
            ),
          },
          {
            id: "storage-on-device",
            heading: "Storage on your device",
            body: (
              <>
                <p>Everything above sits in your browser&apos;s own storage and is sent nowhere. Daily counters reset each midnight by date comparison, on-device. Tapping Reset progress (or clearing site data in browser settings) erases it all instantly.</p>
              </>
            ),
          },
          {
            id: "childrens-data",
            heading: "Children's data",
            body: (
              <>
                <p>SudoCodo is made for children and collects nothing from them: no names, no emails, no photos, no voice, no location. A child can play for years without a single byte of personal data leaving the device. Parents and teachers: standard device-level parental controls apply as usual.</p>
              </>
            ),
          },
          {
            id: "your-rights",
            heading: "Your rights",
            body: (
              <>
                <p>Access, correction and erasure are immediate and in your hands — your data is on your device, so viewing or deleting it needs no request to us. We engage no data processors and serve no business customers, so there is no Data Processing Addendum to sign; there is simply nothing to process on anyone&apos;s behalf.</p>
              </>
            ),
          },
          {
            id: "contact",
            heading: "Contact",
            body: (
              <>
                <p>Privacy questions or concerns: open an issue at <a href="https://github.com/parthasdey2304/sudoCodo/issues" target="_blank" rel="noopener noreferrer">github.com/parthasdey2304/sudoCodo/issues</a>. Under India&apos;s DPDP Act 2023 you may also approach the Data Protection Board of India; see our <a href="/legal/dpdp">DPDP compliance note</a>.</p>
              </>
            ),
          },
        ]}
      />
    </>
  );
}
