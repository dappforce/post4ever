/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

// this function handles the opacity of color
function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `hsl(var(${variable}))`;
    }
    return `hsl(var(${variable}) / ${opacityValue})`;
  };
}

module.exports = withMT({
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "node_modules/daisyui/dist/**/*.js",
    "node_modules/react-daisyui/dist/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        "light-gray": withOpacityValue("--light-gray"),
      },
      backdropBlur: {
        sm: "1px",
      },
    },
  },
  variants: {
    background: ["disabled"],
    extend: {
      display: ["group-hover"],
      border: ["first", "last"],
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/forms")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/colors/themes")["[data-theme=light]"],
          primary: "hsla(224, 90%, 62%, 1)",
          secondary: "hsla(165, 58%, 51%, 1)",
          accent: "hsla(260, 76%, 49%, 1)",
          neutral: "hsla(202, 13%, 16%, 1)",
          "--light-gray": "light-gray",
        },
      },
    ],
  },
});
