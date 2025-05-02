'use client';
import React, { useState, useEffect } from 'react';
import CalculatorForm from '@/components/CalculatorForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import FeedbackForm from '@/components/FeedbackForm';
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
          <div className="max-w-4xl mx-auto">
            {/* Calculator on the top */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl mb-8`}>
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
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} overflow-fix`}>
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        title={t('calculator.title')}
      />

      <main className="flex-grow pt-28 pb-16 px-4">
        {renderContent()}
      </main>

      {/* Feedback form placed at the bottom right of the page */}
      <div className="fixed bottom-6 right-6 z-40">
        <FeedbackForm darkMode={darkMode} />
      </div>

      <Footer darkMode={darkMode} />
    </div>
  );
}