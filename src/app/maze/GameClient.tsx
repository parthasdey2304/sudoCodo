"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import GameShell from "@/components/GameShell";
import Celebration from "@/components/Celebration";
import BlockWorkspace, { BlockDef, DroppedBlock } from "@/components/BlockWorkspace";
import { getLevel, setLevel, setGameProgress } from "@/lib/storage";

type Pos = { x: number; y: number };
type Dir = 0 | 1 | 2 | 3;
const DIRS = [
  { dx: 0, dy: -1, rot: 0 },
  { dx: 1, dy: 0, rot: 90 },
  { dx: 0, dy: 1, rot: 180 },
  { dx: -1, dy: 0, rot: 270 },
];

type MazeLevel = {
  id: number;
  title: string;
  size: number;
  start: Pos & { dir: Dir };
  goal: Pos;
  walls: Pos[];
  maxBlocks: number;
  palette: string[];
};

const ALL_LEVELS: MazeLevel[] = [
  { id: 1, title: "Straight Path", size: 5, start: { x: 0, y: 2, dir: 1 }, goal: { x: 4, y: 2 }, walls: [], maxBlocks: 4, palette: ["fwd"] },
  { id: 2, title: "Turn", size: 5, start: { x: 0, y: 0, dir: 1 }, goal: { x: 4, y: 4 }, walls: [], maxBlocks: 6, palette: ["fwd", "left", "right"] },
  { id: 3, title: "Wall", size: 6, start: { x: 0, y: 0, dir: 1 }, goal: { x: 5, y: 5 }, walls: [{ x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }, { x: 3, y: 3 }, { x: 3, y: 4 }], maxBlocks: 8, palette: ["fwd", "left", "right"] },
  { id: 4, title: "Loop Intro", size: 6, start: { x: 0, y: 5, dir: 0 }, goal: { x: 5, y: 0 }, walls: [{ x: 2, y: 4 }, { x: 2, y: 3 }, { x: 2, y: 2 }, { x: 4, y: 2 }], maxBlocks: 6, palette: ["fwd", "left", "right", "repeat"] },
  { id: 5, title: "Maze Sprint", size: 7, start: { x: 0, y: 0, dir: 1 }, goal: { x: 6, y: 6 }, walls: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 5, y: 3 }, { x: 5, y: 4 }, { x: 5, y: 5 }], maxBlocks: 12, palette: ["fwd", "left", "right", "repeat"] },
  { id: 6, title: "U-Turn", size: 6, start: { x: 0, y: 2, dir: 1 }, goal: { x: 0, y: 4 }, walls: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }], maxBlocks: 8, palette: ["fwd", "left", "right", "repeat"] },
  { id: 7, title: "Harder Maze", size: 7, start: { x: 3, y: 0, dir: 2 }, goal: { x: 3, y: 6 }, walls: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 1 }, { x: 1, y: 3 }, { x: 1, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 4 }], maxBlocks: 14, palette: ["fwd", "left", "right", "repeat", "if"] },
  { id: 8, title: "If Path", size: 7, start: { x: 0, y: 3, dir: 1 }, goal: { x: 6, y: 3 }, walls: [{ x: 2, y: 2 }, { x: 2, y: 4 }, { x: 4, y: 2 }, { x: 4, y: 4 }], maxBlocks: 12, palette: ["fwd", "left", "right", "repeat", "if"] },
  { id: 9, title: "Champion", size: 8, start: { x: 0, y: 0, dir: 1 }, goal: { x: 7, y: 7 }, walls: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 2 }, { x: 4, y: 3 }, { x: 5, y: 4 }, { x: 5, y: 5 }, { x: 2, y: 5 }, { x: 2, y: 6 }], maxBlocks: 16, palette: ["fwd", "left", "right", "repeat", "if"] },
  { id: 10, title: "Master Maze", size: 8, start: { x: 0, y: 7, dir: 0 }, goal: { x: 7, y: 0 }, walls: [{ x: 1, y: 6 }, { x: 1, y: 5 }, { x: 3, y: 4 }, { x: 3, y: 3 }, { x: 5, y: 2 }, { x: 5, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 6 }], maxBlocks: 16, palette: ["fwd", "left", "right", "repeat", "if"] },
];

const BLOCK_DEFS: Record<string, BlockDef> = {
  fwd: { id: "fwd", label: "Move Forward", icon: "⬆️", color: "bg-[#4C97FF] border-black/20 text-white" },
  left: { id: "left", label: "Turn Left", icon: "↩️", color: "bg-[#4C97FF] border-black/20 text-white" },
  right: { id: "right", label: "Turn Right", icon: "↪️", color: "bg-[#4C97FF] border-black/20 text-white" },
  repeat: { id: "repeat", label: "Repeat 4×", icon: "🔁", color: "bg-[#FFAB19] border-black/20 text-white" },
  if: { id: "if", label: "If path ahead → move", icon: "❓", color: "bg-[#FFAB19] border-black/20 text-white" },
};

// Kid-friendly auto-solver: BFS over (x,y,dir) to goal — powers 💡 Hint + ✨ Magic Solve
function solveMazeLevel(lvl: MazeLevel): string[] {
  const walls = new Set(lvl.walls.map((w) => `${w.x},${w.y}`));
  const canStep = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < lvl.size && y < lvl.size && !walls.has(`${x},${y}`);
  type State = { x: number; y: number; d: Dir; path: string[] };
  const start: State = { x: lvl.start.x, y: lvl.start.y, d: lvl.start.dir, path: [] };
  const seen = new Set<string>([`${start.x},${start.y},${start.d}`]);
  const q: State[] = [start];
  while (q.length) {
    const cur = q.shift()!;
    if (cur.x === lvl.goal.x && cur.y === lvl.goal.y) return cur.path;
    if (cur.path.length > 60) continue;
    // try fwd
    const nx = cur.x + DIRS[cur.d].dx;
    const ny = cur.y + DIRS[cur.d].dy;
    if (canStep(nx, ny)) {
      const k = `${nx},${ny},${cur.d}`;
      if (!seen.has(k)) {
        seen.add(k);
        q.push({ x: nx, y: ny, d: cur.d, path: [...cur.path, "fwd"] });
      }
    }
    // try turns
    for (const [act, nd] of [["left", ((cur.d + 3) % 4) as Dir], ["right", ((cur.d + 1) % 4) as Dir]] as const) {
      const k = `${cur.x},${cur.y},${nd}`;
      if (!seen.has(k)) {
        seen.add(k);
        q.push({ x: cur.x, y: cur.y, d: nd, path: [...cur.path, act] });
      }
    }
  }
  return [];
}

export default function MazePage() {
  const [idx, setIdx] = useState(0);
  const lvl = ALL_LEVELS[idx];
  const [program, setProgram] = useState<DroppedBlock[]>([]);
  const [pos, setPos] = useState<Pos>(lvl.start);
  const [dir, setDir] = useState<Dir>(lvl.start.dir);
  const [running, setRunning] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "win" | "fail">("idle");
  const [step, setStep] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showCeleb, setShowCeleb] = useState(false);
  const ref = useRef<number[]>([]);
  const solution = useMemo(() => solveMazeLevel(lvl), [lvl]);

  useEffect(() => {
    const saved = getLevel("maze", ALL_LEVELS.length);
    setIdx(Math.min(saved - 1, ALL_LEVELS.length - 1));
  }, []);

  useEffect(() => {
    setPos(lvl.start);
    setDir(lvl.start.dir);
    setProgram([]);
    setMsg(null);
    setStatus("idle");
    setStep(0);
    setShowHint(false);
    setShowCeleb(false);
    ref.current.forEach((t) => window.clearTimeout(t));
    ref.current = [];
    setRunning(false);
  }, [idx, lvl]);

  const magicSolve = () => {
    if (running || solution.length === 0) return;
    setProgram(
      solution.map((id) => ({ ...BLOCK_DEFS[id], uid: Math.random().toString(36).slice(2, 9) }))
    );
    setMsg("✨ Magic filled the answer! Now press ▶ Run to watch it go! You can change it after. 💛");
    setStatus("idle");
    setShowHint(false);
  };

  const wallsSet = useMemo(() => new Set(lvl.walls.map((w) => `${w.x},${w.y}`)), [lvl]);
  const palette = useMemo(() => lvl.palette.map((k) => BLOCK_DEFS[k]), [lvl.palette]);

  const canMove = (p: Pos, d: Dir, walls: Set<string>, size: number) => {
    const nx = p.x + DIRS[d].dx;
    const ny = p.y + DIRS[d].dy;
    if (nx < 0 || ny < 0 || nx >= size || ny >= size) return false;
    if (walls.has(`${nx},${ny}`)) return false;
    return true;
  };

  const run = () => {
    if (running || program.length === 0) return;
    setRunning(true);
    setStatus("idle");
    setMsg(null);
    let cur: Pos = { ...lvl.start };
    let d: Dir = lvl.start.dir;
    setPos(cur);
    setDir(d);
    setStep(0);

    // expand program: repeat means repeat last fwd-like block 3 extra times
    const expanded: string[] = [];
    for (const b of program) {
      if (b.id === "repeat") {
        const last = expanded[expanded.length - 1];
        if (last && last !== "repeat" && last !== "if") {
          for (let k = 0; k < 3; k++) expanded.push(last);
        }
      } else expanded.push(b.id);
    }

    const tick = (i: number) => {
      if (i >= expanded.length) {
        if (cur.x === lvl.goal.x && cur.y === lvl.goal.y) {
          setStatus("win");
          setMsg("🏆 YAY! You did it! Super star! ⭐ Give yourself a clap! 👏");
          const next = Math.min(idx + 2, ALL_LEVELS.length);
          setLevel("maze", next);
          setGameProgress("maze", { level: next, completed: idx === ALL_LEVELS.length - 1, stars: 3 });
          setShowCeleb(true);
        } else {
          setStatus("fail");
          setMsg("🌟 Good try, superstar! Almost there! Tap 💡 Hint if you want help — trying again makes you smarter! 💪");
        }
        setRunning(false);
        return;
      }
      const act = expanded[i];
      setStep(i + 1);
      if (act === "left") d = ((d + 3) % 4) as Dir;
      else if (act === "right") d = ((d + 1) % 4) as Dir;
      else if (act === "fwd") {
        if (!canMove(cur, d, wallsSet, lvl.size)) {
          setMsg("🧱 Oopsie! Bumped a wall — no worries! Even robots bump! Try a turn first, or tap 💡 Hint. 💛");
          setStatus("fail");
          setRunning(false);
          return;
        }
        cur = { x: cur.x + DIRS[d].dx, y: cur.y + DIRS[d].dy };
      } else if (act === "if") {
        if (canMove(cur, d, wallsSet, lvl.size)) {
          cur = { x: cur.x + DIRS[d].dx, y: cur.y + DIRS[d].dy };
        }
      }
      setPos({ ...cur });
      setDir(d);
      if (cur.x === lvl.goal.x && cur.y === lvl.goal.y && i === expanded.length - 1) {
        // early win check will happen after
      }
      const t = window.setTimeout(() => tick(i + 1), 420);
      ref.current.push(t);
    };
    tick(0);
  };

  const reset = () => {
    ref.current.forEach((t) => window.clearTimeout(t));
    ref.current = [];
    setRunning(false);
    setPos(lvl.start);
    setDir(lvl.start.dir);
    setStep(0);
    setMsg(null);
    setStatus("idle");
    setShowCeleb(false);
  };

  const cells = useMemo(() => {
    const arr = [];
    for (let y = 0; y < lvl.size; y++) for (let x = 0; x < lvl.size; x++) arr.push({ x, y });
    return arr;
  }, [lvl.size]);

  return (
    <GameShell
      title="Maze"
      icon="🧭"
      subtitle={`Level ${lvl.id} — ${lvl.title} • Easy & unlimited ♾️`}
      color="from-sky-100 to-indigo-100 border-sky-200"
      controls={
        <>
          <button onClick={reset} className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-bold dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">🔄 Try Again</button>
          <button
            onClick={run}
            disabled={running || program.length === 0}
            className={`px-5 py-1.5 rounded-full font-black text-sm shadow ${running ? "bg-slate-200 text-slate-500" : "bg-sky-600 text-white hover:bg-sky-700"}`}
          >
            {running ? `Running ${step}…` : "▶ Run"}
          </button>
        </>
      }
      levelBar={
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-1">
          {ALL_LEVELS.map((l, i) => (
            <button
              key={l.id}
              onClick={() => !running && setIdx(i)}
              className={`shrink-0 w-8 h-8 rounded-xl border-2 font-black text-xs grid place-items-center ${i === idx ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white" : i < idx ? "bg-sky-600 text-white border-sky-700" : "bg-white text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600"}`}
            >
              {i < idx ? "✓" : l.id}
            </button>
          ))}
          <span className="ml-2 text-xs font-bold text-slate-500 whitespace-nowrap">🎯 Goal: reach the 🚩 • ♾️ Use as many blocks as you want!</span>
        </div>
      }
      canvas={
        <div className="p-3 sm:p-4">
          <Celebration
            open={showCeleb}
            mascot="🧭"
            title="MAZE CONQUERED!"
            message={`You guided the pegman to the flag on level ${lvl.id}! Give yourself a big clap! 👏`}
            primaryLabel={idx < ALL_LEVELS.length - 1 ? `Next → Level ${lvl.id + 1}` : "★ All mazes done!"}
            onPrimary={() => {
              setShowCeleb(false);
              if (idx < ALL_LEVELS.length - 1) setIdx((v) => v + 1);
            }}
            secondaryLabel="🔄 Play this maze again"
            onSecondary={() => {
              setShowCeleb(false);
              reset();
            }}
          />
          {/* Kid helpers: Hint + Magic Solve */}
          <div className="mb-3 flex flex-wrap gap-2">
            <button
              onClick={() => setShowHint((v) => !v)}
              className="px-3 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black hover:bg-amber-200"
            >
              💡 {showHint ? "Hide Hint" : "Need a Hint?"}
            </button>
            <button
              onClick={magicSolve}
              disabled={running || solution.length === 0}
              className="px-3 py-1.5 rounded-full bg-violet-600 text-white text-xs font-black shadow hover:bg-violet-700 disabled:opacity-40"
            >
              ✨ Magic Solve for Me
            </button>
            <span className="text-[11px] font-bold text-slate-500 self-center">No worries — asking for help is smart! 🌟</span>
          </div>
          {showHint && (
            <div className="mb-3 px-3 py-2 rounded-xl text-sm font-bold border bg-amber-50 border-amber-200 text-amber-900">
              💡 Hint: try this order — {solution.slice(0, 8).map((s) => (s === "fwd" ? "⬆️ Forward" : s === "left" ? "↩️ Left" : "↪️ Right")).join(" → ")}
              {solution.length > 8 ? ` … +${solution.length - 8} more!` : ""} You can add extra blocks — unlimited! ♾️
            </div>
          )}
          {msg && <div className={`mb-3 px-3 py-2 rounded-xl text-sm font-bold border ${status === "win" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : status === "fail" ? "bg-orange-50 border-orange-200 text-orange-800" : "bg-slate-50"}`}>{msg}</div>}
          <div className="grid gap-1 p-2 rounded-2xl bg-gradient-to-br from-slate-50 to-sky-50 border mx-auto" style={{ gridTemplateColumns: `repeat(${lvl.size}, minmax(0,1fr))`, maxWidth: 440 }}>
            {cells.map((c) => {
              const isWall = wallsSet.has(`${c.x},${c.y}`);
              const isGoal = lvl.goal.x === c.x && lvl.goal.y === c.y;
              const isPeg = pos.x === c.x && pos.y === c.y;
              return (
                <div key={`${c.x}-${c.y}`} className={`aspect-square rounded-lg border-2 grid place-items-center relative ${isWall ? "bg-slate-800 border-slate-900" : isGoal ? "bg-amber-100 border-amber-300" : "bg-white border-slate-200"}`}>
                  {isWall ? <span className="text-white">▓</span> : null}
                  {isGoal && !isPeg && <span className="text-lg">🚩</span>}
                  {isPeg && (
                    <div className="absolute inset-1 rounded-md bg-sky-500 border border-sky-600 grid place-items-center shadow transition-all duration-300" style={{ transform: `rotate(${DIRS[dir].rot}deg)` }}>
                      <span className="text-white text-sm">⮝</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-2 text-center text-xs font-semibold text-slate-500">🧭 Pegman • {program.length} blocks • ♾️ Unlimited workspace • {(() => {
            let ex = 0;
            for (const b of program) ex += b.id === "repeat" ? 4 : 1;
            return ex;
          })()} steps total — more blocks is OK! 🎉</div>
        </div>
      }
      workspace={<BlockWorkspace palette={palette} program={program} setProgram={setProgram} maxBlocks={lvl.maxBlocks} />}
    />
  );
}
