import React from 'react';
import { ChevronRight } from 'lucide-react';

interface RegionCardProps {
  countryCode: string;
  startYear: number;
  endYear: number;
  onClick: () => void;
}

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
  onClick,
}) => {
  const country = countryInfo[countryCode] || { name: countryCode, flag: '🌍' };

  return (
    <button
      onClick={onClick}
      className="block w-full rounded-xl overflow-hidden transition-all duration-200 border border-[var(--border)] bg-[var(--card-bg)] hover:bg-[var(--card-hover)]"
    >
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl mr-3" role="img" aria-label={country.name}>
              {country.flag}
            </span>
            <div>
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                {country.name}
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {startYear}–{endYear}
              </p>
            </div>
          </div>
          <ChevronRight className="text-[var(--text-secondary)]" size={18} />
        </div>
      </div>
    </button>
  );
};

export default RegionCard;
