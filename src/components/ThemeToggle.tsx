"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("sudocodo_theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const isDark = saved ? saved === "dark" : prefersDark;
      setDark(isDark);
      document.documentElement.classList.toggle("dark", isDark);
    } catch {}
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    try {
      localStorage.setItem("sudocodo_theme", next ? "dark" : "light");
      document.documentElement.classList.toggle("dark", next);
    } catch {}
  };

  if (!mounted) {
    return (
      <button aria-label="Toggle theme" className={`${compact ? "w-9 h-9" : "px-3 py-1.5"} rounded-full bg-white border text-sm font-bold dark:bg-slate-800 dark:border-slate-700`}>
        🌗
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={dark}
      title={dark ? "☀️ Light mode" : "🌙 Dark mode"}
      className={`rounded-full border-2 font-black transition active:scale-95 hover:shadow ${
        compact
          ? "w-9 h-9 grid place-items-center text-lg bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700"
          : "px-3 py-1.5 text-sm bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
      }`}
    >
      {dark ? "☀️" : "🌙"}
      {!compact && <span className="ml-1 hidden sm:inline">{dark ? "Light" : "Dark"}</span>}
    </button>
  );
}
