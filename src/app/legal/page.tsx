import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";
import { LEGAL_DOCS } from "@/components/LegalShell";
import { SITE_URL } from "@/lib/seo";

const TITLE = "Legal - Terms, Privacy & Compliance";
const DESC =
  "SudoCodo legal documents: Terms of Service, Privacy Policy, DPDP Act 2023 compliance and Security. Free kids games, no accounts, data stays on device.";
const CANONICAL = `${SITE_URL}/legal`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: CANONICAL,
    images: [{ url: `${SITE_URL}/og/og-home.png`, width: 1200, height: 630, alt: "sudoCodo legal documents" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [`${SITE_URL}/og/og-home.png`] },
};

const BLURBS: Record<string, string> = {
  "/legal/terms": "The playing rules — free service, fair use, and learning content.",
  "/legal/privacy": "What we collect (nothing on servers), what never leaves your device.",
  "/legal/dpdp": "How a zero-data kids app maps to India's DPDP Act 2023.",
  "/legal/security": "Static site, no backend, no secrets — our security posture.",
};

export default function LegalHub() {
  const breadcrumb = breadcrumbSchema([{ name: "Home", url: SITE_URL }, { name: "Legal", url: CANONICAL }]);
  return (
    <>
      <JsonLd data={[breadcrumb]} />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Legal", href: "/legal", current: true }]} />
      <main id="main-content" className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">⚖️ Legal</h1>
        <p className="mt-2 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 max-w-2xl">
          Short, plain-language documents. SudoCodo is free, has no accounts and no payments — most legal pages other apps need simply don&apos;t apply here.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {LEGAL_DOCS.map((d) => (
            <Link
              key={d.href}
              href={d.href}
              className="rounded-[20px] border bg-white p-5 hover:shadow-xl hover:-translate-y-0.5 transition dark:bg-slate-900 dark:border-slate-700"
              aria-label={`Read ${d.label}`}
            >
              <div className="text-3xl" aria-hidden="true">{d.icon}</div>
              <div className="mt-2 font-black text-slate-900 dark:text-white">{d.label}</div>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{BLURBS[d.href]}</p>
              <span className="mt-3 inline-block text-xs font-black text-indigo-600 dark:text-indigo-400">Read →</span>
            </Link>
          ))}
        </div>
        <aside className="mt-5 rounded-[20px] border border-dashed border-slate-300 p-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300" aria-label="Pages we deliberately skip">
          <p className="font-black text-slate-900 dark:text-white">📄 Pages we skip — on purpose</p>
          <ul className="mt-1 list-disc pl-5 space-y-1">
            <li><b>Refund &amp; Cancellation Policy</b> — nothing is sold, so there is nothing to refund. Stated in Terms §2.</li>
            <li><b>Data Processing Addendum</b> — we engage no data processors and serve no business customers. Stated in Privacy §6.</li>
          </ul>
        </aside>
      </main>
    </>
  );
}
