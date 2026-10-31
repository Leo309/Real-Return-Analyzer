'use client';

import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
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
              Privacy Policy
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-[var(--card-bg)] text-[var(--foreground)] p-6 rounded-lg border border-[var(--border)]">
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
