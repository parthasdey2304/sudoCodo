"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import GameShell from "@/components/GameShell";
import { completeAscensoNode, getAscenso, setAscensoCurrent, type Ascenso } from "@/lib/progress";

type Node = { n: number; name: string; icon: string; route: string; game: string };

const NODES: Node[] = [
  { n: 1, name: "First Blocks", icon: "🧩", route: "/puzzle", game: "Puzzle" },
  { n: 2, name: "Maze Runner", icon: "🧭", route: "/maze", game: "Maze" },
  { n: 3, name: "Monkey Order", icon: "🐒", route: "/sequencing", game: "Sequencing" },
  { n: 4, name: "Bird Logic", icon: "🐦", route: "/bird", game: "Bird" },
  { n: 5, name: "Turtle Art", icon: "🐢", route: "/turtle", game: "Turtle" },
  { n: 6, name: "Movie Math", icon: "🎬", route: "/movie", game: "Movie" },
  { n: 7, name: "Music Maker", icon: "🎵", route: "/music", game: "Music" },
  { n: 8, name: "Pond Duel", icon: "🦆", route: "/pond", game: "Pond" },
  { n: 9, name: "Master Maze", icon: "🌀", route: "/maze", game: "Maze" },
  { n: 10, name: "Grand Champion", icon: "🏆", route: "/pond", game: "Pond" },
];

// Zig-zag alignment for the stepped path (portrait-friendly)
const ALIGN = ["justify-start", "justify-center", "justify-end", "justify-center"] as const;

export default function AscensoClient() {
  const [track, setTrack] = useState<Ascenso>({ current: 1, unlocked: 1, done: [] });
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    setTrack(getAscenso());
    const sync = () => setTrack(getAscenso());
    window.addEventListener("sudocodo-progress", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("sudocodo-progress", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const current = NODES[track.current - 1];

  const complete = () => {
    const next = completeAscensoNode(track.current);
    setTrack(next);
    setMsg(`🎉 Level ${track.current} conquered! +5π — next stop: ${NODES[next.current - 1].name}! 🚀`);
  };

  return (
    <GameShell
      title="Ascenso — Nivel Ruta"
      icon="🗺️"
      subtitle={`Level ${track.current} of 10 • ${track.done.length} conquered`}
      color="from-violet-100 to-fuchsia-100 border-violet-300 dark:from-violet-950 dark:to-fuchsia-950 dark:border-violet-800"
      controls={
        <Link
          href={current.route}
          className="px-5 py-1.5 rounded-full font-black text-sm shadow bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white hover:opacity-90"
        >
          ▶ JUGAR • PLAY
        </Link>
      }
      canvas={
        <div className="p-3 sm:p-4 relative overflow-hidden">
          {msg && <div className="mb-3 px-3 py-2 rounded-xl text-sm font-bold border bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-100">{msg}</div>}

          {/* Decorative isometric elements (pure Tailwind + emoji, no assets) */}
          <div className="pointer-events-none absolute right-2 top-2 text-3xl opacity-70" aria-hidden="true">🧭</div>
          <div className="pointer-events-none absolute left-3 top-1/3 text-2xl opacity-50" aria-hidden="true">🔺</div>
          <div className="pointer-events-none absolute right-4 bottom-1/3 text-2xl opacity-50" aria-hidden="true">🏛️</div>
          <div className="pointer-events-none absolute left-6 bottom-6 text-xl opacity-40" aria-hidden="true">⭐</div>

          {/* Stepped path */}
          <ol className="relative flex flex-col gap-1" aria-label="Ascenso level path">
            {NODES.map((node, i) => {
              const isDone = track.done.includes(node.n);
              const isCurrent = node.n === track.current;
              const isLocked = node.n > track.unlocked;
              return (
                <li key={node.n} className={`flex ${ALIGN[i % ALIGN.length]}`}>
                  <button
                    onClick={() => !isLocked && setTrack(setAscensoCurrent(node.n))}
                    disabled={isLocked}
                    aria-current={isCurrent ? "step" : undefined}
                    aria-label={`Level ${node.n}: ${node.name} — ${isDone ? "completed" : isCurrent ? "current" : isLocked ? "locked" : "unlocked"}`}
                    className={`relative flex items-center gap-3 rounded-2xl border-2 p-2.5 pr-4 transition active:scale-95 disabled:cursor-not-allowed ${
                      isCurrent
                        ? "bg-white border-indigo-500 shadow-[0_8px_28px_-8px_rgba(99,102,241,0.7)] dark:bg-[#181D27] dark:border-indigo-400"
                        : isDone
                          ? "bg-emerald-50 border-emerald-400 dark:bg-emerald-950 dark:border-emerald-700"
                          : isLocked
                            ? "bg-slate-50 border-slate-200 opacity-60 dark:bg-slate-900 dark:border-slate-800"
                            : "bg-white border-slate-200 hover:border-indigo-300 dark:bg-[#181D27] dark:border-slate-700"
                    }`}
                  >
                    <span
                      className={`w-11 h-11 rounded-full grid place-items-center text-lg font-black border-2 shrink-0 ${
                        isCurrent ? "animate-bounce" : ""
                      } ${
                        isDone
                          ? "bg-emerald-500 text-white border-emerald-600"
                          : isCurrent
                            ? "bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white border-white"
                            : "bg-white text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                      }`}
                      aria-hidden="true"
                    >
                      {isLocked ? "🔒" : isDone ? "✓" : node.n}
                    </span>
                    <span className="text-left">
                      <span className="block text-2xl leading-none" aria-hidden="true">{isLocked ? "" : node.icon}</span>
                      <span className="block text-xs font-black text-slate-900 dark:text-white">{node.n}. {node.name}</span>
                      <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">{node.game}</span>
                    </span>
                    {node.n === 1 && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-black px-2 py-0.5 rounded-full bg-yellow-300 text-slate-900 border border-yellow-500 shadow animate-pulse">
                        🚩 Empieza aquí • Start here
                      </span>
                    )}
                    {isCurrent && node.n !== 1 && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-600 text-white shadow animate-pulse">
                        📍 YOU ARE HERE
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>

          {/* Current level action card */}
          <div className="mt-4 rounded-2xl border-2 border-indigo-500 bg-indigo-50 p-4 text-center dark:bg-indigo-950 dark:border-indigo-700">
            <p className="text-xs font-black tracking-widest text-indigo-700 dark:text-indigo-300">NOW PLAYING • JUGANDO AHORA</p>
            <p className="mt-1 text-lg font-black text-slate-900 dark:text-white">
              {current.icon} Level {current.n}: {current.name}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 justify-center">
              <Link href={current.route} className="px-6 py-2.5 rounded-full font-black text-sm text-white shadow bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:opacity-90">
                ▶ PLAY • JUGAR
              </Link>
              <button onClick={complete} className="px-4 py-2.5 rounded-full font-black text-sm bg-white border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-50 dark:bg-slate-800 dark:text-emerald-300">
                ✓ Mark complete +5π
              </button>
            </div>
            <p className="mt-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">Finish the game, then mark complete to unlock the next node. ♾️ No rush! 💛</p>
          </div>
        </div>
      }
      workspace={
        <div className="space-y-3">
          <div className="rounded-2xl bg-white border p-4 dark:bg-[#181D27] dark:border-slate-700">
            <div className="text-xs font-black tracking-widest text-slate-500 dark:text-slate-400">🏔️ PROGRESS</div>
            <div className="mt-2 h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-all" style={{ width: `${(track.done.length / 10) * 100}%` }} />
            </div>
            <p className="mt-1 text-xs font-bold text-slate-600 dark:text-slate-300">{track.done.length}/10 conquered • Node {track.unlocked} unlocked 🔓</p>
          </div>
          <div className="rounded-2xl border-2 border-dashed border-slate-200 p-3 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">🗺️ Ascenso = Spanish for “climb”. Each node is a real game — play it with unlimited blocks, hints & Magic Solve!</p>
          </div>
        </div>
      }
    />
  );
}
