import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#3a2330",
        rose: "#d94f8a",
        berry: "#9f2d5a",
        blush: "#fff1f7",
        paper: "#fff9fc"
      }
    }
  },
  plugins: []
};

export default config;
