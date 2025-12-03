/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.js", "./screens/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7B61FF",
        secondary: "#EFE9FF",
        accent: "#5A3FFF",
        card: "#FFFFFF",
        darkBg: "#0F0F10",
        darkCard: "#1A1A1C"
      }
    }
  },
  plugins: []
};
