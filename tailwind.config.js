/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        custom: "0 2px 5px 0 rgba(0, 0, 0, 0.1)",
      },
      colors: {
        authPrimary: "#FF8000",
        primary: "#FF7233",
        brown: "#624637",
        textBrown: "#57453C",
        borderColor: "#B0B0B0",
        cardColor: "#FFF3ED",
      },
      backgroundImage: {
        authGradient: "linear-gradient(to bottom, #FFAC71, #FF6929)",
        displayGradient: "linear-gradient(to bottom, #FFDBBA, #FFB673,#FF7A00)",
      },
    },
  },
  plugins: [],
};
