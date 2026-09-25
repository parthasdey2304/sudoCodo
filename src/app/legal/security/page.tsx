import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import LegalShell from "@/components/LegalShell";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/seo";

const TITLE = "Security & Architecture - Static, No Backend";
const DESC =
  "SudoCodo security posture: fully static site, no backend or database, no secrets, HTTPS, security headers and pinned audited dependencies.";
const CANONICAL = `${SITE_URL}/legal/security`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: ["security", "static site security", "kids app safety"],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: CANONICAL,
    images: [{ url: `${SITE_URL}/og/og-home.png`, width: 1200, height: 630, alt: "sudoCodo security and architecture" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [`${SITE_URL}/og/og-home.png`] },
};

export default function SecurityPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Legal", url: `${SITE_URL}/legal` },
    { name: "Security & Architecture", url: CANONICAL },
  ]);
  return (
    <>
      <JsonLd data={[breadcrumb]} />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Legal", href: "/legal" },
          { name: "Security & Architecture", href: "/legal/security", current: true },
        ]}
      />
      <LegalShell
        title="Security & Architecture"
        intro="Why a static kids app with no backend is about as small an attack surface as software gets."
        updated="26 September 2026"
        active="/legal/security"
        sections={[
          {
            id: "static-architecture",
            heading: "Static architecture",
            body: (
              <>
                <p>Every page is prerendered to static HTML at build time. There is no application server, no database, no user sessions and no API that accepts input — the entire categories of bugs that plague dynamic apps (injection, broken access control, session theft) have nowhere to live.</p>
              </>
            ),
          },
          {
            id: "no-secrets",
            heading: "No secrets or auth to steal",
            body: (
              <>
                <p>There are no API keys in the client, no accounts, no passwords and no payment flows. An attacker studying the shipped JavaScript finds game logic and styling — nothing that unlocks anything else.</p>
              </>
            ),
          },
          {
            id: "transport-platform",
            heading: "Transport and platform",
            body: (
              <>
                <p>Pages are served over HTTPS by the hosting platform. Responses carry <code>X-Content-Type-Options</code>, <code>X-Frame-Options: DENY</code>, a strict <code>Referrer-Policy</code> and a restrictive <code>Permissions-Policy</code> (see <code>next.config.mjs</code>), and the <code>X-Powered-By</code> header is disabled.</p>
              </>
            ),
          },
          {
            id: "supply-chain",
            heading: "Supply chain",
            body: (
              <>
                <p>Dependencies are pinned in <code>package-lock.json</code>, the framework is kept on patched releases (Next.js 15.5.x security backports), and <code>npm audit</code> findings are triaged — remaining advisories are build-time-only packages that never ship to browsers. Every change lands through reviewed pull requests with squash merges.</p>
              </>
            ),
          },
          {
            id: "local-data-safety",
            heading: "Local data safety",
            body: (
              <>
                <p>Game progress lives in same-origin <code>localStorage</code>, readable only by pages on this domain. The app never renders user input as HTML (the only inline scripts are our own structured-data JSON and a static theme snippet), keeping cross-site scripting with nothing to steal even if it occurred.</p>
              </>
            ),
          },
          {
            id: "disclosure",
            heading: "Responsible disclosure",
            body: (
              <>
                <p>Found something that looks wrong? Please report it privately first via <a href="https://github.com/parthasdey2304/sudoCodo/issues" target="_blank" rel="noopener noreferrer">GitHub issues</a> so we can fix it before details circulate. We will acknowledge, patch, and credit reporters who give us a fair chance to respond.</p>
              </>
            ),
          },
        ]}
      />
    </>
  );
}
