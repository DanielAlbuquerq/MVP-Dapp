/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Make sure this includes all files using Nativewind class names, especially the `src` app directory.
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./App.tsx", "./components/**/*.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}