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

  if (!result) return null;

  // 货币格式化
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: countryData.currency,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // 计算百分比变化
  const percentageChange = ((result.inflationAdjustedValue - amount) / amount) * 100;
  const formattedPercentage = percentageChange.toFixed(2) + '%';

  // 生成分享文本
  const getShareText = () => {
    const investmentGrowth = investmentType !== 'none' 
      ? ((result.combinedValue - amount) / amount * 100).toFixed(1)
      : 0;
  
    let baseText = `I calculated that ${formatCurrency(amount)} in ${startYear} is worth ${formatCurrency(result.inflationAdjustedValue)} in ${endYear} (${formattedPercentage}).`;
    
    if (investmentType !== 'none') {
      const store = useCalculatorStore.getState();
      const investmentTypeText = investmentType === 'stockMarket' 
        ? 'the stock market' 
        : investmentType === 'savings'
          ? 'a savings account'
          : store.customRate 
            ? `a ${store.customRate}% annual return investment`
            : `an investment`;

      baseText += ` If invested in ${investmentTypeText}, it would be worth ${formatCurrency(result.combinedValue)} (${investmentGrowth >= 0 ? '+' : ''}${investmentGrowth}%) today.`;
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
        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
        scale: 2
      });
      
      const link = document.createElement('a');
      link.download = `investment-result-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // 优化后的社交平台配置
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

      {/* 标签切换 */}
      <div className="flex mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === 'text' 
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Text Summary
        </button>
        <button
          onClick={() => setActiveTab('visual')}
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === 'visual' 
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Visual Card
        </button>
      </div>

      {/* 内容区域 */}
      {activeTab === 'text' && (
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          <p className={`leading-relaxed ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{shareText}</p>
        </div>
      )}

      {activeTab === 'visual' && (
        <div className="group relative">
          <div 
            ref={visualRef}
            className={`p-6 rounded-xl bg-gradient-to-br ${
              isDarkMode 
                ? 'from-gray-800 to-gray-900' 
                : 'from-blue-50 to-purple-50'
            } shadow-lg transform transition-transform duration-300 hover:scale-[1.01]`}
          >
            {/* 卡片头部 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm`}>
                  <TrendingUp size={20} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                </div>
                <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Financial Time Travel
                </h4>
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                Powered by SKYNEX
              </div>
            </div>

            {/* 价值对比 */}
            <div className="flex justify-between items-end">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Initial Value</p>
                <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(amount)}
                </p>
              </div>
              <ArrowUpRight className={`w-8 h-8 ${
                percentageChange >= 0 
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`} />
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-right`}>
                  {investmentType !== 'none' ? 'Invested Value' : 'Current Value'}
                </p>
                <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} text-right`}>
                  {investmentType !== 'none' 
                    ? formatCurrency(result.combinedValue)
                    : formatCurrency(result.inflationAdjustedValue)}
                </p>
              </div>
            </div>

            {/* 投资增长显示 */}
            {investmentType !== 'none' && (
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm mt-6`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Investment Growth</span>
                  <span className={`text-lg font-bold ${
                    ((result.combinedValue - amount) / amount * 100) >= 0
                      ? (isDarkMode ? 'text-green-400' : 'text-green-600')
                      : (isDarkMode ? 'text-red-400' : 'text-red-600')
                  }`}>
                    {((result.combinedValue - amount) / amount * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 下载按钮 */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={generateShareImage}
              disabled={isGeneratingImage}
              className={`p-2 rounded-full backdrop-blur-sm transition-transform ${
                isDarkMode 
                  ? 'bg-gray-700/80 hover:bg-gray-600/90 text-white' 
                  : 'bg-white/80 hover:bg-white text-gray-800'
              } ${isGeneratingImage ? 'animate-pulse' : ''}`}
            >
              <DownloadCloud size={20} />
            </button>
          </div>
        </div>
      )}

      {/* 统一操作区域 */}
      <div className="mt-8 space-y-4">
        {/* 单行社交按钮 */}
        <div className="flex flex-wrap justify-center gap-2">
          {socialPlatforms.map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              onClick={(e) => platform.action && (e.preventDefault(), platform.action())}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center p-2 rounded-xl space-x-1 min-w-[100px] text-sm ${
                platform.bg
              } ${platform.color} transition-all hover:scale-105`}
            >
              {platform.icon}
              <span>{platform.name}</span>
            </a>
          ))}
        </div>

        {/* 动态复制按钮 */}
        <button
          onClick={copyToClipboard}
          className={`w-full flex items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
            copied 
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