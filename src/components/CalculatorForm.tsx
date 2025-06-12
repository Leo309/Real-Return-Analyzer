import React from 'react';
import useCalculatorStore from '@/store/calculatorStore';
import { ArrowRight } from 'lucide-react';
import { historicalData } from '@/data/historical';
import { useTranslation } from '@/hooks/useTranslation';
import { getThemeColor } from '@/lib/themeColors';

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
    investmentType,
    customRate,
    setAmount,
    setStartYear,
    setEndYear,
    setCustomRate,
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
    <form onSubmit={handleSubmit} className={`w-full max-w-md mx-auto py-5 px-4 space-y-6 ${isDarkMode ? 'bg-gray-800/70' : 'bg-white'} rounded-lg ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border shadow-sm`}>
      {/* Initial Amount */}
      <div>
        <label htmlFor="amount" className={`block text-base font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          {t('calculator.initialAmount') || 'Initial Amount'}
        </label>
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg flex items-center`}>
          <div className={`relative flex-grow`}>
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
              className={`block w-full pl-8 py-3 text-lg border-0 ${
                isDarkMode ? 'focus:ring-blue-400' : 'focus:ring-blue-500'
              } focus:ring-2 focus:outline-none rounded-lg ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'
              }`}
              placeholder="0"
              required
            />
          </div>
          <div className="flex space-x-1 px-2">
            <button 
              type="button" 
              onClick={() => setAmount(1000)} 
              className={`text-sm px-2 py-1 rounded-md ${
                isDarkMode 
                  ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              } transition-colors`}
            >
              1K
            </button>
            <button 
              type="button" 
              onClick={() => setAmount(10000)} 
              className={`text-sm px-2 py-1 rounded-md ${
                isDarkMode 
                  ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              } transition-colors`}
            >
              10K
            </button>
            <button 
              type="button" 
              onClick={() => setAmount(100000)} 
              className={`text-sm px-2 py-1 rounded-md ${
                isDarkMode 
                  ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              } transition-colors`}
            >
              100K
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Start Year */}
        <div>
          <label htmlFor="startYear" className={`block text-base font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            {t('calculator.startYear') || 'Start Year'}
          </label>
          <select
            id="startYear"
            value={startYear}
            onChange={(e) => setStartYear(Number(e.target.value))}
            className={`block w-full py-2 pl-3 pr-10 text-base rounded-md focus:outline-none focus:ring-2 ${
              isDarkMode
                ? 'bg-gray-700 text-white border-gray-600 focus:ring-blue-400'
                : 'bg-white text-gray-900 border-gray-300 focus:ring-blue-500'
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
            {t('calculator.endYear') || 'End Year'}
          </label>
          <select
            id="endYear"
            value={endYear}
            onChange={(e) => setEndYear(Number(e.target.value))}
            className={`block w-full py-2 pl-3 pr-10 text-base rounded-md focus:outline-none focus:ring-2 ${
              isDarkMode
                ? 'bg-gray-700 text-white border-gray-600 focus:ring-blue-400'
                : 'bg-white text-gray-900 border-gray-300 focus:ring-blue-500'
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

      {/* Custom Rate Input - only show when investment type is custom */}
      {investmentType === 'custom' && (
        <div>
          <label htmlFor="customRate" className={`block text-base font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            {t('calculator.customRate') || 'Custom Annual Return Rate (%)'}
          </label>
          <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg flex items-center`}>
            <div className={`relative flex-grow`}>
              <input
                type="number"
                id="customRate"
                min="-50"
                max="100"
                step="0.1"
                value={customRate || ''}
                onChange={(e) => setCustomRate(Number(e.target.value) || null)}
                className={`block w-full px-3 py-3 text-lg border-0 ${
                  isDarkMode ? 'focus:ring-blue-400' : 'focus:ring-blue-500'
                } focus:ring-2 focus:outline-none rounded-lg ${
                  isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'
                }`}
                placeholder="5.0"
                required
              />
            </div>
            <div className="flex space-x-1 px-3">
              <span className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>%</span>
            </div>
          </div>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('calculator.customRateHint') || 'Enter the expected annual return rate for your custom investment'}
          </p>
        </div>
      )}

      {/* Calculate Button */}
      <div className="flex justify-center pt-2">
        <button
          type="submit"
          className={`py-3 px-8 rounded-md flex items-center justify-center text-white font-medium ${
            isDarkMode
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-blue-500 hover:bg-blue-600'
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm hover:shadow`}
        >
          {t('calculator.calculateButton') || 'Calculate'}
          <ArrowRight size={18} className="ml-2" strokeWidth={2} />
        </button>
      </div>
    </form>
  );
};

export default CalculatorForm;