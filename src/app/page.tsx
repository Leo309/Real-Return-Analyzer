'use client';
import React, { useState, useEffect } from 'react';
import CalculatorForm from '@/components/CalculatorForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import RegionSelector from '@/components/RegionSelector';
import InvestmentSelector from '@/components/InvestmentSelector';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import useCalculatorStore from '@/store/calculatorStore';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Home() {
  const { t } = useTranslation();
  const { currentStep, result, goBack } = useCalculatorStore();
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode based on user's system preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
      setDarkMode(isDark);
      
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
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
          <div className="max-w-4xl mx-auto">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl`}>
              <div className="flex items-center mb-4">
                <button
                  onClick={goBack}
                  className={`flex items-center text-base py-2 px-3 rounded-lg transition-colors back-button ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 hover:text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <ArrowLeft size={20} className="mr-2" />
                  {t('calculator.backToInvestments')}
                </button>
              </div>
              <CalculatorForm darkMode={darkMode} />
            </div>
          </div>
        );
      case 'results':
        return (
          <div className="max-w-4xl mx-auto">
            {/* Calculator on the top */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl mb-8`}>
              <div className="flex items-center mb-4">
                <button
                  onClick={goBack}
                  className={`flex items-center text-base py-2 px-3 rounded-lg transition-colors back-button ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 hover:text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <ArrowLeft size={20} className="mr-2" />
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
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} overflow-fix`}>
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        title={t('calculator.title')}
      />

      <main className="flex-grow pt-28 pb-16 px-4">
        {renderContent()}
      </main>

      <Footer darkMode={darkMode} />
    </div>
  );
}