/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#D4AF37',
          'gold-light': '#FFD700',
          'gold-dark': '#B8860B',
          black: '#1A1A1A',
          'black-light': '#2D2D2D',
          'black-dark': '#0D0D0D'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};