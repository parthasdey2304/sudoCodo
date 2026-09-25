"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const nav = [
  { href: "/", label: "All Games", icon: "🎮", desc: "Home — 8 games" },
  { href: "/duels", label: "Duels Arena", icon: "⚔️", desc: "Math, memory, puzzle battles" },
  { href: "/ascenso", label: "Ascenso", icon: "🗺️", desc: "10-level Nivel Ruta climb" },
  { href: "/dailies", label: "Dailies", icon: "📅", desc: "Fresh boards every midnight" },
  { href: "/puzzle", label: "Puzzle", icon: "🧩", desc: "Learn block shapes" },
  { href: "/maze", label: "Maze", icon: "🧭", desc: "Loops & logic puzzles" },
  { href: "/sequencing", label: "Sequencing", icon: "🐒", desc: "CodeMonkey style order" },
  { href: "/bird", label: "Bird", icon: "🐦", desc: "Conditional logic fun" },
  { href: "/turtle", label: "Turtle", icon: "🐢", desc: "Draw with code" },
  { href: "/movie", label: "Movie", icon: "🎬", desc: "Animate with math" },
  { href: "/music", label: "Music", icon: "🎵", desc: "Compose with blocks" },
  { href: "/pond", label: "Pond", icon: "🦆", desc: "Code duel vs AI" },
  { href: "/monkey-code", label: "Monkey Coding Jr.", icon: "🐒", desc: "Block Sequencing & Loops" },
  { href: "/legal", label: "Legal", icon: "⚖️", desc: "Terms, privacy & compliance" },
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

  // Lock body scroll when fullscreen menu is open + close on Escape
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("sudocodo-open-menu", onOpen);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("sudocodo-open-menu", onOpen);
    };
  }, [open ]);

  const desktopNav = [
    { href: "/", label: "Games" },
    { href: "/duels", label: "Duels" },
    { href: "/ascenso", label: "Ascenso" },
    { href: "/dailies", label: "Dailies" },
    { href: "/maze", label: "Maze" },
    { href: "/sequencing", label: "Sequencing" },
    { href: "/pond", label: "Pond" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b dark:bg-slate-950/80 dark:border-slate-800" role="banner">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2" aria-label="SudoCodo — Block coding games home">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-500 flex items-center justify-center text-white font-black text-sm" aria-hidden="true">S</div>
              <span className="font-extrabold tracking-tight text-slate-900 dark:text-white">Sudo<span className="text-indigo-600 dark:text-indigo-400">Codo</span></span>
              <span className="hidden sm:inline ml-2 text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800">BETA</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
              {desktopNav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  aria-current={pathname === n.href ? "page" : undefined}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${pathname === n.href ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "hover:bg-slate-100 text-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
                  {progress.completed}/{progress.total} completed
                </span>
              </div>
              {/* Light / Dark toggle in Navbar */}
              <ThemeToggle compact />
              <button
                onClick={() => setOpen((v) => !v)}
                className="w-9 h-9 rounded-xl bg-slate-900 text-white grid place-items-center hover:bg-slate-700 transition dark:bg-white dark:text-slate-900"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
              >
                {open ? (
                  <span className="text-lg font-black leading-none" aria-hidden="true">×</span>
                ) : (
                  <div className="space-y-1" aria-hidden="true">
                    <div className="w-4 h-0.5 bg-current rounded" />
                    <div className="w-4 h-0.5 bg-current rounded" />
                    <div className="w-4 h-0.5 bg-current rounded" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Fullscreen hamburger menu — takes entire page, vertical options in the middle */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div className="min-h-full flex flex-col max-w-lg mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/30 grid place-items-center font-black">S</div>
                <span className="font-extrabold text-lg">SudoCodo</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/15 border border-white/20 font-bold">
                  {progress.completed}/{progress.total} ✓
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle compact />
                <button
                  onClick={() => setOpen(false)}
                  className="w-10 h-10 rounded-full bg-white text-slate-900 grid place-items-center text-xl font-black hover:bg-yellow-300 transition"
                  aria-label="Close menu"
                >
                  ×
                </button>
              </div>
            </div>

            <p className="mt-6 text-center text-white/80 text-xs font-extrabold tracking-[0.25em]">CHOOSE A GAME 🎮</p>

            <nav aria-label="Fullscreen menu" className="mt-4 flex-1 flex flex-col justify-center gap-2.5 pb-6">
              {nav.map((n, i) => {
                const active = pathname === n.href;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`group flex items-center gap-4 px-5 py-3.5 rounded-2xl border-2 transition active:scale-[0.98] ${
                      active
                        ? "bg-white text-slate-900 border-white shadow-xl"
                        : "bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur"
                    }`}
                  >
                    <span className={`w-11 h-11 rounded-xl grid place-items-center text-2xl shrink-0 ${active ? "bg-slate-900 text-white" : "bg-white/15 border border-white/20"}`} aria-hidden="true">
                      {n.icon}
                    </span>
                    <span className="flex-1 text-left">
                      <span className="block font-black text-base leading-tight">
                        {i + 1}. {n.label} {active && "← you are here"}
                      </span>
                      <span className={`block text-xs font-semibold ${active ? "text-slate-500" : "text-white/70"}`}>{n.desc}</span>
                    </span>
                    <span className="text-xl" aria-hidden="true">→</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pb-4 text-center">
              <p className="text-white/70 text-xs font-semibold">♾️ Unlimited workspace • 💡 Hints • ✨ Magic Solve • No login 💛</p>
              <button onClick={() => setOpen(false)} className="mt-3 px-6 py-2 rounded-full bg-white/15 border border-white/25 text-white text-sm font-bold hover:bg-white/25">
                Close Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
