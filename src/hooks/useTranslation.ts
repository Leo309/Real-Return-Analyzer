// Simple translation hook that will be expanded later with full i18n support
// For now, it just returns English strings from a static file

// This is a placeholder English dictionary - in a real implementation, 
// we would use a proper i18n library like next-i18next or react-i18next
const en = {
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
    realGrowth: 'real growth'
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
      name: 'Cash/Savings',
      description: 'Low-risk savings accounts or short-term government bills with minimal volatility',
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
  }
};

export function useTranslation() {
  // Currently just returns English strings
  // Will be replaced with proper i18n implementation later
  
  const t = (key: string, replacements?: Record<string, string | number>) => {
    // Parse the key path (e.g., "regionSelector.title")
    const parts = key.split('.');
    let value: unknown = en;
    
    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = (value as Record<string, unknown>)[part];
      } else {
        return key; // Return the key if translation not found
      }
    }
    
    if (typeof value === 'string' && replacements) {
      // Replace placeholders like {startYear} with actual values
      return Object.entries(replacements).reduce(
        (str, [key, val]) => str.replace(new RegExp(`{${key}}`, 'g'), String(val)),
        value
      );
    }
    
    return typeof value === 'string' ? value : key;
  };
  
  return { t };
}