"use client";
import { useEffect, useMemo, useState, useRef } from "react";
import GameShell from "@/components/GameShell";
import Celebration from "@/components/Celebration";
import BlockWorkspace, { BlockDef, DroppedBlock } from "@/components/BlockWorkspace";
import { getLevel, setLevel, setGameProgress } from "@/lib/storage";

type Pos = { x: number; y: number };
const LEVELS = [
  { id: 1, title: "First Worm", size: 5, bird: { x: 0, y: 2 }, worm: { x: 4, y: 2 }, walls: [] as Pos[], max: 5 },
  { id: 2, title: "Turn & Eat", size: 5, bird: { x: 0, y: 0 }, worm: { x: 4, y: 4 }, walls: [] as Pos[], max: 6 },
  { id: 3, title: "Two Worms", size: 6, bird: { x: 2, y: 5 }, worm: { x: 2, y: 0 }, worm2: { x: 5, y: 5 }, walls: [{ x: 2, y: 2 }] as Pos[], max: 10 },
  { id: 4, title: "Branch Maze", size: 6, bird: { x: 0, y: 0 }, worm: { x: 5, y: 5 }, walls: [{ x: 1, y: 1 }, { x: 1, y: 2 }, { x: 3, y: 3 }] as Pos[], max: 10 },
  { id: 5, title: "If Worm Ahead", size: 6, bird: { x: 0, y: 3 }, worm: { x: 5, y: 3 }, walls: [{ x: 2, y: 2 }, { x: 2, y: 4 }, { x: 4, y: 2 }] as Pos[], max: 8 },
  { id: 6, title: "Repeat Flight", size: 5, bird: { x: 0, y: 4 }, worm: { x: 4, y: 0 }, walls: [] as Pos[], max: 6 },
  { id: 7, title: "Forest", size: 7, bird: { x: 0, y: 0 }, worm: { x: 6, y: 6 }, walls: [{ x: 1, y: 1 }, { x: 3, y: 2 }, { x: 5, y: 3 }, { x: 2, y: 5 }] as Pos[], max: 14 },
  { id: 8, title: "Hunt", size: 7, bird: { x: 3, y: 6 }, worm: { x: 3, y: 0 }, walls: [{ x: 2, y: 4 }, { x: 4, y: 4 }, { x: 3, y: 3 }] as Pos[], max: 12 },
  { id: 9, title: "Double Trouble", size: 7, bird: { x: 0, y: 3 }, worm: { x: 6, y: 1 }, worm2: { x: 6, y: 5 }, walls: [{ x: 2, y: 1 }, { x: 2, y: 5 }, { x: 4, y: 3 }] as Pos[], max: 14 },
  { id: 10, title: "Master Bird", size: 8, bird: { x: 0, y: 7 }, worm: { x: 7, y: 0 }, walls: [{ x: 1, y: 6 }, { x: 3, y: 5 }, { x: 5, y: 3 }, { x: 5, y: 1 }] as Pos[], max: 16 },
];

const PALETTE: BlockDef[] = [
  { id: "up", label: "Fly Up", icon: "⬆️", color: "bg-[#4C97FF] border-black/20 text-white" },
  { id: "down", label: "Fly Down", icon: "⬇️", color: "bg-[#4C97FF] border-black/20 text-white" },
  { id: "left", label: "Fly Left", icon: "⬅️", color: "bg-[#4C97FF] border-black/20 text-white" },
  { id: "right", label: "Fly Right", icon: "➡️", color: "bg-[#4C97FF] border-black/20 text-white" },
  { id: "ifworm", label: "If worm ahead", icon: "🪱", color: "bg-[#FFAB19] border-black/20 text-white" },
  { id: "repeat", label: "Repeat 3×", icon: "🔁", color: "bg-[#FFAB19] border-black/20 text-white" },
];

type BirdLevel = { size: number; bird: Pos; worm: Pos; worm2?: Pos; walls: Pos[] };

// Kid-friendly solver: BFS collecting all worms — powers Hint + Magic Solve
function solveBirdLevel(lvl: BirdLevel): string[] {
  const walls = new Set(lvl.walls.map((w) => `${w.x},${w.y}`));
  const worms = [lvl.worm, lvl.worm2].filter(Boolean) as Pos[];
  const wIdx = new Map(worms.map((w, i) => [`${w.x},${w.y}`, i]));
  const full = (1 << worms.length) - 1;
  let sm = 0;
  if (wIdx.has(`${lvl.bird.x},${lvl.bird.y}`)) sm |= 1 << wIdx.get(`${lvl.bird.x},${lvl.bird.y}`)!;
  const moves = [
    ["up", 0, -1],
    ["down", 0, 1],
    ["left", -1, 0],
    ["right", 1, 0],
  ] as const;
  type S = { x: number; y: number; m: number; path: string[] };
  const seen = new Set([`${lvl.bird.x},${lvl.bird.y},${sm}`]);
  const q: S[] = [{ x: lvl.bird.x, y: lvl.bird.y, m: sm, path: [] }];
  while (q.length) {
    const cur = q.shift()!;
    if (cur.m === full) return cur.path;
    if (cur.path.length > 40) continue;
    for (const [act, dx, dy] of moves) {
      const nx = cur.x + dx;
      const ny = cur.y + dy;
      if (nx < 0 || ny < 0 || nx >= lvl.size || ny >= lvl.size) continue;
      if (walls.has(`${nx},${ny}`)) continue;
      let nm = cur.m;
      if (wIdx.has(`${nx},${ny}`)) nm |= 1 << wIdx.get(`${nx},${ny}`)!;
      const k = `${nx},${ny},${nm}`;
      if (seen.has(k)) continue;
      seen.add(k);
      q.push({ x: nx, y: ny, m: nm, path: [...cur.path, act] });
    }
  }
  return [];
}

const BIRD_LOOKUP: Record<string, BlockDef> = {
  up: { id: "up", label: "Fly Up", icon: "⬆️", color: "bg-[#4C97FF] border-black/20 text-white" },
  down: { id: "down", label: "Fly Down", icon: "⬇️", color: "bg-[#4C97FF] border-black/20 text-white" },
  left: { id: "left", label: "Fly Left", icon: "⬅️", color: "bg-[#4C97FF] border-black/20 text-white" },
  right: { id: "right", label: "Fly Right", icon: "➡️", color: "bg-[#4C97FF] border-black/20 text-white" },
};

export default function BirdPage() {
  const [idx, setIdx] = useState(0);
  const lvl = LEVELS[idx];
  const [program, setProgram] = useState<DroppedBlock[]>([]);
  const [bird, setBird] = useState<Pos>(lvl.bird);
  const [worms, setWorms] = useState<Pos[]>(() => [lvl.worm, (lvl as any).worm2].filter(Boolean));
  const [running, setRunning] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "win" | "fail">("idle");
  const [showHint, setShowHint] = useState(false);
  const [showCeleb, setShowCeleb] = useState(false);
  const timers = useRef<number[]>([]);
  const solution = useMemo(() => solveBirdLevel(lvl), [lvl]);

  useEffect(() => {
    const s = getLevel("bird", LEVELS.length);
    setIdx(Math.min(s - 1, LEVELS.length - 1));
  }, []);
  useEffect(() => {
    setBird(lvl.bird);
    setWorms([lvl.worm, (lvl as any).worm2].filter(Boolean) as Pos[]);
    setProgram([]);
    setMsg(null);
    setStatus("idle");
    setShowHint(false);
    setShowCeleb(false);
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setRunning(false);
  }, [idx, lvl]);

  const magicSolve = () => {
    if (running || solution.length === 0) return;
    setProgram(solution.map((id) => ({ ...BIRD_LOOKUP[id], uid: Math.random().toString(36).slice(2, 9) })));
    setMsg("✨ Magic filled the flight! Press ▶ Fly to watch birdie eat! 🐦🪱");
    setStatus("idle");
    setShowHint(false);
  };

  const resetAll = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    setRunning(false);
    setBird(lvl.bird);
    setWorms([lvl.worm, (lvl as any).worm2].filter(Boolean) as Pos[]);
    setMsg(null);
    setStatus("idle");
    setShowCeleb(false);
  };

  const wallSet = useMemo(() => new Set(lvl.walls.map((w) => `${w.x},${w.y}`)), [lvl]);

  const run = () => {
    if (running || program.length === 0) return;
    setRunning(true);
    setStatus("idle");
    setMsg(null);
    let cur = { ...lvl.bird };
    let ws = [...worms];
    setBird(cur);

    const expanded: string[] = [];
    for (const b of program) {
      if (b.id === "repeat") {
        const last = expanded[expanded.length - 1];
        if (last && last !== "repeat" && last !== "ifworm") for (let k = 0; k < 2; k++) expanded.push(last);
      } else expanded.push(b.id);
    }

    const isWormAhead = (p: Pos) => ws.some((w) => Math.abs(w.x - p.x) + Math.abs(w.y - p.y) === 1);

    const step = (i: number) => {
      if (i >= expanded.length) {
        if (ws.length === 0) {
          setMsg("🎉 YUMMY! Birdie ate all the worms! You are amazing! 🐦💛⭐");
          setStatus("win");
          const nxt = Math.min(idx + 2, LEVELS.length);
          setLevel("bird", nxt);
          setGameProgress("bird", { level: nxt, completed: idx === LEVELS.length - 1, stars: 3 });
          setShowCeleb(true);
        } else {
          setMsg("🌟 Nice flying! Worm is still hungry-waiting! Tap 💡 Hint — you are doing great! 💪🪱");
          setStatus("fail");
        }
        setRunning(false);
        return;
      }
      const a = expanded[i];
      let nx = cur.x, ny = cur.y;
      if (a === "up") ny--;
      else if (a === "down") ny++;
      else if (a === "left") nx--;
      else if (a === "right") nx++;
      else if (a === "ifworm") {
        if (isWormAhead(cur)) {
          // move toward nearest worm
          const nearest = ws.reduce((best, w) => (Math.abs(w.x - cur.x) + Math.abs(w.y - cur.y) < Math.abs(best.x - cur.x) + Math.abs(best.y - cur.y) ? w : best), ws[0]);
          if (nearest.x > cur.x) nx++;
          else if (nearest.x < cur.x) nx--;
          else if (nearest.y > cur.y) ny++;
          else if (nearest.y < cur.y) ny--;
        }
      }
      if (a !== "ifworm" || (a === "ifworm" && isWormAhead(cur))) {
        const inBounds = nx >= 0 && ny >= 0 && nx < lvl.size && ny < lvl.size;
        if (!inBounds || wallSet.has(`${nx},${ny}`)) {
          setMsg("🌳 Oopsie — bumped a tree! No worries, birdies bump too! Try another way or tap 💡 Hint. 💛");
          setStatus("fail");
          setRunning(false);
          return;
        }
        cur = { x: nx, y: ny };
        ws = ws.filter((w) => !(w.x === cur.x && w.y === cur.y));
        setBird({ ...cur });
        setWorms([...ws]);
      }
      timers.current.push(window.setTimeout(() => step(i + 1), 420));
    };
    step(0);
  };

  const cells = useMemo(() => {
    const arr = [];
    for (let y = 0; y < lvl.size; y++) for (let x = 0; x < lvl.size; x++) arr.push({ x, y });
    return arr;
  }, [lvl.size]);

  return (
    <GameShell
      title="Bird"
      icon="🐦"
      subtitle={`Level ${lvl.id} — ${lvl.title} • Easy & unlimited ♾️`}
      color="from-emerald-100 to-teal-100 border-emerald-200 dark:from-emerald-950 dark:to-teal-950 dark:border-emerald-800"
      controls={
        <>
          <button onClick={resetAll} className="px-3 py-1.5 rounded-full bg-white border text-sm font-bold dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">🔄 Try Again</button>
          <button onClick={run} disabled={running || program.length === 0} className={`px-5 py-1.5 rounded-full font-black text-sm shadow ${running ? "bg-slate-200" : "bg-emerald-600 text-white"}`}>{running ? "Flying…" : "▶ Fly"}</button>
        </>
      }
      levelBar={
        <div className="flex gap-1.5 overflow-x-auto py-1">
          {LEVELS.map((l, i) => (
              <button key={l.id} onClick={() => !running && setIdx(i)} className={`shrink-0 w-8 h-8 rounded-xl border-2 font-black text-xs grid place-items-center ${i === idx ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : i < idx ? "bg-emerald-600 text-white border-emerald-700" : "bg-white text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600"}`}>{i < idx ? "✓" : l.id}</button>
          ))}
        </div>
      }
      canvas={
        <div className="p-3 sm:p-4">
          <Celebration
            open={showCeleb}
            mascot="🐦"
            title="BIRDIE IS FULL!"
            message={`Yummy! Birdie gobbled every worm on level ${lvl.id}! What a clever pilot! 🪱`}
            primaryLabel={idx < LEVELS.length - 1 ? `Next → Level ${lvl.id + 1}` : "★ All worms eaten!"}
            onPrimary={() => {
              setShowCeleb(false);
              if (idx < LEVELS.length - 1) setIdx((v) => v + 1);
            }}
            secondaryLabel="🔄 Fly this level again"
            onSecondary={() => {
              setShowCeleb(false);
              resetAll();
            }}
          />
          <div className="mb-3 flex flex-wrap gap-2">
            <button onClick={() => setShowHint((v) => !v)} className="px-3 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black hover:bg-amber-200 dark:bg-amber-900 dark:border-amber-700 dark:text-amber-100">
              💡 {showHint ? "Hide Hint" : "Need a Hint?"}
            </button>
            <button onClick={magicSolve} disabled={running || solution.length === 0} className="px-3 py-1.5 rounded-full bg-violet-600 text-white text-xs font-black shadow hover:bg-violet-700 disabled:opacity-40">
              ✨ Magic Solve for Me
            </button>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 self-center">♾️ Unlimited blocks — more is OK! 🌟</span>
          </div>
          {showHint && (
            <div className="mb-3 px-3 py-2 rounded-xl text-sm font-bold border bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-100">
              💡 Hint: fly — {solution.slice(0, 8).map((s) => (s === "up" ? "⬆️ Up" : s === "down" ? "⬇️ Down" : s === "left" ? "⬅️ Left" : "➡️ Right")).join(" → ")}
              {solution.length > 8 ? ` … +${solution.length - 8} more!` : ""}
            </div>
          )}
          {msg && <div className={`mb-3 px-3 py-2 rounded-xl text-sm font-bold border ${status === "win" ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-100" : status === "fail" ? "bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-950 dark:border-orange-800 dark:text-orange-100" : "bg-slate-50 dark:bg-slate-800"}`}>{msg}</div>}
          <div className="grid gap-1 p-2 rounded-2xl bg-gradient-to-br from-sky-50 to-emerald-50 border mx-auto" style={{ gridTemplateColumns: `repeat(${lvl.size}, minmax(0,1fr))`, maxWidth: 420 }}>
            {cells.map((c) => {
              const isWall = wallSet.has(`${c.x},${c.y}`);
              const isWorm = worms.some((w) => w.x === c.x && w.y === c.y);
              const isBird = bird.x === c.x && bird.y === c.y;
              return (
                <div key={`${c.x}-${c.y}`} className={`aspect-square rounded-xl border-2 grid place-items-center text-lg ${isWall ? "bg-slate-800 border-slate-900" : "bg-white border-slate-200"}`}>
                  {isWall ? "🌳" : isBird ? "🐦" : isWorm ? "🪱" : ""}
                </div>
              );
            })}
          </div>
        </div>
      }
      workspace={
        <div className="space-y-3">
          <BlockWorkspace palette={PALETTE} program={program} setProgram={setProgram} maxBlocks={lvl.max} />
          <div className="rounded-2xl bg-white border p-3 dark:bg-slate-900 dark:border-slate-700">
            <div className="text-xs font-black tracking-widest text-slate-500 dark:text-slate-400">EASY FLYING TIPS 🐦</div>
            <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">👆 Tap arrows to fly — use as many as you want! ♾️ Bumped a tree? Just tap 🔄 Try Again — birdies never give up! 💛</p>
          </div>
        </div>
      }
    />
  );
}
