import React from 'react';
import { useEffect, useState } from 'react';
import useCalculatorStore from '@/store/calculatorStore';
import { HelpCircle, ArrowRight } from 'lucide-react';
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
    investmentType,
    customRate,
    setAmount,
    setStartYear,
    setEndYear,
    setCustomRate,
    calculate,
    getAvailableYearsForCountry
  } = useCalculatorStore();

  // Local state for custom rate input
  const [customRateInput, setCustomRateInput] = useState('');
  // Investment type tooltip
  const [showInvestmentTypeInfo, setShowInvestmentTypeInfo] = useState(false);

  // Update local input when investment type changes
  useEffect(() => {
    if (investmentType === 'custom') {
      setCustomRateInput(customRate ? customRate.toString() : '');
    }
  }, [investmentType, customRate]);

  const availableYears = getAvailableYearsForCountry(countryCode);
  const isDarkMode = darkMode;

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculate();
  };

  // Handle custom rate change
  const handleCustomRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update input field's raw value
    setCustomRateInput(e.target.value);
    // Update stored numeric value
    setCustomRate(Number(e.target.value));
  };

  // Get country data
  const countryData = historicalData[countryCode];
  const currencySymbol = countryData?.symbol || '$';

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-lg w-full max-w-xl mx-auto">
      <div className="mb-6">
        <label htmlFor="amount" className={`block font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          {t('calculator.initialAmount')}
        </label>
        <div className="relative w-full max-w-md mx-auto border-b-2 border-gray-300 focus-within:border-blue-500 transition-colors pb-2 group">
          <span className={`absolute left-0 top-0 text-xl font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {currencySymbol}
          </span>
          <input
            id="amount"
            type="number"
            min="1"
            step="any"
            value={amount || ''}
            onChange={(e) => setAmount(Number(e.target.value) || 0)}
            className={`text-right w-full pl-8 bg-transparent text-2xl focus:outline-none ${isDarkMode
              ? 'text-white'
              : 'text-gray-800'}`}
            required
          />
        </div>
      </div>

      <div className="mb-6 w-full max-w-md mx-auto">
        <div className="flex justify-between items-center mb-2">
          <label className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            {t('calculator.timeRange')}
          </label>
          <div className="flex space-x-2">
            <button 
              type="button" 
              onClick={() => {
                const currentYear = new Date().getFullYear();
                setStartYear(currentYear - 10);
                setEndYear(currentYear);
              }}
              className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            >
              10Y
            </button>
            <button 
              type="button" 
              onClick={() => {
                const currentYear = new Date().getFullYear();
                setStartYear(currentYear - 20);
                setEndYear(currentYear);
              }}
              className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            >
              20Y
            </button>
            <button 
              type="button" 
              onClick={() => {
                const currentYear = new Date().getFullYear();
                setStartYear(currentYear - 50);
                setEndYear(currentYear);
              }}
              className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            >
              50Y
            </button>
          </div>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-inner">
          <div className="flex justify-between mb-2">
            <div className="text-center">
              <span className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>From</span>
              <div className="relative inline-block">
                <select
                  id="startYear"
                  value={startYear}
                  onChange={(e) => setStartYear(Number(e.target.value))}
                  className={`appearance-none py-1 pl-3 pr-7 rounded border-0 text-lg font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
                >
                  {availableYears.map((year) => (
                    <option key={`start-${year}`} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <span className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>To</span>
              <div className="relative inline-block">
                <select
                  id="endYear"
                  value={endYear}
                  onChange={(e) => setEndYear(Number(e.target.value))}
                  className={`appearance-none py-1 pl-3 pr-7 rounded border-0 text-lg font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
                >
                  {availableYears.filter(year => year >= startYear).map((year) => (
                    <option key={`end-${year}`} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 px-2">
            <div className="relative h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
              {/* Duration indicator */}
              <div 
                className="absolute h-full bg-blue-500 dark:bg-blue-600"
                style={{
                  left: `${((startYear - availableYears[0]) / (availableYears[availableYears.length-1] - availableYears[0])) * 100}%`,
                  right: `${100 - ((endYear - availableYears[0]) / (availableYears[availableYears.length-1] - availableYears[0])) * 100}%`
                }}
              ></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{availableYears[0]}</span>
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{availableYears[availableYears.length-1]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Investment type information */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <label className={`block font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Selected: {t(`investmentTypes.${investmentType}.name`)}
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
              <span className="font-medium">{t(`investmentTypes.${investmentType}.name`)}:</span> {t(`investmentTypes.${investmentType}.description`)}
            </p>
          </div>
        )}
      </div>

      {/* Custom rate input */}
      {investmentType === 'custom' && (
        <div className="mt-4 animate-fadeIn">
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
            className={`w-full max-w-md p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500
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

      <div className="flex justify-center mt-8 mb-2">
        <button
          type="submit"
          className={`px-8 py-3 rounded-full font-medium text-base shadow-lg transform transition-all duration-300 flex items-center
            ${isDarkMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30 hover:shadow-blue-600/40 hover:translate-y-[-2px]'
              : 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/30 hover:shadow-lg hover:translate-y-[-2px]'}`}
        >
          Calculate
          <ArrowRight size={18} className="ml-2" strokeWidth={2.5} />
        </button>
      </div>
    </form>
  );
};
export default CalculatorForm;