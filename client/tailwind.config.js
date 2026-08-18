/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#070b12",
          900: "#0a111c",
          850: "#0d1623",
          800: "#111c2c",
          700: "#1a2740",
          600: "#27395b",
          500: "#3a5283",
        },
        accent: {
          50: "#e6fbff",
          100: "#c5f3fb",
          200: "#8fe6f5",
          300: "#54d6ec",
          400: "#22bfe0",
          500: "#0aa3c8",
          600: "#0a83a3",
          700: "#0c6884",
          800: "#0f526a",
          900: "#113e51",
        },
        gold: {
          400: "#f6d36b",
          500: "#e6b94a",
          600: "#c8962e",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Sora", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 0 rgba(255,255,255,0.04) inset, 0 10px 30px -12px rgba(0,0,0,0.6)",
        glow: "0 0 0 1px rgba(34,191,224,0.25), 0 0 24px -6px rgba(34,191,224,0.35)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
      backgroundSize: { "grid-faint": "44px 44px" },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out both",
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [],
};
