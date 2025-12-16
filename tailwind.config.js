/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FAC638",
        "background-light": "#f8f8f5",
        "background-dark": "#231e0f",
        "card-dark": "#1e2e19"
      },
      fontFamily: {
        display: ["System"], // Fallback to System for now, update if Manrope is loaded
      }
    },
  },
  plugins: [],
}
