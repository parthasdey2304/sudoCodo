"use client";
import { useEffect, useRef, useState } from "react";
import GameShell from "@/components/GameShell";
import BlockWorkspace, { BlockDef, DroppedBlock } from "@/components/BlockWorkspace";

const NOTES = ["C", "D", "E", "F", "G", "A", "B", "C2"];
const NOTE_FREQ: Record<string, number> = { C: 261.63, D: 293.66, E: 329.63, F: 349.23, G: 392, A: 440, B: 493.88, C2: 523.25 };

const PALETTE: BlockDef[] = NOTES.map((n) => ({
  id: n,
  label: n === "C2" ? "High C" : `Note ${n}`,
  icon: "🎵",
  color: "bg-[#CF63CF] border-black/20 text-white",
})) as BlockDef[];

export default function MusicPage() {
  const [program, setProgram] = useState<DroppedBlock[]>([
    { id: "C", label: "Note C", icon: "🎵", color: "bg-[#CF63CF] border-black/20 text-white", uid: "1" } as any,
    { id: "E", label: "Note E", icon: "🎵", color: "bg-[#CF63CF] border-black/20 text-white", uid: "2" } as any,
    { id: "G", label: "Note G", icon: "🎵", color: "bg-[#CF63CF] border-black/20 text-white", uid: "3" } as any,
  ]);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [tempo, setTempo] = useState(120);
  const [volume, setVolume] = useState(0.5);
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sudocodo_music");
      if (saved) setProgram(JSON.parse(saved));
      const savedT = localStorage.getItem("sudocodo_music_tempo");
      if (savedT) setTempo(Number(savedT));
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem("sudocodo_music", JSON.stringify(program));
  }, [program]);
  useEffect(() => {
    localStorage.setItem("sudocodo_music_tempo", String(tempo));
  }, [tempo]);

  const playTone = (freq: number, dur: number) => {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const ctx = ctxRef.current!;
    if (ctx.state === "suspended") ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.value = volume;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.stop(ctx.currentTime + dur);
  };

  const play = async () => {
    for (let i = 0; i < program.length; i++) {
      setPlayingIdx(i);
      const n = program[i].id;
      playTone(NOTE_FREQ[n] || 440, (60 / tempo) * 0.9);
      await new Promise((r) => setTimeout(r, (60 / tempo) * 1000));
    }
    setPlayingIdx(null);
  };

  return (
    <GameShell
      title="Music"
      icon="🎵"
      subtitle="Compose with blocks • Easy & unlimited"
      color="from-indigo-100 to-violet-100 border-indigo-200 dark:from-indigo-950 dark:to-violet-950 dark:border-indigo-800"
      controls={<button onClick={play} disabled={program.length === 0} className={`px-5 py-1.5 rounded-full font-black text-sm shadow ${program.length ? "bg-indigo-600 text-white" : "bg-slate-200"}`}>▶ Play Song</button>}
      canvas={
        <div className="p-3 sm:p-4">
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-900 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="text-xs font-black tracking-[0.2em] opacity-70">STUDIO</div>
              <div className="text-xs px-2 py-1 rounded-full bg-white/15 border border-white/20 font-bold">{program.length} notes • {tempo} BPM</div>
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {program.length === 0 ? (
                <div className="w-full py-8 text-center rounded-xl bg-white/10 border border-white/15 text-white/70 font-semibold">Add notes below — hear them in order</div>
              ) : (
                program.map((b, i) => (
                  <div key={b.uid} className={`shrink-0 w-14 h-20 rounded-xl border-2 grid place-items-center font-black text-sm transition ${i === playingIdx ? "bg-yellow-300 text-slate-900 border-yellow-400 scale-105" : "bg-white text-slate-900 border-white/20"}`}>
                    <div className="text-center">
                      <div className="text-lg">♪</div>
                      <div>{b.id}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="bg-white/10 border border-white/15 rounded-xl p-3 backdrop-blur">
                <div className="text-[11px] font-black tracking-widest opacity-70">TEMPO</div>
                <input type="range" min={60} max={200} value={tempo} onChange={(e) => setTempo(parseInt(e.target.value))} className="w-full" />
                <div className="text-xs font-bold text-center">{tempo} BPM</div>
              </label>
              <label className="bg-white/10 border border-white/15 rounded-xl p-3 backdrop-blur">
                <div className="text-[11px] font-black tracking-widest opacity-70">VOLUME</div>
                <input type="range" min={0} max={1} step={0.05} value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-full" />
                <div className="text-xs font-bold text-center">{Math.round(volume * 100)}%</div>
              </label>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={() => setProgram([])} className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold">Clear</button>
              <button onClick={() => { const N = (id: string, uid: string) => ({ id, label: id === "C2" ? "High C" : `Note ${id}`, icon: "🎵", color: "bg-[#CF63CF] border-black/20 text-white", uid }) as any; setProgram([N("C", "a"), N("C", "b"), N("G", "c"), N("G", "d"), N("A", "e"), N("A", "f"), N("G", "g")]); }} className="px-3 py-1.5 rounded-full bg-white text-slate-900 text-xs font-black">Twinkle Demo</button>
            </div>
          </div>
        </div>
      }
      workspace={
        <div className="space-y-3">
          <BlockWorkspace palette={PALETTE} program={program} setProgram={setProgram} />
          <div className="rounded-2xl bg-white border border-slate-200 p-3 dark:bg-slate-900 dark:border-slate-700">
            <div className="text-xs font-black tracking-widest text-slate-500 dark:text-slate-400">TIP</div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1">Each block is a note. Order = melody. Adjust tempo and press Play — audio is generated with Web Audio API, no files needed. Saved locally.</p>
          </div>
        </div>
      }
    />
  );
}
