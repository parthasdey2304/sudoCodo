"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { countDone, getAscenso, getPi, getRatings, useCountdown, type Ratings } from "@/lib/progress";

export default function HomeHub() {
  const countdown = useCountdown();
  const [ratings, setRatings] = useState<Ratings>({ math: 1000, memory: 1000, puzzle: 1000, logic: 1000 });
  const [ascenso, setAscenso] = useState({ current: 1, unlocked: 1, done: [] as number[] });
  const [today, setToday] = useState({ p: 0, m: 0, mem: 0 });
  const [pi, setPi] = useState(0);

  useEffect(() => {
    const sync = () => {
      setRatings(getRatings());
      const a = getAscenso();
      setAscenso({ current: a.current, unlocked: a.unlocked, done: a.done });
      setToday({
        p: countDone(["sudoku-easy", "cross-easy", "kenken-easy", "mazetap-easy"]),
        m: countDone(["div3", "divopen"]),
        mem: countDone(["pinball"]),
      });
      setPi(getPi());
    };
    sync();
    window.addEventListener("sudocodo-progress", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("sudocodo-progress", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const best = (Object.entries(ratings) as [keyof Ratings, number][]).sort((a, b) => b[1] - a[1])[0];

  return (
    <section id="feed" className="max-w-6xl mx-auto px-4 mt-8 scroll-mt-20" aria-labelledby="hub-heading">
      <h2 id="hub-heading" className="font-black text-slate-900 dark:text-white text-lg sm:text-xl text-center">
        ⚔️ Arena Hub — battle, climb & streak
      </h2>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {/* Duels preview */}
        <Link href="/duels" className="rounded-[20px] border-2 border-yellow-300 bg-white p-4 hover:shadow-xl hover:-translate-y-0.5 transition dark:bg-[#181D27] dark:border-yellow-700" aria-label="Open Duels Arena">
          <div className="flex items-center justify-between">
            <span className="text-2xl" aria-hidden="true">⚔️</span>
            <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-yellow-300 text-slate-900">★ {best[1]} {best[0].toUpperCase()}</span>
          </div>
          <div className="mt-1 font-black text-slate-900 dark:text-white">Duels Arena</div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Math • Memory • Puzzle • Logic battles →</p>
          <div className="mt-2 flex gap-1">
            {(Object.entries(ratings) as [string, number][]).map(([k, v]) => (
              <span key={k} className="flex-1 text-center text-[10px] font-black px-1 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {k.slice(0, 3).toUpperCase()} {v}
              </span>
            ))}
          </div>
        </Link>

        {/* Ascenso preview */}
        <Link href="/ascenso" className="rounded-[20px] border-2 border-violet-300 bg-white p-4 hover:shadow-xl hover:-translate-y-0.5 transition dark:bg-[#181D27] dark:border-violet-700" aria-label="Open Ascenso Nivel Ruta">
          <div className="flex items-center justify-between">
            <span className="text-2xl" aria-hidden="true">🗺️</span>
            <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-violet-600 text-white">Lv {ascenso.current}/10</span>
          </div>
          <div className="mt-1 font-black text-slate-900 dark:text-white">Ascenso • Nivel Ruta</div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">10-node climb, play now →</p>
          <div className="mt-2 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden" aria-hidden="true">
            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" style={{ width: `${(ascenso.done.length / 10) * 100}%` }} />
          </div>
        </Link>

        {/* Dailies preview */}
        <Link href="/dailies" className="rounded-[20px] border-2 border-amber-300 bg-white p-4 hover:shadow-xl hover:-translate-y-0.5 transition dark:bg-[#181D27] dark:border-amber-700" aria-label="Open Daily Challenges">
          <div className="flex items-center justify-between">
            <span className="text-2xl" aria-hidden="true">📅</span>
            <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 tabular-nums">⏱ {countdown}</span>
          </div>
          <div className="mt-1 font-black text-slate-900 dark:text-white">Daily Challenges</div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">🧩 {today.p}/4 • ➗ {today.m}/2 • 👁️ {today.mem}/1 • π {pi} →</p>
          <div className="mt-2 text-[11px] font-bold text-amber-600 dark:text-amber-400">Fresh boards every midnight 🌙</div>
        </Link>
      </div>
    </section>
  );
}
