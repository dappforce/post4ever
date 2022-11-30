/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "node_modules/daisyui/dist/**/*.js",
    "node_modules/react-daisyui/dist/**/*.js",
  ],
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      display: ["group-hover"],
      border: ["first", "last"],
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/forms")],
};
