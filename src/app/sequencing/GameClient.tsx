"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import GameShell from "@/components/GameShell";
import Celebration from "@/components/Celebration";
import BlockWorkspace, { BlockDef, DroppedBlock } from "@/components/BlockWorkspace";
import { getLevel, setLevel, setGameProgress } from "@/lib/storage";

type Pos = { x: number; y: number };
type Dir = 0 | 1 | 2 | 3; // N E S W
type Cell = "empty" | "wall" | "banana";

const DIRS = [
  { dx: 0, dy: -1, rot: 0 },
  { dx: 1, dy: 0, rot: 90 },
  { dx: 0, dy: 1, rot: 180 },
  { dx: -1, dy: 0, rot: 270 },
];

type Level = {
  id: number;
  title: string;
  size: number;
  start: Pos & { dir: Dir };
  bananas: Pos[];
  walls: Pos[];
  maxBlocks: number;
  hint: string;
};

const LEVELS: Level[] = [
  {
    id: 1,
    title: "First Steps",
    size: 5,
    start: { x: 0, y: 2, dir: 1 },
    bananas: [{ x: 2, y: 2 }],
    walls: [],
    maxBlocks: 3,
    hint: "Tap “Move Forward” twice. Order matters!",
  },
  {
    id: 2,
    title: "Turn Right",
    size: 5,
    start: { x: 0, y: 0, dir: 1 },
    bananas: [{ x: 2, y: 2 }],
    walls: [],
    maxBlocks: 4,
    hint: "Move, turn, move. Try turn right!",
  },
  {
    id: 3,
    title: "Two Bananas",
    size: 5,
    start: { x: 1, y: 1, dir: 1 },
    bananas: [{ x: 3, y: 1 }, { x: 3, y: 3 }],
    walls: [{ x: 2, y: 2 }],
    maxBlocks: 6,
    hint: "Collect both bananas. Plan the path around the rock.",
  },
  {
    id: 4,
    title: "Around the Tree",
    size: 6,
    start: { x: 0, y: 5, dir: 0 },
    bananas: [{ x: 5, y: 0 }],
    walls: [{ x: 1, y: 4 }, { x: 1, y: 3 }, { x: 3, y: 2 }, { x: 4, y: 3 }],
    maxBlocks: 8,
    hint: "You need left & right turns. Count your steps.",
  },
  {
    id: 5,
    title: "Zig-Zag",
    size: 6,
    start: { x: 0, y: 0, dir: 1 },
    bananas: [{ x: 5, y: 5 }],
    walls: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 3 }, { x: 4, y: 4 }, { x: 1, y: 4 }],
    maxBlocks: 10,
    hint: "Longer route — use every block wisely.",
  },
  {
    id: 6,
    title: "Banana Loop",
    size: 5,
    start: { x: 2, y: 4, dir: 0 },
    bananas: [{ x: 2, y: 0 }, { x: 0, y: 2 }, { x: 4, y: 2 }],
    walls: [{ x: 2, y: 2 }],
    maxBlocks: 10,
    hint: "3 bananas around a central rock. Think in loops!",
  },
  {
    id: 7,
    title: "Repeat Power",
    size: 5,
    start: { x: 0, y: 2, dir: 1 },
    bananas: [{ x: 4, y: 2 }],
    walls: [],
    maxBlocks: 4,
    hint: "Use Repeat 2x & 3x to save blocks.",
  },
  {
    id: 8,
    title: "Final Challenge",
    size: 6,
    start: { x: 0, y: 0, dir: 1 },
    bananas: [{ x: 5, y: 0 }, { x: 5, y: 5 }, { x: 0, y: 5 }],
    walls: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 3 }, { x: 1, y: 4 }, { x: 4, y: 2 }],
    maxBlocks: 12,
    hint: "All skills together. Sequence perfectly!",
  },
];

const PALETTE: BlockDef[] = [
  { id: "fwd", label: "Move Forward", icon: "⬆️", color: "bg-sky-50 border-sky-300 text-sky-900", desc: "Step ahead" },
  { id: "left", label: "Turn Left", icon: "↩️", color: "bg-amber-50 border-amber-300 text-amber-900" },
  { id: "right", label: "Turn Right", icon: "↪️", color: "bg-amber-50 border-amber-300 text-amber-900" },
  { id: "r2", label: "Repeat 2×", icon: "🔁", color: "bg-violet-50 border-violet-300 text-violet-900" },
  { id: "r3", label: "Repeat 3×", icon: "🔂", color: "bg-violet-50 border-violet-300 text-violet-900" },
];

// Kid-friendly solver: BFS collecting all bananas — powers Hint + Magic Solve
function solveSequencingLevel(lvl: Level): string[] {
  const walls = new Set(lvl.walls.map((w) => `${w.x},${w.y}`));
  const canStep = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < lvl.size && y < lvl.size && !walls.has(`${x},${y}`);
  const bananaIdx = new Map(lvl.bananas.map((b, i) => [`${b.x},${b.y}`, i]));
  type S = { x: number; y: number; d: Dir; mask: number; path: string[] };
  let startMask = 0;
  const sk = `${lvl.start.x},${lvl.start.y}`;
  if (bananaIdx.has(sk)) startMask |= 1 << bananaIdx.get(sk)!;
  const full = (1 << lvl.bananas.length) - 1;
  const seen = new Set<string>([`${lvl.start.x},${lvl.start.y},${lvl.start.dir},${startMask}`]);
  const q: S[] = [{ x: lvl.start.x, y: lvl.start.y, d: lvl.start.dir, mask: startMask, path: [] }];
  while (q.length) {
    const cur = q.shift()!;
    if (cur.mask === full) return cur.path;
    if (cur.path.length > 50) continue;
    const nx = cur.x + DIRS[cur.d].dx;
    const ny = cur.y + DIRS[cur.d].dy;
    if (canStep(nx, ny)) {
      let nm = cur.mask;
      const bk = `${nx},${ny}`;
      if (bananaIdx.has(bk)) nm |= 1 << bananaIdx.get(bk)!;
      const k = `${nx},${ny},${cur.d},${nm}`;
      if (!seen.has(k)) {
        seen.add(k);
        q.push({ x: nx, y: ny, d: cur.d, mask: nm, path: [...cur.path, "fwd"] });
      }
    }
    for (const [act, nd] of [["left", ((cur.d + 3) % 4) as Dir], ["right", ((cur.d + 1) % 4) as Dir]] as const) {
      const k = `${cur.x},${cur.y},${nd},${cur.mask}`;
      if (!seen.has(k)) {
        seen.add(k);
        q.push({ x: cur.x, y: cur.y, d: nd, mask: cur.mask, path: [...cur.path, act] });
      }
    }
  }
  return [];
}

const BLOCK_LOOKUP: Record<string, BlockDef> = {
  fwd: { id: "fwd", label: "Move Forward", icon: "⬆️", color: "bg-sky-50 border-sky-300 text-sky-900" },
  left: { id: "left", label: "Turn Left", icon: "↩️", color: "bg-amber-50 border-amber-300 text-amber-900" },
  right: { id: "right", label: "Turn Right", icon: "↪️", color: "bg-amber-50 border-amber-300 text-amber-900" },
};

export default function SequencingPage() {
  const [levelIdx, setLevelIdx] = useState(0);
  const lvl = LEVELS[levelIdx];
  const [program, setProgram] = useState<DroppedBlock[]>([]);
  const [pos, setPos] = useState<Pos>(lvl.start);
  const [dir, setDir] = useState<Dir>(lvl.start.dir);
  const [collected, setCollected] = useState<boolean[]>(() => lvl.bananas.map(() => false));
  const [running, setRunning] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "fail">("idle");
  const [step, setStep] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showCeleb, setShowCeleb] = useState(false);
  const timeouts = useRef<number[]>([]);
  const solution = useMemo(() => solveSequencingLevel(lvl), [lvl]);

  useEffect(() => {
    const saved = getLevel("sequencing", LEVELS.length);
    setLevelIdx(Math.min(saved - 1, LEVELS.length - 1));
  }, []);

  useEffect(() => {
    setPos(lvl.start);
    setDir(lvl.start.dir);
    setCollected(lvl.bananas.map(() => false));
    setProgram([]);
    setMsg(null);
    setStatus("idle");
    setStep(0);
    setShowHint(false);
    setShowCeleb(false);
    timeouts.current.forEach((t) => window.clearTimeout(t));
    timeouts.current = [];
    setRunning(false);
  }, [levelIdx, lvl]);

  const magicSolve = () => {
    if (running || solution.length === 0) return;
    setProgram(solution.map((id) => ({ ...BLOCK_LOOKUP[id], uid: Math.random().toString(36).slice(2, 9) })));
    setMsg("✨ Magic filled the answer! Press ▶ Run to watch the monkey grab bananas! 🐒🍌");
    setStatus("idle");
    setShowHint(false);
  };

  const wallsSet = useMemo(() => new Set(lvl.walls.map((w) => `${w.x},${w.y}`)), [lvl]);
  const expanded = useMemo(() => {
    const out: string[] = [];
    for (const b of program) {
      if (b.id === "r2") {
        const last = out[out.length - 1];
        if (last) out.push(last);
      } else if (b.id === "r3") {
        const last = out[out.length - 1];
        if (last) { out.push(last); out.push(last); }
      } else out.push(b.id);
    }
    return out;
  }, [program]);

  const run = async () => {
    if (running || program.length === 0) return;
    setRunning(true);
    setStatus("idle");
    setMsg(null);
    setPos(lvl.start);
    setDir(lvl.start.dir);
    setCollected(lvl.bananas.map(() => false));
    setStep(0);

    let cur: Pos = { ...lvl.start };
    let d: Dir = lvl.start.dir;
    let coll = lvl.bananas.map(() => false);

    const tick = (i: number) => {
      if (i >= expanded.length) {
        const all = coll.every(Boolean);
        if (all) {
          setStatus("success");
          setMsg("🎉 WOW! You collected ALL bananas! Monkey is so happy! 🐒💛 You are a coding superstar! ⭐");
          const next = Math.min(levelIdx + 2, LEVELS.length);
          setLevel("sequencing", next);
          setGameProgress("sequencing", { completed: levelIdx === LEVELS.length - 1, stars: 3, level: next });
          setShowCeleb(true);
        } else {
          setStatus("fail");
          setMsg("🌟 Great trying! Some bananas are still waiting! Tap 💡 Hint for help — you are learning so fast! 💪🍌");
        }
        setRunning(false);
        return;
      }
      const act = expanded[i];
      setStep(i + 1);
      if (act === "left") d = ((d + 3) % 4) as Dir;
      else if (act === "right") d = ((d + 1) % 4) as Dir;
      else if (act === "fwd") {
        const nx = cur.x + DIRS[d].dx;
        const ny = cur.y + DIRS[d].dy;
        const key = `${nx},${ny}`;
        const inBounds = nx >= 0 && ny >= 0 && nx < lvl.size && ny < lvl.size;
        if (!inBounds || wallsSet.has(key)) {
          setMsg("🧱 Oops — hit a wall or edge! Check your sequence.");
          setStatus("fail");
          setRunning(false);
          return;
        }
        cur = { x: nx, y: ny };
        lvl.bananas.forEach((b, idx) => {
          if (b.x === cur.x && b.y === cur.y) coll[idx] = true;
        });
      }
      setPos({ ...cur });
      setDir(d);
      setCollected([...coll]);
      const t = window.setTimeout(() => tick(i + 1), 520);
      timeouts.current.push(t);
    };
    tick(0);
  };

  const reset = () => {
    timeouts.current.forEach((t) => window.clearTimeout(t));
    timeouts.current = [];
    setRunning(false);
    setPos(lvl.start);
    setDir(lvl.start.dir);
    setCollected(lvl.bananas.map(() => false));
    setStep(0);
    setMsg(null);
    setStatus("idle");
    setShowCeleb(false);
  };

  const gridCells = useMemo(() => {
    const cells = [];
    for (let y = 0; y < lvl.size; y++) for (let x = 0; x < lvl.size; x++) cells.push({ x, y });
    return cells;
  }, [lvl.size]);

  return (
    <GameShell
      title="Sequencing"
      icon="🐒"
      subtitle={`Level ${lvl.id} — ${lvl.title} • Easy & unlimited ♾️`}
      color="from-amber-100 to-orange-100 border-amber-200 dark:from-amber-950 dark:to-orange-950 dark:border-amber-800"
      controls={
        <>
          <button onClick={reset} className="px-3 py-1.5 rounded-full bg-white border text-sm font-bold dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">🔄 Try Again</button>
          <button
            onClick={run}
            disabled={running || program.length === 0}
            className={`px-5 py-1.5 rounded-full font-black text-sm shadow ${running ? "bg-slate-200 text-slate-500" : "bg-emerald-500 text-white hover:bg-emerald-600"}`}
          >
            {running ? `Running ${step}/${expanded.length}…` : "▶ Run"}
          </button>
        </>
      }
      levelBar={
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {LEVELS.map((l, i) => (
            <button
              key={l.id}
              onClick={() => !running && setLevelIdx(i)}
              className={`shrink-0 w-9 h-9 rounded-xl border-2 font-black text-sm grid place-items-center ${i === levelIdx ? "bg-slate-900 text-white border-slate-900" : i < levelIdx ? "bg-emerald-500 text-white border-emerald-600" : "bg-white"}`}
            >
              {i < levelIdx ? "✓" : l.id}
            </button>
          ))}
          <span className="ml-2 text-xs font-bold text-slate-500 whitespace-nowrap">{lvl.hint}</span>
        </div>
      }
      canvas={
        <div className="p-3 sm:p-4">
          <Celebration
            open={showCeleb}
            mascot="🐒"
            title="BANANAS COLLECTED!"
            message={`Monkey munched every banana on level ${lvl.id}! You ordered the steps perfectly! 🍌`}
            primaryLabel={levelIdx < LEVELS.length - 1 ? `Next → Level ${lvl.id + 1}` : "★ All bananas collected!"}
            onPrimary={() => {
              setShowCeleb(false);
              if (levelIdx < LEVELS.length - 1) setLevelIdx((v) => v + 1);
            }}
            secondaryLabel="🔄 Play this level again"
            onSecondary={() => {
              setShowCeleb(false);
              reset();
            }}
          />
          <div className="mb-3 flex flex-wrap gap-2">
            <button onClick={() => setShowHint((v) => !v)} className="px-3 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black hover:bg-amber-200 dark:bg-amber-900 dark:border-amber-700 dark:text-amber-100">
              💡 {showHint ? "Hide Hint" : "Need a Hint?"}
            </button>
            <button onClick={magicSolve} disabled={running || solution.length === 0} className="px-3 py-1.5 rounded-full bg-violet-600 text-white text-xs font-black shadow hover:bg-violet-700 disabled:opacity-40">
              ✨ Magic Solve for Me
            </button>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 self-center">Asking for help is smart! 🌟 ♾️ Unlimited blocks!</span>
          </div>
          {showHint && (
            <div className="mb-3 px-3 py-2 rounded-xl text-sm font-bold border bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-100">
              💡 Hint: try — {solution.slice(0, 8).map((s) => (s === "fwd" ? "⬆️ Forward" : s === "left" ? "↩️ Left" : "↪️ Right")).join(" → ")}
              {solution.length > 8 ? ` … +${solution.length - 8} more!` : ""} Extra blocks are OK! ♾️
            </div>
          )}
          {msg && (
            <div className={`mb-3 px-3 py-2 rounded-xl text-sm font-bold border ${status === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-100" : status === "fail" ? "bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-950 dark:border-orange-800 dark:text-orange-100" : "bg-amber-50 border-amber-200 dark:bg-slate-800"}`}>{msg}</div>
          )}
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-extrabold tracking-widest text-slate-500 dark:text-slate-400">WORLD • {lvl.size}×{lvl.size} • {collected.filter(Boolean).length}/{lvl.bananas.length} 🍌</div>
            <div className="text-xs font-bold px-2 py-1 rounded-full bg-white border dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">{expanded.length} steps • ♾️ Unlimited — more is OK! 🎉</div>
          </div>

          {/* Grid */}
          <div
            className="mx-auto grid gap-1 p-2 rounded-2xl bg-gradient-to-br from-green-50 to-amber-50 border"
            style={{ gridTemplateColumns: `repeat(${lvl.size}, minmax(0,1fr))`, maxWidth: 420 }}
          >
            {gridCells.map((c) => {
              const isWall = wallsSet.has(`${c.x},${c.y}`);
              const bi = lvl.bananas.findIndex((b) => b.x === c.x && b.y === c.y);
              const isBanana = bi !== -1 && !collected[bi];
              const isCollected = bi !== -1 && collected[bi];
              const isMonkey = pos.x === c.x && pos.y === c.y;
              return (
                <div
                  key={`${c.x}-${c.y}`}
                  className={`aspect-square rounded-xl border-2 grid place-items-center text-lg sm:text-xl relative overflow-hidden ${isWall ? "bg-stone-700 border-stone-800" : "bg-white border-slate-200"}`}
                >
                  {isWall && <span>🌳</span>}
                  {isBanana && <span className="animate-bounce">🍌</span>}
                  {isCollected && <span className="opacity-30">🍌</span>}
                  {isMonkey && (
                    <span
                      className="absolute inset-0 grid place-items-center bg-amber-200/60 rounded-xl transition-all duration-400"
                      style={{ transform: `rotate(${DIRS[dir].rot}deg)` }}
                    >
                      <span className="text-xl">🐒</span>
                    </span>
                  )}
                  {!isWall && !isBanana && !isMonkey && <span className="opacity-10 text-xs">{c.x},{c.y}</span>}
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap gap-2 justify-center">
            <span className="text-xs px-2 py-1 rounded-full bg-white border font-semibold">🐒 Monkey</span>
            <span className="text-xs px-2 py-1 rounded-full bg-white border font-semibold">🍌 Banana</span>
            <span className="text-xs px-2 py-1 rounded-full bg-white border font-semibold">🌳 Obstacle</span>
          </div>
        </div>
      }
      workspace={
        <div className="space-y-3">
          <BlockWorkspace palette={PALETTE} program={program} setProgram={setProgram} maxBlocks={lvl.maxBlocks} />
          <div className="rounded-2xl bg-white border p-3 dark:bg-slate-900 dark:border-slate-700">
            <div className="text-xs font-black tracking-widest text-slate-500 dark:text-slate-400">HOW TO PLAY — SUPER EASY! 🌟</div>
            <ul className="mt-1 text-sm text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-1 font-medium">
              <li>👆 Tap blocks to add — as many as you want! ♾️</li>
              <li>▶️ Press Run to watch the monkey go!</li>
              <li>🍌 Grab all bananas — bumping is OK, just try again! 💛</li>
            </ul>
          </div>
        </div>
      }
    />
  );
}
