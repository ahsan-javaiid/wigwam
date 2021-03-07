const theme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === "production",
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/**/*.{html,js,mjs}"],
  },
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          darkbg: "#1F2128",
          darkover: "#191B20",
          darktext: "#11142D",
          lightgray: "#E4E4E4",
          primary: "#355DFF",
        },
      },
      fontFamily: {
        sans: ["Inter", ...theme.fontFamily.sans],
      },
      animation: {
        bootfadein: "bootfadein 0.15s ease-in-out",
      },
      keyframes: {
        bootfadein: {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
      },
    },
  },
  variants: {
    extend: {
      display: ["dark"],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
