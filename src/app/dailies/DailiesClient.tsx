"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import GameShell from "@/components/GameShell";
import {
  countDone,
  getDailies,
  getPi,
  grantAward,
  markDaily,
  useCountdown,
} from "@/lib/progress";

/* ================= shared bits ================= */

function useDailySync() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const sync = () => setTick((t) => t + 1);
    window.addEventListener("sudocodo-progress", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("sudocodo-progress", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
}

function DoneBanner({ pi }: { pi?: number }) {
  return (
    <div className="mt-2 px-3 py-2 rounded-xl text-sm font-black text-center bg-emerald-500 text-white shadow">
      ✅ Completed! {pi ? `+${pi}π banked! ` : ""}See you tomorrow for a fresh board! 🎉
    </div>
  );
}

function NumInput({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, "").slice(0, 2))}
      inputMode="numeric"
      aria-label={label}
      className="w-full aspect-square min-w-[2.2rem] text-center rounded-lg border-2 border-slate-200 font-black text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:border-indigo-400 focus:outline-none"
    />
  );
}

/* ================= SUDOKU 4×4 ================= */

const SUD_SOL = [
  [1, 2, 3, 4],
  [3, 4, 1, 2],
  [2, 1, 4, 3],
  [4, 3, 2, 1],
];
const SUD_EASY = [
  [1, 0, 3, 0],
  [0, 4, 0, 2],
  [2, 0, 0, 3],
  [0, 3, 2, 0],
];
const SUD_HARD = [
  [0, 0, 3, 0],
  [0, 0, 0, 2],
  [0, 1, 0, 0],
  [4, 0, 0, 0],
];

function SudokuPanel({ givens, id }: { givens: number[][]; id: string }) {
  const [grid, setGrid] = useState<string[][]>(() =>
    givens.map((r) => r.map((v) => (v === 0 ? "" : String(v))))
  );
  const [msg, setMsg] = useState<string | null>(null);
  const [done, setDone] = useState(getDailies().done[id] || false);

  const set = (r: number, c: number, v: string) =>
    setGrid((g) => g.map((row, ri) => row.map((cell, ci) => (ri === r && ci === c ? v : cell))));

  const check = () => {
    const ok = grid.every((row, r) => row.every((cell, c) => Number(cell) === SUD_SOL[r][c]));
    if (ok) {
      setDone(true);
      markDaily(id);
      setMsg("🏆 Sudoku solved! Brilliant!");
    } else {
      setMsg("🌟 Not yet — check rows, columns & 2×2 boxes for 1-4. You can do it!");
    }
  };

  if (done) return <DoneBanner />;
  return (
    <div>
      <div className="grid grid-cols-4 gap-1 max-w-[280px] mx-auto">
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const given = givens[r][c] !== 0;
            const box = `${r < 2 ? "border-t-2" : ""} ${c < 2 ? "border-l-2" : ""}`;
            return given ? (
              <div key={`${r}-${c}`} className={`aspect-square grid place-items-center rounded-lg bg-slate-100 font-black text-slate-700 dark:bg-slate-800 dark:text-slate-100 ${box}`}>
                {cell}
              </div>
            ) : (
              <div key={`${r}-${c}`} className={box}>
                <NumInput value={cell} onChange={(v) => set(r, c, v)} label={`Row ${r + 1} column ${c + 1}`} />
              </div>
            );
          })
        )}
      </div>
      <div className="mt-3 text-center">
        <button onClick={check} className="px-5 py-2 rounded-full bg-emerald-500 text-white text-sm font-black shadow hover:bg-emerald-600">
          ✓ Check Sudoku
        </button>
        {msg && <p className="mt-2 text-xs font-bold text-slate-600 dark:text-slate-300">{msg}</p>}
      </div>
    </div>
  );
}

/* ================= CROSS MATH ================= */

function CrossEasy() {
  const id = "cross-easy";
  const [cells, setCells] = useState(["", "", "", ""]);
  const [msg, setMsg] = useState<string | null>(null);
  const [done, setDone] = useState(getDailies().done[id] || false);
  // targets: R1=8 R2=6 C1=7 C2=7
  const check = () => {
    const [a, b, c, d] = cells.map(Number);
    if ([a, b, c, d].some((n) => !n)) {
      setMsg("Fill all 4 boxes first! 💛");
      return;
    }
    if (a + b === 8 && c + d === 6 && a + c === 7 && b + d === 7) {
      setDone(true);
      markDaily(id);
      setMsg("🏆 Cross complete!");
    } else setMsg("🌟 Sums don't match yet — rows need 8 & 6, columns 7 & 7!");
  };
  if (done) return <DoneBanner />;
  return (
    <div className="max-w-[240px] mx-auto">
      <div className="grid grid-cols-3 gap-1 items-center">
        <NumInput value={cells[0]} onChange={(v) => setCells([v, cells[1], cells[2], cells[3]])} label="Top left" />
        <NumInput value={cells[1]} onChange={(v) => setCells([cells[0], v, cells[2], cells[3]])} label="Top right" />
        <div className="text-center text-xs font-black text-slate-500">= 8</div>
        <NumInput value={cells[2]} onChange={(v) => setCells([cells[0], cells[1], v, cells[3]])} label="Bottom left" />
        <NumInput value={cells[3]} onChange={(v) => setCells([cells[0], cells[1], cells[2], v])} label="Bottom right" />
        <div className="text-center text-xs font-black text-slate-500">= 6</div>
        <div className="text-center text-xs font-black text-slate-500">7</div>
        <div className="text-center text-xs font-black text-slate-500">7</div>
        <div />
      </div>
      <div className="mt-3 text-center">
        <button onClick={check} className="px-5 py-2 rounded-full bg-emerald-500 text-white text-sm font-black shadow">✓ Check Cross</button>
        {msg && <p className="mt-2 text-xs font-bold text-slate-600 dark:text-slate-300">{msg}</p>}
      </div>
    </div>
  );
}

function CrossHard() {
  const id = "cross-hard";
  const [cells, setCells] = useState<string[]>(Array(9).fill(""));
  const [msg, setMsg] = useState<string | null>(null);
  const [done, setDone] = useState(getDailies().done[id] || false);
  const ROWS = [8, 11, 8];
  const COLS = [9, 9, 9];
  const check = () => {
    const n = cells.map(Number);
    if (n.some((x) => !x)) {
      setMsg("Fill all 9 boxes first! 💛");
      return;
    }
    const okRows = [0, 1, 2].every((r) => n[r * 3] + n[r * 3 + 1] + n[r * 3 + 2] === ROWS[r]);
    const okCols = [0, 1, 2].every((c) => n[c] + n[c + 3] + n[c + 6] === COLS[c]);
    if (okRows && okCols) {
      setDone(true);
      markDaily(id);
      setMsg("🏆 Hard cross crushed!");
    } else setMsg("🌟 Check rows (8, 11, 8) & columns (9, 9, 9)!");
  };
  if (done) return <DoneBanner />;
  return (
    <div className="max-w-[280px] mx-auto">
      <div className="grid grid-cols-4 gap-1 items-center">
        {cells.map((v, i) => (
          <NumInput key={i} value={v} onChange={(nv) => setCells(cells.map((c, j) => (j === i ? nv : c)))} label={`Cell ${i + 1}`} />
        ))}
        <div className="text-center text-xs font-black text-slate-500">=8</div>
        <div className="text-center text-xs font-black text-slate-500">=11</div>
        <div className="text-center text-xs font-black text-slate-500">=8</div>
        <div />
        <div className="text-center text-xs font-black text-slate-500">9</div>
        <div className="text-center text-xs font-black text-slate-500">9</div>
        <div className="text-center text-xs font-black text-slate-500">9</div>
        <div />
      </div>
      <div className="mt-3 text-center">
        <button onClick={check} className="px-5 py-2 rounded-full bg-emerald-500 text-white text-sm font-black shadow">✓ Check Hard</button>
        {msg && <p className="mt-2 text-xs font-bold text-slate-600 dark:text-slate-300">{msg}</p>}
      </div>
    </div>
  );
}

/* ================= KENKEN ================= */

type Cage = { cells: [number, number][]; color: string };
const KEN_CAGES: Cage[] = [
  { cells: [[0, 0], [1, 0]], color: "bg-red-100 dark:bg-red-950" },
  { cells: [[0, 1], [0, 2]], color: "bg-sky-100 dark:bg-sky-950" },
  { cells: [[0, 3], [1, 3]], color: "bg-amber-100 dark:bg-amber-950" },
  { cells: [[1, 1], [1, 2], [2, 2]], color: "bg-emerald-100 dark:bg-emerald-950" },
  { cells: [[2, 0], [3, 0]], color: "bg-violet-100 dark:bg-violet-950" },
  { cells: [[2, 1], [3, 1]], color: "bg-pink-100 dark:bg-pink-950" },
  { cells: [[2, 3], [3, 3]], color: "bg-teal-100 dark:bg-teal-950" },
  { cells: [[3, 2]], color: "bg-slate-100 dark:bg-slate-800" },
];
const KEN_GIVEN_EASY: Record<string, number> = { "0,0": 1, "1,1": 4, "2,3": 3, "3,0": 4, "3,2": 2 };
const KEN_GIVEN_HARD: Record<string, number> = { "1,1": 4, "3,2": 2 };

function KenKenPanel({ givens, id }: { givens: Record<string, number>; id: string }) {
  const [grid, setGrid] = useState<string[][]>(() =>
    Array.from({ length: 4 }, (_, r) => Array.from({ length: 4 }, (_, c) => (givens[`${r},${c}`] ? String(givens[`${r},${c}`]) : "")))
  );
  const [msg, setMsg] = useState<string | null>(null);
  const [done, setDone] = useState(getDailies().done[id] || false);

  const cageOf = (r: number, c: number) => KEN_CAGES.findIndex((k) => k.cells.some(([x, y]) => x === r && y === c));
  const targetOf = (ci: number) => KEN_CAGES[ci].cells.reduce((s, [x, y]) => s + SUD_SOL[x][y], 0);

  const check = () => {
    const n = grid.map((row) => row.map(Number));
    if (n.flat().some((x) => !x)) {
      setMsg("Fill every box first! 💛");
      return;
    }
    const latin = (arr: number[]) => [1, 2, 3, 4].every((v) => arr.includes(v));
    const rowsOk = n.every(latin);
    const colsOk = [0, 1, 2, 3].every((c) => latin(n.map((r) => r[c])));
    const cagesOk = KEN_CAGES.every((k) => k.cells.reduce((s, [x, y]) => s + n[x][y], 0) === k.cells.reduce((s, [x, y]) => s + SUD_SOL[x][y], 0));
    if (rowsOk && colsOk && cagesOk) {
      setDone(true);
      markDaily(id);
      setMsg("🏆 KenKen cracked!");
    } else setMsg("🌟 Rows/cols need 1-4 each, and cage sums must match the little numbers!");
  };

  if (done) return <DoneBanner />;
  return (
    <div>
      <div className="grid grid-cols-4 gap-1 max-w-[280px] mx-auto">
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const ci = cageOf(r, c);
            const isFirst = KEN_CAGES[ci].cells[0][0] === r && KEN_CAGES[ci].cells[0][1] === c;
            const given = givens[`${r},${c}`] !== undefined;
            return (
              <div key={`${r}-${c}`} className={`relative rounded-lg ${KEN_CAGES[ci].color} p-0.5`}>
                {isFirst && <span className="absolute top-0.5 left-1 text-[10px] font-black text-slate-600 dark:text-slate-300">{targetOf(ci)}+</span>}
                {given ? (
                  <div className="aspect-square grid place-items-center font-black text-slate-700 dark:text-slate-100 pt-2">{cell}</div>
                ) : (
                  <div className="pt-2">
                    <NumInput value={cell} onChange={(v) => setGrid((g) => g.map((rw, ri) => rw.map((cl, cj) => (ri === r && cj === c ? v : cl))))} label={`Row ${r + 1} column ${c + 1}`} />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      <div className="mt-3 text-center">
        <button onClick={check} className="px-5 py-2 rounded-full bg-emerald-500 text-white text-sm font-black shadow">✓ Check KenKen</button>
        {msg && <p className="mt-2 text-xs font-bold text-slate-600 dark:text-slate-300">{msg}</p>}
      </div>
    </div>
  );
}

/* ================= MATH MAZE (tap path) ================= */

function MazeTap({ size, path, decoys, id }: { size: number; path: [number, number][]; decoys: [number, number][]; id: string }) {
  const [step, setStep] = useState(0);
  const [miss, setMiss] = useState(0);
  const [done, setDone] = useState(getDailies().done[id] || false);
  const key = (x: number, y: number) => `${x},${y}`;
  const pathSet = useMemo(() => new Set(path.map(([x, y]) => key(x, y))), [path]);
  const decoySet = useMemo(() => new Set(decoys.map(([x, y]) => key(x, y))), [decoys]);

  const tap = (x: number, y: number) => {
    if (done) return;
    const next = path[step];
    if (next && next[0] === x && next[1] === y) {
      const ns = step + 1;
      setStep(ns);
      if (ns === path.length) {
        setDone(true);
        markDaily(id);
      }
    } else {
      setMiss((m) => m + 1);
    }
  };

  if (done) return <DoneBanner />;
  const cells = [];
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) cells.push({ x, y });
  return (
    <div>
      <p className="text-center text-xs font-bold text-slate-600 dark:text-slate-300">👆 Tap numbers in order: {step}/{path.length} {miss > 0 && `• Oopsies: ${miss} (no worries! 💛)`}</p>
      <div className="mt-2 grid gap-1 max-w-[300px] mx-auto" style={{ gridTemplateColumns: `repeat(${size}, minmax(0,1fr))` }}>
        {cells.map(({ x, y }) => {
          const pi = path.findIndex(([px, py]) => px === x && py === y);
          const isPath = pi !== -1;
          const reached = pi !== -1 && pi < step;
          const isDecoy = decoySet.has(key(x, y));
          return (
            <button
              key={key(x, y)}
              onClick={() => tap(x, y)}
              className={`aspect-square rounded-lg border-2 grid place-items-center font-black text-sm transition active:scale-95 ${
                reached ? "bg-emerald-500 text-white border-emerald-600" : "bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
              }`}
              aria-label={isPath ? `Number ${pi + 1}` : isDecoy ? "Tricky tile" : "Empty tile"}
            >
              {isPath ? pi + 1 : isDecoy ? "❓" : ""}
            </button>
          );
        })}
      </div>
      {!pathSet.has("x") && <p className="mt-2 text-center text-[11px] font-semibold text-slate-400">Start at 1, follow numbers to the end! 🌀</p>}
    </div>
  );
}

/* ================= DIVISION QUIZ ================= */

function DivQuiz({ divisors, id, label }: { divisors: number[]; id: string; label: string }) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [typed, setTyped] = useState("");
  const [fb, setFb] = useState<string | null>(null);
  const [done, setDone] = useState(getDailies().done[id] || false);
  const [q, setQ] = useState(() => makeQ(divisors));

  function makeQ(divs: number[]) {
    const d = divs[Math.floor(Math.random() * divs.length)];
    const ans = 2 + Math.floor(Math.random() * 11);
    return { d, ans, top: d * ans };
  }

  const TOTAL = 5;
  const submit = () => {
    if (!typed.trim() || fb) return;
    const ok = Number(typed) === q.ans;
    if (ok) setScore((s) => s + 1);
    setFb(ok ? "✅ Correct!" : `❌ It was ${q.ans}`);
    window.setTimeout(() => {
      if (round + 1 >= TOTAL) {
        const final = score + (ok ? 1 : 0);
        if (final >= 4) {
          setDone(true);
          markDaily(id);
        }
        setRound(TOTAL);
      } else {
        setQ(makeQ(divisors));
        setTyped("");
        setFb(null);
        setRound((r) => r + 1);
      }
    }, 800);
  };

  if (done) return <DoneBanner />;
  if (round >= TOTAL)
    return (
      <div className="text-center">
        <p className="font-black text-slate-900 dark:text-white">{score}/5 — {score >= 4 ? "🏆 Division dashed!" : "💪 So close! Tap Retry below!"}</p>
        <button
          onClick={() => {
            setRound(0);
            setScore(0);
            setQ(makeQ(divisors));
            setTyped("");
            setFb(null);
          }}
          className="mt-2 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-black"
        >
          🔄 Retry {label}
        </button>
      </div>
    );
  return (
    <div className="text-center max-w-[260px] mx-auto">
      <p className="text-xs font-bold text-slate-500">Round {round + 1}/5 • Score {score} ⭐</p>
      <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
        {q.top} ÷ {q.d} = ?
      </p>
      <form
        className="mt-2 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <input
          value={typed}
          onChange={(e) => setTyped(e.target.value.replace(/[^0-9]/g, "").slice(0, 3))}
          inputMode="numeric"
          autoFocus
          placeholder="?"
          aria-label="Answer"
          className="flex-1 min-w-0 px-3 py-2 rounded-xl border-2 border-slate-200 font-black text-center dark:bg-slate-800 dark:border-slate-700 dark:text-white"
        />
        <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-black text-sm">
          Go →
        </button>
      </form>
      {fb && <p className="mt-1 text-xs font-black text-slate-600 dark:text-slate-300">{fb}</p>}
    </div>
  );
}

/* ================= PIN BALL RECALL ================= */

function PinRecall() {
  const id = "pinball";
  const [targets, setTargets] = useState<number[]>([]);
  const [phase, setPhase] = useState<"watch" | "tap">("watch");
  const [hits, setHits] = useState<number[]>([]);
  const [miss, setMiss] = useState(0);
  const [done, setDone] = useState(getDailies().done[id] || false);

  const deal = () => {
    const s = new Set<number>();
    while (s.size < 5) s.add(Math.floor(Math.random() * 16));
    setTargets([...s]);
    setHits([]);
    setMiss(0);
    setPhase("watch");
    window.setTimeout(() => setPhase("tap"), 1600);
  };

  useEffect(() => {
    deal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (targets.length > 0 && hits.length === targets.length) {
      setDone(true);
      markDaily(id);
    }
  }, [hits, targets, id]);

  const tap = (i: number) => {
    if (phase !== "tap" || hits.includes(i) || done) return;
    if (targets.includes(i)) setHits((h) => [...h, i]);
    else {
      const m = miss + 1;
      setMiss(m);
      if (m >= 3) deal();
    }
  };

  if (done) return <DoneBanner pi={10} />;
  return (
    <div>
      <p className="text-center text-xs font-bold text-slate-600 dark:text-slate-300">
        {phase === "watch" ? "👁️ Memorize the 5 glowing balls…" : `👆 Tap the 5 balls! ${hits.length}/5 ${miss > 0 ? `• misses ${miss}/3` : ""}`}
      </p>
      <div className="mt-2 grid grid-cols-4 gap-1.5 max-w-[280px] mx-auto">
        {Array.from({ length: 16 }, (_, i) => {
          const show = phase === "watch" && targets.includes(i);
          const hit = hits.includes(i);
          return (
            <button
              key={i}
              onClick={() => tap(i)}
              disabled={phase !== "tap"}
              aria-label={`Mirror tile ${i + 1}`}
              className={`aspect-square rounded-xl border-2 grid place-items-center text-xl transition active:scale-95 ${
                show || hit ? "" : "bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700"
              }`}
              style={show || hit ? { background: "#38BDF8", borderColor: "#0284c7" } : undefined}
            >
              {(show || hit) && "🔮"}
            </button>
          );
        })}
      </div>
      <div className="mt-2 text-center">
        <button onClick={deal} className="text-xs font-bold px-3 py-1.5 rounded-full bg-white border dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
          🔄 New round
        </button>
      </div>
    </div>
  );
}

/* ================= Game card wrapper ================= */

function GameCard2({
  icon,
  name,
  easy,
  hard,
  easyId,
  hardId,
  preview,
  isNew,
  open,
  onToggle,
}: {
  icon: string;
  name: string;
  easy: React.ReactNode;
  hard?: React.ReactNode;
  easyId: string;
  hardId?: string;
  preview: React.ReactNode;
  isNew?: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  useDailySync();
  const d = getDailies().done;
  const easyDone = !!d[easyId];
  const hardDone = hardId ? !!d[hardId] : false;
  const hardLocked = !!hard && !easyDone;
  const [mode, setMode] = useState<"easy" | "hard">("easy");

  return (
    <div className={`rounded-2xl border-2 bg-white overflow-hidden dark:bg-[#181D27] ${open ? "border-indigo-500" : "border-slate-200 dark:border-slate-700"}`}>
      <button onClick={onToggle} aria-expanded={open} className="w-full flex items-center gap-3 p-3 text-left">
        <span className="w-12 h-12 rounded-xl bg-slate-50 border grid place-items-center text-2xl shrink-0 dark:bg-slate-800 dark:border-slate-700" aria-hidden="true">
          {preview}
        </span>
        <span className="flex-1 min-w-0">
          <span className="flex items-center gap-1.5">
            <span className="font-black text-slate-900 dark:text-white text-sm">
              {icon} {name}
            </span>
            {isNew && <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-rose-500 text-white">NEW</span>}
            {easyDone && <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-500 text-white">✓</span>}
          </span>
          <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            {easyDone ? "Easy done! " : ""}
            {hard ? (hardLocked ? "Easy / Hard 🔒" : hardDone ? "Easy ✓ / Hard ✓" : "Easy / Hard") : "Tap to play ▶"}
          </span>
        </span>
        <span aria-hidden="true" className="text-slate-400">{open ? "▾" : "▸"}</span>
      </button>
      {open && (
        <div className="px-3 pb-3">
          {hard && (
            <div className="mb-2 flex gap-1.5" role="tablist" aria-label={`${name} difficulty`}>
              <button
                role="tab"
                aria-selected={mode === "easy"}
                onClick={() => setMode("easy")}
                className={`flex-1 py-1.5 rounded-xl text-xs font-black border-2 ${mode === "easy" ? "bg-emerald-500 text-white border-emerald-600" : "bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"}`}
              >
                Easy {easyDone && "✓"}
              </button>
              <button
                role="tab"
                aria-selected={mode === "hard"}
                onClick={() => !hardLocked && setMode("hard")}
                disabled={hardLocked}
                title={hardLocked ? "Finish Easy to unlock Hard!" : "Hard mode"}
                className={`flex-1 py-1.5 rounded-xl text-xs font-black border-2 ${mode === "hard" ? "bg-rose-500 text-white border-rose-600" : "bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"} ${hardLocked ? "opacity-50" : ""}`}
              >
                Hard {hardLocked ? "🔒" : hardDone ? "✓" : ""}
              </button>
            </div>
          )}
          {hardLocked && mode === "hard" ? (
            <p className="text-center text-xs font-bold text-slate-500">🔒 Finish Easy first to unlock Hard!</p>
          ) : mode === "easy" ? (
            easy
          ) : (
            hard
          )}
        </div>
      )}
    </div>
  );
}

/* ================= Main hub ================= */

const PUZZLE_IDS = ["sudoku-easy", "cross-easy", "kenken-easy", "mazetap-easy"];
const MATHS_IDS = ["div3", "divopen"];
const MEMORY_IDS = ["pinball"];

function Milestones({ at, got, rewards }: { at: number; got: number; rewards: { count: number; pi: number; id: string }[] }) {
  const pct = Math.min(100, (got / at) * 100);
  return (
    <div className="rounded-2xl border bg-white p-3 dark:bg-[#181D27] dark:border-slate-700">
      <div className="flex items-center justify-between text-xs font-black">
        <span className="text-slate-700 dark:text-slate-200">
          {got}/{at} completed
        </span>
        <span className="text-slate-500 dark:text-slate-400">
          {rewards.map((r) => (
            <span key={r.id} className={got >= r.count ? "text-amber-500" : ""}>
              π{r.pi}{" "}
            </span>
          ))}
        </span>
      </div>
      <div className="mt-2 h-3 rounded-full bg-slate-100 dark:bg-slate-800 relative overflow-visible">
        <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all" style={{ width: `${pct}%` }} />
        {rewards.map((r) => (
          <span
            key={r.id}
            className={`absolute -top-1 w-5 h-5 rounded-full grid place-items-center text-[10px] border-2 ${got >= r.count ? "bg-amber-400 border-amber-600" : "bg-white border-slate-300 dark:bg-slate-700"}`}
            style={{ left: `calc(${(r.count / at) * 100}% - 10px)` }}
            title={`Milestone: ${r.count} → π${r.pi}`}
            aria-hidden="true"
          >
            π
          </span>
        ))}
      </div>
    </div>
  );
}

function Inner() {
  useDailySync();
  const params = useSearchParams();
  const countdown = useCountdown();
  const [tab, setTab] = useState<"puzzles" | "maths" | "memory">("puzzles");
  const [openId, setOpenId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const dailies = getDailies();
  const pi = getPi();
  const pCount = countDone(PUZZLE_IDS);
  const mCount = countDone(MATHS_IDS);
  const memCount = countDone(MEMORY_IDS);

  // milestone awards (once per day)
  useEffect(() => {
    if (pCount >= 2 && grantAward("p2", 5)) setNotice("🎯 Puzzles milestone! +5π!");
    if (pCount >= 4 && grantAward("p4", 15)) setNotice("🏆 All puzzles! +15π!");
    if (mCount >= 2 && grantAward("m2", 10)) setNotice("🎯 Maths milestone! +10π!");
    if (memCount >= 1 && grantAward("mem1", 10)) setNotice("🎯 Memory done! +10π!");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pCount, mCount, memCount]);

  useEffect(() => {
    if (notice) {
      const t = window.setTimeout(() => setNotice(null), 2600);
      return () => window.clearTimeout(t);
    }
  }, [notice]);

  // deep link ?game=
  useEffect(() => {
    const g = params.get("game");
    if (!g) return;
    if (["sudoku", "cross", "kenken", "maze"].includes(g)) {
      setTab("puzzles");
      setOpenId(g);
    }
  }, [params]);

  const toggle = (id: string) => setOpenId((o) => (o === id ? null : id));

  const tabs = [
    { id: "puzzles" as const, label: `Puzzles ${pCount}/4`, icon: "🧩" },
    { id: "maths" as const, label: `Maths ${mCount}/2`, icon: "➗" },
    { id: "memory" as const, label: `Memory ${memCount}/1`, icon: "👁️" },
  ];

  return (
    <GameShell
      title="Daily Challenges"
      icon="📅"
      subtitle={`Fresh every day • π bank ${pi}`}
      color="from-amber-100 to-orange-100 border-amber-300 dark:from-amber-950 dark:to-orange-950 dark:border-amber-800"
      controls={
        <span className="px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-black dark:bg-white dark:text-slate-900" aria-label={`Resets in ${countdown}`}>
          ⏱ {countdown}
        </span>
      }
      canvas={
        <div className="p-3 sm:p-4">
          {notice && <div className="mb-2 px-3 py-2 rounded-xl text-sm font-black text-center bg-amber-400 text-slate-900 shadow">{notice}</div>}

          {/* Category tabs */}
          <div className="grid grid-cols-3 gap-1.5" role="tablist" aria-label="Daily categories">
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`py-2 rounded-xl text-xs font-black border-2 transition active:scale-95 ${
                  tab === t.id ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white" : "bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <div className="mt-3 space-y-2.5">
            {tab === "puzzles" && (
              <>
                <Milestones
                  at={4}
                  got={pCount}
                  rewards={[
                    { count: 2, pi: 5, id: "p2" },
                    { count: 4, pi: 15, id: "p4" },
                  ]}
                />
                <GameCard2
                  icon="🔲" name="SUDOKU" easyId="sudoku-easy" hardId="sudoku-hard"
                  preview={<span className="grid grid-cols-2 gap-0.5" aria-hidden="true">{[1, 2, 3, 4].map((n) => (<span key={n} className="w-3 h-3 rounded-[4px] bg-indigo-200 dark:bg-indigo-800 grid place-items-center text-[8px] font-black">{n}</span>))}</span>}
                  easy={<SudokuPanel givens={SUD_EASY} id="sudoku-easy" />} hard={<SudokuPanel givens={SUD_HARD} id="sudoku-hard" />}
                  open={openId === "sudoku"} onToggle={() => toggle("sudoku")}
                />
                <GameCard2
                  icon="✖️" name="CROSS MATH" easyId="cross-easy" hardId="cross-hard"
                  preview={<span className="font-black text-indigo-500" aria-hidden="true">✚</span>}
                  easy={<CrossEasy />} hard={<CrossHard />}
                  open={openId === "cross"} onToggle={() => toggle("cross")}
                />
                <GameCard2
                  icon="📦" name="KENKEN" easyId="kenken-easy" hardId="kenken-hard"
                  preview={<span className="grid grid-cols-2 gap-px" aria-hidden="true">{["3+", "5+", "6+", "2"].map((t) => (<span key={t} className="px-1 rounded bg-emerald-100 dark:bg-emerald-900 text-[8px] font-black">{t}</span>))}</span>}
                  easy={<KenKenPanel givens={KEN_GIVEN_EASY} id="kenken-easy" />} hard={<KenKenPanel givens={KEN_GIVEN_HARD} id="kenken-hard" />}
                  open={openId === "kenken"} onToggle={() => toggle("kenken")}
                />
                <GameCard2
                  icon="🌀" name="MATH MAZE" easyId="mazetap-easy" hardId="mazetap-hard"
                  preview={<span className="text-xl" aria-hidden="true">🌀</span>}
                  easy={<MazeTap size={5} path={[[0, 4], [1, 4], [1, 3], [1, 2], [2, 2], [3, 2], [3, 1], [4, 1]]} decoys={[[3, 4], [0, 1]]} id="mazetap-easy" />}
                  hard={<MazeTap size={6} path={[[0, 5], [1, 5], [2, 5], [2, 4], [2, 3], [3, 3], [4, 3], [4, 2], [4, 1], [5, 1]]} decoys={[[1, 2], [3, 5], [5, 4]]} id="mazetap-hard" />}
                  open={openId === "maze"} onToggle={() => toggle("maze")}
                />
              </>
            )}
            {tab === "maths" && (
              <>
                <Milestones at={2} got={mCount} rewards={[{ count: 2, pi: 10, id: "m2" }]} />
                <div className="rounded-2xl border-2 border-indigo-500 bg-white p-3 dark:bg-[#181D27]">
                  <div className="flex items-center gap-2">
                    <span className="w-9 h-9 grid place-items-center font-black text-white text-sm" style={{ clipPath: "polygon(50% 0,100% 38%,81% 100%,19% 100%,0 38%)", background: "#6366f1" }} aria-hidden="true">3</span>
                    <div className="flex-1">
                      <div className="font-black text-slate-900 dark:text-white text-sm">DIV 3 DIVISION</div>
                      <div className="text-[11px] font-bold text-emerald-600">● Unlocked — divide by 3, 4, 5</div>
                    </div>
                    <button onClick={() => toggle("div3")} className="px-3 py-1.5 rounded-full bg-indigo-600 text-white text-xs font-black" aria-expanded={openId === "div3"}>
                      {openId === "div3" ? "▾" : "Play →"}
                    </button>
                  </div>
                  {openId === "div3" && (
                    <div className="mt-2">
                      <DivQuiz divisors={[3, 4, 5]} id="div3" label="Div 3" />
                    </div>
                  )}
                </div>
                <div className="rounded-2xl border-2 border-fuchsia-500 bg-white p-3 dark:bg-[#181D27]">
                  <div className="flex items-center gap-2">
                    <span className="w-9 h-9 rounded-full grid place-items-center font-black text-sm border-4 border-fuchsia-500 text-fuchsia-600" aria-hidden="true">◎</span>
                    <div className="flex-1">
                      <div className="font-black text-slate-900 dark:text-white text-sm">OPEN DIVISION</div>
                      <div className="text-[11px] font-bold text-emerald-600">● Unlocked — mixed ÷2 to ÷12</div>
                    </div>
                    <button onClick={() => toggle("divopen")} className="px-3 py-1.5 rounded-full bg-fuchsia-600 text-white text-xs font-black" aria-expanded={openId === "divopen"}>
                      {openId === "divopen" ? "▾" : "Play →"}
                    </button>
                  </div>
                  {openId === "divopen" && (
                    <div className="mt-2">
                      <DivQuiz divisors={[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]} id="divopen" label="Open" />
                    </div>
                  )}
                </div>
                {(["DIV 1 DIVISION", "DIV 2 DIVISION"] as const).map((name) => (
                  <div key={name} className="rounded-2xl border-2 border-slate-200 bg-white p-3 opacity-60 dark:bg-[#181D27] dark:border-slate-700" aria-disabled="true">
                    <div className="flex items-center gap-2">
                      <span className="w-9 h-9 rounded-full grid place-items-center bg-slate-200 text-slate-400 dark:bg-slate-800" aria-hidden="true">🔒</span>
                      <div className="flex-1">
                        <div className="font-black text-slate-500 text-sm">{name}</div>
                        <div className="text-[11px] font-bold text-slate-400">🔒 LOCKED — finish Open Division dailies to unlock</div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {tab === "memory" && (
              <>
                <Milestones at={1} got={memCount} rewards={[{ count: 1, pi: 10, id: "mem1" }]} />
                <GameCard2
                  icon="🔮" name="PIN BALL RECALL" easyId="pinball"
                  preview={<span className="grid grid-cols-3 gap-0.5" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => (<span key={i} className={`w-3 h-3 rounded-full ${[1, 4, 7].includes(i) ? "bg-sky-400" : "bg-slate-200 dark:bg-slate-700"}`} />))}</span>}
                  isNew
                  easy={<PinRecall />}
                  open={openId === "pinball"} onToggle={() => toggle("pinball")}
                />
                <p className="text-center text-[11px] font-bold text-slate-500">More memory duels live in <a href="/duels" className="underline">Arena → Memory ⚡</a></p>
              </>
            )}
          </div>
        </div>
      }
      workspace={
        <div className="space-y-3">
          <div className="rounded-2xl bg-white border p-4 dark:bg-[#181D27] dark:border-slate-700">
            <div className="text-xs font-black tracking-widest text-slate-500 dark:text-slate-400">⏱ RESETS IN</div>
            <div className="mt-1 text-3xl font-black text-slate-900 dark:text-white tabular-nums">{countdown}</div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Fresh boards every midnight. Ratings & π never reset. 💛</p>
          </div>
          <div className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-4 text-center dark:bg-amber-950 dark:border-amber-700">
            <div className="text-4xl font-black text-slate-900 dark:text-white">π {pi}</div>
            <div className="text-xs font-black tracking-widest text-amber-700 dark:text-amber-300">YOUR PI BANK</div>
          </div>
          <div className="rounded-2xl bg-white border p-3 dark:bg-[#181D27] dark:border-slate-700">
            <div className="text-xs font-black tracking-widest text-slate-500 dark:text-slate-400">TODAY</div>
            <p className="mt-1 text-sm font-bold text-slate-700 dark:text-slate-200">🧩 {pCount}/4 • ➗ {mCount}/2 • 👁️ {memCount}/1</p>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Date key {dailies.date} • stored on this device 📱</p>
          </div>
        </div>
      }
    />
  );
}

export default function DailiesClient() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-8 text-center font-bold">Loading dailies… 📅</div>}>
      <Inner />
    </Suspense>
  );
}
