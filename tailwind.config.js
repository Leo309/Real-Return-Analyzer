// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'notion-text': '#37352f',
        'notion-text-secondary': '#787774',
        'notion-bg': '#ffffff',
        'notion-accent': '#f7f6f3',
        'notion-border': '#e3e2de',
        'notion-blue': '#2383e2',
      },
    },
  },
  plugins: [],
}
