'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfUse() {
  const [darkMode, setDarkMode] = useState(false);

  // 初始化暗色模式基于用户系统偏好
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} sticky top-0 z-10 shadow-md border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-5xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className={`${darkMode ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'} mr-4`}>
              <ArrowLeft size={20} />
            </Link>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Terms of Use
            </h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className={`${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} p-6 rounded-lg shadow`}>
          <h2 className="text-2xl font-bold mb-4">Terms of Use</h2>
          <p className="mb-4"><strong>Last Updated: March 14, 2025</strong></p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">1. Introduction</h3>
          <p className="mb-4">
            By using the Investment Time Machine provided by SKYNEX GLOBAL COMMERCE & TECH INC., you agree to these Terms of Use. Please read them carefully.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">2. Educational Purpose Only</h3>
          <p className="mb-4">
            The Investment Time Machine is an educational tool designed to illustrate the potential effects of inflation and investment strategies on money over time. The calculations are based on historical data and general assumptions. The information provided is for educational purposes only and does not constitute financial advice.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">3. No Warranties</h3>
          <p className="mb-4">
            We make no representations or warranties about the accuracy, reliability, or availability of the service. The service is provided "as is" without any guarantees.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">4. Contact Us</h3>
          <p className="mb-4">
            If you have any questions about these Terms, please contact us at:
            <br />
            SKYNEX GLOBAL COMMERCE & TECH INC.
            <br />
            Email: support@skynexdigital.com
          </p>
        </div>
      </main>
      
      <footer className={`${darkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-white border-t border-gray-200'} mt-auto py-6`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className={`text-center md:text-left ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              © {new Date().getFullYear()} SKYNEX GLOBAL COMMERCE & TECH INC. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <Link href="/privacy" className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} mx-3`}>Privacy Policy</Link>
              <Link href="/terms" className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} mx-3`}>Terms of Use</Link>
              <a href="mailto:support@skynexdigital.com" className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} mx-3`}>Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}