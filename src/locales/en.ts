// src/locales/en.ts
// English translations
// This will be the base for future internationalization

export const en = {
  common: {
    back: 'Back',
    next: 'Next',
    calculate: 'Calculate',
    selectRegion: 'Select your region',
    selectInvestment: 'Select investment type',
    years: 'years',
    dataAvailable: 'Data available',
    from: 'from',
    to: 'to',
    submit: 'Submit',
    feedback: 'Feedback',
    feedbackThankYou: 'Thank you for your feedback!',
    loading: 'Loading...',
    error: 'An error occurred',
  },
  regionSelector: {
    title: 'Where are you investing?',
    subtitle: 'Select your region to get started with region-specific investment data',
    dataYearsLabel: '{startYear}-{endYear}',
    dataCompleteness: {
      full: 'Complete data',
      partial: 'Partial data',
      limited: 'Limited data'
    }
  },
  investmentSelector: {
    title: 'Choose your investment type',
    subtitle: 'See how different investment strategies would have performed in',
    availableYears: '{years} years of data ({startYear}-{endYear})',
    dataNote: 'Note on data coverage',
    selectButton: 'Select this investment',
    backToRegions: 'Change region',
    historicalReturn: 'Avg. historical return: {returnRate}%'
  },
  calculator: {
    title: 'Real Return Analyzer',
    subtitle: 'See how inflation and investments affect your money over time',
    initialAmount: 'Initial Amount',
    startYear: 'Start Year',
    endYear: 'End Year',
    inflationImpact: 'Inflation Impact',
    investmentPerformance: 'Investment Performance',
    originalAmount: 'Original Amount',
    trueValueToday: 'True Value Today',
    withInvestmentReturns: 'With Investment Returns',
    realGrowthAfterInflation: 'Real Growth After Inflation',
    calculateButton: 'Calculate Results',
    backToInvestments: 'Change investment type',
    moneyLostToInflation: 'Money Lost to Inflation',
    changeInPurchasingPower: 'change in purchasing power',
    nominalGrowth: 'nominal growth',
    realGrowth: 'real growth',
    customRate: 'Custom Annual Return Rate (%)',
    customRateHint: 'Enter the expected annual return rate for your custom investment',
    results: 'Results',
    inflationReducedPurchasingPower: 'Even with investment, inflation reduced your purchasing power by {percentage}%'
  },
  feedback: {
    title: 'Help us improve',
    emailLabel: 'Your email (optional)',
    messageLabel: 'Your feedback',
    ratingLabel: 'How would you rate your experience?',
    submitButton: 'Submit Feedback',
    placeholder: 'Tell us what you think about the calculator...',
    thankYou: 'Thank you for your feedback!'
  },
  investmentTypes: {
    none: {
      name: 'No Investment',
      description: 'See the impact of inflation only, without any investment returns',
    },
    cash: {
      name: 'Savings Account',
      description: 'Low-risk savings accounts or time deposits with minimal volatility',
    },
    bonds: {
      name: 'Government Bonds',
      description: '10-year government bonds with moderate risk and typically higher returns than cash',
    },
    stocks: {
      name: 'Stock Market',
      description: 'Broad stock market index representing higher risk with potential for higher long-term returns',
    },
    realEstate: {
      name: 'Real Estate',
      description: 'Residential property price index showing average housing market performance',
    },
    custom: {
      name: 'Custom Rate',
      description: 'Define your own annual return rate for comparing custom investment scenarios',
    }
  },
  landing: {
    hero: {
      badge: 'Real Return Analyzer',
      titleStart: 'Wondering if you made a',
      titleHighlight: 'smart decision',
      titleEnd: 'in investment?',
      subtitle: 'See how inflation silently eats your money — and what you can do about it. Backed by real historical data from 7 major economies.',
      cta: 'Start Analyzing',
      learnMore: 'Learn More',
      trustBadge1: 'Free & Open Source',
      trustBadge2: '7 Countries Covered',
    },
    features: {
      title: 'What You Can Discover',
      subtitle: 'Understand the true impact of inflation on your wealth and how different investments compare.',
      purchasingPower: {
        title: 'Real Purchasing Power',
        description: 'See exactly how much your money can actually buy after years of inflation. The results might surprise you.',
      },
      compare: {
        title: 'Compare Investments',
        description: 'Stocks, bonds, real estate, savings accounts — see how each would have performed side by side.',
      },
      economies: {
        title: '7 Major Economies',
        description: 'Real historical data from the US, Canada, UK, Germany, Japan, China, and Australia since 1970.',
      },
    },
    howItWorks: {
      title: 'How It Works',
      step1: {
        title: 'Choose Your Region',
        description: 'Pick from 7 countries with real historical economic data.',
      },
      step2: {
        title: 'Select Investment Type',
        description: 'Compare cash, bonds, stocks, real estate, or set custom rates.',
      },
      step3: {
        title: 'See Real Results',
        description: 'Interactive charts showing your money\'s true purchasing power over time.',
      },
    },
    trust: {
      text: 'Built with real government data sources — central banks, stock indices, and housing data — covering 1970 to present.',
    },
    bottomCta: {
      title: 'Ready to see the truth about your money?',
      subtitle: 'It takes 30 seconds. No sign-up required.',
      cta: 'Try the Calculator',
    },
  },
  seo: {
    title: 'Investment Calculator | Historical Returns & Inflation Impact',
    description: 'Calculate how inflation and investments affect your money over time. Compare stocks, bonds, real estate and more based on historical data.',
    keywords: 'investment calculator, inflation calculator, stock returns, bond returns, real estate investment, historical returns, financial planning'
  }
};