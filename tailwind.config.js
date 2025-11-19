/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'matte-black': '#050505', // Deeper black
        'neon-white': '#f0f0f0', // Slightly off-white for better readability
        'neon-accent': '#ffffff', // Pure white for accents
        'neon-blue': '#e0e0e0',
        'dark-gray': '#121212',
        'glass-border': 'rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Modern sans
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'], // Premium display font
      },
      boxShadow: {
        'neon': '0 0 10px rgba(255, 255, 255, 0.1), 0 0 30px rgba(255, 255, 255, 0.05)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
