import { create } from 'zustand';
import { 
  calculateInflationAndInvestment, 
  InvestmentType, 
  CalculationResult, 
  getAverageInvestmentReturn 
} from '@/lib/calculatorUtils';
import { historicalData, getLatestYear, getEarliestYear } from '@/data/historical';

// New types for tracking data completeness
export type DataCompleteness = 'full' | 'partial' | 'limited';

export interface InvestmentDataCoverage {
  investmentType: InvestmentType;
  yearsAvailable: number;
  startYear: number;
  endYear: number;
  dataCompleteness: DataCompleteness;
  averageReturn?: number;
}

export type CalculatorStep = 'region' | 'investment' | 'calculator' | 'results';

interface CalculatorState {
  // Navigation state
  currentStep: CalculatorStep;
  
  // Data inputs
  amount: number | null;
  countryCode: string;
  startYear: number;
  endYear: number;
  investmentType: InvestmentType;
  customRate: number | null;
  
  // Results
  result: CalculationResult | null;
  isCalculating: boolean;
  
  // Data coverage info - computed once when the store is created
  availableYearsForRegion: Record<string, {start: number, end: number, dataCompleteness: DataCompleteness}>;
  investmentDataCoverage: Record<string, InvestmentDataCoverage[]>;
  
  // Actions - Navigation
  setStep: (step: CalculatorStep) => void;
  goBack: () => void;
  
  // Actions - Data
  setAmount: (amount: number) => void;
  setCountryCode: (code: string) => void;
  setStartYear: (year: number) => void;
  setEndYear: (year: number) => void;
  setInvestmentType: (type: InvestmentType) => void;
  setCustomRate: (rate: number | null) => void;
  
  // Actions - Calculation
  calculate: () => void;
  
  // Helper functions
  getDataCompletenessForCountry: (countryCode: string) => DataCompleteness;
  getAvailableYearsForCountry: (countryCode: string) => number[];
  getInvestmentCoverageForCountry: (countryCode: string) => InvestmentDataCoverage[];
}

// Helper function to calculate data coverage for each region
function calculateRegionDataCoverage() {
  const coverage: Record<string, {start: number, end: number, dataCompleteness: DataCompleteness}> = {};
  
  // Process each country in the historical data
  Object.entries(historicalData).forEach(([countryCode, countryData]) => {
    // Get all available years for this country from inflation data (which should be most complete)
    const years = Object.keys(countryData.inflationRates).map(Number).sort((a, b) => a - b);
    
    if (years.length === 0) {
      coverage[countryCode] = { start: 2000, end: getLatestYear(), dataCompleteness: 'limited' };
      return;
    }
    
    const start = years[0];
    const end = years[years.length - 1];
    
    // Calculate completeness by checking for gaps in the data
    const expectedYearCount = end - start + 1;
    const actualYearCount = years.length;
    const completenessRatio = actualYearCount / expectedYearCount;
    
    let dataCompleteness: DataCompleteness;
    if (completenessRatio >= 0.9) {
      dataCompleteness = 'full';
    } else if (completenessRatio >= 0.7) {
      dataCompleteness = 'partial';
    } else {
      dataCompleteness = 'limited';
    }
    
    coverage[countryCode] = { start, end, dataCompleteness };
  });
  
  return coverage;
}

// Helper function to calculate investment type coverage for each country
function calculateInvestmentDataCoverage() {
  const coverage: Record<string, InvestmentDataCoverage[]> = {};
  
  // Process each country
  Object.entries(historicalData).forEach(([countryCode, countryData]) => {
    const investmentCoverage: InvestmentDataCoverage[] = [];
    
    // Add coverage for each investment type
    const investmentTypes: Array<{ type: InvestmentType; dataKey: keyof typeof countryData }> = [
      { type: 'none', dataKey: 'inflationRates' },
      { type: 'cash', dataKey: 'savingsRates' },
      { type: 'bonds', dataKey: 'bondReturns' },
      { type: 'stocks', dataKey: 'stockMarketReturns' },
      { type: 'realEstate', dataKey: 'realEstateReturns' }
    ];
    
    investmentTypes.forEach(({ type, dataKey }) => {
      // Skip if the data is not available for this country
      if (!countryData[dataKey]) return;
      
      const data = countryData[dataKey] as Record<number, number>;
      const years = Object.keys(data).map(Number).sort((a, b) => a - b);
      
      if (years.length === 0) return;
      
      const start = years[0];
      const end = years[years.length - 1];
      const yearsAvailable = years.length;
      
      // Calculate completeness
      const expectedYearCount = end - start + 1;
      const completenessRatio = yearsAvailable / expectedYearCount;
      
      let dataCompleteness: DataCompleteness;
      if (completenessRatio >= 0.9) {
        dataCompleteness = 'full';
      } else if (completenessRatio >= 0.7) {
        dataCompleteness = 'partial';
      } else {
        dataCompleteness = 'limited';
      }
      
      // Calculate average return for this investment type
      let averageReturn: number | undefined;
      if (type !== 'none') {
        try {
          averageReturn = getAverageInvestmentReturn(countryCode, start, end, type);
        } catch (error) {
          console.error(`Error calculating average return for ${type} in ${countryCode}:`, error);
          averageReturn = undefined;
        }
      }
      
      investmentCoverage.push({
        investmentType: type,
        yearsAvailable,
        startYear: start,
        endYear: end,
        dataCompleteness,
        averageReturn
      });
    });
    
    coverage[countryCode] = investmentCoverage;
  });
  
  return coverage;
}

const useCalculatorStore = create<CalculatorState>((set, get) => ({
  // Initial state
  currentStep: 'region',
  amount: 10000, // Default value
  countryCode: 'US',
  startYear: 2000,
  endYear: getLatestYear(),
  investmentType: 'none',
  customRate: 5, // Default value for custom rate
  result: null,
  isCalculating: false,
  
  // Precomputed data coverage info
  availableYearsForRegion: calculateRegionDataCoverage(),
  investmentDataCoverage: calculateInvestmentDataCoverage(),
  
  // Navigation actions
  setStep: (step) => set({ currentStep: step }),
  goBack: () => {
    const { currentStep } = get();
    if (currentStep === 'investment') {
      set({ currentStep: 'region' });
    } else if (currentStep === 'calculator') {
      set({ currentStep: 'investment' });
    } else if (currentStep === 'results') {
      set({ currentStep: 'calculator' });
    }
  },
  
  // Data setters
  setAmount: (amount) => set({ amount: amount || 0 }),
  setCountryCode: (code) => {
    const availableYears = get().getAvailableYearsForCountry(code);
    
    set({ 
      countryCode: code,
      // Reset the years to valid ranges for this country
      startYear: availableYears.length > 0 ? availableYears[0] : 2000,
      endYear: availableYears.length > 0 ? availableYears[availableYears.length - 1] : getLatestYear()
    });
  },
  setStartYear: (year) => set({ startYear: year }),
  setEndYear: (year) => set({ endYear: year }),
  setInvestmentType: (type) => set({ investmentType: type }),
  setCustomRate: (rate) => set({ customRate: rate }),
  
  // Calculation
  calculate: () => {
    const state = get();
    const {
      amount,
      countryCode,
      startYear,
      endYear,
      investmentType,
      customRate
    } = state;
    
    if (!amount || amount <= 0) {
      console.error('Invalid amount value');
      return;
    }
    
    set({ isCalculating: true, result: null });

    try {
      const result = calculateInflationAndInvestment(
        amount,
        countryCode,
        startYear,
        endYear,
        investmentType,
        customRate
      );
      
      set({ result, currentStep: 'results' });
    } catch (error) {
      console.error('Calculation error:', error);
      set({ result: null });
    } finally {
      set({ isCalculating: false });
    }
  },
  
  // Helper functions
  getDataCompletenessForCountry: (countryCode) => {
    return get().availableYearsForRegion[countryCode]?.dataCompleteness || 'limited';
  },
  
  getAvailableYearsForCountry: (countryCode) => {
    const { start, end } = get().availableYearsForRegion[countryCode] || 
      { start: 2000, end: getLatestYear() };
    
    const years = [];
    for (let year = start; year <= end; year++) {
      years.push(year);
    }
    return years;
  },
  
  getInvestmentCoverageForCountry: (countryCode) => {
    return get().investmentDataCoverage[countryCode] || [];
  }
}));

export default useCalculatorStore;