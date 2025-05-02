'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, Sun, Moon } from 'lucide-react';
import siteConfig from '@/config/siteConfig';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  title: string;
}

export default function Header({ darkMode, toggleDarkMode, title }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Add scroll listener
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? darkMode 
          ? 'bg-gray-900/80 backdrop-blur-md shadow-lg' 
          : 'bg-white/80 backdrop-blur-md shadow-lg'
        : darkMode
          ? 'bg-gray-900/30 backdrop-blur-sm'
          : 'bg-white/30 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href={siteConfig.externalUrls.mainSite} className="flex items-center space-x-2 relative z-10">
            <div className="h-12 relative">
              <Image 
                src="/SKYNEX_500_BLUE.png" 
                alt="SKYNEX" 
                width={160} 
                height={48} 
                className="w-auto h-full object-contain block dark:hidden" 
                priority
              />
              <Image 
                src="/SKYNEX_500_WHITE.png" 
                alt="SKYNEX" 
                width={160} 
                height={48} 
                className="w-auto h-full object-contain hidden dark:block" 
                priority
              />
            </div>
          </Link>

          {/* Site Title - Mobile Hidden, Desktop Visible */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
            <h1 className={`text-2xl font-bold animated-title title-glow ${
              darkMode 
                ? 'bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 text-transparent bg-clip-text' 
                : 'bg-gradient-to-r from-blue-600 via-sky-500 to-blue-700 text-transparent bg-clip-text'
            } flex items-center`}>
              <span className={`mr-2 p-2 rounded-full title-icon ${
                darkMode 
                  ? 'bg-gradient-to-br from-blue-600 to-cyan-500' 
                  : 'bg-gradient-to-br from-blue-700 to-sky-500'
              } text-white shadow-lg`}>
                <TrendingUp size={20} />
              </span>
              {title}
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link 
              href={siteConfig.externalUrls.mainSite} 
              className="text-gray-700 hover:text-blue-600 dark:text-white/80 dark:hover:text-white transition-colors"
            >
              Main Site
            </Link>
            <Link 
              href={`${siteConfig.externalUrls.mainSite}/products`} 
              className="text-gray-700 hover:text-blue-600 dark:text-white/80 dark:hover:text-white transition-colors"
            >
              Products
            </Link>
            <Link 
              href={siteConfig.externalUrls.contact} 
              className="text-gray-700 hover:text-blue-600 dark:text-white/80 dark:hover:text-white transition-colors"
            >
              Contact
            </Link>
            
            {/* Dark/Light Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-20"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>
            
            <button
              className="p-2 rounded-md text-gray-700 dark:text-white z-20"
              onClick={toggleMenu}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Site Title - Mobile Visible */}
        <div className="md:hidden flex justify-center pb-3">
          <h1 className={`text-xl font-bold animated-title title-glow ${
            darkMode 
              ? 'bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 text-transparent bg-clip-text' 
              : 'bg-gradient-to-r from-blue-600 via-sky-500 to-blue-700 text-transparent bg-clip-text'
          } flex items-center`}>
            <span className={`mr-2 p-1.5 rounded-full title-icon ${
              darkMode 
                ? 'bg-gradient-to-br from-blue-600 to-cyan-500' 
                : 'bg-gradient-to-br from-blue-700 to-sky-500'
            } text-white shadow-md`}>
              <TrendingUp size={16} />
            </span>
            {title}
          </h1>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={`md:hidden fixed inset-0 z-10 flex items-center justify-center ${
            darkMode 
              ? 'bg-gray-900/95 backdrop-blur-lg' 
              : 'bg-white/95 backdrop-blur-lg'
          }`}>
            <div className="flex flex-col items-center space-y-8 text-center">
              <Link 
                href={siteConfig.externalUrls.mainSite}
                className={`text-2xl ${darkMode ? 'text-white hover:text-cyan-400' : 'text-gray-700 hover:text-blue-600'} transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                Main Site
              </Link>
              <Link 
                href={`${siteConfig.externalUrls.mainSite}/products`}
                className={`text-2xl ${darkMode ? 'text-white hover:text-cyan-400' : 'text-gray-700 hover:text-blue-600'} transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                href={siteConfig.externalUrls.contact}
                className={`text-2xl ${darkMode ? 'text-white hover:text-cyan-400' : 'text-gray-700 hover:text-blue-600'} transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}