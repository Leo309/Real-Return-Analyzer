import React from 'react';
import { countries, getAvailableYears } from '@/data/countries';
import useCalculatorStore from '@/store/calculatorStore';

const CalculatorForm: React.FC = () => {
  const {
    amount,
    countryCode,
    startYear,
    endYear,
    investmentType,
    setAmount,
    setCountryCode,
    setStartYear,
    setEndYear,
    setInvestmentType,
    calculate
  } = useCalculatorStore();
  
  const availableYears = getAvailableYears();
  const countryOptions = Object.values(countries);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculate();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="amount" className="block text-gray-700 font-medium mb-2">
          Initial Amount
        </label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-500">
            {countries[countryCode]?.symbol || '$'}
          </span>
          <input
            id="amount"
            type="number"
            min="1"
            step="100"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="pl-8 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="country" className="block text-gray-700 font-medium mb-2">
          Country
        </label>
        <select
          id="country"
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {countryOptions.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="startYear" className="block text-gray-700 font-medium mb-2">
            Start Year
          </label>
          <select
            id="startYear"
            value={startYear}
            onChange={(e) => setStartYear(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availableYears.map((year) => (
              <option key={`start-${year}`} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="endYear" className="block text-gray-700 font-medium mb-2">
            End Year
          </label>
          <select
            id="endYear"
            value={endYear}
            onChange={(e) => setEndYear(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <label className="block text-gray-700 font-medium mb-2">
          Investment Type
        </label>
        <div className="grid grid-cols-3 gap-2">
          <label className={`
            flex items-center justify-center p-3 border rounded cursor-pointer
            ${investmentType === 'none' ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'}
          `}>
            <input
              type="radio"
              name="investmentType"
              value="none"
              checked={investmentType === 'none'}
              onChange={() => setInvestmentType('none')}
              className="sr-only"
            />
            <span>No Investment</span>
          </label>
          <label className={`
            flex items-center justify-center p-3 border rounded cursor-pointer
            ${investmentType === 'savings' ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'}
          `}>
            <input
              type="radio"
              name="investmentType"
              value="savings"
              checked={investmentType === 'savings'}
              onChange={() => setInvestmentType('savings')}
              className="sr-only"
            />
            <span>Savings Account</span>
          </label>
          <label className={`
            flex items-center justify-center p-3 border rounded cursor-pointer
            ${investmentType === 'stockMarket' ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'}
          `}>
            <input
              type="radio"
              name="investmentType"
              value="stockMarket"
              checked={investmentType === 'stockMarket'}
              onChange={() => setInvestmentType('stockMarket')}
              className="sr-only"
            />
            <span>Stock Market</span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Calculate
      </button>
    </form>
  );
};

export default CalculatorForm;