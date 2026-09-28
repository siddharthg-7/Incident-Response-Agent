/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090d16",
        surface: "#0f172a",
        surfaceHover: "#1e293b",
        border: "#1e293b",
        primary: {
          DEFAULT: "#0284c7",
          hover: "#0369a1",
          light: "#38bdf8"
        },
        accent: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444"
      }
    },
  },
  plugins: [],
}
