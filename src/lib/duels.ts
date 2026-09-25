import type { DuelCat } from "./progress";

export type QuizQ = {
  prompt: string;
  hint: string;
  options?: string[];
  answer: string;
};

export type SubGame = {
  id: string;
  name: string;
  desc: string;
  icon: string;
  kind: "quiz" | "interactive" | "link";
  link?: string;
  gen?: () => QuizQ;
};

export type DuelCategory = {
  id: DuelCat;
  name: string;
  tagline: string;
  icon: string;
  accent: string;
  dimAccent: string;
  subs: SubGame[];
};

const ri = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

function withOptions(answer: number, spread = 10): string[] {
  const set = new Set<string>([String(answer)]);
  while (set.size < 4) set.add(String(answer + ri(-spread, spread) || answer + 1));
  return shuffle([...set]);
}

/* ---------------- MATH generators ---------------- */

const genSpeedArithmetic = (): QuizQ => {
  const a = ri(11, 60);
  const b = ri(11, 60);
  const plus = Math.random() < 0.5;
  const ans = plus ? a + b : a - b;
  return { prompt: `${a} ${plus ? "+" : "−"} ${b} = ?`, hint: "⚡ Fast! Round to tens first.", options: withOptions(ans), answer: String(ans) };
};

const genMentalMath = (): QuizQ => {
  const a = ri(3, 12);
  const b = ri(3, 12);
  return { prompt: `${a} × ${b} = ?`, hint: "🧠 Break it: (a × 10) − (a × rest).", options: withOptions(a * b, 12), answer: String(a * b) };
};

const genAlgebra = (): QuizQ => {
  const x = ri(2, 12);
  const a = ri(2, 15);
  return { prompt: `x + ${a} = ${x + a} — find x`, hint: "⚖️ Undo the +: subtract both sides.", options: withOptions(x, 5), answer: String(x) };
};

const genFactorial = (): QuizQ => {
  const n = ri(3, 6);
  let f = 1;
  for (let i = 2; i <= n; i++) f *= i;
  return { prompt: `${n}! = ?`, hint: `❗ Multiply 1·2·…·${n}.`, options: withOptions(f, 30), answer: String(f) };
};

/* ---------------- MEMORY (quiz-style) generators ---------------- */

const genPatternRecall = (): QuizQ => {
  const start = ri(2, 9);
  const step = ri(2, 7);
  const seq = [start, start + step, start + 2 * step, start + 3 * step];
  return {
    prompt: `${seq.join(" → ")} → ?`,
    hint: "👁️ Spot the jump between numbers.",
    options: withOptions(start + 4 * step, 8),
    answer: String(start + 4 * step),
  };
};

const genSequenceMatch = (): QuizQ => {
  const base = [ri(1, 5), ri(6, 12), ri(13, 20)];
  const correct = [...base, base[2] + (base[1] - base[0])];
  const wrong = [
    [...base, base[2] + ri(1, 5)],
    [...base, base[2] - ri(1, 4)],
    [...base, base[2] + ri(6, 12)],
  ];
  const opts = shuffle([correct, ...wrong]).map((s) => s.join(", "));
  return { prompt: `Which finishes: ${base.join(", ")}, …?`, hint: "🔍 Same jump each step.", options: opts, answer: correct.join(", ") };
};

/* ---------------- LOGIC generators ---------------- */

const genTruthTables = (): QuizQ => {
  const type = pick(["AND", "OR"] as const);
  const a = Math.random() < 0.5;
  const b = Math.random() < 0.5;
  const ans = type === "AND" ? a && b : a || b;
  const A = a ? "TRUE" : "FALSE";
  const B = b ? "TRUE" : "FALSE";
  return {
    prompt: `${A} ${type} ${B} = ?`,
    hint: type === "AND" ? "🔌 AND needs BOTH true." : "🔌 OR needs ANY true.",
    options: ["TRUE", "FALSE"],
    answer: ans ? "TRUE" : "FALSE",
  };
};

const genDeduction = (): QuizQ => {
  const kind = ri(0, 2);
  if (kind === 0) {
    const s = ri(2, 5);
    const seq = [s, s * 2, s * 4, s * 8];
    return { prompt: `${seq.join(" → ")} → ?`, hint: "✖️ Each step doubles.", options: withOptions(s * 16, 20), answer: String(s * 16) };
  }
  if (kind === 1) {
    const s = ri(3, 7);
    const seq = [s * s, (s + 1) * (s + 1), (s + 2) * (s + 2)];
    const ans = (s + 3) * (s + 3);
    return { prompt: `${seq.join(" → ")} → ?`, hint: "🟧 Squares: 3², 4², 5²…", options: withOptions(ans, 25), answer: String(ans) };
  }
  const a = ri(5, 15);
  const seq = [a, a - 2, a - 4, a - 6];
  return { prompt: `${seq.join(" → ")} → ?`, hint: "➖ Same step down.", options: withOptions(a - 8, 6), answer: String(a - 8) };
};

const RIDDLES: { q: string; a: string }[] = [
  { q: "All Bloops are Razzies. All Razzies are Lazzies. So all Bloops are Lazzies.", a: "TRUE" },
  { q: "Some cats are dogs. All dogs bark. So some cats bark.", a: "TRUE" },
  { q: "No fish can fly. Nemo is a fish. So Nemo can fly.", a: "FALSE" },
  { q: "If it rains, the ground gets wet. The ground is wet. So it rained.", a: "FALSE" },
  { q: "All squares are rectangles. This is a square. So it is a rectangle.", a: "TRUE" },
];

const genBooleanRiddle = (): QuizQ => {
  const r = pick(RIDDLES);
  return { prompt: r.q, hint: "🧩 Valid logic only — guessing doesn't count!", options: ["TRUE", "FALSE"], answer: r.a };
};

const ARROWS = ["⬆️", "➡️", "⬇️", "⬅️"];

const genFlowRouting = (): QuizQ => {
  const start = ri(0, 3);
  const steps = ri(4, 7);
  const seq: string[] = [];
  for (let i = 0; i < steps; i++) seq.push(ARROWS[(start + i) % 4]);
  const ans = ARROWS[(start + steps) % 4];
  return {
    prompt: `Route repeats ${seq.join(" ")} — next move?`,
    hint: "🔁 The cycle loops every 4.",
    options: shuffle([...ARROWS]),
    answer: ans,
  };
};

/* ---------------- Category tree ---------------- */

export const DUEL_CATEGORIES: DuelCategory[] = [
  {
    id: "math",
    name: "MATH",
    tagline: "Numbers at lightning speed",
    icon: "➗",
    accent: "#FFD600",
    dimAccent: "rgba(255,214,0,0.14)",
    subs: [
      { id: "speed", name: "Speed Arithmetic", desc: "5 rapid +/− sprints", icon: "⚡", kind: "quiz", gen: genSpeedArithmetic },
      { id: "mental", name: "Mental Math", desc: "Multiply in your head", icon: "🧠", kind: "quiz", gen: genMentalMath },
      { id: "algebra", name: "Algebraic Equations", desc: "Solve for x", icon: "⚖️", kind: "quiz", gen: genAlgebra },
      { id: "factorial", name: "Factorials", desc: "n! — watch it explode", icon: "❗", kind: "quiz", gen: genFactorial },
    ],
  },
  {
    id: "memory",
    name: "MEMORY",
    tagline: "See it once, keep it forever",
    icon: "👁️",
    accent: "#38BDF8",
    dimAccent: "rgba(56,189,248,0.14)",
    subs: [
      { id: "pattern", name: "Pattern Recall", desc: "What comes next?", icon: "🔢", kind: "quiz", gen: genPatternRecall },
      { id: "sequence", name: "Sequence Match", desc: "Pick the true finish", icon: "🔍", kind: "quiz", gen: genSequenceMatch },
      { id: "gridflash", name: "Grid Flash", desc: "Catch the lit tiles", icon: "⚡", kind: "interactive" },
      { id: "cardflip", name: "Card Flip", desc: "Match all pairs", icon: "🃏", kind: "interactive" },
    ],
  },
  {
    id: "puzzle",
    name: "PUZZLE",
    tagline: "Daily grids, cages & mazes",
    icon: "🧩",
    accent: "#22C55E",
    dimAccent: "rgba(34,197,94,0.14)",
    subs: [
      { id: "sudoku", name: "Sudoku", desc: "Fill the grid", icon: "🔲", kind: "link", link: "/dailies?game=sudoku" },
      { id: "crossmath", name: "Cross Math", desc: "Crossword sums", icon: "✖️", kind: "link", link: "/dailies?game=cross" },
      { id: "kenken", name: "KenKen", desc: "Caged sums", icon: "📦", kind: "link", link: "/dailies?game=kenken" },
      { id: "mathmaze", name: "Math Maze", desc: "Tap the number path", icon: "🌀", kind: "link", link: "/dailies?game=maze" },
    ],
  },
  {
    id: "logic",
    name: "LOGIC",
    tagline: "Truth, proofs & routes",
    icon: "🧠",
    accent: "#F43F5E",
    dimAccent: "rgba(244,63,94,0.14)",
    subs: [
      { id: "truth", name: "Truth Tables", desc: "AND / OR verdicts", icon: "🔌", kind: "quiz", gen: genTruthTables },
      { id: "deduction", name: "Pattern Deductions", desc: "Crack the rule", icon: "🕵️", kind: "quiz", gen: genDeduction },
      { id: "boolean", name: "Boolean Riddles", desc: "Valid or trap?", icon: "🧩", kind: "quiz", gen: genBooleanRiddle },
      { id: "routing", name: "Flow Routing", desc: "Follow the cycle", icon: "🔁", kind: "quiz", gen: genFlowRouting },
    ],
  },
];
