/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  safelist: [
    {
      pattern: /bg-(pink|purple)-(100|200|300|400|500|600|700)/,
    },
    {
      pattern: /text-(pink|purple)-(100|200|300|400|500|600|700)/,
    },
    {
      pattern: /from-(pink|purple)-[0-9]+/,
    },
    {
      pattern: /to-(pink|purple)-[0-9]+/,
    },
    {
      pattern: /bg-gradient-to-[trbl]/,
    },
    {
      pattern: /bg-clip-text/,
    },
    {
      pattern: /text-transparent/,
    },
  ],
  plugins: [],
}
