"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import GameShell from "@/components/GameShell";
import DuelQuiz from "@/components/DuelQuiz";
import { DUEL_CATEGORIES } from "@/lib/duels";
import { addRating, getRatings, type DuelCat, type Ratings } from "@/lib/progress";

/* ---------- Interactive: Grid Flash ---------- */

function GridFlash({ accent, onWin }: { accent: string; onWin: () => void }) {
  const [targets, setTargets] = useState<number[]>([]);
  const [phase, setPhase] = useState<"watch" | "tap">("watch");
  const [hits, setHits] = useState<number[]>([]);
  const [msg, setMsg] = useState("👁️ Watch the flashing tiles…");
  const won = useMemo(() => targets.length > 0 && hits.length === targets.length, [targets, hits]);

  const newRound = useCallback(() => {
    const set = new Set<number>();
    while (set.size < 4) set.add(Math.floor(Math.random() * 9));
    setTargets([...set]);
    setHits([]);
    setPhase("watch");
    setMsg("👁️ Watch the flashing tiles…");
    window.setTimeout(() => {
      setPhase("tap");
      setMsg("👆 Now tap the ones that flashed!");
    }, 1400);
  }, []);

  useEffect(() => {
    newRound();
  }, [newRound]);

  useEffect(() => {
    if (won) {
      setMsg("🏆 Perfect memory! +15 rating!");
      const t = window.setTimeout(onWin, 600);
      return () => window.clearTimeout(t);
    }
  }, [won, onWin]);

  const tap = (i: number) => {
    if (phase !== "tap" || hits.includes(i)) return;
    if (targets.includes(i)) {
      setHits((h) => [...h, i]);
    } else {
      setMsg("❌ Not that one — watch again!");
      newRound();
    }
  };

  return (
    <div className="rounded-2xl border-2 bg-white p-4 dark:bg-[#181D27] dark:border-slate-700" style={{ borderColor: accent }}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-black text-slate-900 dark:text-white">⚡ Grid Flash — {hits.length}/{targets.length}</div>
        <button onClick={newRound} className="text-xs font-bold px-2.5 py-1 rounded-full bg-white border dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">🔄 New</button>
      </div>
      <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{msg}</p>
      <div className="mt-3 grid grid-cols-3 gap-2 max-w-[280px] mx-auto">
        {Array.from({ length: 9 }, (_, i) => {
          const lit = phase === "watch" && targets.includes(i);
          const hit = hits.includes(i);
          return (
            <button
              key={i}
              onClick={() => tap(i)}
              disabled={phase !== "tap"}
              aria-label={`Tile ${i + 1}`}
              className={`aspect-square rounded-xl border-2 transition active:scale-95 ${
                lit || hit ? "" : "bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700"
              }`}
              style={lit || hit ? { background: accent, borderColor: accent } : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Interactive: Card Flip (pairs) ---------- */

const PAIRS = ["🐒", "🍌", "🚀", "⭐"];

function CardFlip({ accent, onWin }: { accent: string; onWin: () => void }) {
  const [deck, setDeck] = useState<string[]>([]);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const deal = useCallback(() => {
    const d = [...PAIRS, ...PAIRS]
      .map((v, i) => ({ v, r: Math.random(), i }))
      .sort((a, b) => a.r - b.r)
      .map((c) => c.v);
    setDeck(d);
    setOpen([]);
    setMatched([]);
    setMoves(0);
  }, []);

  useEffect(() => {
    deal();
  }, [deal]);

  useEffect(() => {
    if (deck.length > 0 && matched.length === deck.length) {
      const t = window.setTimeout(onWin, 600);
      return () => window.clearTimeout(t);
    }
  }, [matched, deck, onWin]);

  const flip = (i: number) => {
    if (open.includes(i) || matched.includes(i) || open.length >= 2) return;
    const next = [...open, i];
    setOpen(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      if (deck[next[0]] === deck[next[1]]) {
        window.setTimeout(() => {
          setMatched((m) => [...m, ...next]);
          setOpen([]);
        }, 450);
      } else {
        window.setTimeout(() => setOpen([]), 700);
      }
    }
  };

  return (
    <div className="rounded-2xl border-2 bg-white p-4 dark:bg-[#181D27] dark:border-slate-700" style={{ borderColor: accent }}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-black text-slate-900 dark:text-white">🃏 Card Flip — {matched.length / 2}/{PAIRS.length} pairs • {moves} moves</div>
        <button onClick={deal} className="text-xs font-bold px-2.5 py-1 rounded-full bg-white border dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">🔄 New</button>
      </div>
      {matched.length === deck.length && deck.length > 0 ? (
        <p className="mt-2 text-center text-sm font-black text-emerald-600">🏆 All matched! +15 rating!</p>
      ) : (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {deck.map((v, i) => {
            const face = open.includes(i) || matched.includes(i);
            return (
              <button
                key={i}
                onClick={() => flip(i)}
                aria-label={face ? `${v} card` : "Hidden card"}
                className={`aspect-square rounded-xl border-2 grid place-items-center text-2xl transition active:scale-95 ${
                  face ? "" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                }`}
                style={face ? { background: accent + "33", borderColor: accent, opacity: matched.includes(i) ? 0.55 : 1 } : undefined}
              >
                {face ? v : "❓"}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------- Duels page ---------- */

export default function DuelsClient() {
  const [ratings, setRatings] = useState<Ratings>({ math: 1000, memory: 1000, puzzle: 1000, logic: 1000 });
  const [activeId, setActiveId] = useState<DuelCat>("math");
  const [subId, setSubId] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    setRatings(getRatings());
    try {
      const saved = localStorage.getItem("sudocodo_duels_active") as DuelCat | null;
      if (saved && ["math", "memory", "puzzle", "logic"].includes(saved)) setActiveId(saved);
    } catch {}
    const sync = () => setRatings(getRatings());
    window.addEventListener("sudocodo-progress", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("sudocodo-progress", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const active = DUEL_CATEGORIES.find((c) => c.id === activeId)!;

  const chooseCat = (id: DuelCat) => {
    setActiveId(id);
    setSubId(null);
    try {
      localStorage.setItem("sudocodo_duels_active", id);
    } catch {}
  };

  const win = (cat: DuelCat, label: string) => {
    const next = addRating(cat, 15);
    setRatings(next);
    setFlash(`+15 ${label} rating! Now ${next[cat]} ⭐`);
    window.setTimeout(() => setFlash(null), 2200);
  };

  const activeSub = active.subs.find((s) => s.id === subId) || null;

  return (
    <GameShell
      title="Duels Arena"
      icon="⚔️"
      subtitle="Pick a category • win duels • raise rating"
      color="from-yellow-100 to-amber-100 border-yellow-300 dark:from-yellow-950 dark:to-amber-950 dark:border-yellow-800"
      controls={
        <span className="px-3 py-1.5 rounded-full text-xs font-black text-white shadow" style={{ background: active.accent, color: activeId === "math" ? "#3b2f00" : "#fff" }}>
          ★ {ratings[activeId]} {active.name}
        </span>
      }
      levelBar={
        flash ? (
          <div className="px-3 py-2 rounded-xl text-sm font-black text-center text-white shadow" style={{ background: active.accent, color: activeId === "math" ? "#3b2f00" : "#fff" }}>
            {flash}
          </div>
        ) : (
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 text-center">👆 Tap a category — your rating saves locally, no login! 💛</p>
        )
      }
      canvas={
        <div className="p-3 sm:p-4">
          {/* Category selector */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2" role="tablist" aria-label="Duel categories">
            {DUEL_CATEGORIES.map((c) => {
              const isActive = c.id === activeId;
              return (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => chooseCat(c.id)}
                  className="rounded-2xl border-[3px] p-3 text-left transition active:scale-95 bg-white dark:bg-[#181D27]"
                  style={{
                    borderColor: isActive ? c.accent : "transparent",
                    boxShadow: isActive ? `0 8px 24px -8px ${c.accent}` : undefined,
                    background: isActive ? c.dimAccent : undefined,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl" aria-hidden="true">{c.icon}</span>
                    <span className="text-[11px] font-black px-2 py-0.5 rounded-full text-white" style={{ background: c.accent, color: c.id === "math" ? "#3b2f00" : "#fff" }}>
                      ★ {ratings[c.id]}
                    </span>
                  </div>
                  <div className="mt-1 font-black text-slate-900 dark:text-white text-sm tracking-wide">{c.name}</div>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-tight">{c.tagline}</div>
                </button>
              );
            })}
          </div>

          {/* Sub-game grid */}
          <h2 className="mt-4 font-black text-slate-900 dark:text-white text-sm">
            {active.icon} {active.name} games — pick your duel
          </h2>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {active.subs.map((s) => {
              const selected = s.id === subId;
              const inner =
                s.kind === "link" ? (
                  <Link
                    href={s.link!}
                    className="flex items-center gap-3 rounded-2xl border-2 bg-white p-3 text-left transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-[#181D27] dark:border-slate-700"
                    style={{ borderColor: active.accent }}
                    aria-label={`Play ${s.name} in Daily Challenges`}
                  >
                    <span className="w-11 h-11 rounded-xl grid place-items-center text-2xl shrink-0" style={{ background: active.dimAccent }} aria-hidden="true">
                      {s.icon}
                    </span>
                    <span className="flex-1">
                      <span className="block font-black text-slate-900 dark:text-white text-sm">{s.name}</span>
                      <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">{s.desc} • opens in Dailies 📅</span>
                    </span>
                    <span aria-hidden="true">→</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => setSubId(selected ? null : s.id)}
                    aria-expanded={selected}
                    className="flex items-center gap-3 rounded-2xl border-2 bg-white p-3 text-left transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-[#181D27]"
                    style={{ borderColor: selected ? active.accent : "#e2e8f0" }}
                  >
                    <span className="w-11 h-11 rounded-xl grid place-items-center text-2xl shrink-0" style={{ background: active.dimAccent }} aria-hidden="true">
                      {s.icon}
                    </span>
                    <span className="flex-1">
                      <span className="block font-black text-slate-900 dark:text-white text-sm">{s.name}</span>
                      <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">{s.desc}</span>
                    </span>
                    <span aria-hidden="true">{selected ? "▾" : "▸"}</span>
                  </button>
                );
              return <div key={s.id}>{inner}</div>;
            })}
          </div>

          {/* Active duel panel */}
          {activeSub && activeSub.kind === "quiz" && activeSub.gen && (
            <div className="mt-3">
              <DuelQuiz
                key={active.id + activeSub.id}
                title={activeSub.name}
                icon={activeSub.icon}
                accent={active.accent}
                gen={activeSub.gen}
                onWin={() => win(active.id, active.name)}
              />
            </div>
          )}
          {activeSub && activeSub.id === "gridflash" && (
            <div className="mt-3">
              <GridFlash accent={active.accent} onWin={() => win(active.id, active.name)} />
            </div>
          )}
          {activeSub && activeSub.id === "cardflip" && (
            <div className="mt-3">
              <CardFlip accent={active.accent} onWin={() => win(active.id, active.name)} />
            </div>
          )}
        </div>
      }
      workspace={
        <div className="space-y-3">
          <div className="rounded-2xl bg-white border p-4 dark:bg-[#181D27] dark:border-slate-700">
            <div className="text-xs font-black tracking-widest text-slate-500 dark:text-slate-400">🏆 YOUR RATINGS</div>
            <div className="mt-2 space-y-2">
              {DUEL_CATEGORIES.map((c) => (
                <button key={c.id} onClick={() => chooseCat(c.id)} className="w-full flex items-center gap-2">
                  <span className="text-xs font-black w-16 text-left" style={{ color: c.accent }}>{c.name}</span>
                  <span className="flex-1 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <span className="block h-full rounded-full" style={{ width: `${Math.min(100, ((ratings[c.id] - 900) / 400) * 100)}%`, background: c.accent }} />
                  </span>
                  <span className="text-xs font-black text-slate-700 dark:text-slate-200 w-12 text-right">★ {ratings[c.id]}</span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">Win a duel (4/5) = +15 rating. Saved in this browser. 💛</p>
          </div>
          <div className="rounded-2xl border-2 p-3 text-sm font-bold" style={{ borderColor: active.accent, background: active.dimAccent }}>
            <span className="text-slate-800 dark:text-slate-100">💡 {active.name}: {active.tagline}. Puzzle games live in <Link href="/dailies" className="underline">Dailies 📅</Link>.</span>
          </div>
        </div>
      }
    />
  );
}
