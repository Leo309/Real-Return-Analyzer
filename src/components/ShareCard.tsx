import React, { useState, useRef } from 'react';
import { Share2, Copy, Check, Mail, ArrowUpRight, DownloadCloud, TrendingUp } from 'lucide-react';
import {
  FaXTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaTiktok
} from "react-icons/fa6";
import html2canvas from 'html2canvas';
import useCalculatorStore from '@/store/calculatorStore';
import { countries } from '@/data/countries';

const ShareCard: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'visual'>('visual');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const visualRef = useRef<HTMLDivElement>(null);

  // 从store获取数据
  const { result, amount, countryCode, startYear, endYear, investmentType } = useCalculatorStore();
  const countryData = countries[countryCode];
  const isDarkMode = document.documentElement.classList.contains('dark');

  if (!result || amount === null) return null;

  // 货币格式化
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: countryData.currency,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // 计算百分比变化
  const percentageChange = ((result.inflationAdjustedValue - amount!) / amount!) * 100;
  const formattedPercentage = percentageChange.toFixed(2) + '%';

  // 计算投资价值变化
  const investmentGrowth = investmentType !== 'none'
    ? ((result.combinedValue - amount!) / amount! * 100)
    : 0;
  const formattedInvestmentGrowth = investmentGrowth.toFixed(1) + '%';

  // 生成分享文本
  const getShareText = () => {
    let baseText = `I calculated that ${formatCurrency(amount!)} in ${startYear} is worth ${formatCurrency(result.inflationAdjustedValue)} in ${endYear} (${formattedPercentage}).`;

    if (investmentType !== 'none') {
      const store = useCalculatorStore.getState();
      const investmentTypeText = investmentType === 'stockMarket'
        ? 'the stock market'
        : investmentType === 'savings'
          ? 'a savings account'
          : store.customRate
            ? `a ${store.customRate}% annual return investment`
            : `an investment`;

      baseText += ` If invested in ${investmentTypeText}, it would be worth ${formatCurrency(result.combinedValue)} (${investmentGrowth >= 0 ? '+' : ''}${formattedInvestmentGrowth}) today.`;
    }

    return baseText + " #FinancialWisdom #MoneyManagement";
  };

  const shareText = getShareText();

  // 复制到剪贴板
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // 生成分享图片
  const generateShareImage = async () => {
    if (!visualRef.current) return;

    setIsGeneratingImage(true);
    try {
      const canvas = await html2canvas(visualRef.current, {
        backgroundColor: isDarkMode ? '#0f172a' : '#f9fafb',
        scale: 2,
        useCORS: true,
        logging: true,
        ignoreElements: (element) => {
          // 排除所有可能包含渐变背景的元素
          return element.classList?.contains('bg-gradient-to-br');
        }
      });

      const link = document.createElement('a');
      link.download = `investment-result-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // 社交平台配置
  const socialPlatforms = [
    {
      name: 'Twitter',
      url: `https://x.com/intent/post?text=${encodeURIComponent(shareText)}`,
      icon: <FaXTwitter className="w-4 h-4" />,
      color: 'text-white',
      bg: 'bg-[#000000] hover:bg-[#272727]'
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
      icon: <FaFacebookF className="w-4 h-4" />,
      color: 'text-white',
      bg: 'bg-[#1877f2] hover:bg-[#166fe5]'
    },
    {
      name: 'Instagram',
      icon: <FaInstagram className="w-4 h-4" />,
      action: generateShareImage,
      color: 'text-white',
      bg: 'bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:brightness-110'
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
      icon: <FaLinkedinIn className="w-4 h-4" />,
      color: 'text-white',
      bg: 'bg-[#0a66c2] hover:bg-[#0959ab]'
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/upload?refer=web',
      icon: <FaTiktok className="w-4 h-4" />,
      color: 'text-white',
      bg: 'bg-[#ff0050] hover:bg-[#ff0050]/90'
    },
    {
      name: 'Email',
      url: `mailto:?subject=Investment Time Machine Results&body=${encodeURIComponent(shareText)}`,
      icon: <Mail className="w-4 h-4" />,
      color: 'text-white',
      bg: 'bg-[#ea4335] hover:bg-[#d33828]'
    }
  ];

  return (
    <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} transition-all duration-300 hover:shadow-2xl`}>
      <h3 className={`text-2xl font-bold mb-6 flex items-center space-x-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-blue-600/20' : 'bg-blue-100'} text-blue-500`}>
          <Share2 size={24} />
        </div>
        <span>Share Your Financial Insight</span>
      </h3>

      <div className="flex mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-3 text-sm font-medium ${activeTab === 'text'
            ? 'border-b-2 border-blue-500 text-blue-500'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
        >
          Text Summary
        </button>
        <button
          onClick={() => setActiveTab('visual')}
          className={`flex-1 py-3 text-sm font-medium ${activeTab === 'visual'
            ? 'border-b-2 border-blue-500 text-blue-500'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
        >
          Visual Card
        </button>
      </div>

      {activeTab === 'text' && (
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          <p className={`leading-relaxed ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{shareText}</p>
        </div>
      )}

      {activeTab === 'visual' && (
        <div className="group relative" id="share-card">
          <div
            ref={visualRef}
            className={`p-6 rounded-xl overflow-hidden ${isDarkMode
                ? 'bg-gradient-to-br from-gray-800 to-gray-900'
                : 'bg-gradient-to-br from-blue-50 to-purple-50'
              } shadow-lg`}
          >
            {/* 移除了Logo区域 */}
            <div className={`text-center mb-6 ${isDarkMode
                ? 'bg-blue-600/20 text-blue-300'
                : 'bg-blue-100 text-blue-600'
              } py-2 rounded-full font-medium text-sm`}>
              Investment Time Machine
            </div>


            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-white/80'} backdrop-blur-sm shadow-md mb-5`}>
              <h4 className={`text-lg font-semibold mb-4 text-center ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                Financial Value Over Time
              </h4>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {startYear} Value
                    </p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(amount!)}
                    </p>
                  </div>

                  <div className={`p-2 rounded-full ${percentageChange >= 0
                    ? (isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600')
                    : (isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600')
                    } flex items-center`}>
                    <ArrowUpRight className="w-5 h-5 mr-1" />
                    <span className="font-bold">{formattedPercentage}</span>
                  </div>

                  <div className="text-right">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {endYear} Value
                    </p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(result.inflationAdjustedValue)}
                    </p>
                  </div>
                </div>

                {investmentType !== 'none' && (
                  <>
                    <div className={`h-px w-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          If Invested
                        </p>
                        <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {formatCurrency(amount!)}
                        </p>
                      </div>

                      <div className={`p-2 rounded-full ${investmentGrowth >= 0
                        ? (isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600')
                        : (isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600')
                        } flex items-center`}>
                        <TrendingUp className="w-5 h-5 mr-1" />
                        <span className="font-bold">{investmentGrowth >= 0 ? '+' : ''}{formattedInvestmentGrowth}</span>
                      </div>

                      <div className="text-right">
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Final Value
                        </p>
                        <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {formatCurrency(result.combinedValue)}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {countryData?.name || 'Global'}
              </span>
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={generateShareImage}
              disabled={isGeneratingImage}
              className={`p-2 rounded-full backdrop-blur-sm transition-transform ${isDarkMode
                ? 'bg-gray-700/80 hover:bg-gray-600/90 text-white'
                : 'bg-white/80 hover:bg-white text-gray-800'
                } ${isGeneratingImage ? 'animate-pulse' : ''}`}
            >
              <DownloadCloud size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-4">
        <div className="flex flex-wrap justify-center gap-2">
          {socialPlatforms.map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              onClick={(e) => platform.action && (e.preventDefault(), platform.action())}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center p-2 rounded-xl space-x-1 min-w-[100px] text-sm ${platform.bg
                } ${platform.color} transition-all hover:scale-105`}
            >
              {platform.icon}
              <span>{platform.name}</span>
            </a>
          ))}
        </div>

        <button
          onClick={copyToClipboard}
          className={`w-full flex items-center justify-center p-3 rounded-xl border transition-all duration-200 ${copied
            ? 'border-green-500 bg-green-500/10'
            : `${isDarkMode ? 'border-gray-700 hover:border-blue-500' : 'border-gray-200 hover:border-blue-400'}`
            }`}
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-green-500 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className={`w-5 h-5 mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {activeTab === 'text' ? 'Copy Full Analysis' : 'Copy Summary'}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ShareCard;