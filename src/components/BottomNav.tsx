"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/duels", label: "Arena", icon: "⚔️" },
  { href: "/ascenso", label: "Ascenso", icon: "🗺️" },
  { href: "/pond", label: "Compete", icon: "🦆" },
  { href: "/dailies", label: "Dailies", icon: "📅" },
  { href: "/#feed", label: "Feed", icon: "📰" },
];

export default function BottomNav() {
  const pathname = usePathname();

  const openMenu = () => {
    window.dispatchEvent(new Event("sudocodo-open-menu"));
  };

  return (
    <nav
      aria-label="Bottom tab navigation"
      className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/90 backdrop-blur border-t border-slate-200 dark:bg-[#12161F]/95 dark:border-slate-800"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-6 px-1 pt-1.5 pb-1.5">
        {TABS.map((t) => {
          const active = t.href === "/#feed" ? false : pathname === t.href || (t.href === "/duels" && pathname === "/");
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center gap-0.5 py-1.5 rounded-xl text-[10px] font-black transition active:scale-95 ${
                active ? "text-indigo-600 dark:text-yellow-300" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <span className={`text-xl leading-none ${active ? "scale-110" : ""}`} aria-hidden="true">
                {t.icon}
              </span>
              {t.label}
              {active && <span className="w-4 h-1 rounded-full bg-current" aria-hidden="true" />}
            </Link>
          );
        })}
        <button
          onClick={openMenu}
          aria-label="Open full menu"
          className="flex flex-col items-center gap-0.5 py-1.5 rounded-xl text-[10px] font-black text-slate-500 dark:text-slate-400 transition active:scale-95"
        >
          <span className="text-xl leading-none" aria-hidden="true">⋯</span>
          More
        </button>
      </div>
    </nav>
  );
}
