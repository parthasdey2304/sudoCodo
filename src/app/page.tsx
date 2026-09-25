import GameCard from "@/components/GameCard";
import ResetProgress from "@/components/ResetProgress";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-4 pt-6 sm:pt-8">
        <div className="rounded-[28px] border bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-[1px]">
          <div className="rounded-[27px] bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-black/10 blur-2xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold tracking-widest bg-white/15 border border-white/20 rounded-full px-3 py-1">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" /> OFFLINE • NO LOGIN • AUTOSAVE
              </div>
              <h1 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight leading-[0.95]">
                Learn to code
                <br />
                <span className="text-yellow-300">with blocks.</span>
              </h1>
              <p className="mt-3 max-w-2xl text-white/90 text-sm sm:text-base font-medium">
                A modern, mobile-first playground inspired by <span className="underline decoration-white/40">Blockly Games</span> &{" "}
                <span className="underline decoration-white/40">CodeMonkey Junior</span>. Portrait-friendly, crisp, and built for phones — progress stays on your device.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href="/maze" className="px-5 py-2.5 rounded-full bg-white text-slate-900 font-extrabold text-sm hover:bg-yellow-300 transition">Start Playing →</Link>
                <Link href="/sequencing" className="px-5 py-2.5 rounded-full bg-black/15 border border-white/20 backdrop-blur text-white font-bold text-sm hover:bg-black/25 transition">
                  CodeMonkey Style
                </Link>
                <span className="hidden sm:inline-flex items-center px-3 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-bold">8 Games • 60+ Levels • Zero Setup</span>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-2 max-w-md">
                <div className="rounded-2xl bg-white/10 border border-white/15 p-3 backdrop-blur">
                  <div className="text-lg">📱</div>
                  <div className="text-xs font-extrabold">Portrait UI</div>
                  <div className="text-[11px] opacity-80">Phone-first layout</div>
                </div>
                <div className="rounded-2xl bg-white/10 border border-white/15 p-3 backdrop-blur">
                  <div className="text-lg">💾</div>
                  <div className="text-xs font-extrabold">Autosave</div>
                  <div className="text-[11px] opacity-80">Local cache</div>
                </div>
                <div className="rounded-2xl bg-white/10 border border-white/15 p-3 backdrop-blur">
                  <div className="text-lg">⚡</div>
                  <div className="text-xs font-extrabold">Instant Run</div>
                  <div className="text-[11px] opacity-80">No install</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GRID — like blockly.games */}
      <section className="max-w-6xl mx-auto px-4 mt-6">
        <div className="flex items-end justify-between">
          <h2 className="font-black text-slate-900 text-lg sm:text-xl">All Games</h2>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-900 text-white">Tap to play</span>
        </div>

        <div className="mt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          <GameCard
            href="/puzzle"
            title="Puzzle"
            desc="Learn how blocks snap. Match the picture."
            icon="🧩"
            color="bg-violet-500"
            accent="bg-violet-50 border-violet-200"
            level="4 levels"
            badge="START HERE"
          />
          <GameCard
            href="/maze"
            title="Maze"
            desc="Guide the astronaut. Loops & turns."
            icon="🧭"
            color="bg-sky-500"
            accent="bg-sky-50 border-sky-200"
            level="10 levels"
            badge="POPULAR"
          />
          <GameCard
            href="/sequencing"
            title="Sequencing"
            desc="CodeMonkey-style: order the steps to collect bananas."
            icon="🐒"
            color="bg-amber-500"
            accent="bg-amber-50 border-amber-200"
            level="8 levels"
            badge="NEW"
          />
          <GameCard
            href="/bird"
            title="Bird"
            desc="Help the bird catch the worm. If/else logic."
            icon="🐦"
            color="bg-emerald-500"
            accent="bg-emerald-50 border-emerald-200"
            level="10 levels"
          />
          <GameCard
            href="/turtle"
            title="Turtle"
            desc="Draw art with loops. Geometry & repeat."
            icon="🐢"
            color="bg-teal-500"
            accent="bg-teal-50 border-teal-200"
            level="∞ canvas"
          />
          <GameCard
            href="/movie"
            title="Movie"
            desc="Animate with math: x, y, time."
            icon="🎬"
            color="bg-rose-500"
            accent="bg-rose-50 border-rose-200"
            level="4 scenes"
          />
          <GameCard
            href="/music"
            title="Music"
            desc="Compose by coding notes & beats."
            icon="🎵"
            color="bg-indigo-500"
            accent="bg-indigo-50 border-indigo-200"
            level="Studio"
          />
          <GameCard
            href="/pond"
            title="Pond"
            desc="Code your duck: duel the enemy AI."
            icon="🦆"
            color="bg-cyan-500"
            accent="bg-cyan-50 border-cyan-200"
            level="vs AI"
            badge="BATTLE"
          />
        </div>

        {/* info strip */}
        <div className="mt-6 rounded-[20px] border bg-white p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <div className="font-extrabold text-slate-900">Built for phones first</div>
            <p className="text-sm text-slate-600 max-w-xl">
              Every game is portrait-optimized: canvas on top, toolbox below, big tap targets, no horizontal scroll. Swipe, tap, drag — all touch-friendly. Your level & stars are stored in this browser`s cache.
            </p>
          </div>
          <ResetProgress />
        </div>

        <div className="mt-4 rounded-2xl bg-slate-900 text-white p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="text-sm font-bold">“Just like Blockly Games — but faster, modern, and works offline.”</div>
          <div className="text-xs opacity-70">Tip: Add to Home Screen for full-screen portrait app feel.</div>
        </div>
      </section>
    </main>
  );
}
