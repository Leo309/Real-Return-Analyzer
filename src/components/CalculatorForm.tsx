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
      <div className="mb-4">
        <label htmlFor="amount" className={`block font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          {t('calculator.initialAmount')}
        </label>
        <div className="relative">
          <span className={`absolute left-3 top-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {currencySymbol}
          </span>
          <input
            id="amount"
            type="number"
            min="1"
            step="any"
            value={amount || ''}
            onChange={(e) => setAmount(Number(e.target.value) || 0)}
            className={`pl-8 w-full max-w-md p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500
              ${isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'border-gray-300 text-gray-900'}`}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="startYear" className={`block font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            {t('calculator.startYear')}
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
            {t('calculator.endYear')}
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

      <button
        type="submit"
        className={`w-full py-2 px-4 rounded font-medium transition-colors mt-6 flex items-center justify-center
          ${isDarkMode
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
      >
        {t('calculator.calculateButton')}
        <ArrowRight size={16} className="ml-2" />
      </button>
    </form>
  );
};
export default CalculatorForm;