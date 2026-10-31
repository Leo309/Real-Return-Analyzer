import React, { useState } from 'react';
import { Share2, Copy, Check, Twitter, Facebook, Linkedin, Instagram } from 'lucide-react';
import useCalculatorStore from '@/store/calculatorStore';
import { historicalData } from '@/data/historical';
import { useTranslation } from '@/hooks/useTranslation';

const ShareCard: React.FC = () => {
  const { result, amount, countryCode, startYear, endYear, investmentType, customRate } = useCalculatorStore();
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  if (!result || !amount) return null;

  const countryData = historicalData[countryCode];

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
        case 'cash': return t('investmentTypes.cash.name');
        case 'bonds': return t('investmentTypes.bonds.name');
        case 'stocks': return t('investmentTypes.stocks.name');
        case 'realEstate': return t('investmentTypes.realEstate.name');
        case 'custom': return `${t('investmentTypes.custom.name')} (${customRate}%)`;
        default: return t('investmentTypes.none.name');
      }
    })();

    return `I just used the Real Return Analyzer to see how ${originalAmount} would change from ${startYear} to ${endYear} in ${countryData.name}. With ${investmentName}, it would be worth ${finalValue} (${changePercent}% change). Try it yourself at realreturns.skynexdigital.com`;
  };

  const shareUrl = 'https://realreturns.skynexdigital.com';
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
    alert('To share on Instagram, take a screenshot of your results and upload it to Instagram.');
    window.open('https://www.instagram.com', '_blank');
  };

  return (
    <div className="rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--card-bg)] transition-all duration-300">
      <div className="p-5">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center">
            <div className="p-2 rounded-full mr-3 bg-[var(--primary)]/10 text-[var(--primary)]">
              <Share2 size={20} />
            </div>
            <span className="font-medium text-[var(--foreground)]">
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
              stroke="currentColor"
              className="text-[var(--text-secondary)]"
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
            <div className="p-4 rounded-md mb-3 text-sm border border-[var(--border)] bg-[var(--accent)] text-[var(--foreground)]">
              <div className="flex items-center mb-3">
                <span className="text-sm font-bold tracking-tight text-[var(--foreground)] mr-2">SKYNEX</span>
                <span className="text-xs text-[var(--text-secondary)]">realreturns.skynexdigital.com</span>
              </div>
              {shareText}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors bg-[var(--accent)] hover:bg-[var(--border)] text-[var(--foreground)]"
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
                className="flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors bg-[#1DA1F2] hover:bg-[#1a94da] text-white"
              >
                <Twitter size={16} className="mr-1" />
                Twitter
              </button>

              <button
                onClick={handleFacebookShare}
                className="flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors bg-[#1877F2] hover:bg-[#1664c9] text-white"
              >
                <Facebook size={16} className="mr-1" />
                Facebook
              </button>

              <button
                onClick={handleLinkedInShare}
                className="flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors bg-[#0A66C2] hover:bg-[#085096] text-white"
              >
                <Linkedin size={16} className="mr-1" />
                LinkedIn
              </button>

              <button
                onClick={handleInstagramShare}
                className="flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors bg-[#E4405F] hover:bg-[#d33c58] text-white"
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
