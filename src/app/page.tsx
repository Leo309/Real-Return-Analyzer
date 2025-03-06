'use client';

import React from 'react';
import CalculatorForm from '@/components/CalculatorForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import FeedbackForm from '@/components/FeedbackForm';
import useCalculatorStore from '@/store/calculatorStore';

export default function Home() {
  const { result } = useCalculatorStore();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Investment Time Machine</h1>
          <p className="text-gray-600">See how inflation and investments affect your money over time</p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <CalculatorForm />
              <div className="mt-6">
                <FeedbackForm />
              </div>
            </div>
            
            <div>
              {result ? (
                <ResultsDisplay />
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-md h-full flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">How It Works</h2>
                    <p className="text-gray-600">
                      Enter an amount, select your country, timeframe, and investment type, 
                      then click "Calculate" to see how your money's value changes over time.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white shadow mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Investment Time Machine. All data is for educational purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}