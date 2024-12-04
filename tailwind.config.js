/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/adminPages/**/*.{js,ts,jsx,tsx}",
    "./src/userPages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        maroon: "#800000",
        gold: "#FFD700",
      },
      keyframes: {
        "fill-left-right": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        "underline-left-right": {
          "0%": { transform: "scaleX(0)", transformOrigin: "left" },
          "100%": { transform: "scaleX(1)", transformOrigin: "left" },
        },
        "float-clouds": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        wave1: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        wave2: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        wave3: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fill-lr": "fill-left-right 0.3s ease-out forwards",
        "underline-lr": "underline-left-right 0.3s ease-out forwards",
        "floating-clouds": "float-clouds 20s linear infinite",
        "wave-motion": "wave 15s linear infinite",
        wave1: "wave1 30s linear infinite",
        wave2: "wave2 25s linear infinite",
        wave3: "wave3 20s linear infinite",
      },
    },
  },
  plugins: [],
};
