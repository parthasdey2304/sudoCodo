import Link from "next/link";

export type GameCardProps = {
  href: string;
  title: string;
  desc: string;
  icon: string;
  color: string;
  accent: string;
  level?: string;
  badge?: string;
};

export default function GameCard({ href, title, desc, icon, color, accent, level, badge }: GameCardProps) {
  // Accessible, semantic card: one <article> per game, descriptive anchor text for sitelinks
  const ariaLabel = `${title} — ${desc} — ${level ?? ""}`.trim();
  return (
    <article className="contents">
      <Link
        href={href}
        aria-label={ariaLabel}
        className="group relative overflow-hidden rounded-[20px] border bg-white p-4 sm:p-5 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <div className={`absolute inset-0 opacity-[0.06] group-hover:opacity-[0.10] transition ${color}`} aria-hidden="true" />
        <div className="flex items-start justify-between gap-3 relative">
          <div
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl grid place-items-center text-2xl sm:text-3xl shadow-sm border ${accent}`}
            role="img"
            aria-label={`${title} icon`}
          >
            {icon}
          </div>
          {badge && <span className="text-[10px] font-extrabold tracking-widest px-2 py-1 rounded-full bg-slate-900 text-white">{badge}</span>}
        </div>
        <h3 className="mt-3 font-extrabold text-slate-900 leading-tight">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2">{desc}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-900 text-white group-hover:bg-indigo-600 transition" aria-hidden="true">Play {title} →</span>
          {level && <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 border">{level}</span>}
        </div>
      </Link>
    </article>
  );
}
