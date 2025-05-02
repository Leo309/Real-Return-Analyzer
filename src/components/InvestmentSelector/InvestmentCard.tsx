import React from 'react';
import { ChevronRight, Check, AlertTriangle, Info, Wand2, Wallet, Building, LineChart, DollarSign, TrendingUp, BanknoteIcon } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import type { DataCompleteness } from '@/store/calculatorStore';
import type { InvestmentType } from '@/lib/calculatorUtils';

interface InvestmentCardProps {
  investmentType: InvestmentType;
  yearsAvailable: number;
  startYear: number;
  endYear: number;
  dataCompleteness: DataCompleteness;
  darkMode: boolean;
  onClick: () => void;
  averageReturn: number | null;
}

// Investment type styling
const investmentTypeInfo: Record<string, { icon: React.ReactNode; color: string }> = {
  none: { 
    icon: <BanknoteIcon size={24} />, 
    color: 'gray' 
  },
  cash: { 
    icon: <Wallet size={24} />, 
    color: 'blue' 
  },
  bonds: { 
    icon: <DollarSign size={24} />, 
    color: 'green' 
  },
  stocks: { 
    icon: <LineChart size={24} />, 
    color: 'purple' 
  },
  realEstate: { 
    icon: <Building size={24} />, 
    color: 'amber' 
  },
  custom: { 
    icon: <Wand2 size={24} />, 
    color: 'indigo' 
  },
};

const InvestmentCard: React.FC<InvestmentCardProps> = ({
  investmentType,
  yearsAvailable,
  startYear,
  endYear,
  dataCompleteness,
  darkMode,
  onClick,
  averageReturn,
}) => {
  const { t } = useTranslation();
  const { icon, color } = investmentTypeInfo[investmentType] || investmentTypeInfo.none;
  
  // Determine the badge style based on data completeness
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

  // Generate return rate badge
  const returnRateBadge = averageReturn !== null && (
    <div className={`flex items-center mt-2 ${
      averageReturn >= 5
        ? (darkMode ? 'text-green-300' : 'text-green-600')
        : averageReturn >= 0
          ? (darkMode ? 'text-blue-300' : 'text-blue-600')
          : (darkMode ? 'text-red-300' : 'text-red-600')
    }`}>
      <TrendingUp size={16} className="mr-1" />
      <span className="text-sm font-medium">
        {t('investmentSelector.historicalReturn', { returnRate: averageReturn.toFixed(1) })}
      </span>
    </div>
  );

  return (
    <button
      onClick={onClick}
      className={`block w-full rounded-xl overflow-hidden shadow-md transition-all duration-300
        hover:shadow-xl transform hover:-translate-y-1
        ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
    >
      <div className={`h-16 flex items-center justify-center 
        ${darkMode ? `bg-${color}-900/30` : `bg-${color}-100`}`}
      >
        <span className={`p-2 rounded-full ${darkMode ? `bg-${color}-800/50 text-${color}-200` : `bg-${color}-200 text-${color}-600`}`}>
          {icon}
        </span>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t(`investmentTypes.${investmentType}.name`)}
          </h3>
          <ChevronRight className={darkMode ? 'text-gray-400' : 'text-gray-500'} size={20} />
        </div>
        
        <p className={`text-sm mb-3 line-clamp-2 h-10 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {t(`investmentTypes.${investmentType}.description`)}
        </p>
        
        {investmentType !== 'custom' && investmentType !== 'none' && (
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
              <span className="mr-1">{badgeIcon}</span>
              {t(`regionSelector.dataCompleteness.${dataCompleteness}`)}
            </span>
          </div>
        )}
        
        {investmentType !== 'custom' && returnRateBadge}
        
        {investmentType !== 'custom' && (
          <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('investmentSelector.availableYears', { years: yearsAvailable, startYear, endYear })}
          </p>
        )}
        
        {investmentType === 'custom' && (
          <p className={`text-xs italic mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Define your own custom rate of return
          </p>
        )}
      </div>
    </button>
  );
};

export default InvestmentCard;