/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
const { fontFamily } = require("tailwindcss/defaultTheme");

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
        "dark-gray": withOpacityValue("--dark-gray"),
        "disabled-gray": withOpacityValue("--disabled-gray"),
        "link-blue": withOpacityValue("--link-blue"),
        "light-blue": withOpacityValue("--light-blue"),
        "base-blue": withOpacityValue("--base-blue"),
        "base-pink": withOpacityValue("--base-pink"),
      },
      backgroundImage: {
        "primary-gradient":
          "linear-gradient(93.08deg, hsl(var(--base-pink)) 5.1%, hsl(var(--base-blue)) 100%)",
      },
      backdropBlur: {
        sm: "1px",
      },
      fontFamily: {
        unbounded: ["var(--font-unbounded)", ...fontFamily.sans],
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
          accent: "hsla(224, 61%, 46%, 1)",
          neutral: "hsla(202, 13%, 16%, 1)",
          "--light-gray": "light-gray",
          "--dark-gray": "dark-gray",
          "--disabled-gray": "disabled-gray",
          "--link-blue": "link-blue",
          "--light-blue": "light-blue",
          "--base-blue": "base-blue",
          "--base-pink": "base-pink",
        },
      },
    ],
  },
});
