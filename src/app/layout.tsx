import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { JsonLd, websiteSchema, organizationSchema } from "@/components/JsonLd";
import { SITE_URL, SITE_NAME, SITE_TAGLINE, LOGO_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "sudoCodo: Interactive Coding & Math Games for Kids",
    template: "%s | sudoCodo",
  },
  description:
    "Play coding & math games — Duels Arena, Ascenso levels, Daily Sudoku & KenKen, plus 8 block-coding games. Free, no login, portrait-first, saves progress locally.",
  keywords: [
    "coding games for kids",
    "math games for students",
    "block coding for kids",
    "blockly games",
    "codemonkey sequencing",
    "daily sudoku kids",
    "math duels",
    "kids coding games online",
  ],
  authors: [{ name: "SudoCodo" }],
  creator: "SudoCodo",
  publisher: "SudoCodo",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: {
    canonical: SITE_URL,
    languages: { "en-US": SITE_URL },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "sudoCodo: Interactive Coding & Math Games for Kids",
    description:
      "A modern playground with coding & math games — Duels Arena, Ascenso levels, Daily Challenges plus 8 block-coding games. Free, offline, no login.",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "SudoCodo — Block coding games for kids on phone and desktop",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "sudoCodo: Interactive Coding & Math Games for Kids",
    description:
      "Duels, Ascenso levels, Daily Sudoku & 8 block-coding games. Portrait-friendly, saves progress, no login.",
    images: [DEFAULT_OG_IMAGE],
    creator: "@sudocodo",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml", sizes: "512x512" },
    ],
    apple: [{ url: "/icon.svg", type: "image/svg+xml", sizes: "any" }],
    shortcut: "/favicon.svg",
  },
  manifest: "/manifest.webmanifest",
  category: "education",
  verification: {
    // google: "REPLACE_WITH_SEARCH_CONSOLE_TOKEN",
    // yandex: "REPLACE",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6366f1" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0E14" },
  ],
  colorScheme: "dark light",
};

const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('sudocodo_theme');var d=t?t==='dark':true;if(d)document.documentElement.classList.add('dark');}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Explicit charset is handled by Next.js but declared for audit completeness */}
        <meta charSet="utf-8" />
        {/* Preconnect for performance (Core Web Vitals) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        {/* Theme init — avoids light flash, persisted in localStorage */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-[#f8f9ff] text-slate-800 antialiased selection:bg-indigo-100 dark:bg-[#0B0E14] dark:text-slate-100 transition-colors duration-300">
        {/* Structured Data: WebSite + Organization — enables Sitelinks Searchbox */}
        <JsonLd
          data={[
            websiteSchema(SITE_URL, SITE_NAME, SITE_TAGLINE, LOGO_URL),
            organizationSchema(SITE_URL, SITE_NAME, LOGO_URL),
          ]}
        />
        {/* Skip to content for a11y + crawl */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-3 focus:py-2 focus:rounded-lg focus:bg-slate-900 focus:text-white"
        >
          Skip to content
        </a>

        <Header />

        {/* BreadcrumbList is injected per-page; layout only provides global schemas */}

        <div id="main-content">{children}</div>

        <footer className="mt-12 border-t border-slate-200 bg-white/70 backdrop-blur dark:bg-slate-950 dark:border-slate-800" role="contentinfo">
          <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Brand banner */}
            <div className="rounded-[20px] bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-5 sm:p-6 text-white flex flex-col sm:flex-row sm:items-center gap-4 justify-between overflow-hidden relative">
              <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
              <div className="relative flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white text-indigo-700 grid place-items-center font-black text-lg shadow" aria-hidden="true">S</div>
                <div>
                  <p className="font-black text-lg leading-tight">SudoCodo</p>
                  <p className="text-xs text-white/80 font-semibold">Learn to code with blocks — 8 games, 60+ levels 🎮</p>
                </div>
              </div>
              <div className="relative flex flex-wrap gap-2">
                <a href="/maze" className="px-4 py-2 rounded-full bg-white text-slate-900 text-xs font-black hover:bg-yellow-300 transition">Start Playing →</a>
                <a href="/sequencing" className="px-4 py-2 rounded-full bg-white/15 border border-white/25 text-white text-xs font-bold hover:bg-white/25 transition">CodeMonkey Style 🐒</a>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-[1.1fr_1.3fr_1fr] text-sm">
              {/* About brand */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:bg-slate-900 dark:border-slate-800">
                <h2 className="font-extrabold text-slate-900 dark:text-white">SudoCodo</h2>
                <p className="mt-1 text-slate-600 dark:text-slate-400 text-[13px] leading-relaxed">
                  Free, offline, no login. Inspired by <a className="underline underline-offset-4 hover:text-indigo-600 dark:hover:text-indigo-400" href="https://blockly.games" rel="noopener noreferrer" target="_blank">Blockly Games</a> &amp;{" "}
                  <a className="underline underline-offset-4 hover:text-indigo-600 dark:hover:text-indigo-400" href="https://app.codemonkey.com/junior/chapters/sequencing/challenges/1" rel="noopener noreferrer" target="_blank">CodeMonkey Junior</a>.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">♾️ Unlimited</span>
                  <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">💡 Hints</span>
                  <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800">🌙 Dark mode</span>
                </div>
              </div>

              {/* Games nav — pill grid, portrait-friendly */}
              <nav aria-label="Footer navigation" className="rounded-2xl border border-slate-200 bg-white p-4 dark:bg-slate-900 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs tracking-widest">ARENA & GAMES 🎮</h3>
                <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  <li><a href="/duels" className="block px-3 py-1.5 rounded-xl bg-yellow-100 border border-yellow-300 text-[13px] font-semibold hover:opacity-90 transition text-slate-800 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-200">⚔️ Duels Arena</a></li>
                  <li><a href="/ascenso" className="block px-3 py-1.5 rounded-xl bg-violet-100 border border-violet-300 text-[13px] font-semibold hover:opacity-90 transition text-slate-800 dark:bg-violet-950 dark:border-violet-800 dark:text-violet-200">🗺️ Ascenso Ruta</a></li>
                  <li><a href="/dailies" className="block px-3 py-1.5 rounded-xl bg-amber-100 border border-amber-300 text-[13px] font-semibold hover:opacity-90 transition text-slate-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200">📅 Daily Challenges</a></li>
                  <li><a href="/puzzle" className="block px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-semibold hover:bg-white hover:border-indigo-300 hover:text-indigo-700 transition dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-500">🧩 Puzzle — block shapes</a></li>
                  <li><a href="/maze" className="block px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-semibold hover:bg-white hover:border-indigo-300 hover:text-indigo-700 transition dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-500">🧭 Maze — loops & puzzles</a></li>
                  <li><a href="/sequencing" className="block px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-semibold hover:bg-white hover:border-indigo-300 hover:text-indigo-700 transition dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-500">🐒 Sequencing — CodeMonkey</a></li>
                  <li><a href="/bird" className="block px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-semibold hover:bg-white hover:border-indigo-300 hover:text-indigo-700 transition dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-500">🐦 Bird — conditionals</a></li>
                  <li><a href="/turtle" className="block px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-semibold hover:bg-white hover:border-indigo-300 hover:text-indigo-700 transition dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-500">🐢 Turtle — draw code</a></li>
                  <li><a href="/pond" className="block px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-semibold hover:bg-white hover:border-indigo-300 hover:text-indigo-700 transition dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-500">🦆 Pond — duel vs AI</a></li>
                  <li><a href="/movie" className="block px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-semibold hover:bg-white hover:border-indigo-300 hover:text-indigo-700 transition dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-500">🎬 Movie — math anim</a></li>
                  <li><a href="/monkey-code" className="block px-3 py-1.5 rounded-xl bg-lime-50 border border-lime-300 text-[13px] font-semibold hover:bg-white hover:border-lime-400 hover:text-lime-700 transition dark:bg-lime-950 dark:border-lime-800 dark:text-lime-200">🐒 Monkey Jr. — blocks→Python</a></li>
                  <li><a href="/music" className="block px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-semibold hover:bg-white hover:border-indigo-300 hover:text-indigo-700 transition dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-500">🎵 Music — compose</a></li>
                </ul>
              </nav>

              {/* Privacy / tech */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:bg-slate-900 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs tracking-widest">PRIVATE BY DESIGN 🔒</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                  Progress saved in <code className="px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-mono dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">localStorage</code> — no account needed, works offline.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <a href="/sitemap.xml" className="text-[11px] font-bold px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-white transition dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">Sitemap</a>
                  <a href="/robots.txt" className="text-[11px] font-bold px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-white transition dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">Robots</a>
                  <a href="/" className="text-[11px] font-bold px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-white transition dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">Home</a>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
              <p className="font-semibold">© {new Date().getFullYear()} SudoCodo — made for kids 💛</p>
              <p className="font-medium">Portrait-first 📱 • Works offline • No login</p>
            </div>

            {/* Giant outlined wordmark */}
            <div className="mt-6 overflow-hidden" aria-hidden="true">
              <p className="text-center font-black tracking-tight leading-none text-[19vw] md:text-[9rem] text-transparent [-webkit-text-stroke:2px_rgba(100,116,139,0.55)] dark:[-webkit-text-stroke:2px_rgba(148,163,184,0.45)] select-none">
                SUDO CODO
              </p>
            </div>
          </div>
        </footer>

        {/* Bottom tab bar (mobile) + spacer so content never hides behind it */}
        <div className="h-[64px] md:hidden" aria-hidden="true" />
        <BottomNav />
      </body>
    </html>
  );
}
