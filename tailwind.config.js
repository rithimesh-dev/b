/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'matte-black': '#0f0f0f',
        'neon-white': '#ffffff',
        'neon-accent': '#ffffff',
        'neon-blue': '#e0e0e0',
        'dark-gray': '#1a1a1a',
      },
      boxShadow: {
        'neon': '0 0 5px theme("colors.neon-white"), 0 0 20px theme("colors.neon-accent")',
      },
      fontFamily: {
        sans: ['monospace', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],

      }
    },
  },
  plugins: [],
}
