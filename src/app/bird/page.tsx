"use client";
import { useEffect, useMemo, useState, useRef } from "react";
import GameShell from "@/components/GameShell";
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
  { id: "up", label: "Fly Up", icon: "⬆️", color: "bg-sky-50 border-sky-300" },
  { id: "down", label: "Fly Down", icon: "⬇️", color: "bg-sky-50 border-sky-300" },
  { id: "left", label: "Fly Left", icon: "⬅️", color: "bg-amber-50 border-amber-300" },
  { id: "right", label: "Fly Right", icon: "➡️", color: "bg-amber-50 border-amber-300" },
  { id: "ifworm", label: "If worm ahead", icon: "🪱", color: "bg-emerald-50 border-emerald-300" },
  { id: "repeat", label: "Repeat 3×", icon: "🔁", color: "bg-violet-50 border-violet-300" },
];

export default function BirdPage() {
  const [idx, setIdx] = useState(0);
  const lvl = LEVELS[idx];
  const [program, setProgram] = useState<DroppedBlock[]>([]);
  const [bird, setBird] = useState<Pos>(lvl.bird);
  const [worms, setWorms] = useState<Pos[]>(() => [lvl.worm, (lvl as any).worm2].filter(Boolean));
  const [running, setRunning] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "win" | "fail">("idle");
  const timers = useRef<number[]>([]);

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
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setRunning(false);
  }, [idx, lvl]);

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
          setMsg("🎉 Bird fed! All worms eaten!");
          setStatus("win");
          const nxt = Math.min(idx + 2, LEVELS.length);
          setLevel("bird", nxt);
          setGameProgress("bird", { level: nxt, completed: idx === LEVELS.length - 1, stars: 3 });
          if (idx < LEVELS.length - 1) timers.current.push(window.setTimeout(() => setIdx((v) => v + 1), 1300));
        } else {
          setMsg("Almost — worm still there! Adjust your flight path.");
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
          setMsg("💥 Hit a branch! Stay in bounds.");
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
      subtitle={`Level ${lvl.id} — ${lvl.title} • Conditional logic`}
      color="from-emerald-100 to-teal-100 border-emerald-200"
      controls={
        <>
          <button onClick={() => { timers.current.forEach((t) => window.clearTimeout(t)); setRunning(false); setBird(lvl.bird); setWorms([lvl.worm, (lvl as any).worm2].filter(Boolean) as Pos[]); setMsg(null); setStatus("idle"); }} className="px-3 py-1.5 rounded-full bg-white border text-sm font-bold">Reset</button>
          <button onClick={run} disabled={running || program.length === 0} className={`px-5 py-1.5 rounded-full font-black text-sm shadow ${running ? "bg-slate-200" : "bg-emerald-600 text-white"}`}>{running ? "Flying…" : "▶ Fly"}</button>
        </>
      }
      levelBar={
        <div className="flex gap-1.5 overflow-x-auto py-1">
          {LEVELS.map((l, i) => (
            <button key={l.id} onClick={() => !running && setIdx(i)} className={`shrink-0 w-8 h-8 rounded-xl border-2 font-black text-xs grid place-items-center ${i === idx ? "bg-slate-900 text-white" : i < idx ? "bg-emerald-600 text-white" : "bg-white"}`}>{i < idx ? "✓" : l.id}</button>
          ))}
        </div>
      }
      canvas={
        <div className="p-3 sm:p-4">
          {msg && <div className={`mb-3 px-3 py-2 rounded-xl text-sm font-bold border ${status === "win" ? "bg-emerald-50 border-emerald-200" : status === "fail" ? "bg-red-50 border-red-200 text-red-700" : "bg-slate-50"}`}>{msg}</div>}
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
      workspace={<BlockWorkspace palette={PALETTE} program={program} setProgram={setProgram} maxBlocks={lvl.max} />}
    />
  );
}
