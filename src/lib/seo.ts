export const SITE_URL = "https://sudocodo.robogyaan.in";
export const SITE_NAME = "sudoCodo";
export const SITE_TAGLINE = "Interactive Coding & Math Games for Kids & Students";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og/og-home.png`; // 1200x630 absolute placeholder — replace with real asset
export const LOGO_URL = `${SITE_URL}/icon.svg`;
export const TWITTER_HANDLE = "@sudocodo";

export type PageSeo = {
  title: string; // 50-60 chars: Primary Keyword / Action - Brand
  description: string; // 140-160 chars
  canonical: string; // absolute
  ogImage?: string;
  keywords?: string[];
};

export const SEO: Record<string, PageSeo> = {
  home: {
    title: "sudoCodo: Interactive Coding & Math Games for Kids",
    description: "Play coding & math games — Duels Arena, Ascenso levels, Daily Sudoku & KenKen, plus 8 block-coding games. Free, no login, saves progress locally.",
    canonical: `${SITE_URL}/`,
    ogImage: `${SITE_URL}/og/og-home.png`,
    keywords: ["coding games for kids", "math games", "blockly games", "codemonkey sequencing", "daily sudoku kids", "math duels"],
  },
  puzzle: {
    title: "Puzzle Coding Game - Learn Block Shapes",
    description: "Learn how coding blocks snap together. 4 puzzle levels teach shape matching & sequencing — perfect intro to block programming for beginners.",
    canonical: `${SITE_URL}/puzzle`,
    ogImage: `${SITE_URL}/og/og-puzzle.png`,
  },
  maze: {
    title: "Maze Coding Game - Loops & Logic Puzzles",
    description: "Solve 10 maze levels with blocks — move, turn, loops & conditionals. Guide the astronaut to the flag. Saves progress offline.",
    canonical: `${SITE_URL}/maze`,
    ogImage: `${SITE_URL}/og/og-maze.png`,
  },
  sequencing: {
    title: "Sequencing Game - Order Code Like CodeMonkey",
    description: "Master sequencing: order blocks to collect bananas. 8 CodeMonkey-style levels with repeat & obstacles. Phone-first, no signup.",
    canonical: `${SITE_URL}/sequencing`,
    ogImage: `${SITE_URL}/og/og-sequencing.png`,
  },
  bird: {
    title: "Bird Coding Game - Conditional Logic Fun",
    description: "Help the bird catch the worm! 10 levels of if/else & loops using block code. Learn conditionals visually on any phone screen.",
    canonical: `${SITE_URL}/bird`,
    ogImage: `${SITE_URL}/og/og-bird.png`,
  },
  turtle: {
    title: "Turtle Draw with Code - Loops & Geometry",
    description: "Draw art with code — turtle graphics, repeat loops & angles. Create squares, stars & spirals. Infinite canvas saves to cache.",
    canonical: `${SITE_URL}/turtle`,
    ogImage: `${SITE_URL}/og/og-turtle.png`,
  },
  movie: {
    title: "Movie Animation Game - Code with Math",
    description: "Animate with math — control x, y & time. Bounce, orbit & wave scenes teach sine, cosine & variables through block formulas.",
    canonical: `${SITE_URL}/movie`,
    ogImage: `${SITE_URL}/og/og-movie.png`,
  },
  music: {
    title: "Music Coding Game - Compose with Blocks",
    description: "Compose music by coding blocks — drag notes C to C2, set tempo & play. Web Audio API, saves songs locally, no install needed.",
    canonical: `${SITE_URL}/music`,
    ogImage: `${SITE_URL}/og/og-music.png`,
  },
  pond: {
    title: "Pond Battle Game - Code Your Duck vs AI",
    description: "Code your duck to battle enemy AI! Scan, fire & swim blocks in the original Pond duel. Smart logic wins — play vs AI instantly.",
    canonical: `${SITE_URL}/pond`,
    ogImage: `${SITE_URL}/og/og-pond.png`,
  },
};

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
