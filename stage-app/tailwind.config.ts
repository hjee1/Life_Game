import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFF8E7",
        charcoal: "#2C3E50",
        "dawn-gold": "#F4D03F",
        "sky-blue": "#85C1E9",
        "forest-green": "#82C785",
        "stage-red": "#E74C3C",
        "code-purple": "#9B59B6",
        "bond-pink": "#F1948A",
      },
    },
  },
  plugins: [],
};
export default config;
