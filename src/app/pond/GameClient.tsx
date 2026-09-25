"use client";
import { useEffect, useRef, useState } from "react";
import GameShell from "@/components/GameShell";
import BlockWorkspace, { BlockDef, DroppedBlock } from "@/components/BlockWorkspace";
import { setGameProgress } from "@/lib/storage";

type Pos = { x: number; y: number };

const PALETTE: BlockDef[] = [
  { id: "scan", label: "Scan Enemy", icon: "👁️", color: "bg-sky-50 border-sky-300" },
  { id: "fire", label: "Fire Cannon", icon: "💥", color: "bg-red-50 border-red-300" },
  { id: "swim", label: "Swim Forward", icon: "🦆", color: "bg-amber-50 border-amber-300" },
  { id: "left", label: "Turn Left", icon: "↩️", color: "bg-violet-50 border-violet-300" },
  { id: "right", label: "Turn Right", icon: "↪️", color: "bg-violet-50 border-violet-300" },
  { id: "ifEnemy", label: "If Enemy → Fire", icon: "🎯", color: "bg-emerald-50 border-emerald-300" },
  { id: "repeat", label: "Repeat 3×", icon: "🔁", color: "bg-slate-50 border-slate-300" },
];

export default function PondPage() {
  const [program, setProgram] = useState<DroppedBlock[]>([
    { id: "scan", label: "Scan Enemy", icon: "👁️", color: "bg-sky-50 border-sky-300", uid: "1" } as any,
    { id: "ifEnemy", label: "If Enemy → Fire", icon: "🎯", color: "bg-emerald-50 border-emerald-300", uid: "2" } as any,
    { id: "swim", label: "Swim Forward", icon: "🦆", color: "bg-amber-50 border-amber-300", uid: "3" } as any,
  ]);
  const [log, setLog] = useState<string[]>(["Ready — press Battle!"]);
  const [score, setScore] = useState({ you: 0, enemy: 0 });
  const [pos, setPos] = useState<Pos>({ x: 50, y: 80 });
  const [enemy, setEnemy] = useState<Pos>({ x: 50, y: 20 });
  const [dir, setDir] = useState(0);
  const [canon, setCanon] = useState<Pos | null>(null);
  const raf = useRef<number>(0);
  const tRef = useRef(0);

  const battle = () => {
    setLog([]);
    setScore({ you: 0, enemy: 0 });
    let youScore = 0, enemyScore = 0;
    let p = { ...pos }, e = { ...enemy }, d = dir;
    let logs: string[] = [];

    const expanded: string[] = [];
    for (const b of program) {
      if (b.id === "repeat") {
        const last = expanded[expanded.length - 1];
        if (last) for (let k = 0; k < 2; k++) expanded.push(last);
      } else expanded.push(b.id);
    }

    let step = 0;
    const tick = () => {
      if (step >= expanded.length * 3) {
        const win = youScore > enemyScore;
        logs.push(win ? "🏆 You win the duel!" : youScore === enemyScore ? "🤝 Draw!" : "💥 Enemy wins — tweak your logic!");
        setLog([...logs]);
        setScore({ you: youScore, enemy: enemyScore });
        if (win) setGameProgress("pond", { completed: true, stars: 3 });
        cancelAnimationFrame(raf.current);
        return;
      }
      const act = expanded[step % expanded.length];
      if (act === "scan") logs.push(`[${step + 1}] Scanning… enemy at (${e.x.toFixed(0)},${e.y.toFixed(0)})`);
      else if (act === "fire") {
        // check hit: if facing enemy
        const dist = Math.hypot(e.x - p.x, e.y - p.y);
        if (dist < 30) {
          youScore++; logs.push(`💥 Hit! Distance ${dist.toFixed(0)}`);
          setCanon({ x: (p.x + e.x) / 2, y: (p.y + e.y) / 2 });
          setTimeout(() => setCanon(null), 300);
        } else logs.push(`💨 Miss — too far (${dist.toFixed(0)})`);
      } else if (act === "ifEnemy") {
        const dist = Math.hypot(e.x - p.x, e.y - p.y);
        if (dist < 40) { youScore++; logs.push(`🎯 If → Fire HIT!`); setCanon({ x: (p.x + e.x) / 2, y: (p.y + e.y) / 2 }); setTimeout(() => setCanon(null), 200); }
        else logs.push(`👁️ No enemy in range`);
      } else if (act === "swim") {
        p = { x: Math.max(10, Math.min(90, p.x + Math.cos((d * Math.PI) / 180) * 8)), y: Math.max(10, Math.min(90, p.y + Math.sin((d * Math.PI) / 180) * 8)) };
      } else if (act === "left") d -= 30;
      else if (act === "right") d += 30;

      // enemy AI moves randomly
      e = { x: Math.max(10, Math.min(90, e.x + (Math.random() - 0.5) * 6)), y: Math.max(10, Math.min(90, e.y + (Math.random() - 0.5) * 6)) };
      if (Math.random() < 0.15) {
        const dist = Math.hypot(p.x - e.x, p.y - e.y);
        if (dist < 35) { enemyScore++; logs.push(`🔴 Enemy hit you!`); }
      }

      setPos({ ...p }); setEnemy({ ...e }); setDir(d);
      if (logs.length > 6) logs = logs.slice(-6);
      setLog([...logs]);
      setScore({ you: youScore, enemy: enemyScore });
      step++;
      tRef.current = window.setTimeout(tick, 450) as any;
    };
    tick();
  };

  useEffect(() => () => window.clearTimeout(tRef.current), []);

  return (
    <GameShell
      title="Pond"
      icon="🦆"
      subtitle="Code your duck • Battle the AI"
      color="from-cyan-100 to-sky-100 border-cyan-200"
      controls={<button onClick={battle} className="px-5 py-1.5 rounded-full bg-cyan-600 text-white font-black text-sm shadow">⚔️ Battle</button>}
      canvas={
        <div className="p-3">
          <div className="relative w-full h-[300px] sm:h-[360px] rounded-2xl border-2 overflow-hidden bg-gradient-to-br from-cyan-200 via-sky-200 to-blue-300">
            {/* water ripples */}
            <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 30% 30%, white, transparent 50%)" }} />
            <div className="absolute left-2 top-2 px-2 py-1 rounded-full bg-white/90 border text-xs font-black">YOU {score.you} — ENEMY {score.enemy}</div>
            {/* enemy */}
            <div className="absolute w-8 h-8 rounded-full bg-red-500 border-2 border-white grid place-items-center shadow -translate-x-1/2 -translate-y-1/2" style={{ left: `${enemy.x}%`, top: `${enemy.y}%` }}>🦢</div>
            {/* you */}
            <div className="absolute w-10 h-10 rounded-full bg-amber-400 border-2 border-white grid place-items-center shadow -translate-x-1/2 -translate-y-1/2 transition-all duration-400" style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: `translate(-50%,-50%) rotate(${dir}deg)` }}>🦆</div>
            {canon && <div className="absolute w-3 h-3 rounded-full bg-yellow-400 border border-white shadow animate-ping -translate-x-1/2 -translate-y-1/2" style={{ left: `${canon.x}%`, top: `${canon.y}%` }} />}
            <div className="absolute bottom-2 inset-x-2 rounded-xl bg-white/90 border p-2">
              <div className="text-[11px] font-black tracking-widest text-slate-500">BATTLE LOG</div>
              <div className="mt-1 space-y-0.5">
                {log.map((l, i) => (
                  <div key={i} className="text-xs font-mono leading-tight">{l}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-2 text-center text-xs font-bold text-slate-500">Program runs in loop 3× — first to hit wins. Saved locally.</div>
        </div>
      }
      workspace={
        <div className="space-y-3">
          <BlockWorkspace palette={PALETTE} program={program} setProgram={setProgram} />
          <div className="rounded-2xl bg-white border p-3">
            <div className="text-xs font-black tracking-widest text-slate-500">STRATEGY</div>
            <p className="text-sm font-medium text-slate-600 mt-1">Combine <b>Scan</b> + <b>If Enemy → Fire</b> for smart firing. Use <b>Swim</b> & turns to chase. This is how the real Blockly Pond works — your code vs AI code.</p>
          </div>
        </div>
      }
    />
  );
}
