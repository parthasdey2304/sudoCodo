"use client";
import { useState } from "react";

export type BlockDef = {
  id: string;
  label: string;
  color: string;
  icon?: string;
  desc?: string;
};

export type DroppedBlock = BlockDef & { uid: string };

// Scratch-style interlocking block: top notch groove (before) + bottom nub tab (after, opt-in).
// Nub uses bg-inherit so it always matches its own block color, like real Scratch blocks.
const SCRATCH_BASE =
  "relative rounded-lg border-2 border-black/20 shadow-[0_3px_0_rgba(0,0,0,0.25)] " +
  "before:content-[''] before:absolute before:top-[6px] before:left-7 before:w-12 before:h-[10px] before:rounded-b-lg before:bg-black/25 before:pointer-events-none";
const SCRATCH_NUB =
  "after:content-[''] after:absolute after:-bottom-[11px] after:left-7 after:w-12 after:h-[11px] after:rounded-b-lg after:bg-inherit after:pointer-events-none";

export default function BlockWorkspace({
  palette,
  program,
  setProgram,
  maxBlocks,
}: {
  palette: BlockDef[];
  program: DroppedBlock[];
  setProgram: (p: DroppedBlock[]) => void;
  maxBlocks?: number;
}) {
  const [drag, setDrag] = useState<BlockDef | null>(null);
  // Kids-first: unlimited workspace is ON by default — no block limits unless parent turns it off
  const [unlimited, setUnlimited] = useState(true);

  const addBlock = (b: BlockDef) => {
    if (!unlimited && maxBlocks && program.length >= maxBlocks) return;
    setProgram([...program, { ...b, uid: Math.random().toString(36).slice(2, 9) }]);
  };

  const removeAt = (uid: string) => setProgram(program.filter((p) => p.uid !== uid));

  const move = (from: number, to: number) => {
    const arr = [...program];
    const [m] = arr.splice(from, 1);
    arr.splice(to, 0, m);
    setProgram(arr);
  };

  return (
    <div className="grid gap-3">
      {/* PALETTE */}
      <div className="rounded-2xl bg-white border p-3 dark:bg-slate-900 dark:border-slate-700">
        <div className="text-[11px] font-extrabold tracking-widest text-slate-500 dark:text-slate-400">TOOLBOX</div>
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {palette.map((b) => (
            <button
              key={b.id}
              draggable
              onDragStart={() => setDrag(b)}
              onDragEnd={() => setDrag(null)}
              onClick={() => addBlock(b)}
              className={`text-left pl-3 pr-2 pt-4 pb-2.5 font-bold text-sm flex items-center gap-2 active:scale-[0.98] transition ${SCRATCH_BASE} ${b.color}`}
            >
              <span className="text-base" aria-hidden="true">{b.icon || "◆"}</span>
              <span className="leading-tight">{b.label}</span>
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">👆 Tap to add • nub fits into the notch, just like Scratch! 🧩</p>
      </div>

      {/* PROGRAM */}
      <div
        className={`rounded-2xl border-2 border-dashed bg-[#fbfcff] dark:bg-slate-900 p-3 min-h-[110px] ${drag ? "border-indigo-300 bg-indigo-50/50" : "border-slate-200 dark:border-slate-700"}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (drag) addBlock(drag);
          setDrag(null);
        }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="text-[11px] font-extrabold tracking-widest text-slate-500 dark:text-slate-400">
            WORKSPACE • {program.length}{unlimited ? " • ♾️ UNLIMITED" : maxBlocks ? ` / ${maxBlocks}` : ""}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setUnlimited((v) => !v)}
              aria-pressed={unlimited}
              title={unlimited ? "Unlimited ON — use as many blocks as you want!" : "Challenge mode — limited blocks"}
              className={`text-xs font-black px-2.5 py-1 rounded-full border-2 transition active:scale-95 ${unlimited ? "bg-emerald-500 text-white border-emerald-600" : "bg-white border-slate-200 text-slate-600"}`}
            >
              {unlimited ? "♾️ Unlimited ON" : "🎯 Challenge"}
            </button>
            {program.length > 0 && (
              <button onClick={() => setProgram([])} className="text-xs font-bold px-2 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100">
                Clear
              </button>
            )}
          </div>
        </div>
        {!unlimited && maxBlocks && program.length >= maxBlocks && (
          <p className="mt-2 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
            You reached {maxBlocks} blocks! Turn on ♾️ Unlimited to keep building — no limits for kids! 💪
          </p>
        )}
        {unlimited && (
          <p className="mt-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-200">
            ✨ Unlimited workspace — add as many blocks as you want! Perfect for experimenting. 🧒
          </p>
        )}

        {program.length === 0 ? (
          <div className="mt-6 text-center">
            <div className="mx-auto w-10 h-10 rounded-xl bg-white border grid place-items-center text-slate-400 dark:bg-slate-800 dark:border-slate-700">＋</div>
            <p className="mt-2 text-sm font-semibold text-slate-400">Drag blocks here</p>
            <p className="text-xs text-slate-400">Build your program in order — top to bottom runs first</p>
          </div>
        ) : (
          <div className="mt-3 flex flex-col">
            {program.map((b, i) => (
              <div
                key={b.uid}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", String(i));
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const from = Number(e.dataTransfer.getData("text/plain"));
                  if (!isNaN(from)) move(from, i);
                }}
                style={{ zIndex: program.length - i }}
                className={`group flex items-center gap-2 pl-3 pr-2 pt-4 pb-3 mb-[-3px] last:mb-0 font-bold text-sm ${SCRATCH_BASE} ${SCRATCH_NUB} ${b.color}`}
              >
                <span className="w-6 h-6 rounded-md bg-black/25 text-white grid place-items-center text-xs font-black border border-white/30">{i + 1}</span>
                <span className="flex-1">{b.icon} {b.label}</span>
                <button onClick={() => removeAt(b.uid)} aria-label="Remove block" className="w-7 h-7 rounded-full bg-white/90 border border-black/10 grid place-items-center text-slate-600 font-black hover:text-red-600">×</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
