import { HistoricalCountryData, InvestmentTypeInfo, HistoricalDataSources } from './types';
import { usHistoricalData, usDataSources } from './us';
import { canadaHistoricalData, canadaDataSources } from './canada';
import { ukHistoricalData, ukDataSources } from './uk';
import { germanyHistoricalData, germanyDataSources } from './germany';
import { japanHistoricalData, japanDataSources } from './japan';
import { chinaHistoricalData, chinaDataSources } from './china';
import { australiaHistoricalData, australiaDataSources } from './australia';

// 投资类型信息
export const investmentTypes: Record<string, InvestmentTypeInfo> = {
  cash: {
    id: 'cash',
    name: 'Savings Account',
    description: 'Low-risk savings accounts or time deposits with minimal volatility',
    riskLevel: 'low'
  },
  bonds: {
    id: 'bonds',
    name: 'Government Bonds',
    description: '10-year government bonds with moderate risk and typically higher returns than cash',
    riskLevel: 'medium'
  },
  stocks: {
    id: 'stocks',
    name: 'Stock Market',
    description: 'Broad stock market index representing higher risk with potential for higher long-term returns',
    riskLevel: 'high'
  },
  realEstate: {
    id: 'realEstate',
    name: 'Real Estate',
    description: 'Residential property price index showing average housing market performance',
    riskLevel: 'medium'
  },
  custom: {
    id: 'custom',
    name: 'Custom Rate',
    description: 'User-defined annual return rate for comparing custom investment scenarios',
    riskLevel: 'medium'
  },
  none: {
    id: 'none',
    name: 'No Investment',
    description: 'Shows only the impact of inflation without any investment',
    riskLevel: 'low'
  }
};

// 合并所有国家的历史数据
export const historicalData: Record<string, HistoricalCountryData> = {
  US: usHistoricalData,
  CA: canadaHistoricalData,
  UK: ukHistoricalData,
  DE: germanyHistoricalData,
  JP: japanHistoricalData,
  CN: chinaHistoricalData,
  AU: australiaHistoricalData,
};

// 汇总所有数据源
export const dataSources: Record<string, HistoricalDataSources> = {
  US: usDataSources,
  CA: canadaDataSources,
  UK: ukDataSources,
  DE: germanyDataSources,
  JP: japanDataSources,
  CN: chinaDataSources,
  AU: australiaDataSources,
};

// 获取所有可用年份，基于US数据（最完整）
export const getAvailableYears = (): number[] => {
  return Object.keys(historicalData.US.inflationRates)
    .map(year => parseInt(year))
    .sort((a, b) => a - b);
};

// 获取最早可用年份
export const getEarliestYear = (): number => {
  return Math.min(...getAvailableYears());
};

// 获取最新可用年份
export const getLatestYear = (): number => {
  return Math.max(...getAvailableYears());
};

// 获取当前年份
export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

// 导出所有类型
export * from './types';
