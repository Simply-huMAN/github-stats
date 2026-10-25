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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      boxShadow: {
        "glow-bronze": "0 0 25px -5px rgba(180, 83, 9, 0.25)",
        "glow-gold": "0 0 35px -5px rgba(245, 158, 11, 0.35)",
        "glow-mythic": "0 0 45px -5px rgba(99, 102, 241, 0.45), 0 0 20px -5px rgba(236, 72, 153, 0.35)",
      },
      animation: {
        "holographic": "holographic 6s ease infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        holographic: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left top",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right bottom",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
