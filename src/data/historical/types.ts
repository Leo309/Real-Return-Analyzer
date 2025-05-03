export interface HistoricalCountryData {
  name: string;
  code: string;
  currency: string;
  symbol: string;
  metadata: {
    cpiBaseYear: number;  // CPI指数基准年
    inflationSource: string;
    stockMarketBenchmark: string; // 例如 "S&P 500", "S&P/TSX Composite"
    bondBenchmark: string; // 例如 "10-Year Treasury"
    savingsRateDescription: string; // 例如 "High-yield savings accounts"
    realEstateBenchmark?: string; // 例如 "Case-Shiller National Home Price Index"
  };
  // 通胀率数据 (%)
  inflationRates: Record<number, number>;
  // CPI指数数据
  cpiValues: Record<number, number>;
  // 股票市场回报率 (%)
  stockMarketReturns: Record<number, number>;
  // 政府债券回报率 (%)
  bondReturns: Record<number, number>;
  // 储蓄账户利率 (%)
  savingsRates: Record<number, number>;
  // 房地产回报率 (可选，%)
  realEstateReturns?: Record<number, number>;
}

export type InvestmentCategory = 'cash' | 'bonds' | 'stocks' | 'realEstate' | 'custom' | 'none';

export interface InvestmentTypeInfo {
  id: InvestmentCategory;
  name: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface HistoricalDataSources {
  inflation: string;
  stocks: string;
  bonds: string;
  cash: string;
  realEstate?: string;
}
