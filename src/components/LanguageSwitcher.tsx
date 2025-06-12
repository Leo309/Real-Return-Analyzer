'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import useLanguageStore from '@/store/languageStore';
import { languages, type Language } from '@/locales';

interface LanguageSwitcherProps {
  darkMode: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { currentLanguage, setLanguage } = useLanguageStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Only render after client mount to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLangConfig = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const handleLanguageChange = (languageCode: Language) => {
    setLanguage(languageCode);
    setIsOpen(false);
  };

  // Show loading placeholder during SSR to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
        darkMode 
          ? 'bg-gray-800 text-gray-300 border border-gray-700' 
          : 'bg-gray-100 text-gray-700 border border-gray-200'
      }`}>
        <Globe size={16} />
        <span className="text-sm">English</span>
        <ChevronDown size={14} />
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
          darkMode 
            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 border border-gray-200'
        }`}
        aria-label="Change language"
        aria-expanded={isOpen}
      >
        <Globe size={16} />
        <span className="text-sm">{currentLangConfig.nativeName}</span>
        <ChevronDown 
          size={14} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div className="fixed inset-0 z-10 sm:hidden" onClick={() => setIsOpen(false)} />
          
          {/* Dropdown */}
          <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-20 ${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="py-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full text-left px-4 py-3 flex items-center transition-colors duration-150 ${
                    currentLanguage === language.code
                      ? (darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-50 text-blue-700')
                      : (darkMode ? 'hover:bg-gray-700 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900')
                  }`}
                >
                  <div className="flex flex-col flex-1">
                    <span className="text-sm font-medium">{language.nativeName}</span>
                    <span className={`text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {language.name}
                    </span>
                  </div>
                  {currentLanguage === language.code && (
                    <div className={`ml-3 w-2 h-2 rounded-full ${
                      darkMode ? 'bg-blue-400' : 'bg-blue-600'
                    }`} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;