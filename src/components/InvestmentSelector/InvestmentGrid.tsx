import React from 'react';
import InvestmentCard from './InvestmentCard';
import { ArrowLeft } from 'lucide-react';
import useCalculatorStore from '@/store/calculatorStore';
import { useTranslation } from '@/hooks/useTranslation';
import { historicalData } from '@/data/historical';
import { InvestmentType } from '@/lib/calculatorUtils';

const InvestmentGrid: React.FC = () => {
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
    averageReturn: number | null
  }> = [
    {
      type: 'none',
      yearsAvailable: baseCoverage.yearsAvailable,
      startYear: baseCoverage.startYear,
      endYear: baseCoverage.endYear,
      averageReturn: 0
    },

    ...investmentCoverage
      .filter(coverage => coverage.investmentType !== 'none')
      .map(coverage => ({
        type: coverage.investmentType as InvestmentType,
        yearsAvailable: coverage.yearsAvailable,
        startYear: coverage.startYear,
        endYear: coverage.endYear,
        averageReturn: coverage.averageReturn ?? null
      })),

    {
      type: 'custom',
      yearsAvailable: baseCoverage.yearsAvailable,
      startYear: baseCoverage.startYear,
      endYear: baseCoverage.endYear,
      averageReturn: null
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-4">
        <button
          onClick={handleBack}
          className="flex items-center text-base py-2 px-3 rounded-lg transition-colors back-button bg-[var(--accent)] hover:bg-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--foreground)]"
        >
          <ArrowLeft size={20} className="mr-2" />
          {t('investmentSelector.backToRegions')}
        </button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-3 text-[var(--foreground)]">
          {t('investmentSelector.title')}
        </h1>
        <p className="text-lg text-[var(--text-secondary)]">
          {t('investmentSelector.subtitle')} {countryData?.name || countryCode}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allInvestmentTypes.map((investment) => (
          <InvestmentCard
            key={investment.type}
            investmentType={investment.type}
            onClick={() => handleSelectInvestment(investment.type)}
            yearsAvailable={investment.yearsAvailable}
            startYear={investment.startYear}
            endYear={investment.endYear}
            averageReturn={investment.averageReturn}
          />
        ))}
      </div>
    </div>
  );
};

export default InvestmentGrid;
