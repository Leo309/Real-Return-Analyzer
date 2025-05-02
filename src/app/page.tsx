'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import CalculatorForm from '@/components/CalculatorForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import FeedbackForm from '@/components/FeedbackForm';
import RegionSelector from '@/components/RegionSelector';
import InvestmentSelector from '@/components/InvestmentSelector';
import useCalculatorStore from '@/store/calculatorStore';
import { Sun, Moon, TrendingUp, ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Home() {
  const { t } = useTranslation();
  const { currentStep, result, goBack } = useCalculatorStore();
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode based on user's system preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Render appropriate content based on current step
  const renderContent = () => {
    switch (currentStep) {
      case 'region':
        return <RegionSelector darkMode={darkMode} />;
      case 'investment':
        return <InvestmentSelector darkMode={darkMode} />;
      case 'calculator':
        return (
          <div className="grid grid-cols-1 gap-8">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl`}>
              <div className="flex items-center mb-4">
                <button
                  onClick={goBack}
                  className={`flex items-center text-sm ${
                    darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <ArrowLeft size={16} className="mr-1" />
                  {t('calculator.backToInvestments')}
                </button>
              </div>
              <CalculatorForm darkMode={darkMode} />
            </div>
          </div>
        );
      case 'results':
        return (
          <div className="grid grid-cols-1 gap-8">
            {/* Calculator on the top */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl`}>
              <div className="flex items-center mb-4">
                <button
                  onClick={goBack}
                  className={`flex items-center text-sm ${
                    darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <ArrowLeft size={16} className="mr-1" />
                  {t('calculator.backToInvestments')}
                </button>
              </div>
              <CalculatorForm darkMode={darkMode} />
            </div>

            {/* Result */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl`}>
              <ResultsDisplay />
            </div>
          </div>
        );
      default:
        return <RegionSelector darkMode={darkMode} />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} sticky top-0 z-10 shadow-md border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
              <span className={`mr-2 p-2 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white`}>
                <TrendingUp size={20} />
              </span>
              {t('calculator.title')}
            </h1>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
              {t('calculator.subtitle')}
            </p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-3 rounded-full transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex-grow content-area">
        {renderContent()}
      </main>

      {/* Feedback form placed at the bottom right of the page */}
      <div className="fixed bottom-6 right-6 z-50">
        <FeedbackForm darkMode={darkMode} />
      </div>

      <footer className={`${darkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-white border-t border-gray-200'} mt-auto py-6`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className={`text-center md:text-left ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              © {new Date().getFullYear()} SKYNEX GLOBAL COMMERCE & TECH INC. All data is provided for informational purposes only.
            </p>
            <div className="mt-4 md:mt-0">
              <Link href="/privacy-policy" className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} mx-3`}>Privacy Policy</Link>
              <Link href="/terms-of-use" className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} mx-3`}>Terms of Use</Link>
              <a href="mailto:support@skynexdigital.com" className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} mx-3`}>Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}