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

// Investment type styling - improved with consistent, accessible colors
const investmentTypeInfo: Record<string, { icon: React.ReactNode; bgLight: string; bgDark: string; iconLight: string; iconDark: string; borderLight: string; borderDark: string }> = {
  none: { 
    icon: <BanknoteIcon size={24} />, 
    bgLight: 'bg-gray-100', 
    bgDark: 'bg-gray-800/50',
    iconLight: 'bg-gray-200 text-gray-600',
    iconDark: 'bg-gray-700 text-gray-300',
    borderLight: 'border-gray-200',
    borderDark: 'border-gray-700'
  },
  cash: { 
    icon: <Wallet size={24} />, 
    bgLight: 'bg-blue-50', 
    bgDark: 'bg-blue-900/20',
    iconLight: 'bg-blue-100 text-blue-600',
    iconDark: 'bg-blue-800/50 text-blue-300',
    borderLight: 'border-blue-100',
    borderDark: 'border-blue-800/50'
  },
  bonds: { 
    icon: <DollarSign size={24} />, 
    bgLight: 'bg-green-50', 
    bgDark: 'bg-green-900/20',
    iconLight: 'bg-green-100 text-green-600',
    iconDark: 'bg-green-800/50 text-green-300',
    borderLight: 'border-green-100',
    borderDark: 'border-green-800/50'
  },
  stocks: { 
    icon: <LineChart size={24} />, 
    bgLight: 'bg-purple-50', 
    bgDark: 'bg-purple-900/20',
    iconLight: 'bg-purple-100 text-purple-600',
    iconDark: 'bg-purple-800/50 text-purple-300',
    borderLight: 'border-purple-100',
    borderDark: 'border-purple-800/50'
  },
  realEstate: { 
    icon: <Building size={24} />, 
    bgLight: 'bg-amber-50', 
    bgDark: 'bg-amber-900/20',
    iconLight: 'bg-amber-100 text-amber-600',
    iconDark: 'bg-amber-800/50 text-amber-300',
    borderLight: 'border-amber-100',
    borderDark: 'border-amber-800/50'
  },
  custom: { 
    icon: <Wand2 size={24} />, 
    bgLight: 'bg-gray-50', 
    bgDark: 'bg-gray-800/30',
    iconLight: 'bg-gray-200 text-gray-600',
    iconDark: 'bg-gray-700 text-gray-300',
    borderLight: 'border-gray-200',
    borderDark: 'border-gray-700'
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
  const { icon, bgLight, bgDark, iconLight, iconDark, borderLight, borderDark } = 
    investmentTypeInfo[investmentType] || investmentTypeInfo.none;
  
  // Determine the badge style based on data completeness
  let badgeColor, badgeIcon;
  if (dataCompleteness === 'full') {
    badgeColor = darkMode ? 'bg-green-800/60 text-green-200' : 'bg-green-100 text-green-800';
    badgeIcon = <Check size={14} />;
  } else if (dataCompleteness === 'partial') {
    badgeColor = darkMode ? 'bg-yellow-800/60 text-yellow-200' : 'bg-yellow-100 text-yellow-800';
    badgeIcon = <Info size={14} />;
  } else {
    badgeColor = darkMode ? 'bg-red-800/60 text-red-200' : 'bg-red-100 text-red-800';
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
    <div className={`block w-full rounded-xl overflow-hidden shadow-sm transition-all duration-300
      hover:shadow-md transform hover:translate-y-[-2px] h-full
      ${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'}`}>
      {/* Top color banner - made full width to ensure consistency */}
      <div className={`w-full ${darkMode ? bgDark : bgLight}`} style={{height: "80px"}}>
        <div className="h-full flex items-center justify-center">
          <div className={`p-3 rounded-full ${darkMode ? iconDark : iconLight}`}>
            {icon}
          </div>
        </div>
      </div>
      
      {/* Content section with clickable area */}
      <button
        onClick={onClick}
        className={`w-full text-left p-5 block border-t ${darkMode ? borderDark : borderLight}`}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t(`investmentTypes.${investmentType}.name`)}
          </h3>
          <ChevronRight className={darkMode ? 'text-gray-400' : 'text-gray-500'} size={20} />
        </div>
        
        {/* Fixed height description area */}
        <p className={`text-sm mb-3 line-clamp-2 min-h-[40px] ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {t(`investmentTypes.${investmentType}.description`)}
        </p>
        
        {/* Data completeness badge - shown for all except custom */}
        {investmentType !== 'custom' && (
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
              <span className="mr-1">{badgeIcon}</span>
              {t(`regionSelector.dataCompleteness.${dataCompleteness}`)}
            </span>
          </div>
        )}
        
        {/* Return rate badges - consistent display */}
        {investmentType !== 'custom' && returnRateBadge}
        
        {/* Years available info - shown for all except custom */}
        {investmentType !== 'custom' && (
          <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('investmentSelector.availableYears', { years: yearsAvailable, startYear, endYear })}
          </p>
        )}
        
        {/* Custom rate specific message */}
        {investmentType === 'custom' && (
          <p className={`text-xs italic mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('investmentSelector.customRateDescription') || 'Define your own custom rate of return'}
          </p>
        )}
      </button>
    </div>
  );
};

export default InvestmentCard;