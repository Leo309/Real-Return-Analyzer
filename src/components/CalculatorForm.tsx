import React from 'react';
import useCalculatorStore from '@/store/calculatorStore';
import { ArrowRight } from 'lucide-react';
import { historicalData } from '@/data/historical';
import { useTranslation } from '@/hooks/useTranslation';

const CalculatorForm: React.FC = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculate();
  };

  const countryData = historicalData[countryCode];
  const currencySymbol = countryData?.symbol || '$';

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto py-5 px-4 space-y-6 bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
      {/* Initial Amount */}
      <div>
        <label htmlFor="amount" className="block text-base font-medium mb-2 text-[var(--foreground)]">
          {t('calculator.initialAmount') || 'Initial Amount'}
        </label>
        <div className="bg-[var(--accent)] rounded-lg flex items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-xl text-[var(--text-secondary)]">{currencySymbol}</span>
            </div>
            <input
              type="number"
              id="amount"
              min="1"
              step="any"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="block w-full pl-8 py-3 text-lg border-0 focus:ring-2 focus:ring-[var(--primary)] focus:outline-none rounded-lg bg-[var(--accent)] text-[var(--foreground)]"
              placeholder="0"
              required
            />
          </div>
          <div className="flex space-x-1 px-2">
            {[1000, 10000, 100000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setAmount(val)}
                className="text-sm px-2.5 py-1 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-colors"
              >
                {val >= 1000 ? `${val / 1000}K` : val}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Start Year */}
        <div>
          <label htmlFor="startYear" className="block text-base font-medium mb-2 text-[var(--foreground)]">
            {t('calculator.startYear') || 'Start Year'}
          </label>
          <select
            id="startYear"
            value={startYear}
            onChange={(e) => setStartYear(Number(e.target.value))}
            className="block w-full py-2 pl-3 pr-10 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--accent)] text-[var(--foreground)] border border-[var(--border)]"
          >
            {availableYears.map((year) => (
              <option key={`start-${year}`} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* End Year */}
        <div>
          <label htmlFor="endYear" className="block text-base font-medium mb-2 text-[var(--foreground)]">
            {t('calculator.endYear') || 'End Year'}
          </label>
          <select
            id="endYear"
            value={endYear}
            onChange={(e) => setEndYear(Number(e.target.value))}
            className="block w-full py-2 pl-3 pr-10 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--accent)] text-[var(--foreground)] border border-[var(--border)]"
          >
            {availableYears.filter(year => year >= startYear).map((year) => (
              <option key={`end-${year}`} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Custom Rate Input */}
      {investmentType === 'custom' && (
        <div>
          <label htmlFor="customRate" className="block text-base font-medium mb-2 text-[var(--foreground)]">
            {t('calculator.customRate') || 'Custom Annual Return Rate (%)'}
          </label>
          <div className="bg-[var(--accent)] rounded-lg flex items-center">
            <div className="relative flex-grow">
              <input
                type="number"
                id="customRate"
                min="-50"
                max="100"
                step="0.1"
                value={customRate || ''}
                onChange={(e) => setCustomRate(Number(e.target.value) || null)}
                className="block w-full px-3 py-3 text-lg border-0 focus:ring-2 focus:ring-[var(--primary)] focus:outline-none rounded-lg bg-[var(--accent)] text-[var(--foreground)]"
                placeholder="5.0"
                required
              />
            </div>
            <div className="flex space-x-1 px-3">
              <span className="text-lg text-[var(--text-secondary)]">%</span>
            </div>
          </div>
          <p className="text-sm mt-1 text-[var(--text-secondary)]">
            {t('calculator.customRateHint') || 'Enter the expected annual return rate for your custom investment'}
          </p>
        </div>
      )}

      {/* Calculate Button */}
      <div className="flex justify-center pt-2">
        <button
          type="submit"
          className="py-3 px-8 rounded-lg flex items-center justify-center font-medium bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-opacity"
        >
          {t('calculator.calculateButton') || 'Calculate'}
          <ArrowRight size={18} className="ml-2" strokeWidth={2} />
        </button>
      </div>
    </form>
  );
};

export default CalculatorForm;
