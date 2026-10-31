'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import siteConfig from '@/config/siteConfig';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isLanding = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)]'
        : isLanding
          ? 'bg-transparent'
          : 'bg-[var(--background)]/30 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="relative z-10">
            <span className="text-xl font-bold tracking-tight text-[var(--foreground)]">
              SKYNEX
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {isLanding ? (
              <Link
                href="/calculator"
                className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-opacity"
              >
                Try Calculator
              </Link>
            ) : (
              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
              >
                Home
              </Link>
            )}

            <Link
              href={siteConfig.externalUrls.mainSite}
              className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
            >
              Main Site
            </Link>

            <div className="w-px h-5 bg-[var(--border)] mx-1" />

            {/* Language Switcher */}
            <LanguageSwitcher />
          </nav>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher />

            <button
              className="p-2 rounded-lg text-[var(--foreground)] z-20"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 z-10 flex items-center justify-center bg-[var(--background)]/95 backdrop-blur-lg">
            <div className="flex flex-col items-center space-y-8 text-center">
              {isLanding ? (
                <Link
                  href="/calculator"
                  className="text-2xl font-medium text-[var(--foreground)]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Try Calculator
                </Link>
              ) : (
                <Link
                  href="/"
                  className="text-2xl font-medium text-[var(--foreground)]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              )}
              <Link
                href={siteConfig.externalUrls.mainSite}
                className="text-2xl text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Main Site
              </Link>
              <Link
                href={siteConfig.externalUrls.contact}
                className="text-2xl text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
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
