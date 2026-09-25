"use client";
import { useEffect, useState } from "react";
import GameShell from "@/components/GameShell";
import Celebration from "@/components/Celebration";
import { getLevel, setLevel, setGameProgress } from "@/lib/storage";

type Piece = { id: string; label: string; color: string; shape: "notch" | "plug" };

const LEVELS = [
  {
    id: 1,
    title: "Snap Together",
    prompt: "Put the two pieces together to make a square",
    pieces: [
      { id: "a", label: "Move", color: "bg-sky-500", shape: "plug" as const },
      { id: "b", label: "Turn", color: "bg-amber-500", shape: "notch" as const },
    ] as Piece[],
    target: ["a", "b"],
  },
  {
    id: 2,
    title: "Three Piece",
    prompt: "Stack in order: Move → Turn → Move",
    pieces: [
      { id: "a", label: "Move", color: "bg-sky-500", shape: "plug" as const },
      { id: "b", label: "Left", color: "bg-violet-500", shape: "notch" as const },
      { id: "c", label: "Move", color: "bg-sky-500", shape: "plug" as const },
    ] as Piece[],
    target: ["a", "b", "c"],
  },
  {
    id: 3,
    title: "If Pattern",
    prompt: "Arrange: If → Move → Else → Turn",
    pieces: [
      { id: "a", label: "Move", color: "bg-emerald-500", shape: "plug" as const },
      { id: "b", label: "If path", color: "bg-indigo-500", shape: "notch" as const },
      { id: "c", label: "Turn", color: "bg-amber-500", shape: "plug" as const },
      { id: "d", label: "Else", color: "bg-rose-500", shape: "notch" as const },
    ] as Piece[],
    target: ["b", "a", "d", "c"],
  },
  {
    id: 4,
    title: "Loop Puzzle",
    prompt: "Build: Repeat → Move → Move",
    pieces: [
      { id: "a", label: "Repeat 3×", color: "bg-violet-600", shape: "notch" as const },
      { id: "b", label: "Move", color: "bg-sky-500", shape: "plug" as const },
      { id: "c", label: "Move", color: "bg-sky-500", shape: "plug" as const },
    ] as Piece[],
    target: ["a", "b", "c"],
  },
];

export default function PuzzlePage() {
  const [idx, setIdx] = useState(0);
  const lvl = LEVELS[idx];
  const [tray, setTray] = useState<Piece[]>(lvl.pieces);
  const [stack, setStack] = useState<Piece[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [showCeleb, setShowCeleb] = useState(false);

  useEffect(() => {
    const saved = getLevel("puzzle", LEVELS.length);
    setIdx(Math.min(saved - 1, LEVELS.length - 1));
  }, []);
  useEffect(() => {
    setTray(lvl.pieces);
    setStack([]);
    setMsg(null);
    setOk(false);
    setShowCeleb(false);
  }, [idx, lvl.pieces]);

  const add = (p: Piece) => {
    setTray((t) => t.filter((x) => x.id !== p.id));
    setStack((s) => [...s, p]);
  };
  const remove = (p: Piece) => {
    setStack((s) => s.filter((x) => x.id !== p.id));
    setTray((t) => [...t, p]);
  };
  const check = () => {
    const got = stack.map((p) => p.id).join(",");
    const want = lvl.target.join(",");
    if (got === want) {
      setMsg("🎉 Perfect snap! You understood the shape!");
      setOk(true);
      const next = Math.min(idx + 2, LEVELS.length);
      setLevel("puzzle", next);
      setGameProgress("puzzle", { level: next, completed: idx === LEVELS.length - 1, stars: 3 });
      setShowCeleb(true);
    } else {
      setMsg("🌟 Good try, superstar! Look at the order — which piece goes first? Tap pieces to move them. You can do it! 💪🧩");
    }
  };

  return (
    <GameShell
      title="Puzzle"
      icon="🧩"
      subtitle={`Level ${lvl.id} — ${lvl.title} • Easy & unlimited ♾️`}
      color="from-violet-100 to-fuchsia-100 border-violet-200 dark:from-violet-950 dark:to-fuchsia-950 dark:border-violet-800"
      controls={
        <>
          <button onClick={() => setStack(lvl.target.map((id) => lvl.pieces.find((p) => p.id === id)!))} className="px-3 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black hover:bg-amber-200 dark:bg-amber-900 dark:border-amber-700 dark:text-amber-100">
            ✨ Magic Solve
          </button>
          <button onClick={check} disabled={stack.length === 0} className={`px-5 py-1.5 rounded-full font-black text-sm ${stack.length ? "bg-violet-600 text-white" : "bg-slate-200 text-slate-500"}`}>Check ✓</button>
        </>
      }
      levelBar={
        <div className="flex gap-1.5">
          {LEVELS.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} className={`w-8 h-8 rounded-xl border-2 font-black text-sm grid place-items-center ${i === idx ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : i < idx ? "bg-violet-600 text-white" : "bg-white dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700"}`}>{i < idx ? "✓" : i + 1}</button>
          ))}
          <span className="ml-2 text-xs font-bold text-slate-500 dark:text-slate-400 self-center whitespace-nowrap">♾️ Unlimited tries • ✨ Magic Solve helps! 🌟</span>
        </div>
      }
      canvas={
        <div className="p-4">
          <Celebration
            open={showCeleb}
            mascot="🧩"
            title="PERFECT SNAP!"
            message={`The pieces clicked together on level ${lvl.id}! You really understand how blocks fit! 🧱`}
            primaryLabel={idx < LEVELS.length - 1 ? `Next → Level ${lvl.id + 1}` : "★ Puzzle master!"}
            onPrimary={() => {
              setShowCeleb(false);
              if (idx < LEVELS.length - 1) setIdx((v) => v + 1);
            }}
            secondaryLabel="🔄 Play this puzzle again"
            onSecondary={() => {
              setShowCeleb(false);
              setTray(lvl.pieces);
              setStack([]);
              setMsg(null);
              setOk(false);
            }}
          />
          {msg && <div className={`mb-3 px-3 py-2 rounded-xl text-sm font-bold border ${ok ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-100" : "bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-950 dark:border-orange-800 dark:text-orange-100"}`}>{msg}</div>}
          <div className="text-center">
            <div className="text-xs font-extrabold tracking-widest text-slate-500 dark:text-slate-400">{lvl.prompt.toUpperCase()}</div>
            <div className="mt-3 mx-auto max-w-sm rounded-2xl border-2 border-dashed bg-white p-4 min-h-[160px] dark:bg-slate-800 dark:border-slate-700">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">WORKSPACE • ♾️ UNLIMITED TRIES 🌟</div>
              <div className="mt-3 flex flex-col gap-2">
                {stack.length === 0 ? <div className="py-6 text-sm font-semibold text-slate-400">Tap pieces below to snap them here</div> : stack.map((p) => (
                  <button key={p.id} onClick={() => remove(p)} className={`w-full text-left px-4 py-3 rounded-xl border-2 text-white font-black flex items-center justify-between ${p.color} shadow`}>
                    <span>{p.label}</span><span className="bg-white/20 px-2 py-1 rounded-full text-xs">tap to remove</span>
                  </button>
                ))}
              </div>
              <div className="mt-4 flex justify-center gap-2">
                <div className="w-16 h-16 rounded-xl bg-slate-900 grid place-items-center text-white font-black">▶</div>
                <div className="hidden sm:block text-xs text-slate-500 self-center">Blocks snap like puzzle pieces</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {tray.map((p) => (
                <button key={p.id} onClick={() => add(p)} className={`px-3 py-3 rounded-xl border-2 font-black text-white ${p.color} hover:scale-[1.02] transition`}>{p.label}</button>
              ))}
              {tray.length === 0 && <div className="col-span-2 text-xs font-semibold text-slate-400">All pieces placed — press Check</div>}
            </div>
          </div>
        </div>
      }
      workspace={
        <div className="rounded-2xl bg-white border p-3 dark:bg-slate-900 dark:border-slate-700">
          <div className="text-xs font-black tracking-widest text-slate-500 dark:text-slate-400">LEARN — SUPER EASY! 🌟</div>
          <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">Blocks snap like LEGO! 🧩 Tap pieces — no drag needed. Stuck? Tap ✨ Magic Solve, then try yourself! Unlimited tries! ♾️💛</p>
          <div className="mt-3 rounded-xl bg-violet-50 border border-violet-200 p-3 flex gap-3 dark:bg-violet-950 dark:border-violet-800">
            <div className="w-10 h-10 rounded-xl bg-violet-600 grid place-items-center text-white shrink-0">💡</div>
            <div className="text-sm dark:text-slate-200"><b>Tip</b>: On phones, tap pieces — trying again makes you smarter! Try level 4 for loops!</div>
          </div>
        </div>
      }
    />
  );
}
