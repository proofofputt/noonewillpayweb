/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bitcoin: '#F7931A',
        ordinal: '#8B5CF6',
        runes: '#10B981',
      },
      fontFamily: {
        mono: ['Monaco', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
