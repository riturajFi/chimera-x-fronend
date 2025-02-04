import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        customGray: "#F2F2F2",
      },

      borderRadius: {
        "extra-rounded": "2rem", // You can increase this value for more rounded corners
      },
      height: {
        "1/7": "14.2857%", // 1/7th of the container
        "2/7": "28.5714%", // 2/7th
        "3/7": "42.8571%", // 3/7th
        "4/7": "57.1428%", // 4/7th
        "5/7": "71.4285%", // 5/7th
        "6/7": "85.7142%", // 6/7th
        "1/8": "12.5%", // 1/8th of the container
        "2/8": "25%", // 2/8th (same as 1/4)
        "3/8": "37.5%", // 3/8th
        "4/8": "50%", // 4/8th (same as 1/2)
        "5/8": "62.5%", // 5/8th
        "6/8": "75%", // 6/8th (same as 3/4)
        "7/8": "87.5%", // 7/8th
      },
    },
  },
  plugins: [],
};
export default config;
