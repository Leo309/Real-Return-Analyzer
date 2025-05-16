import React from 'react';
import InvestmentCard from './InvestmentCard';
import { ArrowLeft } from 'lucide-react';
import useCalculatorStore from '@/store/calculatorStore';
import { useTranslation } from '@/hooks/useTranslation';
import { historicalData } from '@/data/historical';
import { InvestmentType } from '@/lib/calculatorUtils';

interface InvestmentGridProps {
  darkMode: boolean;
}

const InvestmentGrid: React.FC<InvestmentGridProps> = ({ darkMode }) => {
  const { t } = useTranslation();
  const { countryCode, getInvestmentCoverageForCountry, setInvestmentType, setStep, goBack } = useCalculatorStore();
  
  const investmentCoverage = getInvestmentCoverageForCountry(countryCode);
  const countryData = historicalData[countryCode];
  
  const handleSelectInvestment = (investmentType: string) => {
    setInvestmentType(investmentType as InvestmentType);
    setStep('calculator');
  };
  
  const handleBack = () => {
    goBack();
  };

  // Find base coverage info for consistent data across cards
  const baseCoverage = investmentCoverage.find(c => c.investmentType === 'none') || investmentCoverage[0] || {
    yearsAvailable: 0,
    startYear: 2000,
    endYear: new Date().getFullYear(),
    dataCompleteness: 'full' as const
  };
  
  // Create a unified list of all investment types to render
  const allInvestmentTypes: Array<{
    type: InvestmentType,
    yearsAvailable: number,
    startYear: number,
    endYear: number,
    dataCompleteness: string,
    averageReturn: number | null
  }> = [
    // Add "No Investment" card
    {
      type: 'none',
      yearsAvailable: baseCoverage.yearsAvailable,
      startYear: baseCoverage.startYear,
      endYear: baseCoverage.endYear,
      dataCompleteness: baseCoverage.dataCompleteness,
      averageReturn: 0
    },
    
    // Add all dynamic investment options
    ...investmentCoverage
      .filter(coverage => coverage.investmentType !== 'none')
      .map(coverage => ({
        type: coverage.investmentType as InvestmentType,
        yearsAvailable: coverage.yearsAvailable,
        startYear: coverage.startYear,
        endYear: coverage.endYear,
        dataCompleteness: coverage.dataCompleteness,
        averageReturn: coverage.averageReturn ?? null
      })),
    
    // Add custom option
    {
      type: 'custom',
      yearsAvailable: baseCoverage.yearsAvailable,
      startYear: baseCoverage.startYear,
      endYear: baseCoverage.endYear,
      dataCompleteness: 'full',
      averageReturn: null
    }
  ];
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-4">
        <button
          onClick={handleBack}
          className={`flex items-center text-base py-2 px-3 rounded-lg transition-colors back-button ${
            darkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 hover:text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
          }`}
        >
          <ArrowLeft size={20} className="mr-2" />
          {t('investmentSelector.backToRegions')}
        </button>
      </div>
      
      <div className="text-center mb-8">
        <h1 className={`text-3xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {t('investmentSelector.title')}
        </h1>
        <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {t('investmentSelector.subtitle')} {countryData?.name || countryCode}
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Render all investment cards using the unified list */}
        {allInvestmentTypes.map((investment) => (
          <InvestmentCard
            key={investment.type}
            investmentType={investment.type}
            darkMode={darkMode}
            onClick={() => handleSelectInvestment(investment.type)}
            yearsAvailable={investment.yearsAvailable}
            startYear={investment.startYear}
            endYear={investment.endYear}
            dataCompleteness={investment.dataCompleteness as any}
            averageReturn={investment.averageReturn}
          />
        ))}
      </div>
    </div>
  );
};

export default InvestmentGrid;