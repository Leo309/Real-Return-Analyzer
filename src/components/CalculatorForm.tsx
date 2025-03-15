import React from 'react';
import { useEffect, useState } from 'react';
import { countries, getAvailableYears } from '@/data/countries';
import useCalculatorStore from '@/store/calculatorStore';
import { TrendingUp, DollarSign, Wand2, Flag } from 'lucide-react';

interface CalculatorFormProps {
  darkMode?: boolean;
}

const CalculatorForm: React.FC<CalculatorFormProps> = () => {
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

  const availableYears = getAvailableYears();
  const countryOptions = Object.values(countries);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculate();
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-lg">
      <div className="mb-4">
        <label htmlFor="amount" className="block font-medium mb-2 dark:text-gray-200 text-gray-700">
          Initial Amount
        </label>
        <div className="relative">
          <span className="absolute left-3 top-3 dark:text-gray-400 text-gray-500">
            {countries[countryCode]?.symbol || '$'}
          </span>
          <input
            id="amount"
            type="number"
            min="1"
            step="any"
            value={amount || ''}
            onChange={(e) => setAmount(Number(e.target.value) || 0)}
            className="pl-8 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-gray-300 text-gray-900"
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2 dark:text-gray-200 text-gray-700">
          Country
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCountryCode('US')}
            className={`flex-1 p-3 rounded-lg border transition-all
              ${countryCode === 'US'
                ? 'bg-blue-500 border-blue-400 text-white dark:bg-blue-600 dark:border-blue-500'
                : 'bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:text-gray-300'}`}
          >
            <span className="text-xl mr-2">🇺🇸</span>
            United States
          </button>

          <button
            type="button"
            onClick={() => setCountryCode('CA')}
            className={`flex-1 p-3 rounded-lg border transition-all
              ${countryCode === 'CA'
                ? 'bg-red-500 border-red-400 text-white dark:bg-red-600 dark:border-red-500'
                : 'bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:text-gray-300'}`}
          >
            <span className="text-xl mr-2">🇨🇦</span>
            Canada
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="startYear" className="block font-medium mb-2 dark:text-gray-200 text-gray-700">
            Start Year
          </label>
          <select
            id="startYear"
            value={startYear}
            onChange={(e) => setStartYear(Number(e.target.value))}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-gray-300 text-gray-900"
          >
            {availableYears.map((year) => (
              <option key={`start-${year}`} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="endYear" className="block font-medium mb-2 dark:text-gray-200 text-gray-700">
            End Year
          </label>
          <select
            id="endYear"
            value={endYear}
            onChange={(e) => setEndYear(Number(e.target.value))}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-gray-300 text-gray-900"
          >
            {availableYears.filter(year => year >= startYear).map((year) => (
              <option key={`end-${year}`} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label className="block font-medium mb-2 dark:text-gray-200 text-gray-700">
          Investment Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className={`
            flex items-center justify-center p-3 border rounded cursor-pointer
            ${investmentType === 'none'
              ? 'bg-blue-100 border-blue-500 dark:bg-blue-900/40 dark:border-blue-500'
              : 'bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600'}`}
          >
            <input
              type="radio"
              name="investmentType"
              value="none"
              checked={investmentType === 'none'}
              onChange={() => setInvestmentType('none')}
              className="sr-only"
            />
            <span className="dark:text-gray-200 text-gray-900">No Investment</span>
          </label>
          
          {/* 其他投资选项保持相同修改模式 */}
          <label className={`
            flex items-center justify-center p-3 border rounded cursor-pointer
            ${investmentType === 'savings'
              ? 'bg-blue-100 border-blue-500 dark:bg-blue-900/40 dark:border-blue-500'
              : 'bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600'}`}
          >
            <input
              type="radio"
              name="investmentType"
              value="savings"
              checked={investmentType === 'savings'}
              onChange={() => setInvestmentType('savings')}
              className="sr-only"
            />
            <span className="dark:text-gray-200 text-gray-900">Savings Account</span>
          </label>

          <label className={`
            flex items-center justify-center p-3 border rounded cursor-pointer
            ${investmentType === 'stockMarket'
              ? 'bg-blue-100 border-blue-500 dark:bg-blue-900/40 dark:border-blue-500'
              : 'bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600'}`}
          >
            <input
              type="radio"
              name="investmentType"
              value="stockMarket"
              checked={investmentType === 'stockMarket'}
              onChange={() => setInvestmentType('stockMarket')}
              className="sr-only"
            />
            <span className="dark:text-gray-200 text-gray-900">Stock Market</span>
          </label>

          <label className={`
            flex items-center justify-center p-3 border rounded cursor-pointer
            ${investmentType === 'custom'
              ? 'bg-purple-100 border-purple-500 dark:bg-purple-900/40 dark:border-purple-500'
              : 'bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600'}`}
          >
            <input
              type="radio"
              name="investmentType"
              value="custom"
              checked={investmentType === 'custom'}
              onChange={() => setInvestmentType('custom')}
              className="sr-only"
            />
            <Wand2 size={16} className="mr-2 dark:text-purple-300 text-purple-600" />
            <span className="dark:text-gray-200 text-gray-900">Custom</span>
          </label>
        </div>

        {investmentType === 'custom' && (
          <div className="mt-4 animate-fade-in">
            <label htmlFor="customRate" className="block font-medium mb-2 dark:text-gray-200 text-gray-700">
              Expected Annual Return (%)
            </label>
            <input
              id="customRate"
              type="number"
              min="0"
              max="50"
              step="0.1"
              value={customRate ?? ''}
              onChange={(e) => setCustomRate(Number(e.target.value))}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white border-gray-300 text-gray-900"
              placeholder="Enter annual return percentage"
              required
            />
            <p className="text-xs mt-1 dark:text-gray-400 text-gray-500">
              Example: For 8.5% annual return, enter 8.5
            </p>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 rounded font-medium transition-colors bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        Calculate
      </button>
    </form>
  );
};

export default CalculatorForm;