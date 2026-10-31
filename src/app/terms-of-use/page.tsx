'use client';

import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfUse() {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = (dark: boolean) => {
      document.documentElement.classList.toggle('dark', dark);
    };
    apply(mq.matches);
    const handler = (e: MediaQueryListEvent) => apply(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div className="min-h-screen transition-colors duration-300 bg-[var(--background)]">
      <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--card-bg)]">
        <div className="max-w-5xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-[var(--text-secondary)] hover:text-[var(--foreground)] mr-4">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">
              Terms of Use
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-[var(--card-bg)] text-[var(--foreground)] p-6 rounded-lg border border-[var(--border)]">
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

          <h3 className="text-xl font-semibold mt-6 mb-3">3. Data Sources</h3>
          <div className="mb-4">
            <p>Our calculations utilize the following historical market data:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>United States: S&P 500 Index returns</li>
              <li>Canada: S&P/TSX Composite Index returns</li>
            </ul>
            <p className="mt-2">Inflation data is sourced from official government statistics of each country.</p>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">4. Support</h3>
          <p className="mb-4">
            If you have any questions about these Terms, please contact us at:
            <br />
            SKYNEX GLOBAL COMMERCE & TECH INC.
            <br />
            Email: support@skynexdigital.com
          </p>
        </div>
      </main>

      <footer className="border-t border-[var(--border)] bg-[var(--card-bg)] mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-center md:text-left text-[var(--text-secondary)]">
              © {new Date().getFullYear()} SKYNEX GLOBAL COMMERCE & TECH INC. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <Link href="/privacy-policy" className="text-[var(--text-secondary)] hover:text-[var(--foreground)] mx-3">Privacy Policy</Link>
              <Link href="/terms-of-use" className="text-[var(--text-secondary)] hover:text-[var(--foreground)] mx-3">Terms of Use</Link>
              <a href="mailto:support@skynexdigital.com" className="text-[var(--text-secondary)] hover:text-[var(--foreground)] mx-3">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
