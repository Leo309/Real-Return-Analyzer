import { create } from 'zustand';
import { calculateInflationAndInvestment, InvestmentType, CalculationResult } from '@/lib/calculatorUtils';
import { historicalData, getLatestYear } from '@/data/historical';

interface CalculatorState {
  amount: number | null;
  countryCode: string;
  startYear: number;
  endYear: number;
  investmentType: InvestmentType;
  customRate: number | null;
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
  // 初始状态
  amount: null,
  countryCode: 'US',
  startYear: 2000,
  endYear: getLatestYear(),
  investmentType: 'none',
  customRate: 0,
  result: null,
  isCalculating: false,

  // 状态设置器
  setAmount: (amount) => set({ amount: amount || 0 }),
  setCountryCode: (code) => set({ countryCode: code }),
  setStartYear: (year) => set({ startYear: year }),
  setEndYear: (year) => set({ endYear: year }),
  setInvestmentType: (type) => set({ investmentType: type }),
  setCustomRate: (rate) => set({ customRate: rate }),

  // 计算逻辑
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
      console.error('无效的金额值');
      return;
    }
    
    set({ isCalculating: true, result: null });

    try {
      // 使用新的计算工具
      const result = calculateInflationAndInvestment(
        amount,
        countryCode,
        startYear,
        endYear,
        investmentType,
        customRate
      );
      
      set({ result });
    } catch (error) {
      console.error('计算错误:', error);
      set({ result: null });
    } finally {
      set({ isCalculating: false });
    }
  }
}));

export default useCalculatorStore;