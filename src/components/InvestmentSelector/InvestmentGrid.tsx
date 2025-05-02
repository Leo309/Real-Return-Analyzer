import React from 'react';
import InvestmentCard from './InvestmentCard';
import { ArrowLeft } from 'lucide-react';
import useCalculatorStore from '@/store/calculatorStore';
import { useTranslation } from '@/hooks/useTranslation';
import { historicalData } from '@/data/historical';

interface InvestmentGridProps {
  darkMode: boolean;
}

const InvestmentGrid: React.FC<InvestmentGridProps> = ({ darkMode }) => {
  const { t } = useTranslation();
  const { countryCode, getInvestmentCoverageForCountry, setInvestmentType, setStep, goBack } = useCalculatorStore();
  
  const investmentCoverage = getInvestmentCoverageForCountry(countryCode);
  const countryData = historicalData[countryCode];
  
  const handleSelectInvestment = (investmentType: string) => {
    setInvestmentType(investmentType as 'stocks' | 'bonds' | 'realestate' | 'gold' | 'cash' | 'custom' | 'none');
    setStep('calculator');
  };
  
  const handleBack = () => {
    goBack();
  };
  
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
        {/* No Investment option always available */}
        <InvestmentCard
          key="none"
          investmentType="none"
          darkMode={darkMode}
          onClick={() => handleSelectInvestment('none')}
          yearsAvailable={investmentCoverage[0]?.yearsAvailable || 0}
          startYear={investmentCoverage[0]?.startYear || 2000}
          endYear={investmentCoverage[0]?.endYear || new Date().getFullYear()}
          dataCompleteness={investmentCoverage[0]?.dataCompleteness || 'full'}
          averageReturn={0}
        />
        
        {/* Dynamic investment options based on data availability */}
        {investmentCoverage
          .filter((coverage) => coverage.investmentType !== 'none')
          .map((coverage) => (
            <InvestmentCard
              key={coverage.investmentType}
              investmentType={coverage.investmentType}
              darkMode={darkMode}
              onClick={() => handleSelectInvestment(coverage.investmentType)}
              yearsAvailable={coverage.yearsAvailable}
              startYear={coverage.startYear}
              endYear={coverage.endYear}
              dataCompleteness={coverage.dataCompleteness}
              averageReturn={coverage.averageReturn}
            />
          ))}
          
        {/* Custom option always available */}
        <InvestmentCard
          key="custom"
          investmentType="custom"
          darkMode={darkMode}
          onClick={() => handleSelectInvestment('custom')}
          yearsAvailable={investmentCoverage[0]?.yearsAvailable || 0}
          startYear={investmentCoverage[0]?.startYear || 2000}
          endYear={investmentCoverage[0]?.endYear || new Date().getFullYear()}
          dataCompleteness="full"
          averageReturn={null}
        />
      </div>
    </div>
  );
};

export default InvestmentGrid;