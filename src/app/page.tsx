'use client';

import React, { useState, useEffect } from 'react';
import CalculatorForm from '@/components/CalculatorForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import FeedbackForm from '@/components/FeedbackForm';
import useCalculatorStore from '@/store/calculatorStore';
import { Sun, Moon } from 'lucide-react';

export default function Home() {
  const { result } = useCalculatorStore();
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

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <header className={`${darkMode ? 'bg-gray-800 shadow-gray-900' : 'bg-white shadow'}`}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Investment Time Machine
            </h1>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              See how inflation and investments affect your money over time
            </p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-800'}`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {result ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <CalculatorForm />
                <div className="mt-6">
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <ResultsDisplay />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              <div>
                <CalculatorForm />
              </div>
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md h-full`}>
                <div className="text-center">
                  <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    How It Works
                  </h2>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                    Enter an amount, select your country, timeframe, and investment type, 
                    then click "Calculate" to see how your money's value changes over time.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'} p-4 rounded-lg`}>
                      <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Inflation Impact
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        See how inflation erodes your money's purchasing power over time.
                      </p>
                    </div>
                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-green-50'} p-4 rounded-lg`}>
                      <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Investment Growth
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Compare different investment strategies to combat inflation.
                      </p>
                    </div>
                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-yellow-50'} p-4 rounded-lg`}>
                      <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Visual Analysis
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Get clear charts and practical comparisons of your money's changing value.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Show feedback form at the bottom when results are being shown */}
          {result && (
            <div className="mt-6 lg:hidden">
              <FeedbackForm />
            </div>
          )}
        </div>
      </main>
      
      <footer className={`${darkMode ? 'bg-gray-800 shadow-gray-900' : 'bg-white shadow'} mt-auto`}>
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            © {new Date().getFullYear()} Investment Time Machine. All data is for educational purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}