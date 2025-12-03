/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1b5b3a',
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#1b5b3a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
          light: '#4ade80'
        },
        accent: {
          DEFAULT: '#f97316',
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407'
        },
        muted: '#f4f4f5',
      },
      boxShadow: {
        card: '0 12px 24px rgba(27, 91, 58, 0.08)',
      },
    },
  },
  plugins: [],
}

