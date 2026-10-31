# Real Return Analyzer

## Overview
Financial education calculator — helps users understand inflation's impact on purchasing power and compare investment performance across 7 countries.

## Architecture
- **Next.js 15 App Router** with `'use client'` for interactive pages
- **Routes:** `/` (landing page), `/calculator` (tool), `/privacy-policy`, `/terms-of-use`
- **State:** Zustand stores — `calculatorStore` (multi-step flow), `languageStore` (i18n)
- **Styling:** Tailwind CSS 4 with CSS variables (Notion-inspired palette). All components use `var(--foreground)`, `var(--border)`, etc. — no `darkMode` prop anywhere
- **Charts:** Chart.js with SSR workarounds and `src/lib/themeColors.ts` — do not modify chart code casually
- **Logo:** Pure text "SKYNEX" (no PNG images)

## Key Conventions
- **Dark Mode:** Auto-follows system `prefers-color-scheme` (no manual toggle). `.dark` class toggled on `<html>` via `MediaQueryList` listener. CSS variables in `globals.css` handle all theming
- **i18n:** English + 简体中文 only. Inline toggle (`EN | 中`) in header. Custom `useTranslation()` hook with nested key lookup. Translations in `src/locales/en.ts` and `src/locales/zh.ts`
- **Data:** Historical financial data manually curated in `src/data/historical/` per country (no external APIs)

## Commands
```bash
npm run dev       # Dev server (default port 3000)
npm run build     # Production build
npm run lint      # ESLint
```

## Deployment
Vercel at `realreturns.skynexdigital.com`. Build config ignores TypeScript and ESLint errors (`next.config.ts`).
