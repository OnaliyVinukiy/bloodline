const flowbite = require("flowbite-react/tailwind");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content(),],
  theme: {
    extend: {
      fontFamily: {
        playfair: ["Playfair Display", "serif"],
        roboto: ["Roboto", "serif"],
        opensans: ["Open Sans", "serif"],

         
      },
    },
  },
  plugins: [ flowbite.plugin(),],
};