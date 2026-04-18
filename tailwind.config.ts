import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "pc-bg": "#080e1a",
        "pc-card": "#0f172a",
        "pc-border": "#1e293b",
        "pc-green": "#22c55e",
        "pc-orange": "#f59e0b",
        "pc-blue": "#60a5fa",
        "pc-text-muted": "#64748b",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(160deg, #1a0533 0%, #0f2b5e 50%, #0a1a3a 100%)",
        "cta-gradient":
          "linear-gradient(160deg, #0a1a3a 0%, #1a0533 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
