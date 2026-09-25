"use client";
export default function ResetProgress() {
  return (
    <button
      onClick={() => {
        localStorage.clear();
        window.dispatchEvent(new Event("sudocodo-progress"));
        location.reload();
      }}
      className="shrink-0 px-4 py-2 rounded-full border border-slate-200 bg-slate-50 text-slate-700 text-sm font-bold hover:bg-white dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-700"
    >
      Reset progress
    </button>
  );
}
