"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import GameShell from "@/components/GameShell";
import type { BlockDef } from "@/components/BlockWorkspace";

/* ================= types & levels ================= */

type Action = "right" | "left" | "up" | "down" | "jump" | "jumpr" | "jumpl";
type RepeatId = "r2" | "r3" | "r4";
type Block = { id: Action | RepeatId; uid: string };

type Level = {
  id: string;
  name: string;
  cols: number;
  rows: number;
  start: { x: number; y: number };
  goal: { x: number; y: number };
  rocks: [number, number][];
  puddles: [number, number][];
  gaps: [number, number][];
  par: number;
  slots: number;
  tip: string;
};

const LEVELS: Level[] = [
  {
    id: "1-1", name: "First Steps", cols: 6, rows: 1,
    start: { x: 0, y: 0 }, goal: { x: 5, y: 0 },
    rocks: [], puddles: [], gaps: [],
    par: 4, slots: 8, tip: "Tap ➡️ Move Right 5 times, then ▶ Run!",
  },
  {
    id: "1-2", name: "Rock in the Way", cols: 7, rows: 1,
    start: { x: 0, y: 0 }, goal: { x: 6, y: 0 },
    rocks: [[3, 0]], puddles: [], gaps: [],
    par: 5, slots: 8, tip: "A rock blocks the path! Walk close, then ↗️ Jump Right over it!",
  },
  {
    id: "1-3", name: "Puddle Hop", cols: 6, rows: 1,
    start: { x: 0, y: 0 }, goal: { x: 5, y: 0 },
    rocks: [], puddles: [[3, 0]], gaps: [],
    par: 6, slots: 10, tip: "Puddle ahead! ⏫ Jump while standing on it, or you'll slip! 💧",
  },
  {
    id: "2-1", name: "Loopy Trail", cols: 9, rows: 1,
    start: { x: 0, y: 0 }, goal: { x: 8, y: 0 },
    rocks: [], puddles: [], gaps: [],
    par: 4, slots: 10, tip: "Too many steps? Use 🔁 Repeat to loop your moves!",
  },
  {
    id: "2-2", name: "Up & Around", cols: 5, rows: 2,
    start: { x: 0, y: 1 }, goal: { x: 4, y: 0 },
    rocks: [], puddles: [], gaps: [],
    par: 5, slots: 10, tip: "The bananas are upstairs! Walk right, then climb ⬆️!",
  },
  {
    id: "2-3", name: "Monkey Master", cols: 8, rows: 2,
    start: { x: 0, y: 1 }, goal: { x: 7, y: 0 },
    rocks: [[3, 1]], puddles: [[5, 0]], gaps: [[6, 1]],
    par: 8, slots: 12, tip: "Everything at once — rock, puddle AND a hole! You can do it! 🏆",
  },
];

const PALETTE: BlockDef[] = [
  { id: "right", label: "Move Right", icon: "➡️", color: "bg-[#4C97FF] border-black/20 text-white" },
  { id: "left", label: "Move Left", icon: "⬅️", color: "bg-[#4C97FF] border-black/20 text-white" },
  { id: "up", label: "Move Up", icon: "⬆️", color: "bg-[#4C97FF] border-black/20 text-white" },
  { id: "down", label: "Move Down", icon: "⬇️", color: "bg-[#4C97FF] border-black/20 text-white" },
  { id: "jump", label: "Jump", icon: "⏫", color: "bg-[#4C97FF] border-black/20 text-white" },
  { id: "jumpr", label: "Jump Right", icon: "↗️", color: "bg-[#4C97FF] border-black/20 text-white" },
  { id: "jumpl", label: "Jump Left", icon: "↖️", color: "bg-[#4C97FF] border-black/20 text-white" },
  { id: "r2", label: "Repeat ×2", icon: "🔁", color: "bg-[#FFAB19] border-black/20 text-white" },
  { id: "r3", label: "Repeat ×3", icon: "🔂", color: "bg-[#FFAB19] border-black/20 text-white" },
  { id: "r4", label: "Repeat ×4", icon: "🔂", color: "bg-[#FFAB19] border-black/20 text-white" },
];

const PY_FN: Record<Action, string> = {
  right: "hero.move_right()",
  left: "hero.move_left()",
  up: "hero.move_up()",
  down: "hero.move_down()",
  jump: "hero.jump()",
  jumpr: "hero.jump_right()",
  jumpl: "hero.jump_left()",
};

type Progress = { unlocked: number; stars: Record<string, number> };
const PKEY = "sudocodo_monkey_progress";
const MKEY = "sudocodo_monkey_muted";

function loadProgress(): Progress {
  if (typeof window === "undefined") return { unlocked: 1, stars: {} };
  try {
    const raw = localStorage.getItem(PKEY);
    if (!raw) return { unlocked: 1, stars: {} };
    const p = JSON.parse(raw) as Progress;
    return { unlocked: Math.min(LEVELS.length, Math.max(1, p.unlocked || 1)), stars: p.stars || {} };
  } catch {
    return { unlocked: 1, stars: {} };
  }
}

/* ================= tiny sound engine ================= */

function beep(freq: number, dur = 0.12, type: OscillatorType = "sine", vol = 0.15) {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = vol;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + dur);
    window.setTimeout(() => ctx.close(), dur * 1000 + 100);
  } catch {}
}

/* ================= python highlighter ================= */

function PyLine({ code, active }: { code: string; active: boolean }) {
  const trimmed = code.trimStart();
  const indent = code.slice(0, code.length - trimmed.length);
  let body: React.ReactNode = <span className="text-slate-800 dark:text-slate-100">{trimmed}</span>;
  if (trimmed.startsWith("#")) {
    body = <span className="text-emerald-600 dark:text-emerald-400 italic">{trimmed}</span>;
  } else {
    const m = trimmed.match(/^(for|in|range)(.*)$/);
    if (trimmed.startsWith("for ")) {
      body = (
        <>
          <span className="text-violet-600 dark:text-violet-400 font-bold">for </span>
          <span className="text-slate-800 dark:text-slate-100">_ </span>
          <span className="text-violet-600 dark:text-violet-400 font-bold">in </span>
          <span className="text-amber-600 dark:text-amber-400">range</span>
          <span className="text-slate-800 dark:text-slate-100">{trimmed.slice(trimmed.indexOf("("))}</span>
        </>
      );
    } else if (trimmed.startsWith("hero.")) {
      const fn = trimmed.slice(5).split("(")[0];
      body = (
        <>
          <span className="text-sky-600 dark:text-sky-400">hero</span>
          <span className="text-slate-500">.</span>
          <span className="text-amber-600 dark:text-amber-300 font-bold">{fn}</span>
          <span className="text-slate-800 dark:text-slate-100">({trimmed.split("(").slice(1).join("(")}</span>
        </>
      );
    } else if (/^\d/.test(trimmed) || m) {
      body = <span className="text-orange-600 dark:text-orange-400">{trimmed}</span>;
    }
  }
  return (
    <div className={`px-3 font-mono text-[13px] leading-6 whitespace-pre ${active ? "bg-yellow-200/70 dark:bg-yellow-500/20 rounded" : ""}`}>
      <span className="text-slate-400 select-none">{indent}</span>
      {body}
    </div>
  );
}

/* ================= main component ================= */

export default function MonkeyCodeClient() {
  const [levelIdx, setLevelIdx] = useState(0);
  const lvl = LEVELS[levelIdx];
  const [program, setProgram] = useState<Block[]>([]);
  const [slots, setSlots] = useState(lvl.slots);
  const [monkey, setMonkey] = useState(lvl.start);
  const [anim, setAnim] = useState<"idle" | "jump" | "win" | "sad">("idle");
  const [running, setRunning] = useState(false);
  const [activeBi, setActiveBi] = useState<string | null>(null);
  const [failBi, setFailBi] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "win" | "fail">("idle");
  const [stars, setStars] = useState(0);
  const [showWin, setShowWin] = useState(false);
  const [pyTab, setPyTab] = useState(false);
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState<Progress>({ unlocked: 1, stars: {} });
  const timers = useRef<number[]>([]);

  useEffect(() => {
    setProgress(loadProgress());
    try {
      setMuted(localStorage.getItem(MKEY) === "1");
    } catch {}
  }, []);

  useEffect(() => {
    setMonkey(lvl.start);
    setProgram([]);
    setSlots(lvl.slots);
    setAnim("idle");
    setRunning(false);
    setActiveBi(null);
    setFailBi(null);
    setMsg(null);
    setStatus("idle");
    setStars(0);
    setShowWin(false);
    setActiveLine(null);
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, [levelIdx, lvl]);

  const sound = (f: number, d?: number, t?: OscillatorType) => {
    if (!muted) beep(f, d, t);
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    try {
      localStorage.setItem(MKEY, next ? "1" : "0");
    } catch {}
  };

  const reset = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setRunning(false);
    setMonkey(lvl.start);
    setAnim("idle");
    setActiveBi(null);
    setFailBi(null);
    setActiveLine(null);
    setMsg(null);
    setStatus("idle");
    setShowWin(false);
  };

  const rockSet = useMemo(() => new Set(lvl.rocks.map(([x, y]) => `${x},${y}`)), [lvl]);
  const puddleSet = useMemo(() => new Set(lvl.puddles.map(([x, y]) => `${x},${y}`)), [lvl]);
  const gapSet = useMemo(() => new Set(lvl.gaps.map(([x, y]) => `${x},${y}`)), [lvl]);

  const walkable = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < lvl.cols && y < lvl.rows && !gapSet.has(`${x},${y}`) && !rockSet.has(`${x},${y}`);

  /* ---- expansion: blocks → steps (+ python lines) ---- */
  const compiled = useMemo(() => {
    const steps: { a: Action; bi: string }[] = [];
    const lines: string[] = [`# Generated Code for Level ${lvl.id} — Monkey Coding Jr.`, `# Tap Run Code to watch it play!`, ""];
    const stepLine: number[] = [];
    let last: { a: Action; label: string } | null = null;
    let errorBi: string | null = null;
    for (const b of program) {
      if (b.id === "r2" || b.id === "r3" || b.id === "r4") {
        if (!last) {
          errorBi = b.uid;
          lines.push(`# ⚠️ ${b.id === "r2" ? "Repeat ×2" : b.id === "r3" ? "Repeat ×3" : "Repeat ×4"} needs a move before it!`);
          continue;
        }
        const n = b.id === "r2" ? 2 : b.id === "r3" ? 3 : 4;
        lines.push(`for _ in range(${n}):`);
        const bodyIdx = lines.length;
        lines.push(`    ${PY_FN[last.a]}`);
        for (let k = 0; k < n; k++) {
          steps.push({ a: last.a, bi: b.uid });
          stepLine.push(bodyIdx);
        }
      } else {
        last = { a: b.id, label: b.id };
        lines.push(PY_FN[b.id]);
        steps.push({ a: b.id, bi: b.uid });
        stepLine.push(lines.length - 1);
      }
    }
    lines.push("hero.grab_treasure()  # grab the bananas! 🍌");
    return { steps, lines, stepLine, errorBi };
  }, [program, lvl.id]);

  const addBlock = (b: { id: string }) => {
    if (running) return;
    if (program.length >= slots) {
      setMsg("🧺 Tray is full! Tap ＋ More slots for extra room — unlimited building! ♾️");
      return;
    }
    setProgram((p) => [...p, { id: b.id as Block["id"], uid: Math.random().toString(36).slice(2, 9) }]);
    setFailBi(null);
  };

  /* ---- run / execution ---- */
  const run = () => {
    if (running || program.length === 0) return;
    if (compiled.errorBi) {
      setFailBi(compiled.errorBi);
      setStatus("fail");
      setMsg("🔁 Oops — a Repeat block has no move before it! Put a move first, superstar! 💛");
      sound(200, 0.2, "sawtooth");
      return;
    }
    reset();
    setRunning(true);
    setStatus("idle");
    let pos = { ...lvl.start };
    let hopped = false; // jumped on current puddle since arriving?
    setMonkey(pos);

    const tick = (i: number) => {
      if (i >= compiled.steps.length) {
        // finished sequence
        if (pos.x === lvl.goal.x && pos.y === lvl.goal.y) return win(pos);
        setStatus("fail");
        setFailBi(compiled.steps[compiled.steps.length - 1].bi);
        setAnim("sad");
        sound(220, 0.25, "sawtooth");
        setMsg("🙈 Oh no — ran out of moves before the bananas! Tap blocks to add more, then ▶ Run again! 💪");
        setRunning(false);
        return;
      }
      const { a, bi } = compiled.steps[i];
      setActiveBi(bi);
      setActiveLine(compiled.stepLine[i]);

      const fail = (message: string) => {
        setFailBi(bi);
        setStatus("fail");
        setAnim("sad");
        sound(220, 0.25, "sawtooth");
        setMsg(message);
        setRunning(false);
        setActiveBi(null);
        setActiveLine(null);
      };

      const DIRS: Record<string, [number, number]> = {
        right: [1, 0], left: [-1, 0], up: [0, -1], down: [0, 1],
      };

      if (a === "right" || a === "left" || a === "up" || a === "down") {
        const [dx, dy] = DIRS[a];
        const nx = pos.x + dx;
        const ny = pos.y + dy;
        const onPuddle = puddleSet.has(`${pos.x},${pos.y}`);
        if (onPuddle && !hopped) {
          fail("💧 Slip! You left a puddle without jumping! Add ⏫ Jump while ON the puddle! 🙈");
          return;
        }
        if (!walkable(nx, ny)) {
          if (rockSet.has(`${nx},${ny}`)) fail("🪨 Bump! A rock blocks the way — leap over it with ↗️ Jump Right! 💪");
          else fail("🕳️ Whoa — that's a hole! Jump over gaps with ↗️ Jump Right! 🙈");
          return;
        }
        pos = { x: nx, y: ny };
        hopped = false;
        setMonkey(pos);
        sound(440 + i * 20, 0.08);
      } else if (a === "jump") {
        setAnim("jump");
        sound(660, 0.12);
        if (puddleSet.has(`${pos.x},${pos.y}`)) hopped = true;
        timers.current.push(window.setTimeout(() => setAnim("idle"), 480));
      } else if (a === "jumpr" || a === "jumpl") {
        const dx = a === "jumpr" ? 1 : -1;
        const mx = pos.x + dx;
        const lx = pos.x + 2 * dx;
        const midKey = `${mx},${pos.y}`;
        const midIsSomething = rockSet.has(midKey) || gapSet.has(midKey) || puddleSet.has(midKey);
        if (!midIsSomething) {
          fail("🙂 No need to jump here — the path is clear, just Move! Remove this block or move it over the obstacle! 💛");
          return;
        }
        if (!walkable(lx, pos.y)) {
          fail("🕳️ Can't land there! Make sure 2 tiles ahead is safe stone! 🙈");
          return;
        }
        pos = { x: lx, y: pos.y };
        hopped = false;
        setMonkey(pos);
        setAnim("jump");
        sound(760, 0.14);
        timers.current.push(window.setTimeout(() => setAnim("idle"), 480));
      }

      // win check on arrival
      if (pos.x === lvl.goal.x && pos.y === lvl.goal.y) {
        timers.current.push(window.setTimeout(() => win(pos), 450));
        return;
      }
      timers.current.push(window.setTimeout(() => tick(i + 1), 560));
    };

    const win = (at: { x: number; y: number }) => {
      void at;
      setStatus("win");
      setAnim("win");
      sound(523, 0.12);
      window.setTimeout(() => sound(659, 0.12), 130);
      window.setTimeout(() => sound(784, 0.2), 260);
      const used = program.length;
      const s = used <= lvl.par ? 3 : used <= lvl.par + 3 ? 2 : 1;
      setStars(s);
      setMsg(`🎉 AMAZING! Monkey got the bananas! ${"⭐".repeat(s)}`);
      // persist
      const cur = loadProgress();
      const nextUnlocked = Math.min(LEVELS.length, Math.max(cur.unlocked, levelIdx + 2));
      const nextStars = { ...cur.stars, [lvl.id]: Math.max(cur.stars[lvl.id] || 0, s) };
      try {
        localStorage.setItem(PKEY, JSON.stringify({ unlocked: nextUnlocked, stars: nextStars }));
        window.dispatchEvent(new Event("sudocodo-progress"));
      } catch {}
      setProgress({ unlocked: nextUnlocked, stars: nextStars });
      setRunning(false);
      setActiveBi(null);
      window.setTimeout(() => setShowWin(true), 900);
    };

    tick(0);
  };

  /* ---- stage geometry ---- */
  const TILE = 64;
  const W = lvl.cols * TILE + 40;
  const H = 340;
  const tileX = (x: number) => 20 + x * TILE;
  const tileY = (y: number) => H - 40 - (lvl.rows - 1 - y) * (TILE + 6) - 56;
  const mx = tileX(monkey.x) + 8;
  const my = tileY(monkey.y) - 6;

  const flowers = useMemo(() => {
    const arr: { x: number; y: number; e: string }[] = [];
    const icons = ["🌸", "🌼", "🌷", "🌻"];
    let seed = lvl.cols * 7 + lvl.rows * 13 + levelIdx * 29;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < lvl.cols + 3; i++) {
      arr.push({ x: 10 + rnd() * (W - 30), y: H - 30 - rnd() * 40, e: icons[Math.floor(rnd() * icons.length)] });
    }
    return arr;
  }, [lvl.cols, lvl.rows, levelIdx, W, H]);

  const cellKey = (x: number, y: number) => `${x},${y}`;
  const isRock = (x: number, y: number) => rockSet.has(cellKey(x, y));
  const isPuddle = (x: number, y: number) => puddleSet.has(cellKey(x, y));
  const isGap = (x: number, y: number) => gapSet.has(cellKey(x, y));
  const isGoal = (x: number, y: number) => lvl.goal.x === x && lvl.goal.y === y;

  const cells: { x: number; y: number }[] = [];
  for (let y = 0; y < lvl.rows; y++) for (let x = 0; x < lvl.cols; x++) cells.push({ x, y });

  return (
    <GameShell
      title="Monkey Coding Jr."
      icon="🐒"
      subtitle={`Level ${lvl.id} — ${lvl.name} • Block Sequencing & Loops`}
      color="from-lime-100 to-emerald-100 border-lime-300 dark:from-lime-950 dark:to-emerald-950 dark:border-lime-800"
      controls={
        <>
          <button onClick={toggleMute} aria-label={muted ? "Unmute sounds" : "Mute sounds"} className="px-3 py-1.5 rounded-full bg-white border text-sm font-bold dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
            {muted ? "🔇" : "🔊"}
          </button>
          <button onClick={reset} className="px-3 py-1.5 rounded-full bg-white border text-sm font-bold dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
            🔄 Restart
          </button>
          <button
            onClick={run}
            disabled={running || program.length === 0}
            className={`px-5 py-1.5 rounded-full font-black text-sm shadow ${running || program.length === 0 ? "bg-slate-200 text-slate-500" : "bg-emerald-500 text-white hover:bg-emerald-600"}`}
          >
            {running ? "Running… 🐒" : "▶ Run"}
          </button>
        </>
      }
      levelBar={
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-1 items-center">
          {LEVELS.map((l, i) => {
            const locked = i + 1 > progress.unlocked;
            const st = progress.stars[l.id] || 0;
            return (
              <button
                key={l.id}
                onClick={() => !running && !locked && setLevelIdx(i)}
                disabled={locked}
                aria-label={`Level ${l.id} ${l.name} ${locked ? "locked" : st ? `${st} stars` : "unlocked"}`}
                className={`shrink-0 h-9 min-w-9 px-2 rounded-xl border-2 font-black text-xs grid place-items-center ${
                  i === levelIdx
                    ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900"
                    : locked
                      ? "bg-slate-100 text-slate-400 border-slate-200 opacity-60 dark:bg-slate-800 dark:border-slate-700"
                      : "bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                }`}
              >
                {locked ? "🔒" : st ? `${l.id} ${"★".repeat(st)}` : l.id}
              </button>
            );
          })}
          <span className="ml-2 text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">💡 {lvl.tip}</span>
        </div>
      }
      canvas={
        <div className="p-3 sm:p-4">
          {msg && (
            <div className={`mb-3 px-3 py-2 rounded-xl text-sm font-bold border ${status === "win" ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-100" : status === "fail" ? "bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-950 dark:border-orange-800 dark:text-orange-100" : "bg-sky-50 border-sky-200 text-sky-900 dark:bg-sky-950 dark:border-sky-800 dark:text-sky-100"}`}>
              {msg}
            </div>
          )}

          {/* ===== STAGE ===== */}
          <div className="rounded-2xl overflow-hidden border-2 border-sky-200 dark:border-sky-900 relative" role="img" aria-label={`Level ${lvl.id} cartoon jungle stage. Monkey at tile ${monkey.x + 1}, goal bananas at tile ${lvl.goal.x + 1}.`}>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" aria-hidden="true">
              <defs>
                <linearGradient id="mk-sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#7dd3fc" />
                  <stop offset="0.7" stopColor="#bae6fd" />
                  <stop offset="1" stopColor="#e0f2fe" />
                </linearGradient>
                <linearGradient id="mk-hill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#86efac" />
                  <stop offset="1" stopColor="#4ade80" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width={W} height={H} fill="url(#mk-sky)" />
              <circle cx={W - 50} cy={48} r={26} fill="#fde047" />
              <circle cx={W - 50} cy={48} r={34} fill="#fde047" opacity="0.3" />
              <ellipse cx={90} cy={60} rx={42} ry={16} fill="#ffffff" opacity="0.95" />
              <ellipse cx={120} cy={52} rx={30} ry={13} fill="#ffffff" opacity="0.95" />
              <ellipse cx={W / 2} cy={88} rx={46} ry={15} fill="#ffffff" opacity="0.85" />
              <ellipse cx={W / 2} cy={H + 60} rx={W * 0.7} ry={150} fill="url(#mk-hill)" />
              <ellipse cx={70} cy={H - 10} rx={130} ry={70} fill="#4ade80" opacity="0.7" />
              <text x={W - 110} y={H - 96} fontSize={44}>🌳</text>
              <text x={W - 170} y={H - 130} fontSize={30}>🌳</text>
              <text x={W - 96} y={H - 150} fontSize={26}>🦜</text>
              {flowers.map((f, i) => (
                <text key={i} x={f.x} y={f.y} fontSize={20}>{f.e}</text>
              ))}
              <text x={14} y={H - 120} fontSize={34}>🌿</text>
              <text x={W - 60} y={H - 200} fontSize={30}>🦋</text>
            </svg>

            {/* stepping stones overlay */}
            <div className="absolute inset-0">
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block">
                {cells.map(({ x, y }) => {
                  if (isGap(x, y)) return null;
                  const tx = tileX(x);
                  const ty = tileY(y);
                  const puddle = isPuddle(x, y);
                  const goal = isGoal(x, y);
                  return (
                    <g key={`${x}-${y}`}>
                      <rect
                        x={tx} y={ty} width={56} height={56} rx={14}
                        fill={goal ? "#fef3c7" : puddle ? "#bae6fd" : "#e7e5e4"}
                        stroke={goal ? "#f59e0b" : puddle ? "#38bdf8" : "#a8a29e"}
                        strokeWidth={goal ? 3 : 2}
                        strokeDasharray={goal ? "0" : "0"}
                      />
                      <rect x={tx} y={ty + 44} width={56} height={8} rx={4} fill="#00000018" />
                      {puddle && <text x={tx + 28} y={ty + 34} fontSize={24} textAnchor="middle">💧</text>}
                      {isRock(x, y) && <text x={tx + 28} y={ty + 40} fontSize={34} textAnchor="middle">🪨</text>}
                      {goal && (
                        <>
                          <circle cx={tx + 28} cy={ty + 28} r={30} fill="#fbbf24" opacity="0.35">
                            <animate attributeName="r" values="26;32;26" dur="1.6s" repeatCount="indefinite" />
                          </circle>
                          <text x={tx + 28} y={ty + 40} fontSize={36} textAnchor="middle">🍌</text>
                        </>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* monkey hero */}
              <div
                className="absolute top-0 left-0 transition-all duration-500 ease-in-out"
                style={{ transform: `translate(${(mx / W) * 100}%, ${(my / H) * 100}%)`, width: `${(56 / W) * 100}%` }}
              >
                <div
                  className={`grid place-items-center text-3xl sm:text-4xl ${anim === "jump" ? "animate-bounce" : anim === "win" ? "animate-bounce" : anim === "sad" ? "animate-pulse" : "animate-pulse"}`}
                  style={{ animationDuration: anim === "idle" ? "2.4s" : undefined }}
                >
                  {anim === "sad" ? "🙈" : "🐒"}
                </div>
              </div>

              {/* win modal */}
              {showWin && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm grid place-items-center p-4" role="dialog" aria-modal="true" aria-label="Level complete">
                  <div className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-amber-700 p-6 text-center max-w-xs w-full shadow-2xl">
                    <div className="text-5xl" aria-hidden="true">🎉</div>
                    <div className="mt-1 text-3xl tracking-widest" aria-label={`${stars} stars`}>
                      {"★".repeat(stars)}
                      <span className="text-slate-300">{"★".repeat(3 - stars)}</span>
                    </div>
                    <h3 className="mt-2 font-black text-slate-900 dark:text-white">Level {lvl.id} complete!</h3>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Used {program.length} blocks (par {lvl.par}) • Saved! 💾</p>
                    <div className="mt-4 flex gap-2 justify-center">
                      <button onClick={() => { setShowWin(false); reset(); }} className="px-4 py-2 rounded-full bg-white border-2 border-slate-200 text-sm font-black dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
                        🔄 Replay
                      </button>
                      {levelIdx < LEVELS.length - 1 ? (
                        <button onClick={() => setLevelIdx((i) => i + 1)} className="px-5 py-2 rounded-full bg-emerald-500 text-white text-sm font-black shadow hover:bg-emerald-600">
                          Next → {LEVELS[levelIdx + 1].id}
                        </button>
                      ) : (
                        <span className="px-4 py-2 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-sm font-black">🏆 All done, champion!</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ===== COMMAND TRAY ===== */}
          <div className="mt-3 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-[#fbfcff] dark:bg-slate-900 p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-[11px] font-extrabold tracking-widest text-slate-500 dark:text-slate-400">
                MY CODE • {program.length}/{slots} ♾️
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => setSlots((s) => s + 4)} className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-500 text-white hover:bg-emerald-600" title="Add more slots — unlimited building!">
                  ＋ Slots
                </button>
                {program.length > 0 && !running && (
                  <button onClick={() => { setProgram([]); setFailBi(null); }} className="text-xs font-bold px-2.5 py-1 rounded-full bg-white border hover:bg-red-50 hover:text-red-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
                    Clear
                  </button>
                )}
              </div>
            </div>
            {program.length === 0 ? (
              <p className="mt-3 text-center text-sm font-semibold text-slate-400">👆 Tap blocks below to fill your code — top runs first!</p>
            ) : (
              <ol className="mt-2 flex flex-wrap gap-1.5" aria-label="Your command sequence">
                {program.map((b, i) => {
                  const def = PALETTE.find((p) => p.id === b.id)!;
                  const isActive = b.uid === activeBi;
                  const isFail = b.uid === failBi;
                  return (
                    <li key={b.uid}>
                      <button
                        onClick={() => !running && setProgram((p) => p.filter((x) => x.uid !== b.uid))}
                        disabled={running}
                        title={running ? def.label : `${def.label} — tap to remove`}
                        aria-label={`Step ${i + 1}: ${def.label}${isActive ? " (running now)" : ""}${isFail ? " (failed here)" : ""}`}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border-2 font-black text-xs shadow-sm transition ${def.color} ${
                          isActive ? "ring-4 ring-yellow-300 scale-110 -rotate-2" : ""
                        } ${isFail ? "ring-4 ring-red-400 border-red-500 animate-pulse" : ""}`}
                      >
                        <span className="text-[10px] opacity-70">{i + 1}</span>
                        <span>{def.icon}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            )}
            <button
              onClick={run}
              disabled={running || program.length === 0}
              className={`mt-3 w-full py-3 rounded-2xl font-black text-base shadow transition active:scale-[0.99] ${running || program.length === 0 ? "bg-slate-200 text-slate-400" : "bg-emerald-500 text-white hover:bg-emerald-600"}`}
            >
              {running ? "🐒 Running…" : pyTab ? "🐍 ▶ Run Code" : "▶ RUN MY CODE"}
            </button>
          </div>

          {/* ===== BLOCK PALETTE ===== */}
          <div className="mt-3 rounded-2xl bg-white border p-3 dark:bg-slate-900 dark:border-slate-700">
            <div className="text-[11px] font-extrabold tracking-widest text-slate-500 dark:text-slate-400">🧱 BLOCKS — TAP TO ADD</div>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-5 gap-2">
              {PALETTE.map((b) => (
                <button
                  key={b.id}
                  onClick={() => addBlock(b)}
                  disabled={running}
                  className={`px-2.5 py-2.5 rounded-xl border-2 font-bold text-xs flex flex-col items-center gap-1 active:scale-95 transition disabled:opacity-50 ${b.color}`}
                >
                  <span className="text-xl" aria-hidden="true">{b.icon}</span>
                  <span className="leading-tight">{b.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ===== PYTHON VIEW ===== */}
          <div className="mt-3 rounded-2xl overflow-hidden border-2 border-slate-800 dark:border-slate-600">
            <div className="flex" role="tablist" aria-label="Code view">
              <button role="tab" aria-selected={!pyTab} onClick={() => setPyTab(false)} className={`flex-1 py-2 text-xs font-black ${!pyTab ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
                🧱 Blocks
              </button>
              <button role="tab" aria-selected={pyTab} onClick={() => setPyTab(true)} className={`flex-1 py-2 text-xs font-black ${pyTab ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
                🐍 Python Code
              </button>
            </div>
            <div className="bg-[#f8fafc] dark:bg-[#0B0E14] py-2 min-h-[140px]" role="tabpanel" aria-label="Generated Python code">
              {compiled.lines.map((line, i) => (
                <PyLine key={i} code={line} active={i === activeLine} />
              ))}
            </div>
            <p className="px-3 py-2 text-[11px] font-semibold bg-white border-t text-slate-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400">
              💡 Each block becomes a Python line! <code className="px-1 rounded bg-slate-100 dark:bg-slate-800 font-mono">repeat</code> becomes <code className="px-1 rounded bg-slate-100 dark:bg-slate-800 font-mono">for _ in range(n):</code> — same code real programmers write! 🐍
            </p>
          </div>
        </div>
      }
      workspace={
        <div className="space-y-3">
          <div className="rounded-2xl bg-white border p-4 dark:bg-slate-900 dark:border-slate-700">
            <div className="text-xs font-black tracking-widest text-slate-500 dark:text-slate-400">🏆 MY MONKEY PROGRESS</div>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {LEVELS.map((l, i) => {
                const locked = i + 1 > progress.unlocked;
                const st = progress.stars[l.id] || 0;
                return (
                  <button
                    key={l.id}
                    onClick={() => !running && !locked && setLevelIdx(i)}
                    disabled={locked || running}
                    className={`rounded-xl border-2 p-2 text-center transition active:scale-95 disabled:cursor-not-allowed ${i === levelIdx ? "border-amber-400 bg-amber-50 dark:bg-amber-950" : "border-slate-200 dark:border-slate-700"}`}
                    aria-label={`Level ${l.id} ${locked ? "locked" : `${st} stars`}`}
                  >
                    <div className="text-lg" aria-hidden="true">{locked ? "🔒" : "🐒"}</div>
                    <div className="text-[11px] font-black text-slate-700 dark:text-slate-200">{l.id}</div>
                    <div className="text-[10px] text-amber-500" aria-hidden="true">{st > 0 ? "★".repeat(st) : "·"}</div>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">Saved in this browser 💾 • {Object.keys(progress.stars).length}/{LEVELS.length} levels starred ⭐</p>
          </div>
          <div className="rounded-2xl bg-white border p-3 dark:bg-slate-900 dark:border-slate-700">
            <div className="text-xs font-black tracking-widest text-slate-500 dark:text-slate-400">📖 MONKEY MANUAL</div>
            <ul className="mt-1 text-[13px] text-slate-600 dark:text-slate-300 space-y-1 font-medium list-disc pl-4">
              <li>➡️⬅️⬆️⬇️ walk 1 stone (not into 🪨 or holes!)</li>
              <li>↗️↖️ leap OVER a rock, puddle or hole, landing 2 ahead</li>
              <li>⏫ hop ON a 💧 puddle before leaving it!</li>
              <li>🔁 Repeat copies the move just before it</li>
              <li>♾️ Tray full? Tap ＋ Slots — keep building!</li>
            </ul>
          </div>
        </div>
      }
    />
  );
}
