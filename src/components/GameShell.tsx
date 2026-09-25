"use client";
import Link from "next/link";
import { ReactNode } from "react";

export default function GameShell({
  title,
  icon,
  subtitle,
  color,
  controls,
  canvas,
  workspace,
  levelBar,
}: {
  title: string;
  icon: string;
  subtitle: string;
  color: string;
  controls?: ReactNode;
  canvas: ReactNode;
  workspace: ReactNode;
  levelBar?: ReactNode;
}) {
  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* portrait-first header */}
      <div className={`rounded-[20px] border p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-br ${color}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border grid place-items-center text-xl shadow-sm">{icon}</div>
          <div>
            <h1 className="font-black leading-none text-slate-900">{title}</h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" className="px-3 py-1.5 rounded-full bg-white border text-sm font-bold hover:bg-slate-50">← Home</Link>
          {controls}
        </div>
      </div>

      {levelBar && <div className="mt-3">{levelBar}</div>}

      {/* CRITICAL: portrait stack on mobile, side-by-side on desktop */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_0.85fr] items-start">
        <div className="order-1 lg:order-1 rounded-[20px] border bg-white p-3 sm:p-4 shadow-sm">
          {/* Keep canvas aspect portrait-friendly on phone */}
          <div className="rounded-2xl overflow-hidden border bg-slate-50">{canvas}</div>
        </div>
        <div className="order-2 lg:order-2 lg:sticky lg:top-[68px]">{workspace}</div>
      </div>

      <p className="mt-4 text-center text-[11px] text-slate-400">Progress autosaves locally • Works offline • No login needed</p>
    </div>
  );
}
