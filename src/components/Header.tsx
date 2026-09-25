"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const nav = [
  { href: "/", label: "Games" },
  { href: "/maze", label: "Maze" },
  { href: "/sequencing", label: "Sequencing" },
  { href: "/turtle", label: "Turtle" },
  { href: "/bird", label: "Bird" },
  { href: "/pond", label: "Pond" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState({ completed: 0, total: 8 });

  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem("sudocodo_progress");
        if (!raw) return;
        const p = JSON.parse(raw);
        const completed = Object.keys(p || {}).filter((k) => p[k]?.completed).length;
        setProgress({ completed, total: 8 });
      } catch {}
    };
    read();
    window.addEventListener("storage", read);
    window.addEventListener("sudocodo-progress", read as any);
    return () => {
      window.removeEventListener("storage", read);
      window.removeEventListener("sudocodo-progress", read as any);
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b" role="banner">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2" aria-label="SudoCodo — Block coding games home">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-500 flex items-center justify-center text-white font-black text-sm" aria-hidden="true">S</div>
            <span className="font-extrabold tracking-tight text-slate-900">Sudo<span className="text-indigo-600">Codo</span></span>
            <span className="hidden sm:inline ml-2 text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border">BETA</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={pathname === n.href ? "page" : undefined}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${pathname === n.href ? "bg-slate-900 text-white" : "hover:bg-slate-100 text-slate-600"}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold">
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {progress.completed}/{progress.total} completed
              </span>
            </div>
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden w-9 h-9 rounded-xl bg-slate-900 text-white grid place-items-center"
              aria-label="menu"
            >
              <div className="space-y-1">
                <div className="w-4 h-0.5 bg-white rounded" />
                <div className="w-4 h-0.5 bg-white rounded" />
                <div className="w-4 h-0.5 bg-white rounded" />
              </div>
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden pb-4 grid grid-cols-2 gap-2">
            {nav.map((n) => (
              <Link
                key={n.href}
                onClick={() => setOpen(false)}
                href={n.href}
                className={`px-3 py-2 rounded-xl text-sm font-semibold text-center border ${pathname === n.href ? "bg-slate-900 text-white border-slate-900" : "bg-white"}`}
              >
                {n.label}
              </Link>
            ))}
            <Link href="/puzzle" onClick={() => setOpen(false)} className="px-3 py-2 rounded-xl text-sm font-semibold text-center border bg-white">Puzzle</Link>
            <Link href="/music" onClick={() => setOpen(false)} className="px-3 py-2 rounded-xl text-sm font-semibold text-center border bg-white">Music</Link>
            <Link href="/movie" onClick={() => setOpen(false)} className="px-3 py-2 rounded-xl text-sm font-semibold text-center border bg-white">Movie</Link>
          </div>
        )}
      </div>
    </header>
  );
}
