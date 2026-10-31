import React from 'react';
import { ChevronRight, TrendingUp, Wand2, Wallet, Building, LineChart, DollarSign, BanknoteIcon } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import type { InvestmentType } from '@/lib/calculatorUtils';

interface InvestmentCardProps {
  investmentType: InvestmentType;
  yearsAvailable: number;
  startYear: number;
  endYear: number;
  onClick: () => void;
  averageReturn: number | null;
}

const investmentTypeInfo: Record<string, { icon: React.ReactNode; accentColor: string }> = {
  none: { icon: <BanknoteIcon size={22} />, accentColor: 'text-[var(--text-secondary)]' },
  cash: { icon: <Wallet size={22} />, accentColor: 'text-blue-500 dark:text-blue-400' },
  bonds: { icon: <DollarSign size={22} />, accentColor: 'text-green-600 dark:text-green-400' },
  stocks: { icon: <LineChart size={22} />, accentColor: 'text-purple-600 dark:text-purple-400' },
  realEstate: { icon: <Building size={22} />, accentColor: 'text-amber-600 dark:text-amber-400' },
  custom: { icon: <Wand2 size={22} />, accentColor: 'text-[var(--text-secondary)]' },
};

const InvestmentCard: React.FC<InvestmentCardProps> = ({
  investmentType,
  yearsAvailable,
  startYear,
  endYear,
  onClick,
  averageReturn,
}) => {
  const { t } = useTranslation();
  const { icon, accentColor } = investmentTypeInfo[investmentType] || investmentTypeInfo.none;

  const returnRateBadge = averageReturn !== null && (
    <div className={`flex items-center mt-2 ${
      averageReturn >= 5
        ? 'text-green-600 dark:text-green-400'
        : averageReturn >= 0
          ? 'text-[var(--primary)]'
          : 'text-red-500 dark:text-red-400'
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
      className="block w-full rounded-xl overflow-hidden transition-all duration-200 border border-[var(--border)] bg-[var(--card-bg)] hover:bg-[var(--card-hover)] h-full text-left"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg bg-[var(--accent)] flex items-center justify-center ${accentColor}`}>
              {icon}
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">
              {t(`investmentTypes.${investmentType}.name`)}
            </h3>
          </div>
          <ChevronRight className="text-[var(--text-secondary)] mt-1" size={18} />
        </div>

        <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2 min-h-[40px] leading-relaxed">
          {t(`investmentTypes.${investmentType}.description`)}
        </p>

        {investmentType !== 'custom' && returnRateBadge}

        {investmentType !== 'custom' && (
          <p className="text-xs mt-2 text-[var(--text-secondary)]">
            {t('investmentSelector.availableYears', { years: yearsAvailable, startYear, endYear })}
          </p>
        )}

        {investmentType === 'custom' && (
          <p className="text-xs italic mt-2 text-[var(--text-secondary)]">
            {t('investmentSelector.customRateDescription') || 'Define your own custom rate of return'}
          </p>
        )}
      </div>
    </button>
  );
};

export default InvestmentCard;
