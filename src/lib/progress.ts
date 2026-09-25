"use client";

import { useEffect, useState } from "react";

/**
 * ProgressService — clean local-cache engine for the SudoCodo arena.
 * Persists ratings, daily completions, Ascenso nodes & π bank to localStorage.
 * Daily counters auto-reset when the calendar day rolls over (all-time stats kept).
 */

export type DuelCat = "math" | "memory" | "puzzle" | "logic";
export type Ratings = Record<DuelCat, number>;

const RKEY = "sudocodo_duels_rating";
const DKEY = "sudocodo_dailies_v1";
const AKEY = "sudocodo_ascenso_v1";
const PIKEY = "sudocodo_pi_bank";

const isBrowser = () => typeof window !== "undefined";

function readObj<T extends object>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...(JSON.parse(raw) as Partial<T>) };
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

/** Notify listeners (header progress, hub previews) that cached progress changed. */
export function emitProgress() {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event("sudocodo-progress"));
}

export function todayKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/* ---------------- Ratings (Elo-style, start 1000) ---------------- */

const DEFAULT_RATINGS: Ratings = { math: 1000, memory: 1000, puzzle: 1000, logic: 1000 };

export function getRatings(): Ratings {
  return readObj<Ratings>(RKEY, DEFAULT_RATINGS);
}

export function addRating(cat: DuelCat, delta: number): Ratings {
  const cur = getRatings();
  const next = { ...cur, [cat]: Math.max(100, cur[cat] + delta) };
  write(RKEY, next);
  emitProgress();
  return next;
}

/* ---------------- π bank (all-time, never reset) ---------------- */

export function getPi(): number {
  if (!isBrowser()) return 0;
  const v = Number(localStorage.getItem(PIKEY) || "0");
  return isNaN(v) ? 0 : v;
}

export function addPi(n: number): number {
  const next = getPi() + n;
  write(PIKEY, String(next));
  emitProgress();
  return next;
}

/* ---------------- Dailies (reset every calendar day) ---------------- */

export type Dailies = {
  date: string;
  done: Record<string, boolean>;
  awards: string[];
};

function freshDailies(): Dailies {
  return { date: todayKey(), done: {}, awards: [] };
}

/** Returns today's dailies; auto-resets counters if 24h/day rolled over. */
export function getDailies(): Dailies {
  const cur = readObj<Dailies>(DKEY, freshDailies());
  if (cur.date !== todayKey()) {
    const fresh = freshDailies();
    write(DKEY, fresh);
    return fresh;
  }
  return cur;
}

export function markDaily(id: string): Dailies {
  const cur = getDailies();
  if (cur.done[id]) return cur;
  const next = { ...cur, done: { ...cur.done, [id]: true } };
  write(DKEY, next);
  emitProgress();
  return next;
}

/** Grant a milestone award once per day. Returns true if newly awarded. */
export function grantAward(awardId: string, pi: number): boolean {
  const cur = getDailies();
  if (cur.awards.includes(awardId)) return false;
  write(DKEY, { ...cur, awards: [...cur.awards, awardId] });
  addPi(pi);
  return true;
}

export function countDone(ids: string[]): number {
  const { done } = getDailies();
  return ids.filter((id) => done[id]).length;
}

/* ---------------- Ascenso track (10 nodes, persistent) ---------------- */

export type Ascenso = {
  current: number;
  unlocked: number;
  done: number[];
};

const DEFAULT_ASCENSO: Ascenso = { current: 1, unlocked: 1, done: [] };

export function getAscenso(): Ascenso {
  const a = readObj<Ascenso>(AKEY, DEFAULT_ASCENSO);
  return {
    current: Math.min(10, Math.max(1, a.current || 1)),
    unlocked: Math.min(10, Math.max(1, a.unlocked || 1)),
    done: Array.isArray(a.done) ? a.done.filter((n) => n >= 1 && n <= 10) : [],
  };
}

export function setAscensoCurrent(n: number): Ascenso {
  const a = getAscenso();
  const next = { ...a, current: Math.min(a.unlocked, Math.max(1, n)) };
  write(AKEY, next);
  emitProgress();
  return next;
}

export function completeAscensoNode(n: number): Ascenso {
  const a = getAscenso();
  const done = a.done.includes(n) ? a.done : [...a.done, n];
  const unlocked = Math.min(10, Math.max(a.unlocked, n + 1));
  const current = Math.min(10, n + 1);
  const next = { current, unlocked, done };
  write(AKEY, next);
  addPi(5);
  return next;
}

/* ---------------- Countdown hook (ticks every second) ---------------- */

/** Milliseconds remaining until local midnight. */
export function msToMidnight(): number {
  const now = new Date();
  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  return Math.max(0, end.getTime() - now.getTime());
}

export function formatCountdown(ms: number): string {
  const s = Math.floor(ms / 1000);
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${h}:${m}:${sec}`;
}

/** Live "HH:MM:SS to reset" string, re-rendered each second. */
export function useCountdown(): string {
  const [label, setLabel] = useState("--:--:--");
  useEffect(() => {
    const tick = () => setLabel(formatCountdown(msToMidnight()));
    tick();
    const t = window.setInterval(tick, 1000);
    return () => window.clearInterval(t);
  }, []);
  return label;
}
