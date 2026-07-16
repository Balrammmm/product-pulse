import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#f7f4ee",
        linen: "#fbfaf7",
        ink: "#1f2523",
        graphite: "#3a403d",
        mist: "#e9e4da",
        moss: "#234f3c",
        forest: "#173f32",
        sage: "#dce8dd",
        cream: "#f4efe5",
        amber: "#a97935",
        bronze: "#8f612a",
        clay: "#a85f4c",
      },
      boxShadow: {
        soft: "0 24px 70px rgba(31, 37, 35, 0.09)",
        card: "0 12px 34px rgba(31, 37, 35, 0.065)",
        lift: "0 18px 44px rgba(31, 37, 35, 0.11)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        mono: ["SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
