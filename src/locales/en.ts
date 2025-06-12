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
    customRateHint: 'Enter the expected annual return rate for your custom investment'
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
  seo: {
    title: 'Investment Calculator | Historical Returns & Inflation Impact',
    description: 'Calculate how inflation and investments affect your money over time. Compare stocks, bonds, real estate and more based on historical data.',
    keywords: 'investment calculator, inflation calculator, stock returns, bond returns, real estate investment, historical returns, financial planning'
  }
};