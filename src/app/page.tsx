import type { Metadata } from "next";
import GameCard from "@/components/GameCard";
import ResetProgress from "@/components/ResetProgress";
import Breadcrumbs from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";
import { SEO, SITE_URL, SITE_NAME } from "@/lib/seo";
import Link from "next/link";

export const metadata: Metadata = {
  title: SEO.home.title,
  description: SEO.home.description,
  keywords: SEO.home.keywords,
  alternates: { canonical: SEO.home.canonical },
  openGraph: {
    title: SEO.home.title,
    description: SEO.home.description,
    url: SEO.home.canonical,
    siteName: SITE_NAME,
    images: [{ url: SEO.home.ogImage!, width: 1200, height: 630, alt: "SudoCodo — Block coding games for kids" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.home.title,
    description: SEO.home.description,
    images: [SEO.home.ogImage!],
  },
};

export default function Home() {
  const breadcrumbData = breadcrumbSchema([{ name: "Home", url: SITE_URL }]);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Block Coding Games for Kids",
    description: SEO.home.description,
    itemListElement: [
      { "@type": "ListItem", position: 1, url: `${SITE_URL}/puzzle`, name: "Puzzle Coding Game — Learn Block Shapes" },
      { "@type": "ListItem", position: 2, url: `${SITE_URL}/maze`, name: "Maze Coding Game — Loops & Logic Puzzles" },
      { "@type": "ListItem", position: 3, url: `${SITE_URL}/sequencing`, name: "Sequencing Game — CodeMonkey-Style Order" },
      { "@type": "ListItem", position: 4, url: `${SITE_URL}/bird`, name: "Bird Game — Conditional Logic" },
      { "@type": "ListItem", position: 5, url: `${SITE_URL}/turtle`, name: "Turtle Draw — Loops & Geometry" },
      { "@type": "ListItem", position: 6, url: `${SITE_URL}/movie`, name: "Movie Animation — Code with Math" },
      { "@type": "ListItem", position: 7, url: `${SITE_URL}/music`, name: "Music Coding — Compose with Blocks" },
      { "@type": "ListItem", position: 8, url: `${SITE_URL}/pond`, name: "Pond Battle — Code Your Duck vs AI" },
    ],
  };

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: SEO.home.title,
    description: SEO.home.description,
    isPartOf: { "@id": `${SITE_URL}#website` },
    about: { "@id": `${SITE_URL}#organization` },
    primaryImageOfPage: { "@type": "ImageObject", contentUrl: SEO.home.ogImage! },
    inLanguage: "en-US",
    breadcrumb: { "@id": `${SITE_URL}#breadcrumb` },
  };

  return (
    <>
      <JsonLd data={[breadcrumbData, itemListSchema, webpageSchema]} />

      {/* Breadcrumbs — semantic nav for Sitelinks, single H1 later */}
      <Breadcrumbs items={[{ name: "Home", href: "/", current: true }]} />

      <main id="main-content">
        {/* HERO — single H1 per page, keyword-optimized */}
        <section className="max-w-6xl mx-auto px-4 pt-4 sm:pt-6" aria-labelledby="hero-heading">
          <div className="rounded-[28px] border bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-[1px]">
            <div className="rounded-[27px] bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-6 sm:p-8 text-white relative overflow-hidden">
              <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
              <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-black/10 blur-2xl" aria-hidden="true" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 text-xs font-extrabold tracking-widest bg-white/15 border border-white/20 rounded-full px-3 py-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" aria-hidden="true" /> OFFLINE • NO LOGIN • AUTOSAVE
                </div>
                <h1 id="hero-heading" className="mt-3 text-3xl sm:text-5xl font-black tracking-tight leading-[0.95]">
                  Learn to code
                  <br />
                  <span className="text-yellow-300">with blocks.</span>
                </h1>
                <p className="mt-3 max-w-2xl text-white/90 text-sm sm:text-base font-medium">
                  A modern, mobile-first playground inspired by <span className="underline decoration-white/40">Blockly Games</span> &amp;{" "}
                  <span className="underline decoration-white/40">CodeMonkey Junior</span>. Portrait-friendly, crisp, and built for phones — progress stays on your device. 8 games • 60+ levels • Free.
                </p>
                <nav aria-label="Primary calls to action" className="mt-5 flex flex-wrap gap-2">
                  <Link
                    href="/maze"
                    className="px-5 py-2.5 rounded-full bg-white text-slate-900 font-extrabold text-sm hover:bg-yellow-300 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    aria-label="Start playing Maze coding game — 10 levels"
                  >
                    Start Playing Maze Game →
                  </Link>
                  <Link
                    href="/sequencing"
                    className="px-5 py-2.5 rounded-full bg-black/15 border border-white/20 backdrop-blur text-white font-bold text-sm hover:bg-black/25 transition"
                    aria-label="Play Sequencing game CodeMonkey style"
                  >
                    Play Sequencing Game — CodeMonkey Style
                  </Link>
                  <span className="hidden sm:inline-flex items-center px-3 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-bold" aria-hidden="true">
                    8 Games • 60+ Levels • Zero Setup
                  </span>
                </nav>
                <div className="mt-6 grid grid-cols-3 gap-2 max-w-md" role="list" aria-label="Key features">
                  <div className="rounded-2xl bg-white/10 border border-white/15 p-3 backdrop-blur" role="listitem">
                    <div className="text-lg" aria-hidden="true">📱</div>
                    <div className="text-xs font-extrabold">Portrait UI</div>
                    <div className="text-[11px] opacity-80">Phone-first layout</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 border border-white/15 p-3 backdrop-blur" role="listitem">
                    <div className="text-lg" aria-hidden="true">💾</div>
                    <div className="text-xs font-extrabold">Autosave</div>
                    <div className="text-[11px] opacity-80">Local cache</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 border border-white/15 p-3 backdrop-blur" role="listitem">
                    <div className="text-lg" aria-hidden="true">⚡</div>
                    <div className="text-xs font-extrabold">Instant Run</div>
                    <div className="text-[11px] opacity-80">No install</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GAME GRID — H2, then H3 per card (no level skipping) */}
        <section className="max-w-6xl mx-auto px-4 mt-6" aria-labelledby="games-heading">
          <header className="flex items-end justify-between">
            <h2 id="games-heading" className="font-black text-slate-900 text-lg sm:text-xl">All Block Coding Games</h2>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-900 text-white">Tap to play</span>
          </header>

          <div className="mt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4" role="list" aria-label="Game list">
            <GameCard
              href="/puzzle"
              title="Puzzle"
              desc="Learn how blocks snap. Match the picture — beginner intro."
              icon="🧩"
              color="bg-violet-500"
              accent="bg-violet-50 border-violet-200"
              level="4 levels"
              badge="START HERE"
            />
            <GameCard
              href="/maze"
              title="Maze"
              desc="Guide the astronaut through mazes. Loops & turns."
              icon="🧭"
              color="bg-sky-500"
              accent="bg-sky-50 border-sky-200"
              level="10 levels"
              badge="POPULAR"
            />
            <GameCard
              href="/sequencing"
              title="Sequencing"
              desc="CodeMonkey-style: order steps to collect bananas."
              icon="🐒"
              color="bg-amber-500"
              accent="bg-amber-50 border-amber-200"
              level="8 levels"
              badge="NEW"
            />
            <GameCard
              href="/bird"
              title="Bird"
              desc="Help the bird catch the worm. Learn if/else."
              icon="🐦"
              color="bg-emerald-500"
              accent="bg-emerald-50 border-emerald-200"
              level="10 levels"
            />
            <GameCard
              href="/turtle"
              title="Turtle"
              desc="Draw art with loops. Geometry & repeat blocks."
              icon="🐢"
              color="bg-teal-500"
              accent="bg-teal-50 border-teal-200"
              level="∞ canvas"
            />
            <GameCard
              href="/movie"
              title="Movie"
              desc="Animate with math: control x, y, and time."
              icon="🎬"
              color="bg-rose-500"
              accent="bg-rose-50 border-rose-200"
              level="4 scenes"
            />
            <GameCard
              href="/music"
              title="Music"
              desc="Compose by coding notes & beats in blocks."
              icon="🎵"
              color="bg-indigo-500"
              accent="bg-indigo-50 border-indigo-200"
              level="Studio"
            />
            <GameCard
              href="/pond"
              title="Pond"
              desc="Code your duck: duel the enemy AI in pond."
              icon="🦆"
              color="bg-cyan-500"
              accent="bg-cyan-50 border-cyan-200"
              level="vs AI"
              badge="BATTLE"
            />
          </div>

          {/* Info strip — H3 cascade, no skipped levels */}
          <aside className="mt-6 rounded-[20px] border bg-white p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between" aria-label="Phone-first info">
            <div>
              <h3 className="font-extrabold text-slate-900">Built for phones first — portrait UI</h3>
              <p className="text-sm text-slate-600 max-w-xl">
                Every game is portrait-optimized: canvas on top, toolbox below, big tap targets, no horizontal scroll. Your level &amp; stars are stored in this browser`s cache. Works offline after first load.
              </p>
            </div>
            <ResetProgress />
          </aside>

          <div className="mt-4 rounded-2xl bg-slate-900 text-white p-4 flex flex-col sm:flex-row gap-3 items-center justify-between" role="note" aria-label="Testimonial">
            <p className="text-sm font-bold">“Just like Blockly Games — but faster, modern, and works offline.”</p>
            <p className="text-xs opacity-70">Tip: Add to Home Screen for full-screen portrait app feel.</p>
          </div>

          {/* SEO text section — adds crawlable copy, avoids CSR-only content */}
          <section className="mt-8 rounded-[20px] border bg-white p-5" aria-labelledby="learn-heading">
            <h2 id="learn-heading" className="font-black text-slate-900">Why SudoCodo for learning to code?</h2>
            <div className="mt-2 grid gap-4 sm:grid-cols-3 text-sm text-slate-600">
              <div>
                <h3 className="font-bold text-slate-900">Block-based, no syntax errors</h3>
                <p className="mt-1">Drag blocks like puzzle pieces — just like Scratch &amp; Blockly. Kids focus on logic, not typos.</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Sequencing → loops → conditionals</h3>
                <p className="mt-1">Progression from Puzzle (order) to Maze (loops) to Bird (if/else) to Pond (AI) mirrors real curricula.</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Portraits &amp; privacy</h3>
                <p className="mt-1">Portrait-first on phones, no account, progress in your browser. Fast, crisp Tailwind UI with zero trackers.</p>
              </div>
            </div>
            <nav aria-label="Explore games" className="mt-4 flex flex-wrap gap-2">
              <Link href="/puzzle" className="text-xs font-bold px-3 py-1.5 rounded-full border bg-slate-50 hover:bg-white">Play Puzzle — beginner</Link>
              <Link href="/maze" className="text-xs font-bold px-3 py-1.5 rounded-full border bg-slate-50 hover:bg-white">Play Maze — 10 levels</Link>
              <Link href="/sequencing" className="text-xs font-bold px-3 py-1.5 rounded-full border bg-slate-50 hover:bg-white">Play Sequencing — CodeMonkey style</Link>
              <Link href="/pond" className="text-xs font-bold px-3 py-1.5 rounded-full border bg-slate-50 hover:bg-white">Play Pond — battle AI</Link>
            </nav>
          </section>
        </section>
      </main>
    </>
  );
}
