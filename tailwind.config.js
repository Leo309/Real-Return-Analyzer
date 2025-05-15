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
        'primary-blue': '#1E63A0',
        'secondary-blue': '#5A9AD2',
        'dark-grey': '#333333',
        'medium-grey': '#666666',
        'light-grey': '#AAAAAA',
        'warning-red': '#D9534F',
      },
    },
  },
  plugins: [],
}