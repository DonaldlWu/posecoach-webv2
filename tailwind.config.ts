import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        // Pixel-art redesign breakpoint: desktop Sidebar at >820px
        nav: "821px",
      },
      colors: {
        "px-page": "#d9cfb6",
        "px-cream": "#f4ecd8",
        "px-sand": "#eadfc4",
        "px-grid": "#e8dec5",
        "px-ink": "#2b2340",
        "px-ink-2": "#3a3054",
        "px-ink-3": "#443a60",
        "px-ink-4": "#4a3f63",
        "px-coral": "#ff5a3c",
        "px-yellow": "#ffc93c",
        "px-teal": "#2fa58f",
        "px-muted": "#6a5f7a",
        "px-muted-light": "#c9bfd9",
        "px-dash": "#b9ac8e",
        "px-track": "#e0d5b8",
        "px-active": "#fff4d6",
        "px-bezel": "#c9bfa3",
      },
      fontFamily: {
        dot: ["var(--font-dot)", "monospace"],
        pixelify: ["var(--font-pixelify)", "monospace"],
        vt: ["var(--font-vt)", "monospace"],
      },
      backgroundImage: {
        // 24px pixel grid for light sections (Hero)
        "px-grid":
          "linear-gradient(#e8dec5 2px, transparent 2px), linear-gradient(90deg, #e8dec5 2px, transparent 2px)",
        // 20px pixel grid for dark sections
        "px-grid-dark":
          "linear-gradient(#443a60 2px, transparent 2px), linear-gradient(90deg, #443a60 2px, transparent 2px)",
      },
    },
  },
  plugins: [],
};

export default config;
