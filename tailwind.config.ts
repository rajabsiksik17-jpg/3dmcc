import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FFF7F0",
          100: "#FFEDDC",
          200: "#FFD9B3",
          300: "#FFC285",
          400: "#FFA755",
          500: "#F58A2A",
          600: "#E06F14",
          700: "#BC570E",
          800: "#96450F",
          900: "#7A3A10",
          950: "#421B05",
        },
        charcoal: {
          50: "#F6F6F7",
          100: "#E8E8EA",
          200: "#D0D1D5",
          300: "#ADAEB5",
          400: "#84868F",
          500: "#686A74",
          600: "#52545D",
          700: "#43454C",
          800: "#2A2B30",
          900: "#1E1F24",
          950: "#141519",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(20, 21, 25, 0.06)",
        card: "0 1px 2px rgba(20, 21, 25, 0.04), 0 12px 32px rgba(20, 21, 25, 0.06)",
        lift: "0 20px 48px rgba(20, 21, 25, 0.12)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #F58A2A 0%, #E06F14 100%)",
        "charcoal-gradient": "linear-gradient(135deg, #1E1F24 0%, #141519 100%)",
      },
      maxWidth: {
        "8xl": "88rem",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
        shimmer: "shimmer 1.8s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
