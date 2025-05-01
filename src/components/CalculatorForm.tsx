import React from 'react';
import { useEffect, useState } from 'react';
import useCalculatorStore from '@/store/calculatorStore';
import { Wand2, HelpCircle, Info } from 'lucide-react';
import { historicalData, getAvailableYears, investmentTypes } from '@/data/historical';
import type { InvestmentType } from '@/lib/calculatorUtils';

interface CalculatorFormProps {
  darkMode?: boolean;
}

type CountryDisplayInfo = {
  code: string;
  name: string;
  flag: string;
  color: string;
};

// 国家信息配置
const countryOptions: CountryDisplayInfo[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸', color: 'blue' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', color: 'red' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', color: 'indigo' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', color: 'amber' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', color: 'rose' },
  { code: 'CN', name: 'China', flag: '🇨🇳', color: 'red' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', color: 'green' },
];

const CalculatorForm: React.FC<CalculatorFormProps> = ({ darkMode = false }) => {
  const {
    amount,
    countryCode,
    startYear,
    endYear,
    investmentType,
    customRate,
    setAmount,
    setCountryCode,
    setStartYear,
    setEndYear,
    setInvestmentType,
    setCustomRate,
    calculate
  } = useCalculatorStore();

  // 本地状态处理自定义利率输入值
  const [customRateInput, setCustomRateInput] = useState('');
  // 显示的国家列表
  const [visibleCountries, setVisibleCountries] = useState<CountryDisplayInfo[]>(countryOptions.slice(0, 2));
  // 投资类型提示
  const [showInvestmentTypeInfo, setShowInvestmentTypeInfo] = useState(false);

  // 当投资类型改变时更新本地输入
  useEffect(() => {
    if (investmentType === 'custom') {
      setCustomRateInput(customRate ? customRate.toString() : '');
    }
  }, [investmentType, customRate]);

  const availableYears = getAvailableYears();
  const isDarkMode = darkMode;

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculate();
  };

  // 处理自定义利率变更
  const handleCustomRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 直接更新输入字段的原始值
    setCustomRateInput(e.target.value);
    // 更新存储的数值
    setCustomRate(Number(e.target.value));
  };

  // 切换显示所有国家
  const toggleShowAllCountries = () => {
    if (visibleCountries.length === 2) {
      setVisibleCountries(countryOptions);
    } else {
      setVisibleCountries(countryOptions.slice(0, 2));
    }
  };

  // 处理国家选择
  const handleCountrySelect = (code: string) => {
    setCountryCode(code);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-lg">
      <div className="mb-4">
        <label htmlFor="amount" className={`block font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Initial Amount
        </label>
        <div className="relative">
          <span className={`absolute left-3 top-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {historicalData[countryCode]?.symbol || '$'}
          </span>
          <input
            id="amount"
            type="number"
            min="1"
            step="any"
            value={amount || ''}
            onChange={(e) => setAmount(Number(e.target.value) || 0)}
            className={`pl-8 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500
              ${isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'border-gray-300 text-gray-900'}`}
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className={`block font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Country
          </label>
          <button
            type="button"
            onClick={toggleShowAllCountries}
            className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-700'}`}>
            {visibleCountries.length === 2 ? 'Show All Countries' : 'Show Less'}
          </button>
        </div>

        <div className={`grid gap-2 ${visibleCountries.length <= 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
          {visibleCountries.map((country) => (
            <button
              key={country.code}
              type="button"
              onClick={() => handleCountrySelect(country.code)}
              className={`flex items-center justify-center p-3 rounded-lg border transition-all
                ${countryCode === country.code
                ? (isDarkMode
                  ? `bg-${country.color}-600 border-${country.color}-500 text-white`
                  : `bg-${country.color}-500 border-${country.color}-400 text-white`)
                : (isDarkMode
                  ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-700')}
              `}
            >
              <span className="text-xl mr-2">{country.flag}</span>
              <span className="text-sm md:text-base truncate">{country.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="startYear" className={`block font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Start Year
          </label>
          <select
            id="startYear"
            value={startYear}
            onChange={(e) => setStartYear(Number(e.target.value))}
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500
              ${isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'border-gray-300 text-gray-900'}`}
          >
            {availableYears.map((year) => (
              <option key={`start-${year}`} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="endYear" className={`block font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            End Year
          </label>
          <select
            id="endYear"
            value={endYear}
            onChange={(e) => setEndYear(Number(e.target.value))}
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500
              ${isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'border-gray-300 text-gray-900'}`}
          >
            {availableYears.filter(year => year >= startYear).map((year) => (
              <option key={`end-${year}`} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 投资类型 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className={`block font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Investment Type
          </label>
          <button
            type="button"
            onClick={() => setShowInvestmentTypeInfo(!showInvestmentTypeInfo)}
            className={`p-1 rounded-full ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'}`}
          >
            <HelpCircle size={16} />
          </button>
        </div>

        {showInvestmentTypeInfo && (
          <div className={`p-3 mb-3 rounded-lg text-sm ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100 border border-gray-300'}`}>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              <span className="font-medium">No Investment:</span> Calculation shows only inflation impact
            </p>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              <span className="font-medium">Cash/Savings:</span> Low-risk savings or money market accounts
            </p>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              <span className="font-medium">Bonds:</span> Government bonds (10-year treasuries)
            </p>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              <span className="font-medium">Stocks:</span> Stock market index funds (S&P 500, etc.)
            </p>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              <span className="font-medium">Real Estate:</span> National residential property prices
            </p>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              <span className="font-medium">Custom:</span> Set your own annual return rate
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
          <label className={`
            flex items-center justify-center p-3 border rounded cursor-pointer
            ${investmentType === 'none'
              ? (isDarkMode ? 'bg-blue-900/40 border-blue-500' : 'bg-blue-100 border-blue-500')
              : (isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300')}
          `}>
            <input
              type="radio"
              name="investmentType"
              value="none"
              checked={investmentType === 'none'}
              onChange={() => setInvestmentType('none')}
              className="sr-only"
            />
            <span className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>No Investment</span>
          </label>
          <label className={`
            flex items-center justify-center p-3 border rounded cursor-pointer
            ${investmentType === 'cash'
              ? (isDarkMode ? 'bg-blue-900/40 border-blue-500' : 'bg-blue-100 border-blue-500')
              : (isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300')}
          `}>
            <input
              type="radio"
              name="investmentType"
              value="cash"
              checked={investmentType === 'cash'}
              onChange={() => setInvestmentType('cash')}
              className="sr-only"
            />
            <span className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>Cash/Savings</span>
          </label>
          <label className={`
            flex items-center justify-center p-3 border rounded cursor-pointer
            ${investmentType === 'bonds'
              ? (isDarkMode ? 'bg-blue-900/40 border-blue-500' : 'bg-blue-100 border-blue-500')
              : (isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300')}
          `}>
            <input
              type="radio"
              name="investmentType"
              value="bonds"
              checked={investmentType === 'bonds'}
              onChange={() => setInvestmentType('bonds')}
              className="sr-only"
            />
            <span className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>Bonds</span>
          </label>
          <label className={`
            flex items-center justify-center p-3 border rounded cursor-pointer
            ${investmentType === 'stocks'
              ? (isDarkMode ? 'bg-blue-900/40 border-blue-500' : 'bg-blue-100 border-blue-500')
              : (isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300')}
          `}>
            <input
              type="radio"
              name="investmentType"
              value="stocks"
              checked={investmentType === 'stocks'}
              onChange={() => setInvestmentType('stocks')}
              className="sr-only"
            />
            <span className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>Stocks</span>
          </label>
          <label className={`
            flex items-center justify-center p-3 border rounded cursor-pointer
            ${investmentType === 'realEstate'
              ? (isDarkMode ? 'bg-blue-900/40 border-blue-500' : 'bg-blue-100 border-blue-500')
              : (isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300')}
          `}>
            <input
              type="radio"
              name="investmentType"
              value="realEstate"
              checked={investmentType === 'realEstate'}
              onChange={() => setInvestmentType('realEstate')}
              className="sr-only"
            />
            <span className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>Real Estate</span>
          </label>
          <label className={`
            flex items-center justify-center p-3 border rounded cursor-pointer
            ${investmentType === 'custom'
              ? (isDarkMode ? 'bg-purple-900/40 border-purple-500' : 'bg-purple-100 border-purple-500')
              : (isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300')}
          `}>
            <input
              type="radio"
              name="investmentType"
              value="custom"
              checked={investmentType === 'custom'}
              onChange={() => setInvestmentType('custom')}
              className="sr-only"
            />
            <Wand2 size={16} className={`mr-2 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`} />
            <span className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>Custom</span>
          </label>
        </div>

        {/* 显示投资类型的说明 */}
        {investmentType !== 'none' && investmentType !== 'custom' && (
          <div className={`text-xs p-2 rounded mt-1 ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
            <p className="flex gap-1 items-center">
              <Info size={12} />
              {investmentType === 'cash' && 'Based on historical short-term interest rates and savings accounts.'}
              {investmentType === 'bonds' && 'Based on historical 10-year government bond returns.'}
              {investmentType === 'stocks' && `Based on ${countryCode === 'US' ? 'S&P 500' : countryCode === 'CA' ? 'S&P/TSX' : 'major stock market'} total returns including dividends.`}
              {investmentType === 'realEstate' && 'Based on residential property price indexes (not including rental income).'}
            </p>
          </div>
        )}

        {/* 自定义利率输入 */}
        {investmentType === 'custom' && (
          <div className="mt-4 animate-fade-in">
            <label htmlFor="customRate" className={`block font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Expected Annual Return (%)
            </label>
            <input
              id="customRate"
              type="number"
              min="-20"
              max="50"
              step="0.1"
              value={customRateInput}
              onChange={handleCustomRateChange}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500
                ${isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'border-gray-300 text-gray-900 placeholder-gray-500'}`}
              placeholder="Enter annual return percentage"
              required
            />
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Example: For 8.5% annual return, enter 8.5
            </p>
          </div>
        )}
      </div>

      <button
        type="submit"
        className={`w-full py-2 px-4 rounded font-medium transition-colors
          ${isDarkMode
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
      >
        Calculate
      </button>
    </form>
  );
};
export default CalculatorForm;