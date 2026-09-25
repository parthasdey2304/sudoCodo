import Link from "next/link";

export const LEGAL_DOCS = [
  { href: "/legal/terms", label: "Terms of Service", icon: "📜" },
  { href: "/legal/privacy", label: "Privacy Policy", icon: "🔒" },
  { href: "/legal/dpdp", label: "DPDP Act 2023 Compliance", icon: "⚖️" },
  { href: "/legal/security", label: "Security & Architecture", icon: "🛡️" },
];

export type LegalSection = {
  id: string;
  heading: string;
  body: React.ReactNode;
};

export default function LegalShell({
  title,
  intro,
  updated,
  active,
  sections,
}: {
  title: string;
  intro: string;
  updated: string;
  active: string;
  sections: LegalSection[];
}) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid gap-6 lg:grid-cols-[250px_1fr] items-start">
      {/* Sidebar: documents + on-this-page (mirrors reference docs UX) */}
      <aside className="lg:sticky lg:top-[68px] rounded-[20px] border bg-white p-4 dark:bg-slate-900 dark:border-slate-700" aria-label="Legal documents">
        <h2 className="text-[11px] font-black tracking-[0.2em] text-slate-500 dark:text-slate-400">DOCUMENTS</h2>
        <nav aria-label="Legal documents" className="mt-2 space-y-1">
          {LEGAL_DOCS.map((d) => {
            const isActive = d.href === active;
            return (
              <Link
                key={d.href}
                href={d.href}
                aria-current={isActive ? "page" : undefined}
                className={`block px-3 py-2 rounded-xl text-sm font-bold transition ${
                  isActive
                    ? "text-lime-500 dark:text-lime-400"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
                }`}
              >
                {d.icon} {d.label}
              </Link>
            );
          })}
        </nav>
        <div className="my-3 border-t border-slate-200 dark:border-slate-800" aria-hidden="true" />
        <h2 className="text-[11px] font-black tracking-[0.2em] text-slate-500 dark:text-slate-400">ON THIS PAGE</h2>
        <ol className="mt-2 space-y-1.5">
          {sections.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="block text-sm font-medium text-slate-500 hover:text-slate-900 hover:underline underline-offset-4 dark:text-slate-400 dark:hover:text-white">
                {i + 1}. {s.heading}
              </a>
            </li>
          ))}
        </ol>
      </aside>

      {/* Article */}
      <main id="main-content">
        <article className="rounded-[20px] border bg-white p-5 sm:p-8 dark:bg-slate-900 dark:border-slate-700">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">{title}</h1>
          <p className="mt-2 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300">{intro}</p>
          <p className="mt-1 text-xs font-semibold text-slate-400">Last updated {updated}</p>
          <div className="mt-6 space-y-7">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-24">
                <h2 id={`${s.id}-h`} className="text-lg font-black text-slate-900 dark:text-white">
                  {i + 1}. {s.heading}
                </h2>
                <div className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300 space-y-2 [&_a]:underline [&_a]:underline-offset-4 [&_a]:font-bold [&_a]:text-indigo-600 dark:[&_a]:text-indigo-400 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:bg-slate-100 [&_code]:border [&_code]:border-slate-200 [&_code]:font-mono [&_code]:text-[12px] dark:[&_code]:bg-slate-800 dark:[&_code]:border-slate-700 dark:[&_code]:text-slate-100">
                  {s.body}
                </div>
              </section>
            ))}
          </div>
        </article>
      </main>
    </div>
  );
}
