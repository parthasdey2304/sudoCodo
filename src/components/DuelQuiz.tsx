"use client";

import { useMemo, useRef, useState } from "react";
import type { QuizQ } from "@/lib/duels";

const ROUNDS = 5;
const PASS = 4;

export default function DuelQuiz({
  title,
  icon,
  accent,
  gen,
  onWin,
}: {
  title: string;
  icon: string;
  accent: string;
  gen: () => QuizQ;
  onWin: () => void;
}) {
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [q, setQ] = useState<QuizQ>(() => gen());
  const [typed, setTyped] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const [reveal, setReveal] = useState(false);
  const doneRef = useRef(false);

  const total = ROUNDS;
  const finished = qi >= total;

  const submit = (value: string) => {
    if (reveal || finished) return;
    const ok = value.trim() === q.answer;
    setPicked(value);
    setReveal(true);
    if (ok) setScore((s) => s + 1);
    window.setTimeout(() => {
      if (qi + 1 >= total) {
        setQi(total);
        const finalScore = score + (ok ? 1 : 0);
        if (finalScore >= PASS && !doneRef.current) {
          doneRef.current = true;
          onWin();
        }
      } else {
        setQ(gen());
        setTyped("");
        setPicked(null);
        setReveal(false);
        setQi((i) => i + 1);
      }
    }, 750);
  };

  const restart = () => {
    doneRef.current = false;
    setQi(0);
    setScore(0);
    setQ(gen());
    setTyped("");
    setPicked(null);
    setReveal(false);
  };

  const dots = useMemo(() => Array.from({ length: total }, (_, i) => i), [total]);

  return (
    <div className="rounded-2xl border-2 bg-white p-4 dark:bg-[#181D27] dark:border-slate-700" style={{ borderColor: reveal ? undefined : accent }}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl grid place-items-center text-xl border" style={{ background: accent + "22", borderColor: accent }} aria-hidden="true">
            {icon}
          </span>
          <div>
            <div className="font-black text-slate-900 dark:text-white text-sm leading-tight">{title}</div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Round {Math.min(qi + 1, total)}/{total} • Score {score} ⭐
            </div>
          </div>
        </div>
        <button onClick={restart} className="text-xs font-bold px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
          🔄 Retry
        </button>
      </div>

      {/* progress dots */}
      <div className="mt-3 flex gap-1.5" aria-hidden="true">
        {dots.map((i) => (
          <div
            key={i}
            className="h-2 flex-1 rounded-full"
            style={{ background: i < qi ? accent : i === qi ? accent + "55" : "#e2e8f0" }}
          />
        ))}
      </div>

      {!finished ? (
        <div className="mt-3">
          <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white text-center">{q.prompt}</p>
          <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400 text-center">{q.hint}</p>
          {q.options ? (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {q.options.map((op) => {
                const isAns = op === q.answer;
                const isPick = op === picked;
                return (
                  <button
                    key={op}
                    onClick={() => submit(op)}
                    disabled={reveal}
                    className={`px-3 py-2.5 rounded-xl border-2 font-black text-sm transition active:scale-95 disabled:cursor-default ${
                      reveal && isAns
                        ? "bg-emerald-500 text-white border-emerald-600"
                        : reveal && isPick
                          ? "bg-red-500 text-white border-red-600"
                          : "bg-white border-slate-200 hover:border-indigo-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                    }`}
                  >
                    {op}
                  </button>
                );
              })}
            </div>
          ) : (
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (typed.trim()) submit(typed);
              }}
            >
              <input
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                inputMode="decimal"
                autoFocus
                placeholder="Your answer…"
                className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border-2 border-slate-200 font-black text-center dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                aria-label="Your answer"
              />
              <button type="submit" className="px-5 py-2.5 rounded-xl font-black text-sm text-white shadow" style={{ background: accent }}>
                Go →
              </button>
            </form>
          )}
          {reveal && (
            <p className={`mt-2 text-center text-xs font-black ${picked === q.answer ? "text-emerald-600" : "text-red-500"}`}>
              {picked === q.answer ? "✅ Correct! Nice!" : `❌ It was ${q.answer} — you'll get the next one!`}
            </p>
          )}
        </div>
      ) : (
        <div className="mt-3 text-center rounded-xl border p-4" style={{ borderColor: accent, background: accent + "11" }}>
          <div className="text-4xl" aria-hidden="true">{score >= PASS ? "🏆" : "💪"}</div>
          <p className="mt-1 font-black text-slate-900 dark:text-white">
            {score}/{total} — {score >= PASS ? "Victory! +15 rating! ⭐" : "Good fight! Try again! 💛"}
          </p>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Need {PASS}/{total} to win rating.</p>
          <button onClick={restart} className="mt-2 px-4 py-2 rounded-full text-white text-sm font-black shadow" style={{ background: accent }}>
            Play again →
          </button>
        </div>
      )}
    </div>
  );
}
