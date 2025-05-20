/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#edb106",
        secondary: "#b20d0c",
        white: "#ffffff",
        textDark: "#141416",
        body: "#D0D0D0",
        bgDark: "#141416",
        bgDark2: "#1a1a1c",
        borderLight: "#2c2c2e",
        success: "#00ff00",
      },
    },
  },
  plugins: [],
};
