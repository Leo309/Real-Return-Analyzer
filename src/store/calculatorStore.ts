import { create } from 'zustand';
import { Decimal } from 'decimal.js';
import { countries, CountryData } from '@/data/countries';

export type InvestmentType = 'savings' | 'stockMarket' | 'none' | 'custom';

interface CalculationResult {
  nominalValue: number;
  inflationAdjustedValue: number;
  opportunityCostValue: number;
  combinedValue: number;
  yearlyBreakdown: {
    year: number;
    nominal: number;
    inflationAdjusted: number;
    opportunityCost: number;
    combined: number;
  }[];
}

interface CalculatorState {
  amount: number | null;
  countryCode: string;
  startYear: number;
  endYear: number;
  investmentType: InvestmentType;
  customRate: number;
  result: CalculationResult | null;
  isCalculating: boolean;
  
  // Setters
  setAmount: (amount: number) => void;
  setCountryCode: (code: string) => void;
  setStartYear: (year: number) => void;
  setEndYear: (year: number) => void;
  setInvestmentType: (type: InvestmentType) => void;
  setCustomRate: (rate: number | null) => void;
  calculate: () => void;
}

const useCalculatorStore = create<CalculatorState>((set, get) => ({
  // Initial state
  amount: null,
  countryCode: 'US',
  startYear: 2020,
  endYear: 2024,
  investmentType: 'none',
  customRate: 0,
  result: null,
  isCalculating: false,

  // State setters
  setAmount: (amount) => set({ amount: amount || 0 }),
  setCountryCode: (code) => set({ countryCode: code }),
  setStartYear: (year) => set({ startYear: year }),
  setEndYear: (year) => set({ endYear: year }),
  setInvestmentType: (type) => set({ investmentType: type }),
  setCustomRate: (rate) => set({ customRate: rate }),

  // Core calculation logic
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

    set({ isCalculating: true, result: null });

    try {
      const countryData = countries[countryCode];
      if (!countryData || !amount) {
        throw new Error('Invalid calculation parameters');
      }

      // Initialize calculation variables
      let currentNominal = new Decimal(amount);
      let currentInflationAdjusted = new Decimal(amount);
      let currentOpportunityCost = new Decimal(amount);
      let currentCombined = new Decimal(amount);
      const yearlyBreakdown = [];

      for (let year = startYear; year <= endYear; year++) {
        if (!countryData.inflationRates[year]) continue;

        // 1. Calculate inflation impact
        const inflationRate = new Decimal(countryData.inflationRates[year]).dividedBy(100);
        currentInflationAdjusted = currentInflationAdjusted.dividedBy(new Decimal(1).plus(inflationRate));

        // 2. Calculate opportunity cost
        if (investmentType === 'savings') {
          const rate = new Decimal(countryData.savingsRates[year]).dividedBy(100);
          currentOpportunityCost = currentOpportunityCost.times(rate.plus(1));
        } else if (investmentType === 'stockMarket') {
          const rate = new Decimal(countryData.stockMarketReturns[year]).dividedBy(100);
          currentOpportunityCost = currentOpportunityCost.times(rate.plus(1));
        } else if (investmentType === 'custom' && customRate !== null) {
          const rate = new Decimal(customRate).dividedBy(100);
          currentOpportunityCost = currentOpportunityCost.times(rate.plus(1));
        }

        // 3. Calculate combined value (investment growth + inflation)
        if (investmentType !== 'none') {
          let growthRate = new Decimal(0);
          
          if (investmentType === 'savings') {
            growthRate = new Decimal(countryData.savingsRates[year]).dividedBy(100);
          } else if (investmentType === 'stockMarket') {
            growthRate = new Decimal(countryData.stockMarketReturns[year]).dividedBy(100);
          } else if (investmentType === 'custom' && customRate !== null) {
            growthRate = new Decimal(customRate).dividedBy(100);
          }
          
          currentCombined = currentCombined
            .times(growthRate.plus(1))
            .dividedBy(inflationRate.plus(1));
        }

        // Record yearly breakdown
        yearlyBreakdown.push({
          year,
          nominal: currentNominal.toNumber(),
          inflationAdjusted: currentInflationAdjusted.toNumber(),
          opportunityCost: currentOpportunityCost.toNumber(),
          combined: currentCombined.toNumber()
        });
      }

      // Final results
      set({
        result: {
          nominalValue: currentNominal.toNumber(),
          inflationAdjustedValue: currentInflationAdjusted.toNumber(),
          opportunityCostValue: currentOpportunityCost.toNumber(),
          combinedValue: currentCombined.toNumber(),
          yearlyBreakdown
        }
      });
    } catch (error) {
      console.error('Calculation error:', error);
      set({ result: null });
    } finally {
      set({ isCalculating: false });
    }
  }
}));

export default useCalculatorStore;