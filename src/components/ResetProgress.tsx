"use client";
export default function ResetProgress() {
  return (
    <button
      onClick={() => {
        localStorage.clear();
        window.dispatchEvent(new Event("sudocodo-progress"));
        location.reload();
      }}
      className="shrink-0 px-4 py-2 rounded-full border bg-slate-50 text-sm font-bold hover:bg-white"
    >
      Reset progress
    </button>
  );
}
