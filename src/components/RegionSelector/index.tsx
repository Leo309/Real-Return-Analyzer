import React from 'react';
import RegionGrid from './RegionGrid';

interface RegionSelectorProps {
  darkMode: boolean;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({ darkMode }) => {
  return (
    <div className="w-full">
      <RegionGrid darkMode={darkMode} />
    </div>
  );
};

export default RegionSelector;