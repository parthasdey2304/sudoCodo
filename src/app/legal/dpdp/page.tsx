import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import LegalShell from "@/components/LegalShell";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/seo";

const TITLE = "DPDP Act 2023 Compliance - Zero-Data Kids App";
const DESC =
  "How SudoCodo maps to India's DPDP Act 2023: no personal data collected, purpose limitation, rights and children's data for a zero-server app.";
const CANONICAL = `${SITE_URL}/legal/dpdp`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: ["DPDP Act 2023", "India data protection", "kids app compliance"],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: CANONICAL,
    images: [{ url: `${SITE_URL}/og/og-home.png`, width: 1200, height: 630, alt: "sudoCodo DPDP Act 2023 compliance" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [`${SITE_URL}/og/og-home.png`] },
};

export default function DpdpPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Legal", url: `${SITE_URL}/legal` },
    { name: "DPDP Act 2023 Compliance", url: CANONICAL },
  ]);
  return (
    <>
      <JsonLd data={[breadcrumb]} />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Legal", href: "/legal" },
          { name: "DPDP Act 2023 Compliance", href: "/legal/dpdp", current: true },
        ]}
      />
      <LegalShell
        title="DPDP Act 2023 Compliance"
        intro="How a kids app that collects nothing maps to India's Digital Personal Data Protection Act."
        updated="26 September 2026"
        active="/legal/dpdp"
        sections={[
          {
            id: "applicability",
            heading: "Applicability",
            body: (
              <>
                <p>The DPDP Act governs personal data. SudoCodo collects no personal data on any server — no names, contacts, or identifiers — so most obligations have nothing to attach to. This note exists so parents, teachers and regulators can verify that claim precisely.</p>
              </>
            ),
          },
          {
            id: "purpose-limitation",
            heading: "Purpose limitation",
            body: (
              <>
                <p>On-device game state (levels, stars, ratings, daily counters) is processed solely to render your progress back to you. It is never repurposed for advertising, profiling or sale — see <a href="/legal/privacy">Privacy §3</a>.</p>
              </>
            ),
          },
          {
            id: "consent",
            heading: "Consent",
            body: (
              <>
                <p>Because no personal data is collected, no consent notice is required to play. Where the platform host (Vercel) logs routine server telemetry such as IP addresses in access logs, that processing is governed by the host&apos;s own policy, not by anything SudoCodo does.</p>
              </>
            ),
          },
          {
            id: "rights",
            heading: "Data principal rights",
            body: (
              <>
                <p>Access, correction and erasure are exercised directly on the device: progress is visible in-game, and Reset progress or clearing site data erases it completely and immediately — no request, review queue or waiting period needed.</p>
              </>
            ),
          },
          {
            id: "breach-notification",
            heading: "Breach notification",
            body: (
              <>
                <p>There is no user database to breach. If a vulnerability affecting players is ever found in the app or its supply chain, we will disclose it in the public repository (<a href="https://github.com/parthasdey2304/sudoCodo/issues" target="_blank" rel="noopener noreferrer">GitHub issues</a>) and ship a fix promptly.</p>
              </>
            ),
          },
          {
            id: "childrens-data",
            heading: "Children's data",
            body: (
              <>
                <p>SudoCodo is designed for children and processes no personal data at all — no verifiable parental consent workflow is needed because there is nothing to consent to. Behavioural tracking and targeted advertising are absent for everyone, children included. Parents and teachers supervising play is still encouraged.</p>
              </>
            ),
          },
        ]}
      />
    </>
  );
}
