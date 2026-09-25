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

const MASCOTS = [
  { href: "/puzzle", icon: "🧩", label: "Puzzle" },
  { href: "/maze", icon: "🧭", label: "Maze" },
  { href: "/sequencing", icon: "🐒", label: "Monkey" },
  { href: "/bird", icon: "🐦", label: "Bird" },
  { href: "/turtle", icon: "🐢", label: "Turtle" },
  { href: "/movie", icon: "🎬", label: "Movie" },
  { href: "/music", icon: "🎵", label: "Music" },
  { href: "/pond", icon: "🦆", label: "Pond" },
];

const ROADMAP = [
  { icon: "🧩", step: "1", title: "Snap", sub: "Puzzle shapes" },
  { icon: "🧭", step: "2", title: "Move", sub: "Maze + loops" },
  { icon: "🐦", step: "3", title: "Think", sub: "Bird if/else" },
  { icon: "🦆", step: "4", title: "Battle", sub: "Pond vs AI" },
];

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
        {/* HERO — tall, visual, single H1 */}
        <section className="max-w-6xl mx-auto px-4 pt-4 sm:pt-6" aria-labelledby="hero-heading">
          <div className="rounded-[28px] border border-indigo-200 dark:border-indigo-900 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-[1px]">
            <div className="rounded-[27px] bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-6 sm:p-10 text-white relative overflow-hidden min-h-[540px] sm:min-h-[560px] flex flex-col justify-center">
              {/* floating illustrations */}
              <div className="absolute right-4 top-6 text-5xl sm:text-7xl animate-bounce" aria-hidden="true">🐒</div>
              <div className="absolute right-16 sm:right-28 bottom-24 text-4xl sm:text-6xl" aria-hidden="true">🍌</div>
              <div className="absolute left-1/2 top-10 text-3xl sm:text-5xl opacity-80" aria-hidden="true">🧩</div>
              <div className="absolute left-6 bottom-10 text-4xl sm:text-5xl opacity-70" aria-hidden="true">🐢</div>
              <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
              <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-black/10 blur-2xl" aria-hidden="true" />
              <div className="relative max-w-xl">
                <div className="inline-flex items-center gap-2 text-xs font-extrabold tracking-widest bg-white/15 border border-white/20 rounded-full px-3 py-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" aria-hidden="true" /> OFFLINE • NO LOGIN • AUTOSAVE
                </div>
                <h1 id="hero-heading" className="mt-3 text-4xl sm:text-6xl font-black tracking-tight leading-[0.95]">
                  Learn to code
                  <br />
                  <span className="text-yellow-300">with blocks. 🧱</span>
                </h1>
                <p className="mt-3 max-w-xl text-white/90 text-sm sm:text-base font-medium">
                  8 games • 60+ levels • Free forever. Tap blocks, run, play! 🐒🍌
                </p>
                <nav aria-label="Primary calls to action" className="mt-5 flex flex-wrap gap-2">
                  <Link
                    href="/maze"
                    className="px-6 py-3 rounded-full bg-white text-slate-900 font-extrabold text-sm hover:bg-yellow-300 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white shadow-lg"
                    aria-label="Start playing Maze coding game — 10 levels"
                  >
                    ▶ Start Playing →
                  </Link>
                  <Link
                    href="/sequencing"
                    className="px-6 py-3 rounded-full bg-black/15 border border-white/20 backdrop-blur text-white font-bold text-sm hover:bg-black/25 transition"
                    aria-label="Play Sequencing game CodeMonkey style"
                  >
                    🐒 Monkey Game
                  </Link>
                </nav>
                {/* visual stat tiles */}
                <div className="mt-6 grid grid-cols-4 gap-2 max-w-lg" role="list" aria-label="Stats">
                  <div className="rounded-2xl bg-white/10 border border-white/15 p-3 backdrop-blur text-center" role="listitem">
                    <div className="text-2xl font-black">8</div>
                    <div className="text-[11px] font-bold opacity-80">🎮 games</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 border border-white/15 p-3 backdrop-blur text-center" role="listitem">
                    <div className="text-2xl font-black">60+</div>
                    <div className="text-[11px] font-bold opacity-80">🏆 levels</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 border border-white/15 p-3 backdrop-blur text-center" role="listitem">
                    <div className="text-2xl font-black">0</div>
                    <div className="text-[11px] font-bold opacity-80">🔒 logins</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 border border-white/15 p-3 backdrop-blur text-center" role="listitem">
                    <div className="text-2xl font-black">♾️</div>
                    <div className="text-[11px] font-bold opacity-80">blocks</div>
                  </div>
                </div>
              </div>
              {/* mascot parade */}
              <div className="relative mt-8 flex gap-2 overflow-x-auto scrollbar-none pb-1" role="list" aria-label="Meet the characters">
                {MASCOTS.map((m) => (
                  <Link
                    key={m.href}
                    href={m.href}
                    aria-label={`Play ${m.label} game`}
                    className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 border border-white/20 backdrop-blur grid place-items-center hover:bg-white/30 hover:scale-105 transition"
                  >
                    <span className="text-center">
                      <span className="block text-2xl sm:text-3xl" aria-hidden="true">{m.icon}</span>
                      <span className="block text-[10px] font-bold mt-0.5">{m.label}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ADVENTURE ROADMAP — visual, minimal text */}
        <section className="max-w-6xl mx-auto px-4 mt-6" aria-labelledby="roadmap-heading">
          <h2 id="roadmap-heading" className="font-black text-slate-900 dark:text-white text-lg sm:text-xl text-center">🗺️ Your coding adventure</h2>
          <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-4">
            {ROADMAP.map((r) => (
              <div key={r.step} className="rounded-[20px] border bg-white p-3 sm:p-5 text-center dark:bg-slate-900 dark:border-slate-700 hover:shadow-lg hover:-translate-y-0.5 transition">
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-950 dark:to-violet-950 border border-indigo-200 dark:border-indigo-800 grid place-items-center text-2xl sm:text-4xl" aria-hidden="true">{r.icon}</div>
                <div className="mt-2 text-[10px] font-black tracking-widest text-indigo-600 dark:text-indigo-400">STEP {r.step}</div>
                <div className="font-black text-slate-900 dark:text-white text-sm sm:text-base">{r.title}</div>
                <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold">{r.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* GAME GRID — H2, then H3 per card (no level skipping) */}
        <section className="max-w-6xl mx-auto px-4 mt-8" aria-labelledby="games-heading">
          <header className="flex items-end justify-between">
            <h2 id="games-heading" className="font-black text-slate-900 dark:text-white text-lg sm:text-xl">🎮 All Block Coding Games</h2>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900">Tap to play</span>
          </header>

          <div className="mt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4" role="list" aria-label="Game list">
            <GameCard
              href="/puzzle"
              title="Puzzle"
              desc="Snap blocks together 🧩"
              icon="🧩"
              color="bg-violet-500"
              accent="bg-violet-50 border-violet-200"
              level="4 levels"
              badge="START HERE"
            />
            <GameCard
              href="/maze"
              title="Maze"
              desc="Escape the maze 🧭"
              icon="🧭"
              color="bg-sky-500"
              accent="bg-sky-50 border-sky-200"
              level="10 levels"
              badge="POPULAR"
            />
            <GameCard
              href="/sequencing"
              title="Sequencing"
              desc="Help monkey grab 🍌"
              icon="🐒"
              color="bg-amber-500"
              accent="bg-amber-50 border-amber-200"
              level="8 levels"
              badge="NEW"
            />
            <GameCard
              href="/bird"
              title="Bird"
              desc="Catch the worm 🪱"
              icon="🐦"
              color="bg-emerald-500"
              accent="bg-emerald-50 border-emerald-200"
              level="10 levels"
            />
            <GameCard
              href="/turtle"
              title="Turtle"
              desc="Draw art 🎨"
              icon="🐢"
              color="bg-teal-500"
              accent="bg-teal-50 border-teal-200"
              level="∞ canvas"
            />
            <GameCard
              href="/movie"
              title="Movie"
              desc="Animate 🎬"
              icon="🎬"
              color="bg-rose-500"
              accent="bg-rose-50 border-rose-200"
              level="4 scenes"
            />
            <GameCard
              href="/music"
              title="Music"
              desc="Make tunes 🎵"
              icon="🎵"
              color="bg-indigo-500"
              accent="bg-indigo-50 border-indigo-200"
              level="Studio"
            />
            <GameCard
              href="/pond"
              title="Pond"
              desc="Duck battle ⚔️"
              icon="🦆"
              color="bg-cyan-500"
              accent="bg-cyan-50 border-cyan-200"
              level="vs AI"
              badge="BATTLE"
            />
          </div>

          {/* Kid-power strip — visual tiles, one-liners */}
          <aside className="mt-6 rounded-[20px] border bg-white p-4 sm:p-5 dark:bg-slate-900 dark:border-slate-700" aria-label="Why kids love it">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white">🌟 Made for kids</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">♾️ Unlimited</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">💡 Hints</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800">✨ Magic Solve</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800">🌙 Dark mode</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800">📱 Phone-first</span>
                </div>
              </div>
              <ResetProgress />
            </div>
          </aside>

          <div className="mt-4 rounded-2xl bg-slate-900 text-white p-4 flex flex-col sm:flex-row gap-3 items-center justify-between dark:bg-slate-800 dark:border dark:border-slate-700" role="note" aria-label="Testimonial">
            <p className="text-sm font-bold">“Just like Blockly Games — but faster, modern, and works offline.” 🚀</p>
            <p className="text-xs opacity-70">Tip: Add to Home Screen 📲</p>
          </div>

          {/* SEO text — short, visual */}
          <section className="mt-8 rounded-[20px] border bg-white p-5 dark:bg-slate-900 dark:border-slate-700" aria-labelledby="learn-heading">
            <h2 id="learn-heading" className="font-black text-slate-900 dark:text-white">❓ How does it work?</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3 text-center">
              <div className="rounded-2xl bg-slate-50 border p-4 dark:bg-slate-800 dark:border-slate-700">
                <div className="text-3xl" aria-hidden="true">👆</div>
                <h3 className="mt-1 font-bold text-slate-900 dark:text-white text-sm">1. Tap blocks</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">No typing, no errors</p>
              </div>
              <div className="rounded-2xl bg-slate-50 border p-4 dark:bg-slate-800 dark:border-slate-700">
                <div className="text-3xl" aria-hidden="true">▶️</div>
                <h3 className="mt-1 font-bold text-slate-900 dark:text-white text-sm">2. Press Run</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Watch it move!</p>
              </div>
              <div className="rounded-2xl bg-slate-50 border p-4 dark:bg-slate-800 dark:border-slate-700">
                <div className="text-3xl" aria-hidden="true">🏆</div>
                <h3 className="mt-1 font-bold text-slate-900 dark:text-white text-sm">3. Collect stars</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Saved on device</p>
              </div>
            </div>
            <nav aria-label="Explore games" className="mt-4 flex flex-wrap gap-2 justify-center">
              <Link href="/puzzle" className="text-xs font-bold px-3 py-1.5 rounded-full border bg-slate-50 hover:bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">🧩 Puzzle</Link>
              <Link href="/maze" className="text-xs font-bold px-3 py-1.5 rounded-full border bg-slate-50 hover:bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">🧭 Maze</Link>
              <Link href="/sequencing" className="text-xs font-bold px-3 py-1.5 rounded-full border bg-slate-50 hover:bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">🐒 Sequencing</Link>
              <Link href="/pond" className="text-xs font-bold px-3 py-1.5 rounded-full border bg-slate-50 hover:bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">🦆 Pond</Link>
            </nav>
          </section>
        </section>
      </main>
    </>
  );
}
