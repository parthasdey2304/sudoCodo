import type { Config } from "tailwindcss";

const config: Config = {
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
        }
      }
    },
  },
  plugins: [],
};
export default config;
