// Updates to ResultsDisplay.tsx based on the new design guidelines
// For now, I'm just updating the summary cards section as an example of the new styling approach
// The full file is quite large and contains chart code that would need additional changes

import React from 'react';
import useCalculatorStore from '@/store/calculatorStore';
import { TrendingDown, TrendingUp, DollarSign } from 'lucide-react';
import { historicalData } from '@/data/historical';
import { useTranslation } from '@/hooks/useTranslation';
import { getValueColor } from '@/lib/themeColors';

/**
 * Result Summary Card Component
 * A reusable component for displaying result values with semantic color coding
 */
const ResultSummaryCard = ({ 
  title, 
  value, 
  percentage, 
  isDarkMode,
  currencySymbol,
  icon,
  className = ''
}) => {
  const isNegative = percentage < 0;
  
  return (
    <div className={`p-5 rounded-lg shadow-sm ${
      isDarkMode 
        ? 'bg-gray-800 border border-gray-700' 
        : 'bg-white border border-gray-200'
    } ${className}`}>
      <div className="flex flex-col h-full justify-between">
        <div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold mt-2 mb-1 ${getValueColor(percentage, isDarkMode, 'text')}`}>
            {currencySymbol}{value.toLocaleString()}
          </p>
          
          {percentage !== undefined && (
            <div className="flex items-center mt-1">
              {icon || (
                isNegative 
                  ? <TrendingDown size={16} className={getValueColor(percentage, isDarkMode, 'text')} /> 
                  : <TrendingUp size={16} className={getValueColor(percentage, isDarkMode, 'text')} />
              )}
              <p className={`text-sm font-medium ml-1 ${getValueColor(percentage, isDarkMode, 'text')}`}>
                {`${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Money Lost To Inflation Component
 * A component for displaying money lost to inflation with improved styling
 */
const MoneyLostCard = ({ 
  amount, 
  inflationAdjustedValue, 
  isDarkMode, 
  currencySymbol,
  countryCode
}) => {
  const moneyLost = Math.abs(amount - inflationAdjustedValue);
  
  return (
    <div className={`p-4 rounded-lg ${
      isDarkMode 
        ? 'bg-gray-800 border border-gray-700' 
        : 'bg-white border border-gray-200'
    }`}>
      <div className="flex items-center">
        <div className={`p-2 rounded-full ${
          isDarkMode 
            ? 'bg-red-900/30 text-red-400' 
            : 'bg-red-50 text-red-600'
        }`}>
          <DollarSign size={20} />
        </div>
        <h4 className={`ml-2 font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Money Lost To Inflation: {currencySymbol}{moneyLost.toLocaleString()}
        </h4>
      </div>
      <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        That's equivalent to {Math.round(moneyLost / (countryCode === 'US' ? 5 : 6))} premium coffees
        or {Math.round(moneyLost / (countryCode === 'US' ? 20 : 25))} hours of work.
      </p>
    </div>
  );
};

/**
 * Example implementation of the updated summary cards section for ResultsDisplay
 * This is a partial component to demonstrate the styling approach
 */
const ResultsSummaryCards = () => {
  const { t } = useTranslation();
  const { result, amount, countryCode, startYear, endYear, investmentType } = useCalculatorStore();
  
  // Add dark mode detection
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  
  React.useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
    
    // Add observer for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);
  
  if (!result || !amount) return null;
  
  const countryData = historicalData[countryCode];
  const currencySymbol = countryData?.symbol || '$';
  
  // Calculate changes
  const inflationImpact = ((result.inflationAdjustedValue - amount) / amount) * 100;
  const realInvestmentImpact = investmentType !== 'none'
    ? ((result.combinedValue - amount) / amount) * 100
    : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Original Amount Card */}
      <ResultSummaryCard
        title={`${t('calculator.originalAmount')} (${startYear})`}
        value={amount}
        percentage={0}
        isDarkMode={isDarkMode}
        currencySymbol={currencySymbol}
        icon={null}
      />
      
      {/* True Value Today Card */}
      <ResultSummaryCard
        title={`${t('calculator.trueValueToday')} (${endYear})`}
        value={result.inflationAdjustedValue}
        percentage={inflationImpact}
        isDarkMode={isDarkMode}
        currencySymbol={currencySymbol}
        icon={null}
      />
      
      {/* Real Growth After Inflation Card (conditional) */}
      {investmentType !== 'none' ? (
        <ResultSummaryCard
          title={t('calculator.realGrowthAfterInflation')}
          value={result.combinedValue}
          percentage={realInvestmentImpact}
          isDarkMode={isDarkMode}
          currencySymbol={currencySymbol}
          icon={null}
        />
      ) : (
        <div></div> // Empty div for grid alignment when no investment is selected
      )}
    </div>
  );
};

export {
  ResultSummaryCard,
  MoneyLostCard,
  ResultsSummaryCards
};