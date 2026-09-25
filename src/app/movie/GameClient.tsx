"use client";
import { useEffect, useRef, useState } from "react";
import GameShell from "@/components/GameShell";

const SCENES = [
  { id: 1, name: "Bounce", formula: "y = 50 + sin(t*0.08)*40", color: "#0ea5e9" },
  { id: 2, name: "Orbit", formula: "x = 50 + cos(t*0.05)*30, y = 50 + sin(t*0.05)*30", color: "#8b5cf6" },
  { id: 3, name: "Wave", formula: "y = 30 + t*0.2 % 100, x = 50 + sin(t*0.1)*40", color: "#ec4899" },
  { id: 4, name: "Spiral In", formula: "Scale = 1 + sin(t*0.05)", color: "#10b981" },
];

export default function MoviePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scene, setScene] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [scale, setScale] = useState(1);
  const [playing, setPlaying] = useState(true);
  const tRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      const w = rect.width, h = rect.height;
      ctx.clearRect(0, 0, w, h);
      // bg
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, w, h);
      // grid
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

      const t = tRef.current;
      let x = w / 2, y = h / 2;
      const s = SCENES[scene];
      if (scene === 0) {
        y = h / 2 + Math.sin(t * 0.08 * speed) * 70;
        x = w / 2 + Math.cos(t * 0.02) * 10;
      } else if (scene === 1) {
        x = w / 2 + Math.cos(t * 0.05 * speed) * 90;
        y = h / 2 + Math.sin(t * 0.05 * speed) * 90;
      } else if (scene === 2) {
        x = w / 2 + Math.sin(t * 0.1 * speed) * 110;
        y = (t * 0.6 * speed) % (h + 40) - 20;
        if (y < 0) y += h + 40;
      } else if (scene === 3) {
        const sc = 1 + Math.sin(t * 0.05 * speed) * 0.6 * scale;
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.scale(sc, sc);
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(0, 0, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "24px serif";
        ctx.textAlign = "center";
        ctx.fillText("🎬", 0, 8);
        ctx.restore();
        tRef.current += playing ? 1 : 0;
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      // actor
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(x, y, 26 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.font = "20px serif";
      ctx.textAlign = "center";
      ctx.fillText(scene === 0 ? "⚽" : scene === 1 ? "🛰️" : "🌊", x, y + 7);
      // trail
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = "11px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`t=${Math.floor(t)}  ${s.formula}`, 10, 18);
      ctx.fillText(`speed×${speed.toFixed(1)}  scale×${scale.toFixed(1)}`, 10, h - 10);

      tRef.current += playing ? 1 : 0;
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [scene, speed, scale, playing]);

  return (
    <GameShell
      title="Movie"
      icon="🎬"
      subtitle="Animate with math • Easy & fun"
      color="from-slate-900 to-slate-800 border-slate-700 dark:from-black dark:to-slate-900"
      controls={
        <>
          <button onClick={() => setPlaying((v) => !v)} className={`px-4 py-1.5 rounded-full font-black text-sm ${playing ? "bg-amber-400 text-slate-900" : "bg-white text-slate-900 border"}`}>{playing ? "⏸ Pause" : "▶ Play"}</button>
        </>
      }
      canvas={
        <div className="p-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {SCENES.map((s, i) => (
              <button key={s.id} onClick={() => setScene(i)} className={`shrink-0 px-3 py-1.5 rounded-full border text-xs font-black ${i === scene ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-white text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600"}`}>{s.name}</button>
            ))}
          </div>
          <canvas ref={canvasRef} className="w-full h-[300px] sm:h-[380px] rounded-2xl border bg-slate-900" style={{ width: "100%" }} />
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="bg-white border border-slate-200 text-slate-700 rounded-xl p-3 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
              <div className="text-xs font-black tracking-widest text-slate-500">SPEED</div>
              <input type="range" min={0.2} max={3} step={0.1} value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} className="w-full mt-1" />
              <div className="text-xs font-bold text-center">{speed.toFixed(1)}×</div>
            </label>
            <label className="bg-white border border-slate-200 text-slate-700 rounded-xl p-3 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
              <div className="text-xs font-black tracking-widest text-slate-500">SCALE</div>
              <input type="range" min={0.5} max={2} step={0.1} value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} className="w-full mt-1" />
              <div className="text-xs font-bold text-center">{scale.toFixed(1)}×</div>
            </label>
          </div>
        </div>
      }
      workspace={
        <div className="space-y-3">
          <div className="rounded-2xl bg-white border border-slate-200 p-4 dark:bg-slate-900 dark:border-slate-700">
            <div className="text-xs font-black tracking-widest text-slate-500 dark:text-slate-400">FORMULA</div>
            <code className="mt-2 block bg-slate-900 text-emerald-300 rounded-xl p-3 text-xs font-mono">{SCENES[scene].formula}</code>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 font-medium">In the original Blockly Movie, you type equations for <b>x, y</b> each frame. Here you tweak speed & scale — portrait sliders, instant feedback, saved to cache.</p>
          </div>
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-100">
            <div className="font-bold text-sm">🎯 Try</div>
            <ul className="text-sm list-disc pl-4 mt-1 space-y-1">
              <li>Make the ball bounce faster</li>
              <li>Orbit at 0.5× speed</li>
              <li>Wave + scale 2×</li>
            </ul>
          </div>
        </div>
      }
    />
  );
}
