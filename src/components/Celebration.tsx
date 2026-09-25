"use client";

const CONFETTI = [
  { e: "🎉", left: "6%", delay: "0s", size: "1.6rem" },
  { e: "⭐", left: "16%", delay: "0.25s", size: "1.2rem" },
  { e: "🎊", left: "26%", delay: "0.5s", size: "1.4rem" },
  { e: "🍌", left: "36%", delay: "0.15s", size: "1.3rem" },
  { e: "✨", left: "46%", delay: "0.4s", size: "1.1rem" },
  { e: "🎈", left: "56%", delay: "0.1s", size: "1.5rem" },
  { e: "🌟", left: "66%", delay: "0.55s", size: "1.2rem" },
  { e: "💛", left: "76%", delay: "0.3s", size: "1.3rem" },
  { e: "🎉", left: "86%", delay: "0.45s", size: "1.6rem" },
  { e: "⭐", left: "93%", delay: "0.2s", size: "1.1rem" },
];

export default function Celebration({
  open,
  mascot = "🐒",
  title = "YOU DID IT! 🎉",
  message = "You did great! Give yourself a big clap! 👏",
  primaryLabel = "Next →",
  onPrimary,
  secondaryLabel = "🔄 Play again",
  onSecondary,
}: {
  open: boolean;
  mascot?: string;
  title?: string;
  message?: string;
  primaryLabel?: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-label={title}>
      <div className="relative rounded-[28px] bg-white dark:bg-slate-900 p-6 sm:p-8 text-center max-w-sm w-full shadow-[0_25px_80px_-12px_rgba(0,0,0,0.65)] overflow-hidden my-auto">
        {/* confetti shower */}
        <div className="absolute inset-x-0 top-0 h-20 pointer-events-none" aria-hidden="true">
          {CONFETTI.map((c, i) => (
            <span
              key={i}
              className="absolute top-1 animate-bounce"
              style={{ left: c.left, animationDelay: c.delay, fontSize: c.size }}
            >
              {c.e}
            </span>
          ))}
        </div>
        <button
          onClick={onSecondary}
          aria-label="Close celebration"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 border text-slate-500 font-black hover:bg-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
        >
          ×
        </button>

        {/* mascots */}
        <div className="mt-6 flex items-end justify-center gap-2" aria-hidden="true">
          <span className="text-3xl animate-bounce" style={{ animationDelay: "0.2s" }}>🎉</span>
          <span className="text-6xl animate-bounce">{mascot}</span>
          <span className="text-3xl animate-bounce" style={{ animationDelay: "0.4s" }}>🍌</span>
        </div>

        <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">{title}</h2>
        <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">{message}</p>

        <div className="mt-2 text-2xl tracking-[0.2em]" aria-hidden="true">⭐⭐⭐</div>

        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={onPrimary}
            autoFocus
            className="w-full py-3 rounded-2xl font-black text-base text-white shadow-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 transition active:scale-[0.98]"
          >
            {primaryLabel}
          </button>
          <button
            onClick={onSecondary}
            className="w-full py-2.5 rounded-2xl font-black text-sm bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 transition active:scale-[0.98] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
          >
            {secondaryLabel}
          </button>
        </div>
        <p className="mt-3 text-[11px] font-bold text-slate-400">Progress saved! 💾 Keep shining! 🌟</p>
      </div>
    </div>
  );
}
