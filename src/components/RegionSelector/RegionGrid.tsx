import React from 'react';
import RegionCard from './RegionCard';
import useCalculatorStore from '@/store/calculatorStore';
import { useTranslation } from '@/hooks/useTranslation';

interface RegionGridProps {
  darkMode: boolean;
}

const RegionGrid: React.FC<RegionGridProps> = ({ darkMode }) => {
  const { t } = useTranslation();
  const { availableYearsForRegion, setCountryCode, setStep } = useCalculatorStore();
  
  const handleSelectRegion = (countryCode: string) => {
    setCountryCode(countryCode);
    setStep('investment');
  };
  
  // Get all country codes from the available years data
  const countryCodes = Object.keys(availableYearsForRegion);
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className={`text-3xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {t('regionSelector.title')}
        </h1>
        <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {t('regionSelector.subtitle')}
        </p>
      </div>
      
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`}>
        {countryCodes.map((code) => {
          const { start, end, dataCompleteness } = availableYearsForRegion[code];
          return (
            <RegionCard
              key={code}
              countryCode={code}
              startYear={start}
              endYear={end}
              dataCompleteness={dataCompleteness}
              darkMode={darkMode}
              onClick={() => handleSelectRegion(code)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RegionGrid;