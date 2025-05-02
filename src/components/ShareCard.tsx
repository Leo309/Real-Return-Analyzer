import React, { useState } from 'react';
import Image from 'next/image';
import { Share2, Copy, Check, Twitter, Facebook, Linkedin, Instagram } from 'lucide-react';
import useCalculatorStore from '@/store/calculatorStore';
import { historicalData } from '@/data/historical';
import { useTranslation } from '@/hooks/useTranslation';

const ShareCard: React.FC = () => {
  const { t } = useTranslation();
  const { result, amount, countryCode, startYear, endYear, investmentType, customRate } = useCalculatorStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const isDarkMode = document.documentElement.classList.contains('dark');

  if (!result || !amount) return null;

  const countryData = historicalData[countryCode];
  
  // Generate share text
  const getShareText = () => {
    const formatter = new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: countryData.currency, 
      maximumFractionDigits: 0 
    });
    
    const originalAmount = formatter.format(amount);
    const finalValue = formatter.format(
      investmentType === 'none' ? result.inflationAdjustedValue : result.combinedValue
    );
    
    const changePercent = (
      investmentType === 'none' 
        ? ((result.inflationAdjustedValue - amount) / amount) * 100
        : ((result.combinedValue - amount) / amount) * 100
    ).toFixed(1);
    
    const investmentName = (() => {
      switch(investmentType) {
        case 'cash': return 'Cash/Savings';
        case 'bonds': return 'Government Bonds';
        case 'stocks': return 'Stock Market';
        case 'realEstate': return 'Real Estate';
        case 'custom': return `Custom Investment (${customRate}%)`;
        default: return 'No Investment';
      }
    })();
    
    return `I just used the Inflation Impact Calculator to see how ${originalAmount} would change from ${startYear} to ${endYear} in ${countryData.name}. With ${investmentName}, it would be worth ${finalValue} (${changePercent}% change). Try it yourself at inflation.skynexdigital.com`;
  };
  
  const shareUrl = 'https://inflation.skynexdigital.com';
  const shareText = getShareText();
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  
  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };
  
  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(facebookUrl, '_blank');
  };
  
  const handleLinkedInShare = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedinUrl, '_blank');
  };
  
  const handleInstagramShare = () => {
    // Instagram doesn't support direct sharing via URL like other platforms
    // Typically, users would share a screenshot or use Instagram's story features
    // For now, we'll open Instagram and let the user share manually
    alert('To share on Instagram, take a screenshot of your results and upload it to Instagram.');
    window.open('https://www.instagram.com', '_blank');
  };

  return (
    <div className={`rounded-lg overflow-hidden shadow-md transition-all duration-300 
      ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
    >
      <div className="p-5">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center">
            <div className={`p-2 rounded-full mr-3 ${
              isDarkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-600'
            }`}>
              <Share2 size={20} />
            </div>
            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Share your results
            </span>
          </div>
          <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </button>
        
        {isExpanded && (
          <div className="mt-4 animate-fadeIn">
            <div className={`p-4 rounded-md mb-3 text-sm border ${isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
              <div className="flex items-center mb-3">
                <div className="h-8 relative mr-2">
                  <Image 
                    src={isDarkMode ? "/SKYNEX_500_WHITE.png" : "/SKYNEX_500_BLUE.png"} 
                    alt="SKYNEX" 
                    width={100} 
                    height={30} 
                    className="w-auto h-full object-contain" 
                  />
                </div>
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>inflation.skynexdigital.com</span>
              </div>
              {shareText}
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={handleCopyLink}
                className={`flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
              >
                {copySuccess ? (
                  <>
                    <Check size={16} className="mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} className="mr-1" />
                    Copy
                  </>
                )}
              </button>
              
              <button
                onClick={handleTwitterShare}
                className={`flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors
                  bg-[#1DA1F2] hover:bg-[#1a94da] text-white`}
              >
                <Twitter size={16} className="mr-1" />
                Twitter
              </button>
              
              <button
                onClick={handleFacebookShare}
                className={`flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors
                  bg-[#1877F2] hover:bg-[#1664c9] text-white`}
              >
                <Facebook size={16} className="mr-1" />
                Facebook
              </button>
              
              <button
                onClick={handleLinkedInShare}
                className={`flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors
                  bg-[#0A66C2] hover:bg-[#085096] text-white`}
              >
                <Linkedin size={16} className="mr-1" />
                LinkedIn
              </button>
              
              <button
                onClick={handleInstagramShare}
                className={`flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors
                  bg-[#E4405F] hover:bg-[#d33c58] text-white`}
              >
                <Instagram size={16} className="mr-1" />
                Instagram
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareCard;