import React from 'react';
import useCalculatorStore from '@/store/calculatorStore';
import { ArrowRight } from 'lucide-react';
import { historicalData } from '@/data/historical';
import { useTranslation } from '@/hooks/useTranslation';

interface CalculatorFormProps {
  darkMode?: boolean;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({ darkMode = false }) => {
  const { t } = useTranslation();
  const {
    amount,
    countryCode,
    startYear,
    endYear,
    setAmount,
    setStartYear,
    setEndYear,
    calculate,
    getAvailableYearsForCountry
  } = useCalculatorStore();

  const availableYears = getAvailableYearsForCountry(countryCode);
  const isDarkMode = darkMode;

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculate();
  };

  // Get country data
  const countryData = historicalData[countryCode];
  const currencySymbol = countryData?.symbol || '$';

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto px-4 py-6 space-y-6">
      {/* Initial Amount */}
      <div>
        <label htmlFor="amount" className={`block text-base font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Initial Amount
        </label>
        <div className="flex items-center">
          <div className={`relative flex-grow ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-md`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className={`text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{currencySymbol}</span>
            </div>
            <input
              type="number"
              id="amount"
              min="1"
              step="any"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className={`block w-full pl-8 py-3 text-lg border-0 focus:ring-1 focus:ring-blue-500 focus:outline-none rounded-md ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'
              }`}
              placeholder="0"
              required
            />
          </div>
          <div className="flex ml-3 space-x-2">
            <button 
              type="button" 
              onClick={() => setAmount(1000)} 
              className={`text-sm px-3 py-2 rounded ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              1K
            </button>
            <button 
              type="button" 
              onClick={() => setAmount(10000)} 
              className={`text-sm px-3 py-2 rounded ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              10K
            </button>
            <button 
              type="button" 
              onClick={() => setAmount(100000)} 
              className={`text-sm px-3 py-2 rounded ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              100K
            </button>
          </div>
        </div>
      </div>

      {/* Year Range */}
      <div className="grid grid-cols-2 gap-6">
        {/* Start Year */}
        <div>
          <label htmlFor="startYear" className={`block text-base font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Start Year
          </label>
          <select
            id="startYear"
            value={startYear}
            onChange={(e) => setStartYear(Number(e.target.value))}
            className={`block w-full py-3 pl-3 pr-10 text-base rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              isDarkMode
                ? 'bg-gray-700 text-white border-gray-600'
                : 'bg-white text-gray-900 border-gray-300'
            } border`}
          >
            {availableYears.map((year) => (
              <option key={`start-${year}`} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* End Year */}
        <div>
          <label htmlFor="endYear" className={`block text-base font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            End Year
          </label>
          <select
            id="endYear"
            value={endYear}
            onChange={(e) => setEndYear(Number(e.target.value))}
            className={`block w-full py-3 pl-3 pr-10 text-base rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              isDarkMode
                ? 'bg-gray-700 text-white border-gray-600'
                : 'bg-white text-gray-900 border-gray-300'
            } border`}
          >
            {availableYears.filter(year => year >= startYear).map((year) => (
              <option key={`end-${year}`} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Calculate Button */}
      <div className="flex justify-center pt-4">
        <button
          type="submit"
          className={`py-3 px-8 rounded-md flex items-center justify-center text-white font-medium ${
            isDarkMode
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-blue-500 hover:bg-blue-600'
          } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
        >
          Calculate
          <ArrowRight size={18} className="ml-2" strokeWidth={2} />
        </button>
      </div>
    </form>
  );
};

export default CalculatorForm;