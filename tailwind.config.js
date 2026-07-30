/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'classic-beige': {
          50: '#FDFCF6',
          100: '#FBF8F0',
          200: '#F4EFE0',
          300: '#EBE2C9',
          400: '#E0D2A6',
          500: '#D4C081',
          600: '#C5A95A',
          700: '#A68641',
          800: '#8A6D3A',
          900: '#755B33',
        },
        'classic-blue': {
          50: '#F0F6FA',
          100: '#E1EDF5',
          200: '#C9DFEC',
          300: '#A0C8DF',
          400: '#70AACC',
          500: '#4D8DB3',
          600: '#3D7196',
          700: '#325C7C',
          800: '#2A4E68',
          900: '#264257',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
