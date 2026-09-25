"use client";

export type GameProgress = {
  completed?: boolean;
  stars?: number;
  level?: number;
  bestSteps?: number;
  updatedAt?: number;
};

export type AllProgress = Record<string, GameProgress>;

const KEY = "sudocodo_progress";
const LEVEL_PREFIX = "sudocodo_level_";

export function getProgress(): AllProgress {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function setGameProgress(game: string, data: GameProgress) {
  if (typeof window === "undefined") return;
  const cur = getProgress();
  cur[game] = { ...(cur[game] || {}), ...data, updatedAt: Date.now() };
  localStorage.setItem(KEY, JSON.stringify(cur));
  window.dispatchEvent(new Event("sudocodo-progress"));
}

export function getGameProgress(game: string): GameProgress {
  return getProgress()[game] || {};
}

export function setLevel(game: string, level: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${LEVEL_PREFIX}${game}`, String(level));
  // also keep in progress
  setGameProgress(game, { level });
}

export function getLevel(game: string, max = 10): number {
  if (typeof window === "undefined") return 1;
  const v = Number(localStorage.getItem(`${LEVEL_PREFIX}${game}`) || "1");
  if (!v || isNaN(v)) return 1;
  return Math.min(Math.max(1, v), max);
}

export function clearAll() {
  localStorage.removeItem(KEY);
  Object.keys(localStorage).forEach((k) => {
    if (k.startsWith(LEVEL_PREFIX)) localStorage.removeItem(k);
  });
  window.dispatchEvent(new Event("sudocodo-progress"));
}
