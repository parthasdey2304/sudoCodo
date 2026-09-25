"use client";
import { useEffect, useRef, useState } from "react";
import GameShell from "@/components/GameShell";
import BlockWorkspace, { BlockDef, DroppedBlock } from "@/components/BlockWorkspace";
import { getLevel, setLevel, setGameProgress } from "@/lib/storage";

type Cmd = { type: "fwd" | "left" | "right" | "pen" | "color"; v?: number | string };

const PALETTE: BlockDef[] = [
  { id: "fwd50", label: "Move 50", icon: "➡️", color: "bg-sky-50 border-sky-300" },
  { id: "fwd100", label: "Move 100", icon: "⬆️", color: "bg-sky-50 border-sky-300" },
  { id: "left90", label: "Turn Left 90°", icon: "↩️", color: "bg-amber-50 border-amber-300" },
  { id: "right90", label: "Turn Right 90°", icon: "↪️", color: "bg-amber-50 border-amber-300" },
  { id: "left45", label: "Turn 45°", icon: "↪️", color: "bg-amber-50 border-amber-300" },
  { id: "repeat4", label: "Repeat 4×", icon: "🔁", color: "bg-violet-50 border-violet-300" },
  { id: "repeat36", label: "Repeat 36×", icon: "🔂", color: "bg-violet-50 border-violet-300" },
  { id: "color", label: "Random Color", icon: "🎨", color: "bg-pink-50 border-pink-300" },
  { id: "penup", label: "Pen Up", icon: "✏️", color: "bg-slate-50 border-slate-300" },
  { id: "pendown", label: "Pen Down", icon: "🖊️", color: "bg-slate-50 border-slate-300" },
];

const PRESETS = [
  { name: "Square", hint: "Move 100, turn 90° ×4", icon: "⬜" },
  { name: "Star", hint: "Use 36 repeats + turn 10°", icon: "⭐" },
  { name: "Spiral", hint: "Repeat 20× with increasing moves", icon: "🌀" },
  { name: "Flower", hint: "Make 36 circles", icon: "🌸" },
];

export default function TurtlePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [program, setProgram] = useState<DroppedBlock[]>([]);
  const [penDown, setPenDown] = useState(true);
  const [color, setColor] = useState("#0ea5e9");
  const [info, setInfo] = useState("Draw anything — your art is saved locally!");

  const draw = (cmds: Cmd[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);
    // paper
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.strokeStyle = "#e2e8f0";
    ctx.strokeRect(0, 0, rect.width, rect.height);

    let x = rect.width / 2;
    let y = rect.height / 2;
    let ang = -90;
    let down = true;
    let col = "#0ea5e9";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    for (const c of cmds) {
      if (c.type === "pen") down = c.v === "down";
      else if (c.type === "color") col = `hsl(${Math.random() * 360}, 90%, 55%)`;
      else if (c.type === "left") ang -= Number(c.v);
      else if (c.type === "right") ang += Number(c.v);
      else if (c.type === "fwd") {
        const dist = Number(c.v);
        const nx = x + Math.cos((ang * Math.PI) / 180) * dist * 0.6;
        const ny = y + Math.sin((ang * Math.PI) / 180) * dist * 0.6;
        if (down) {
          ctx.strokeStyle = col;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(nx, ny);
          ctx.stroke();
        }
        x = nx; y = ny;
      }
    }
    // turtle
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((ang * Math.PI) / 180);
    ctx.font = "18px serif";
    ctx.fillText("🐢", -9, 6);
    ctx.restore();

    // save thumbnail to localStorage
    try {
      const data = canvas.toDataURL("image/png");
      localStorage.setItem("sudocodo_turtle_last", data);
      localStorage.setItem("sudocodo_turtle_program", JSON.stringify(program));
    } catch {}
  };

  useEffect(() => {
    // restore last drawing
    try {
      const saved = localStorage.getItem("sudocodo_turtle_program");
      if (saved) setProgram(JSON.parse(saved));
    } catch {}
  }, []);

  const expanded = (): Cmd[] => {
    const m: Record<string, Cmd> = {
      fwd50: { type: "fwd", v: 50 },
      fwd100: { type: "fwd", v: 100 },
      left90: { type: "left", v: 90 },
      right90: { type: "right", v: 90 },
      left45: { type: "left", v: 45 },
      color: { type: "color" },
      penup: { type: "pen", v: "up" },
      pendown: { type: "pen", v: "down" },
    };
    const out: Cmd[] = [];
    for (const b of program) {
      if (b.id === "repeat4" || b.id === "repeat36") {
        const times = b.id === "repeat4" ? 4 : 36;
        const last = out[out.length - 1];
        if (last) for (let k = 1; k < times; k++) out.push({ ...last });
      } else if (m[b.id]) out.push(m[b.id]);
    }
    // if star-like auto tweak: if repeat36 with turn 45, we want slight angle
    return out;
  };

  const run = () => {
    draw(expanded());
    setInfo(`Ran ${program.length} blocks → ${expanded().length} steps. Saved to cache!`);
    setGameProgress("turtle", { stars: 3, completed: true });
    setLevel("turtle", 2);
  };
  const clear = () => {
    draw([]);
    setInfo("Cleared!");
  };

  useEffect(() => {
    draw(expanded());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GameShell
      title="Turtle"
      icon="🐢"
      subtitle="Draw with code • Loops & geometry"
      color="from-teal-100 to-emerald-100 border-teal-200"
      controls={
        <>
          <button onClick={clear} className="px-3 py-1.5 rounded-full bg-white border text-sm font-bold">Clear</button>
          <button onClick={run} className="px-5 py-1.5 rounded-full bg-teal-600 text-white font-black text-sm shadow">▶ Draw</button>
        </>
      }
      canvas={
        <div className="p-3">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => {
                  if (p.name === "Square") setProgram([{ id: "fwd100", label: "Move 100", icon: "⬆️", color: "bg-sky-50 border-sky-300", uid: "a" } as any, { id: "right90", label: "Turn Right 90°", icon: "↪️", color: "bg-amber-50 border-amber-300", uid: "b" } as any, { id: "repeat4", label: "Repeat 4×", icon: "🔁", color: "bg-violet-50 border-violet-300", uid: "c" } as any]);
                  if (p.name === "Star") setProgram([{ id: "fwd100", label: "Move 100", icon: "⬆️", color: "", uid: "a" } as any, { id: "left45", label: "Turn 45°", icon: "", color: "", uid: "b" } as any, { id: "repeat36", label: "Repeat 36×", icon: "", color: "", uid: "c" } as any]);
                  if (p.name === "Spiral") setProgram([{ id: "fwd50", label: "Move 50", icon: "", color: "", uid: "a" } as any, { id: "right90", label: "Turn Right 90°", icon: "", color: "", uid: "b" } as any, { id: "color", label: "Random Color", icon: "", color: "", uid: "c" } as any, { id: "repeat36", label: "Repeat 36×", icon: "", color: "", uid: "d" } as any]);
                }}
                className="px-2.5 py-1 rounded-full bg-white border text-xs font-bold hover:bg-slate-50"
              >
                {p.icon} {p.name}
              </button>
            ))}
          </div>
          <canvas ref={canvasRef} className="w-full h-[280px] sm:h-[360px] rounded-2xl border bg-white" style={{ width: "100%" }} />
          <div className="mt-2 text-xs font-semibold text-slate-500 text-center">{info}</div>
        </div>
      }
      workspace={
        <div className="space-y-3">
          <BlockWorkspace palette={PALETTE} program={program} setProgram={setProgram} />
          <div className="rounded-2xl bg-white border p-3">
            <div className="text-xs font-black tracking-widest text-slate-500">CHALLENGES</div>
            <ul className="mt-2 space-y-1.5 text-sm font-medium">
              <li>⬜ Try to draw a perfect square (Revisit Puzzle!)</li>
              <li>⭐ Star: Move + Turn 144° ×5</li>
              <li>🌀 Spiral: keep increasing distance</li>
            </ul>
          </div>
        </div>
      }
    />
  );
}
