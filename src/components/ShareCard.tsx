import React, { useState } from 'react';
import { Share2, Copy, Twitter, Facebook, Linkedin, Mail, Check } from 'lucide-react';
import useCalculatorStore from '@/store/calculatorStore';
import { countries } from '@/data/countries';

const ShareCard: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'visual'>('text');
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
    
    return baseText + " #InvestmentTimeMachine";
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
  const mailUrl = `mailto:?subject=Investment Time Machine Results&body=${encodeURIComponent(shareText)}`;
  
  return (
    <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <h3 className={`text-xl font-bold mb-4 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        <Share2 className={`mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} size={20} />
        Share Your Results
      </h3>
      
      {/* Tab Navigation */}
      <div className="flex mb-4 border-b border-gray-200 dark:border-gray-700">
        <button
          className={`py-2 px-4 font-medium text-sm rounded-t-lg ${activeTab === 'text' 
            ? (isDarkMode ? 'bg-gray-700 text-white border-b-2 border-blue-500' : 'bg-gray-100 text-gray-900 border-b-2 border-blue-500') 
            : (isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')}`}
          onClick={() => setActiveTab('text')}
        >
          Text
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm rounded-t-lg ${activeTab === 'visual' 
            ? (isDarkMode ? 'bg-gray-700 text-white border-b-2 border-blue-500' : 'bg-gray-100 text-gray-900 border-b-2 border-blue-500') 
            : (isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')}`}
          onClick={() => setActiveTab('visual')}
        >
          Visual Card
        </button>
      </div>
      
      {/* Content Area */}
      <div className="mb-6">
        {activeTab === 'text' ? (
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{shareText}</p>
          </div>
        ) : (
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white mr-2`}>
                    <Share2 size={16} />
                  </div>
                  <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Investment Time Machine</span>
                </div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>SKYNEX DIGITAL</span>
              </div>
              
              <div className="my-4 space-y-4">
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{startYear} Value:</p>
                  <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(amount)}</p>
                </div>
                
                <div className="flex items-center">
                  <div className={`h-px flex-grow ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <div className={`mx-3 px-2 py-1 rounded ${isDarkMode ? 'bg-blue-900/50 text-blue-200' : 'bg-blue-100 text-blue-700'}`}>
                    {endYear - startYear} years
                  </div>
                  <div className={`h-px flex-grow ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                </div>
                
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{endYear} Value (Inflation Adjusted):</p>
                  <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formatCurrency(result.inflationAdjustedValue)}
                    <span className={`ml-2 text-sm ${percentageChange >= 0 ? (isDarkMode ? 'text-green-400' : 'text-green-600') : (isDarkMode ? 'text-red-400' : 'text-red-600')}`}>
                      {formattedPercentage}
                    </span>
                  </p>
                </div>
                
                {investmentType !== 'none' && (
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{endYear} Value (If Invested):</p>
                    <p className={`text-xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                      {formatCurrency(result.combinedValue)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-3 flex justify-end">
          <button 
            onClick={copyToClipboard}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              copied 
                ? (isDarkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white') 
                : (isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700')
            }`}
          >
            {copied ? <Check size={16} className="mr-1" /> : <Copy size={16} className="mr-1" />}
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <p className={`text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Share your results with friends and colleagues
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <a 
            href={twitterUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`flex items-center justify-center p-3 rounded-lg transition-all ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-blue-900/80 text-blue-300 hover:text-blue-100 border border-gray-600' 
                : 'bg-gray-100 hover:bg-blue-100 text-blue-500 hover:text-blue-700 border border-gray-200'
            }`}
          >
            <Twitter size={20} className="mr-2" />
            <span className="font-medium">Twitter</span>
          </a>
          
          <a 
            href={facebookUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`flex items-center justify-center p-3 rounded-lg transition-all ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-blue-900/80 text-blue-300 hover:text-blue-100 border border-gray-600' 
                : 'bg-gray-100 hover:bg-blue-100 text-blue-500 hover:text-blue-700 border border-gray-200'
            }`}
          >
            <Facebook size={20} className="mr-2" />
            <span className="font-medium">Facebook</span>
          </a>
          
          <a 
            href={linkedinUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`flex items-center justify-center p-3 rounded-lg transition-all ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-blue-900/80 text-blue-300 hover:text-blue-100 border border-gray-600' 
                : 'bg-gray-100 hover:bg-blue-100 text-blue-500 hover:text-blue-700 border border-gray-200'
            }`}
          >
            <Linkedin size={20} className="mr-2" />
            <span className="font-medium">LinkedIn</span>
          </a>
          
          <a 
            href={mailUrl}
            className={`flex items-center justify-center p-3 rounded-lg transition-all ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-blue-900/80 text-blue-300 hover:text-blue-100 border border-gray-600' 
                : 'bg-gray-100 hover:bg-blue-100 text-blue-500 hover:text-blue-700 border border-gray-200'
            }`}
          >
            <Mail size={20} className="mr-2" />
            <span className="font-medium">Email</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ShareCard;