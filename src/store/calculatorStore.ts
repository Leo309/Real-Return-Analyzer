import { create } from 'zustand';
import { Decimal } from 'decimal.js';
import { countries, CountryData } from '@/data/countries';

export type InvestmentType = 'savings' | 'stockMarket' | 'none';

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
  amount: number | null; // allow null value
  countryCode: string;
  startYear: number;
  endYear: number;
  investmentType: InvestmentType;
  result: CalculationResult | null;
  isCalculating: boolean;
  
  setAmount: (amount: number) => void;
  setCountryCode: (code: string) => void;
  setStartYear: (year: number) => void;
  setEndYear: (year: number) => void;
  setInvestmentType: (type: InvestmentType) => void;
  calculate: () => void;
}

const useCalculatorStore = create<CalculatorState>((set, get) => ({
  amount: null,
  countryCode: 'US',
  startYear: 2020,
  endYear: 2024,
  investmentType: 'none',
  result: null,
  isCalculating: false,
  
  setAmount: (amount) => set({ amount: amount || 0 }), // will set to 0 if empty
  setCountryCode: (code) => set({ countryCode: code }),
  setStartYear: (year) => set({ startYear: year }),
  setEndYear: (year) => set({ endYear: year }),
  setInvestmentType: (type) => set({ investmentType: type }),
  
  calculate: () => {
    const { amount, countryCode, startYear, endYear, investmentType } = get();
    
    set({ isCalculating: true });
    
    const countryData = countries[countryCode];
    if (!countryData) {
      console.error(`Country data not found for code: ${countryCode}`);
      set({ isCalculating: false });
      return;
    }
    
    // Calculate year by year
    const yearlyBreakdown = [];
    let currentNominal = new Decimal(amount);
    let currentInflationAdjusted = new Decimal(amount);
    let currentOpportunityCost = new Decimal(amount);
    let currentCombined = new Decimal(amount);
    
    for (let year = startYear; year <= endYear; year++) {
      // Skip if we don't have data for this year
      if (!countryData.inflationRates[year]) continue;
      
      // For the first year, just record the initial values
      if (year === startYear) {
        yearlyBreakdown.push({
          year,
          nominal: currentNominal.toNumber(),
          inflationAdjusted: currentInflationAdjusted.toNumber(),
          opportunityCost: currentOpportunityCost.toNumber(),
          combined: currentCombined.toNumber()
        });
        continue;
      }
      
      // For subsequent years, apply rates
      const inflationRate = new Decimal(countryData.inflationRates[year]).dividedBy(100);
      
      // Inflation adjustment - purchasing power decreases with inflation
      currentInflationAdjusted = currentInflationAdjusted.dividedBy(
        new Decimal(1).plus(inflationRate)
      );
      
      // Opportunity cost calculation
      if (investmentType === 'savings') {
        const savingsRate = new Decimal(countryData.savingsRates[year]).dividedBy(100);
        currentOpportunityCost = currentOpportunityCost.times(
          new Decimal(1).plus(savingsRate)
        );
      } else if (investmentType === 'stockMarket') {
        const stockReturn = new Decimal(countryData.stockMarketReturns[year]).dividedBy(100);
        currentOpportunityCost = currentOpportunityCost.times(
          new Decimal(1).plus(stockReturn)
        );
      }
      // Combine inlfation and opportunity cost
      if (investmentType !== 'none') {
        if (investmentType === 'savings') {
          const savingsRate = new Decimal(countryData.savingsRates[year]).dividedBy(100);
          currentCombined = currentCombined.times(new Decimal(1).plus(savingsRate));
        } else if (investmentType === 'stockMarket') {
          const stockReturn = new Decimal(countryData.stockMarketReturns[year]).dividedBy(100);
          currentCombined = currentCombined.times(new Decimal(1).plus(stockReturn));
        }
      }
      
      // 应用通胀调整
      currentCombined = currentCombined.dividedBy(new Decimal(1).plus(inflationRate));
      
      // 更新年度数据
      yearlyBreakdown[yearlyBreakdown.length - 1].combined = currentCombined.toNumber();
      
      yearlyBreakdown.push({
        year,
        nominal: currentNominal.toNumber(),
        inflationAdjusted: currentInflationAdjusted.toNumber(),
        opportunityCost: currentOpportunityCost.toNumber(),
        combined: currentCombined.toNumber()
      });
    }
    
    // Get the final values
    const result: CalculationResult = {
      nominalValue: currentNominal.toNumber(),
      inflationAdjustedValue: currentInflationAdjusted.toNumber(),
      opportunityCostValue: currentOpportunityCost.toNumber(),
      combinedValue: currentCombined.toNumber(), // 新增
      yearlyBreakdown
    };
    
    set({ result, isCalculating: false });
  }
}));

export default useCalculatorStore;