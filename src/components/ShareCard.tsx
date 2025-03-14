import React, { useState } from 'react';
import { Share2, Copy, Twitter, Facebook, Linkedin, Mail } from 'lucide-react';
import useCalculatorStore from '@/store/calculatorStore';
import { countries } from '@/data/countries';

const ShareCard: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const { result, amount, countryCode, startYear, endYear, investmentType } = useCalculatorStore();
  const countryData = countries[countryCode];
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  if (!result) return null;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: countryData.currency,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Calculate the percentage change
  const percentageChange = ((result.inflationAdjustedValue - amount) / amount) * 100;
  const formattedPercentage = (percentageChange >= 0 ? '+' : '') + percentageChange.toFixed(2) + '%';
  
  // Generate share text
  const getShareText = () => {
    let baseText = `I calculated that ${formatCurrency(amount)} in ${startYear} is worth ${formatCurrency(result.inflationAdjustedValue)} in ${endYear} (${formattedPercentage}).`;
    
    if (investmentType !== 'none') {
      const investmentTypeText = investmentType === 'stocks' 
        ? 'the stock market' 
        : investmentType === 'savings'
          ? 'a savings account'
          : `a ${useCalculatorStore.getState().customRate}% investment`;
          
      baseText += ` If invested in ${investmentTypeText}, it would be worth ${formatCurrency(result.combinedValue)} today.`;
    }
    
    return baseText + " #InflationCalculator";
  };
  
  const shareText = getShareText();
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  // Generate share URLs
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
  const mailUrl = `mailto:?subject=Inflation Calculator Results&body=${encodeURIComponent(shareText)}`;
  
  return (
    <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
      <h3 className={`text-lg font-semibold mb-4 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        <Share2 className="mr-2" size={20} />
        Share Results
      </h3>
      
      <div className="mb-6">
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{shareText}</p>
        </div>
        
        <div className="mt-2 flex justify-end">
          <button 
            onClick={copyToClipboard}
            className={`flex items-center px-3 py-1 rounded-md text-sm ${
              isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' : 'bg-white hover:bg-gray-100 text-gray-700'
            }`}
          >
            <Copy size={14} className="mr-1" />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
      
      <div className="flex justify-center space-x-4">
        <a 
          href={twitterUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`p-3 rounded-full ${isDarkMode ? 'bg-blue-900/30 hover:bg-blue-900/50' : 'bg-blue-100 hover:bg-blue-200'}`}
        >
          <Twitter size={20} className={isDarkMode ? 'text-blue-300' : 'text-blue-600'} />
        </a>
        <a 
          href={facebookUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`p-3 rounded-full ${isDarkMode ? 'bg-blue-900/30 hover:bg-blue-900/50' : 'bg-blue-100 hover:bg-blue-200'}`}
        >
          <Facebook size={20} className={isDarkMode ? 'text-blue-300' : 'text-blue-600'} />
        </a>
        <a 
          href={linkedinUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`p-3 rounded-full ${isDarkMode ? 'bg-blue-900/30 hover:bg-blue-900/50' : 'bg-blue-100 hover:bg-blue-200'}`}
        >
          <Linkedin size={20} className={isDarkMode ? 'text-blue-300' : 'text-blue-600'} />
        </a>
        <a 
          href={mailUrl}
          className={`p-3 rounded-full ${isDarkMode ? 'bg-blue-900/30 hover:bg-blue-900/50' : 'bg-blue-100 hover:bg-blue-200'}`}
        >
          <Mail size={20} className={isDarkMode ? 'text-blue-300' : 'text-blue-600'} />
        </a>
      </div>
    </div>
  );
};

export default ShareCard;