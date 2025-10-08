/** @type {import('tailwindcss').Config} */
export default {
  darkMode:'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:"#FFFFFF",
        secondary:"#000000",
        darktext:"#DFD0B8",
        darkbgbutton:"#222831",
        darkhover:"#A78295",
        darkbg:"#393E46",
      },
    },
  },
  plugins: [],
}