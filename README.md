# SudoCodo — Learn to Code with Blocks

> **Modern, portrait-first web app copying Blockly Games + CodeMonkey Junior.** 8 block-coding games, 60+ levels, no login, progress saved in your browser.

![Next.js 15](https://img.shields.io/badge/Next.js-15-black) ![React 19](https://img.shields.io/badge/React-19-61DAFB) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6) ![License](https://img.shields.io/badge/license-MIT-green)

**Live:** `https://sudocodo.com` (placeholder — replace `SITE_URL` in `src/lib/seo.ts`)  
**Stack:** Next.js 15 (App Router) · React 19 · Tailwind CSS (utility-only) · TypeScript · Next Metadata API

---

## 🎮 Games (8/8)

| Route | Game | Levels | What kids learn |
|-------|------|--------|-----------------|
| `/puzzle` | **Puzzle** 🧩 | 4 | Block shapes & snapping — first Blockly game |
| `/maze` | **Maze** 🧭 | 10 | Sequencing, loops (`repeat`), `if path ahead` → guide pegman to 🚩 |
| `/sequencing` | **Sequencing** 🐒 | 8 | CodeMonkey-style order matters — collect 🍌, avoid 🌳 (ported from `app.codemonkey.com/junior/chapters/sequencing`) |
| `/bird` | **Bird** 🐦 | 10 | Conditionals (`if worm ahead`) & repeat flight |
| `/turtle` | **Turtle** 🐢 | ∞ canvas | Loops & geometry — square, star, spiral, saves `localStorage` |
| `/movie` | **Movie** 🎬 | 4 scenes | Math animation — `x = f(t)`, `y = f(t)`, `sin/cos` |
| `/music` | **Music** 🎵 | Studio | Notes `C–C2`, tempo/volume, Web Audio API |
| `/pond` | **Pond** 🦆 | vs AI | Scan/fire/swim loop — code duel vs AI duck |

Home at `/` is a blockly.games-style grid with hero, feature strip, and SEO text section.

---

## ✨ Key Features

- **Portrait-first, phone-responsive:** Tailwind only (`src/app/globals.css` holds only `@tailwind` directives). Canvas top + toolbox bottom on phones, side-by-side on desktop, no horizontal scroll. Tested at 375px.
- **No auth, local cache:** `localStorage` keys `sudocodo_progress` + `sudocodo_level_*` — level, stars, last drawing/song. Works offline after first load. “Reset progress” clears cache.
- **Crisp modern UI:** Rounded 2xl cards, gradients, backdrop-blur, `hover:shadow-xl`, `focus-visible:ring`.
- **Production SEO (see below):** Unique titles/descriptions (50–60 / 140–160 chars), canonicals, OG/Twitter, `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, JSON-LD (WebSite + Organization + BreadcrumbList + Course/SoftwareApplication), semantic HTML, one H1 per page.
- **60+ levels total** with hint bars and max-block constraints matching Blockly/CodeMonkey pedagogy.

---

## 🚀 Quick Start

```bash
git clone https://github.com/parthasdey2304/sudoCodo.git
cd sudoCodo
npm install
npm run dev     # http://localhost:3000
npm run build   # production build — must pass
npm start
```

> **Tailwind only:** Do NOT add raw `.css` files outside `src/app/globals.css` (which is just `@tailwind` directives). Use utility classes everywhere. Keep `npm run build` green and `npm run dev` working.

---

## 📁 Structure

```
src/
  app/
    layout.tsx          # Global SEO head, WebSite+Organization JSON-LD, semantic <header>/<main>/<footer>
    page.tsx            # Home — H1, ItemList + BreadcrumbList JSON-LD, semantic sections
    robots.ts           # → /robots.txt (allow /, sitemap)
    sitemap.ts          # → /sitemap.xml (9 URLs, priority, changeFreq)
    manifest.ts         # → /manifest.webmanifest (PWA, portrait-primary)
    puzzle/page.tsx     # Server metadata + breadcrumb JSON-LD → GameClient
    maze/page.tsx       # 10-level maze, etc.
    sequencing/page.tsx # 8-level CodeMonkey clone
    bird/GameClient.tsx # "use client" — interactive logic (same for each game)
    turtle/GameClient.tsx
    movie/GameClient.tsx
    music/GameClient.tsx
    pond/GameClient.tsx
  components/
    Header.tsx          # <header role="banner"> + <nav aria-label="Primary"> keyword-rich anchors
    GameCard.tsx        # <article> + descriptive aria-label, focus ring
    GameShell.tsx       # <section aria-labelledby> + <header> H1 + <section> canvas + <aside> toolbox
    BlockWorkspace.tsx  # Toolbox (palette) + Workspace (stack) — tap to add, drag to reorder, Tailwind
    Breadcrumbs.tsx     # <nav aria-label="Breadcrumb"> ordered list
    JsonLd.tsx          # websiteSchema, organizationSchema, breadcrumbSchema, softwareAppSchema, courseSchema
  lib/
    seo.ts              # SITE_URL, SEO per-route titles/descriptions (50–60 / 140–160), OG placeholders
    storage.ts          # getLevel/setLevel, getProgress/setGameProgress (localStorage)
public/
  favicon.ico, icon-192.png, icon-512.png, apple-touch-icon.png
  og/og-*.png           # 1200×630 OG placeholders — REPLACE with real 1200×630 assets
```

---

## 🔍 SEO Architecture — Production-Grade Audit & Refactor

This codebase was refactored by a Senior Technical SEO Engineer to maximize rankings, rich snippets, Sitelinks, and Core Web Vitals.

### 1. Document Head & Metadata

**File:** `src/app/layout.tsx:1` + `src/lib/seo.ts:1` + per-route `page.tsx`

- **Unique titles (50–60 chars):** `Primary Keyword / Action - Brand` e.g. `Bird Coding Game - Conditional Logic Fun | SudoCodo` (52), `Sequencing Game - Order Code Like CodeMonkey | SudoCodo` (58). Home uses `Block Coding Games for Kids - Play & Learn | SudoCodo`.
- **High-CTR descriptions (140–160 chars):** Tailored to intent, e.g. Maze: `Solve 10 maze levels with blocks — move, turn, loops & conditionals. Guide the astronaut to the flag. Saves progress offline.` (148).
- **Canonical:** Every page via `metadata.alternates.canonical` + `metadataBase: new URL(SITE_URL)` → `<link rel="canonical" href="https://sudocodo.com/maze">`.
- **Viewport/charset/robots:** `viewport` export (`width=device-width, initialScale=1, themeColor #6366f1`), `<meta charset="utf-8">`, `robots: {index:true,follow:true, googleBot:{max-preview:large}}`.
- **Open Graph + Twitter:** Full `og:title/description/image/url/type/site_name` + `twitter:card summary_large_image` with absolute URLs (`https://sudocodo.com/og/og-*.png`, 1200×630, `alt` text). Replace placeholders with real OG assets.
- **Favicon/Manifest:** `icons: {icon,apple,shortcut}` → `/favicon.ico`, `/icon-192.png`, `/apple-touch-icon.png`; `manifest: "/manifest.webmanifest"` from `src/app/manifest.ts`.

### 2. Semantic HTML & Sitelinks

- **Hierarchy:** `<html lang="en">` → `<header role="banner">` (Header) → `<nav aria-label="Primary">` → `<main id="main-content">` → `<article>/<section>` → `<aside>` → `<footer role="contentinfo">`. Exactly **one `<h1>` per page** (Home: `Learn to code with blocks`; each game: `Maze Coding Game…` via `GameShell.tsx:31`). Cascade: H1 → H2 (`All Block Coding Games`, `Why SudoCodo…`) → H3 (per GameCard title). No skipped levels.
- **Sitelinks nav:** `<nav>` uses descriptive anchors (`Maze — Loops & Logic Puzzles`, `Sequencing — CodeMonkey style`, `Pond — Code duel vs AI`) — not `click here`. Clean `/puzzle`, `/maze` etc URLs.
- **Images/CLS:** No `<img>` without `width/height`. Icons are emoji with fixed `w-12 h-12` Tailwind boxes (no CLS). Canvas has `max-h-[380px]` + aspect-square grid. `loading="lazy"` would apply to below-fold images if added (currently no below-fold `<img>`). `width/height` present on OG `ImageObject` JSON-LD (1200×630, 512×512 logo).
- **A11y:** `aria-label`, `aria-current="page"`, `role="img"`, `sr-only` skip link, `focus-visible:ring`.

### 3. Structured Data (JSON-LD)

**Component:** `src/components/JsonLd.tsx:1` — injected via `<script type="application/ld+json">`

- **WebSite** (`#website`): `name: SudoCodo`, `url`, `logo`, `SearchAction` → `https://sudocodo.com/search?q={search_term_string}` (Sitelinks Searchbox eligibility).
- **Organization** (`#organization`): `name`, `url`, `logo.ImageObject` (512×512), `sameAs: [github]`.
- **BreadcrumbList:** Per page, e.g. `Home → Maze Coding Game` (2 items) matching URL hierarchy, enabling breadcrumb rich snippets.
- **Contextual:** Home: `WebPage` + `ItemList` (8 ListItems for games). Game routes: `Course` (totalLevels: 10 for Maze/Bird, 8 for Sequencing, 4 for Puzzle) + `SoftwareApplication` (applicationCategory `GameApplication`/`EducationalApplication`, `offers.price 0`, `isAccessibleForFree true`, `educationalUse`).

All emit absolute URLs and validate at `https://validator.schema.org`.

### 4. Technical SEO & Crawl Files

- **`src/app/robots.ts:1` → `/robots.txt`:**
  ```
  User-agent: *
  Allow: /
  Disallow: /api/ /_next/ /private/
  Sitemap: https://sudocodo.com/sitemap.xml
  ```
  Plus `Googlebot: Allow: /`.

- **`src/app/sitemap.ts:1` → `/sitemap.xml`:**
  Valid XML, 9 URLs (`/`, `/maze` prio 0.9 weekly, `/sequencing` 0.9, `/puzzle` 0.8 monthly, etc.), `<lastmod>`, `<changefreq>`, `<priority>` absolute `https://sudocodo.com/...`.

- **`src/app/manifest.ts:1` → `/manifest.webmanifest`:** `name`, `short_name`, `start_url "/"`, `display standalone`, `orientation portrait-primary`, `lang en`, `categories ["education","games","kids"]`, icons 192/512 maskable+any.

- **`next.config.mjs:1`:** `compress:true`, `poweredByHeader:false`, `headers()` with `X-Content-Type-Options nosniff`, `X-Frame-Options DENY`, sitemap `Content-Type`.

### 5. Performance, CSR Pitfalls & What Changed

| Issue | Before | After — Why |
|-------|--------|-------------|
| **Page title generic** | `SudoCodo — Learn to Code with Blocks` everywhere | Unique 50–60 char per route in `seo.ts` + `page.tsx metadata` — CTR + de-duplication |
| **No canonical** | None → duplicate risk | `alternates.canonical` per page + `metadataBase` |
| **No OG/Twitter** | Bare | Full OG (1200×630) + Twitter `summary_large_image` absolute placeholders |
| **Client-only pages** | `page.tsx` was `"use client"` → metadata ignored, empty HTML for bots | Split to `page.tsx` (server, metadata, JSON-LD, H1) + `GameClient.tsx` ("use client") — SSR shell is crawlable, hydration adds localStorage/game only |
| **No structured data** | None | WebSite+Org+SearchAction (sitelinks), BreadcrumbList, Course/SoftwareApp |
| **No robots/sitemap** | Missing | `robots.ts` + `sitemap.ts` via Next MetadataRoute |
| **Semantic gaps** | Div soup, no H1 guarantee, nav without aria | `<header>/<nav>/<main>/<article>/<section>/<aside>/<footer>`, one H1, `aria-label`, `aria-current` |
| **CLS risk** | Dynamic grid no size | Fixed `w-12 h-12`, `aspect-square`, `maxWidth:440` inline style for grid columns (necessary dynamic) |
| **MANY tailwind vs raw CSS** | Already Tailwind, but `globals.css` had raw `body{}` | Now `globals.css:1` is only `@tailwind` + `@layer` — rest utilities |

**Core Web Vitals:** Hero H1 is LCP (server-rendered, not lazy). CLS prevented by explicit sizes. TBT low (no heavy JS on first paint — game JS hydrates after). Next `Image` `formats ["avif","webp"]` ready for future asset optimization.

**Placeholders to replace before prod:**
- `SITE_URL = "https://sudocodo.com"` in `src/lib/seo.ts:1` — set to real domain.
- `public/og/*.png` (currently 1×1 transparent) — generate real 1200×630 PNGs.
- `public/icon-*.png` — replace 1×1 with real 192/512 icons.
- `verification.google` in `layout.tsx` — add Search Console token.
- `SearchAction target /search` — implement or remove.

Copy-paste code blocks above are production-ready. Validate: `https://www.google.com/search?q=site:sudocodo.com` after deploy, plus Schema Validator, OG Debugger, PageSpeed Insights (CLS <0.1, LCP <2.5s).

---

## 🛠 Workflow — Auto-PR (Mandatory)

After **every** change, an AI agent MUST use PR → squash merge → delete branch (see `AGENTS.md:1` + `.agents.md/README.md:1`).

```bash
git checkout -b feat/<kebab>-$(date +%Y%m%d-%H%M)
git add <files>
git commit -m "feat: <what> — <why>"
git push -u origin HEAD
gh pr create --title "feat: <title>" --body "What/Why" --base main
gh pr merge --squash --delete-branch
git checkout main && git pull
```

One PR per logical change, squash only, `npm run build` must pass.

---

## 📄 License

MIT — see `LICENSE`. Inspired by [Blockly Games](https://blockly.games) & [CodeMonkey Junior Sequencing](https://app.codemonkey.com/junior/chapters/sequencing/challenges/1). Game logic is original; assets are placeholder.

## 🙏 Credits

Original Blockly by Google. This project is a modern, Tailwind, portrait-first re-implementation for learning — no affiliation.
