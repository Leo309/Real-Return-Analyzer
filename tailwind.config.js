// tailwind.config.js
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--primary) / <alpha-value>)',
        'primary-hover': 'rgb(var(--primary-hover) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        background: 'rgb(var(--background) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        'card-bg': 'rgb(var(--background) / <alpha-value>)',
        'primary-foreground': 'white',
        accent: colors.gray[200],
        'skynex-blue': '#3B82F6',
      },
    },
  },
  plugins: [],
}