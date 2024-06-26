/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        main: {
          light: "rgba(152, 63, 63, 0.36)",
          DEFAULT: "rgba(152, 63, 63, 1)",
        },
        sub: "rgba(58, 74, 103, 1)",
      },
      fontFamily: {
        timesnewroman: ["Times New Roman", "Georgia", "serif"],
        opensans: ["Open Sans", "sans-serif"],
        cherry: ["Cherry Bomb One", "cursive"],
      },
    },
  },
  plugins: [],
};
