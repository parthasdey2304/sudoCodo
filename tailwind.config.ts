import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#5b8def",
          yellow: "#ffd500",
          green: "#5cc15c",
          orange: "#ff8c42",
          purple: "#a78bfa"
        },
        ink: "#0B0E14",
        panel: "#12161F",
        card: "#181D27",
        duel: {
          math: "#FFD600",
          memory: "#38BDF8",
          puzzle: "#22C55E",
          logic: "#F43F5E",
        },
      }
    },
  },
  plugins: [],
};
export default config;
