# Real Return Analyzer

A financial education tool that helps users understand how inflation erodes purchasing power and how different investments perform in real terms. Built with real historical data from 7 major economies.

**Live:** [realreturns.skynexdigital.com](https://realreturns.skynexdigital.com)

## Tech Stack

- **Framework:** Next.js 15 + React 19 + TypeScript 5
- **Styling:** Tailwind CSS 4 (Notion-inspired design)
- **State:** Zustand
- **Charts:** Chart.js + react-chartjs-2
- **Math:** Decimal.js for financial precision
- **i18n:** Custom hook with EN / ZH / FR support
- **Deploy:** Vercel

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── page.tsx          # Landing page
│   ├── calculator/       # Calculator tool
│   ├── layout.tsx        # Root layout + metadata
│   └── globals.css       # Design tokens + utilities
├── components/           # UI components
├── data/historical/      # Country-specific financial data
├── hooks/                # useTranslation, useInView
├── lib/                  # Calculator logic, theme colors
├── locales/              # Translation files (en, zh, fr)
└── store/                # Zustand stores
```

## Countries Supported

US, Canada, UK, Germany, Japan, China, Australia — with inflation rates, stock returns, bond yields, savings rates, and real estate data from 1970-2024.

## License

MIT
