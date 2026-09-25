import Link from "next/link";

export default function Breadcrumbs({ items }: { items: { name: string; href: string; current?: boolean }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="max-w-6xl mx-auto px-4 pt-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-500">
        {items.map((it, i) => (
          <li key={it.href} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true" className="text-slate-300">/</span>}
            {it.current ? (
              <span aria-current="page" className="font-bold text-slate-900">{it.name}</span>
            ) : (
              <Link href={it.href} className="hover:text-indigo-600 hover:underline underline-offset-4 transition">{it.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
