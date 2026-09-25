import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { JsonLd, websiteSchema, organizationSchema } from "@/components/JsonLd";
import { SITE_URL, SITE_NAME, SITE_TAGLINE, LOGO_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Block Coding Games for Kids - Play & Learn | SudoCodo",
    template: "%s | SudoCodo",
  },
  description:
    "Play 8 block-coding games for kids — Puzzle, Maze, Bird, Turtle, Movie, Music, Pond & CodeMonkey sequencing. No login, portrait-first, saves progress locally.",
  keywords: [
    "block coding for kids",
    "blockly games",
    "codemonkey sequencing",
    "learn to code with blocks",
    "maze coding game",
    "turtle coding",
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
    title: "Block Coding Games for Kids - Play & Learn | SudoCodo",
    description:
      "A modern, mobile-first playground with 8 block-coding games. Puzzle, Maze, Bird, Turtle, Movie, Music, Pond & CodeMonkey sequencing — free, offline, no login.",
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
    title: "Block Coding Games for Kids - Play & Learn | SudoCodo",
    description:
      "8 block-coding games for kids — Puzzle, Maze, Bird & CodeMonkey sequencing. Portrait-friendly, saves progress, no login.",
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
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
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
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  colorScheme: "light dark",
};

const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('sudocodo_theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

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
      <body className="min-h-screen bg-[#f8f9ff] text-slate-800 antialiased selection:bg-indigo-100 dark:bg-slate-950 dark:text-slate-100">
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

        <footer className="border-t bg-white/60 backdrop-blur mt-12 dark:bg-slate-900/80 dark:border-slate-800" role="contentinfo">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid gap-6 md:grid-cols-3 text-sm">
              <div>
                <h2 className="font-extrabold text-slate-900 dark:text-white">SudoCodo</h2>
                <p className="mt-1 text-slate-600 dark:text-slate-400">
                  Learn to code with blocks — 8 games, 60+ levels. Inspired by Blockly Games &amp; CodeMonkey Junior. Free, offline, no login.
                </p>
              </div>
              <nav aria-label="Footer navigation">
                <h3 className="font-bold text-slate-900 dark:text-white">Games</h3>
                <ul className="mt-2 space-y-1">
                  <li><a href="/puzzle" className="hover:text-indigo-600 underline-offset-4 hover:underline">Puzzle — Learn block shapes</a></li>
                  <li><a href="/maze" className="hover:text-indigo-600 underline-offset-4 hover:underline">Maze — Loops & logic puzzles</a></li>
                  <li><a href="/sequencing" className="hover:text-indigo-600 underline-offset-4 hover:underline">Sequencing — CodeMonkey style</a></li>
                  <li><a href="/bird" className="hover:text-indigo-600 underline-offset-4 hover:underline">Bird — Conditional logic</a></li>
                  <li><a href="/turtle" className="hover:text-indigo-600 underline-offset-4 hover:underline">Turtle — Draw with code</a></li>
                  <li><a href="/pond" className="hover:text-indigo-600 underline-offset-4 hover:underline">Pond — Code duel vs AI</a></li>
                </ul>
              </nav>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">About</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                  © {new Date().getFullYear()} SudoCodo. Inspired by <a className="underline hover:text-indigo-600" href="https://blockly.games" rel="noopener noreferrer" target="_blank">Blockly Games</a> &amp;{" "}
                  <a className="underline hover:text-indigo-600" href="https://app.codemonkey.com/junior/chapters/sequencing/challenges/1" rel="noopener noreferrer" target="_blank">CodeMonkey</a>. Progress saved in{" "}
                  <code className="px-1 py-0.5 rounded bg-slate-100 border text-[11px]">localStorage</code> — no account needed. <a href="/sitemap.xml" className="underline hover:text-indigo-600">Sitemap</a> ·{" "}
                  <a href="/robots.txt" className="underline hover:text-indigo-600">Robots</a>
                </p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
