import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "SudoCodo — Learn to Code with Blocks",
  description: "Playful block-based coding games inspired by Blockly Games & CodeMonkey. Puzzle, Maze, Bird, Turtle, Movie, Music, Pond & Sequencing — all in one modern web app.",
  manifest: "/manifest.json",
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#6366f1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f8f9ff] text-slate-800 antialiased selection:bg-indigo-100">
        <Header />
        {children}
        <footer className="border-t bg-white/60 backdrop-blur mt-12">
          <div className="max-w-6xl mx-auto px-4 py-6 text-center text-xs text-slate-500">
            <p>© {new Date().getFullYear()} SudoCodo — Inspired by <a className="underline" href="https://blockly.games" target="_blank">Blockly Games</a> & <a className="underline" href="https://app.codemonkey.com" target="_blank">CodeMonkey</a>. Built for learning. No login required — progress saved locally.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
