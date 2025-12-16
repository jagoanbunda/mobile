/** @type {import('tailwindcss').Config} */
const Colors = require('./constants/colors').Colors;

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: Colors.primary,
        "primary-muted": Colors.primaryMuted,
        "background-light": Colors.backgroundLight,
        "background-dark": Colors.backgroundDark,
        "card-dark": Colors.cardDark,
        "card-dark-alt": Colors.cardDarkAlt,
        "border-dark": Colors.borderDark,
        "text-muted": Colors.textMuted,
      },
      fontFamily: {
        display: ["System"],
      }
    },
  },
  plugins: [],
}
