/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // 🌞 Light mode
        background: "var(--color-background)",
        text: "var(--color-text)",
        primary: "var(--color-primary)",
        accent: "var(--color-accent)",
        sage: "var(--color-sage)",
        charcoal: "#2b2b2b",

        // 🌙 Dark mode
        darkbg: "var(--color-darkbg)",
        darktext: "var(--color-darktext)",
        darkprimary: "var(--color-darkprimary)",
        darkaccent: "var(--color-darkaccent)",
        darkmuted: "var(--color-darkmuted)",
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
