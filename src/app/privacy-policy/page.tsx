'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
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
              Privacy Policy
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className={`${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} p-6 rounded-lg shadow`}>
          <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
          <p className="mb-4"><strong>Last Updated: March 14, 2025</strong></p>

          <h3 className="text-xl font-semibold mt-6 mb-3">1. Introduction</h3>
          <p className="mb-4">
            This Privacy Policy explains how SKYNEX GLOBAL COMMERCE & TECH INC. (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) collects, uses, and protects your information when you use our Investment Time Machine service.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">2. Information We Collect</h3>
          <p className="mb-2">We may collect the following information:</p>
          <ul className="list-disc ml-6 mb-4">
            <li>Country selection for inflation data</li>
            <li>Financial data you input for calculations</li>
            <li>Feedback you submit through our forms</li>
            <li>Basic usage data and analytics</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">3. How We Use Your Information</h3>
          <p className="mb-2">We use this information to:</p>
          <ul className="list-disc ml-6 mb-4">
            <li>Provide and improve our services</li>
            <li>Respond to your inquiries</li>
            <li>Monitor and analyze usage patterns</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">4. Contact Us</h3>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
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