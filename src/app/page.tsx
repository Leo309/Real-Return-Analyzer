'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import CalculatorForm from '@/components/CalculatorForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import FeedbackForm from '@/components/FeedbackForm';
import useCalculatorStore from '@/store/calculatorStore';
import { Sun, Moon, TrendingUp, DollarSign, BarChart2, Share2, X } from 'lucide-react';
import { Dialog } from '@headlessui/react';

export default function Home() {
  const { result } = useCalculatorStore();
  const [darkMode, setDarkMode] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      setDarkMode(savedTheme === 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} sticky top-0 z-10 shadow-md border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
              <span className={`mr-2 p-2 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white`}>
                <TrendingUp size={20} />
              </span>
              Investment Time Machine
            </h1>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
              See how inflation and investments affect your money over time
            </p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-3 rounded-full transition-colors duration-200 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex-grow content-area">
        {result ? (
          <div className="grid grid-cols-1 gap-8">
            {/* calculator on the top */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl`}>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                <DollarSign className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} size={18} />
                Adjust Calculation
              </h2>
              <CalculatorForm darkMode={darkMode} />
            </div>

            {/* Result */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl`}>
              <ResultsDisplay />
            </div>
          </div>
        ) : (
          <div>
            <div className={`mb-10 ${darkMode ? 'text-white' : 'text-gray-900'} text-center`}>
              <h2 className="text-4xl font-bold mb-3">Calculate Your Financial Future</h2>
              <p className={`text-xl max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Understand how your money transforms over time with our powerful investment calculator
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl`}>
                <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                  <DollarSign className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} size={18} />
                  Enter Your Details
                </h2>
                <CalculatorForm darkMode={darkMode} />
              </div>

              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl`}>
                <div className="compact-card">
                  <h2 className="text-xl font-bold mb-4 flex items-center justify-center">
                    <BarChart2 className="mr-2" size={20} />
                    How It Works
                  </h2>

                  <div className="space-y-6">
                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'} p-5 rounded-lg transition-transform duration-300 hover:scale-102 hover:shadow-md`}>
                      <h3 className={`font-bold mb-2 text-lg ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center`}>
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-2 ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white text-sm font-bold`}>1</span>
                        Inflation Impact
                      </h3>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        See how inflation erodes your money's purchasing power over time, with historical data customized to your country.
                      </p>
                    </div>

                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-green-50'} p-5 rounded-lg transition-transform duration-300 hover:scale-102 hover:shadow-md`}>
                      <h3 className={`font-bold mb-2 text-lg ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center`}>
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-2 ${darkMode ? 'bg-green-600' : 'bg-green-500'} text-white text-sm font-bold`}>2</span>
                        Investment Growth
                      </h3>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Compare different investment strategies to combat inflation and grow your wealth based on historical performance data.
                      </p>
                    </div>

                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-yellow-50'} p-5 rounded-lg transition-transform duration-300 hover:scale-102 hover:shadow-md`}>
                      <h3 className={`font-bold mb-2 text-lg ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center`}>
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-2 ${darkMode ? 'bg-yellow-600' : 'bg-yellow-500'} text-white text-sm font-bold`}>3</span>
                        Visual Analysis
                      </h3>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Get clear charts and practical comparisons showing the real impact of time, inflation, and investment choices on your finances.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feedback form placed at the bottom of the page when results are shown */}
        {result && (
          <div className="fixed bottom-4 right-4 z-50">
            <button
              onClick={() => setShowFeedback(true)}
              className={`p-3 rounded-full shadow-lg transition-all hover:scale-110 ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <Share2 size={20} />
            </button>

            <Dialog
              open={showFeedback}
              onClose={() => setShowFeedback(false)}
              className="relative z-50"
            >
              <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
              <div className="fixed bottom-0 right-0 sm:bottom-4 sm:right-4">
                <Dialog.Panel className={`w-screen sm:w-96 p-4 rounded-t-lg sm:rounded-lg shadow-xl ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      提供反馈
                    </Dialog.Title>
                    <button
                      onClick={() => setShowFeedback(false)}
                      className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700`}
                    >
                      <X size={20} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                    </button>
                  </div>
                  <FeedbackForm darkMode={darkMode} />
                </Dialog.Panel>
              </div>
            </Dialog>
          </div>
        )}
      </main>

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