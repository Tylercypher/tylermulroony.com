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
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          secondary: "var(--accent-secondary)",
          glow: "var(--accent-glow)",
        },
        border: {
          DEFAULT: "var(--border-color)",
        },
        card: {
          DEFAULT: "var(--card-bg)",
        },
      },
      animation: {
        "glitch": "glitch 2s infinite",
        "glitch-2": "glitch-2 2s infinite",
        "scan": "scan 8s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "border-run": "border-run 2s linear infinite",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
        "typing": "typing 3.5s steps(40, end)",
        "blink": "blink 1s step-end infinite",
      },
      keyframes: {
        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
        },
        "glitch-2": {
          "0%, 100%": { transform: "translate(0)", opacity: "0.8" },
          "20%": { transform: "translate(2px, -2px)", opacity: "0.6" },
          "40%": { transform: "translate(2px, 2px)", opacity: "0.8" },
          "60%": { transform: "translate(-2px, -2px)", opacity: "0.6" },
          "80%": { transform: "translate(-2px, 2px)", opacity: "0.8" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.6" },
        },
        "border-run": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        typing: {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        blink: {
          "0%, 100%": { borderColor: "transparent" },
          "50%": { borderColor: "var(--accent)" },
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundSize: {
        "300%": "300% 300%",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
