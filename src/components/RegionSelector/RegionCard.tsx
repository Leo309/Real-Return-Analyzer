import React from 'react';
import { ChevronRight, Check, AlertTriangle, Info } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import type { DataCompleteness } from '@/store/calculatorStore';

interface RegionCardProps {
  countryCode: string;
  startYear: number;
  endYear: number;
  dataCompleteness: DataCompleteness;
  darkMode: boolean;
  onClick: () => void;
}

// 定义国家代码到展示信息的映射
const countryInfo: Record<string, { name: string; flag: string }> = {
  US: { name: 'United States', flag: '🇺🇸' },
  CA: { name: 'Canada', flag: '🇨🇦' },
  UK: { name: 'United Kingdom', flag: '🇬🇧' },
  DE: { name: 'Germany', flag: '🇩🇪' },
  JP: { name: 'Japan', flag: '🇯🇵' },
  CN: { name: 'China', flag: '🇨🇳' },
  AU: { name: 'Australia', flag: '🇦🇺' },
};

const RegionCard: React.FC<RegionCardProps> = ({
  countryCode,
  startYear,
  endYear,
  dataCompleteness,
  darkMode,
  onClick,
}) => {
  const { t } = useTranslation();
  const country = countryInfo[countryCode] || { name: countryCode, flag: '🌍' };
  
  const totalYears = endYear - startYear + 1;
  
  // 确定数据完整度徽章的样式
  let badgeColor, badgeIcon;
  if (dataCompleteness === 'full') {
    badgeColor = darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800';
    badgeIcon = <Check size={14} />;
  } else if (dataCompleteness === 'partial') {
    badgeColor = darkMode ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 text-yellow-800';
    badgeIcon = <Info size={14} />;
  } else {
    badgeColor = darkMode ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-800';
    badgeIcon = <AlertTriangle size={14} />;
  }

  return (
    <button
      onClick={onClick}
      className={`block w-full rounded-xl overflow-hidden shadow-md transition-all duration-300
        hover:shadow-xl transform hover:-translate-y-1
        ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-5xl mr-4" role="img" aria-label={country.name}>
              {country.flag}
            </span>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {country.name}
            </h3>
          </div>
          <ChevronRight className={darkMode ? 'text-gray-400' : 'text-gray-500'} size={20} />
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
            <span className="mr-1">{badgeIcon}</span>
            {t(`regionSelector.dataCompleteness.${dataCompleteness}`)}
          </span>
        </div>
        
        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {t('common.dataAvailable')} {t('common.from')} <span className="font-medium">{startYear}</span> {t('common.to')} <span className="font-medium">{endYear}</span>
        </p>
        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {totalYears} {t('common.years')} {t('common.dataAvailable').toLowerCase()}
        </p>
      </div>
    </button>
  );
};

export default RegionCard;