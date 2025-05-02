import { Decimal } from 'decimal.js';
import { historicalData } from '@/data/historical';

export type InvestmentType = 'cash' | 'bonds' | 'stocks' | 'realEstate' | 'none' | 'custom';

export interface CalculationResult {
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

/**
 * 计算指定时间段内的通货膨胀和投资影响
 */
export const calculateInflationAndInvestment = (
  amount: number,
  countryCode: string,
  startYear: number,
  endYear: number,
  investmentType: InvestmentType,
  customRate: number | null = null
): CalculationResult => {
  if (!amount || amount <= 0) {
    throw new Error('无效的金额');
  }

  const countryData = historicalData[countryCode];
  if (!countryData) {
    throw new Error('无效的国家选择');
  }

  // 初始化计算变量
  const currentNominal = new Decimal(amount);
  let currentInflationAdjusted = new Decimal(amount);
  let currentOpportunityCost = new Decimal(amount);
  let currentCombined = new Decimal(amount);
  const yearlyBreakdown = [];

  for (let year = startYear; year <= endYear; year++) {
    if (!countryData.inflationRates[year]) continue;

    // 1. 计算通货膨胀影响
    const inflationRate = new Decimal(countryData.inflationRates[year]).dividedBy(100);
    currentInflationAdjusted = currentInflationAdjusted.dividedBy(new Decimal(1).plus(inflationRate));

    // 2. 计算投资收益
    let investmentRate = new Decimal(0);
    if (investmentType === 'cash' && countryData.savingsRates?.[year] !== undefined) {
      investmentRate = new Decimal(countryData.savingsRates[year]).dividedBy(100);
    } else if (investmentType === 'bonds' && countryData.bondReturns?.[year] !== undefined) {
      investmentRate = new Decimal(countryData.bondReturns[year]).dividedBy(100);
    } else if (investmentType === 'stocks' && countryData.stockMarketReturns?.[year] !== undefined) {
      investmentRate = new Decimal(countryData.stockMarketReturns[year]).dividedBy(100);
    } else if (investmentType === 'realEstate' && countryData.realEstateReturns?.[year] !== undefined) {
      investmentRate = new Decimal(countryData.realEstateReturns[year]).dividedBy(100);
    } else if (investmentType === 'custom' && customRate !== null) {
      investmentRate = new Decimal(customRate).dividedBy(100);
    }

    if (investmentType !== 'none') {
      currentOpportunityCost = currentOpportunityCost.times(investmentRate.plus(1));
    }

    // 3. 计算投资收益 + 通货膨胀的综合效果
    if (investmentType !== 'none') {
      currentCombined = currentCombined
        .times(investmentRate.plus(1))
        .dividedBy(inflationRate.plus(1));
    } else {
      currentCombined = currentInflationAdjusted;
    }

    // 记录年度数据
    yearlyBreakdown.push({
      year,
      nominal: currentNominal.toNumber(),
      inflationAdjusted: currentInflationAdjusted.toNumber(),
      opportunityCost: currentOpportunityCost.toNumber(),
      combined: currentCombined.toNumber()
    });
  }

  // 最终结果
  return {
    nominalValue: currentNominal.toNumber(),
    inflationAdjustedValue: currentInflationAdjusted.toNumber(),
    opportunityCostValue: currentOpportunityCost.toNumber(),
    combinedValue: currentCombined.toNumber(),
    yearlyBreakdown
  };
};

/**
 * 获取两个年份之间的平均年度通货膨胀率
 */
export const getAverageInflationRate = (
  countryCode: string,
  startYear: number,
  endYear: number
): number => {
  const countryData = historicalData[countryCode];
  if (!countryData) {
    throw new Error('无效的国家选择');
  }

  let totalRate = new Decimal(0);
  let years = 0;

  for (let year = startYear; year <= endYear; year++) {
    if (countryData.inflationRates[year] !== undefined) {
      totalRate = totalRate.plus(countryData.inflationRates[year]);
      years++;
    }
  }

  return years > 0 ? totalRate.dividedBy(years).toNumber() : 0;
};

/**
 * 获取两个年份之间的平均年度投资回报率
 */
export const getAverageInvestmentReturn = (
  countryCode: string,
  startYear: number,
  endYear: number,
  investmentType: InvestmentType,
  customRate: number | null = null
): number => {
  if (investmentType === 'none') {
    return 0;
  }

  if (investmentType === 'custom' && customRate !== null) {
    return customRate;
  }

  const countryData = historicalData[countryCode];
  if (!countryData) {
    throw new Error('无效的国家选择');
  }

  let totalRate = new Decimal(0);
  let years = 0;
  let rateData: Record<number, number> | undefined;

  if (investmentType === 'cash') {
    rateData = countryData.savingsRates;
  } else if (investmentType === 'bonds') {
    rateData = countryData.bondReturns;
  } else if (investmentType === 'stocks') {
    rateData = countryData.stockMarketReturns;
  } else if (investmentType === 'realEstate') {
    rateData = countryData.realEstateReturns;
  }

  if (!rateData) {
    return 0;
  }

  for (let year = startYear; year <= endYear; year++) {
    if (rateData[year] !== undefined) {
      totalRate = totalRate.plus(rateData[year]);
      years++;
    }
  }

  return years > 0 ? totalRate.dividedBy(years).toNumber() : 0;
};

/**
 * 获取特定国家的CPI基准年份
 */
export const getCPIBaseYear = (countryCode: string): number => {
  const countryData = historicalData[countryCode];
  return countryData?.metadata?.cpiBaseYear || 2010;
};

/**
 * 将金额格式化为货币字符串
 */
export const formatCurrency = (value: number, countryCode: string): string => {
  const countryData = historicalData[countryCode];
  if (!countryData) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: countryData.currency,
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * 将百分比格式化为字符串
 */
export const formatPercentage = (value: number): string => {
  return value.toFixed(2) + '%';
};