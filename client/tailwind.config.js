/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // colors
      colors: {
        main: "#080a1a",
        subMain: "#f20000",
        dry: "#0b0f29",
        text: "#c0c0c0",
        star: "#ffb000",
        border: "#4b5563",
        dryGray: "#e0d5d5",        
      },

      // height
      height: {
        header: "560px",
        rate: "400px",
      },

      //fontsize
      fontSize: {
        h1: "2.6rem",
      },

      //screen
      screens: {
        xs: "475px",
      }
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
  ],
}

