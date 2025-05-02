import React from 'react';
import InvestmentGrid from './InvestmentGrid';

interface InvestmentSelectorProps {
  darkMode: boolean;
}

const InvestmentSelector: React.FC<InvestmentSelectorProps> = ({ darkMode }) => {
  return (
    <div className="w-full">
      <InvestmentGrid darkMode={darkMode} />
    </div>
  );
};

export default InvestmentSelector;