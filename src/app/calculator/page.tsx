'use client';
import React, { useEffect } from 'react';
import CalculatorForm from '@/components/CalculatorForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import RegionSelector from '@/components/RegionSelector';
import InvestmentSelector from '@/components/InvestmentSelector';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import useCalculatorStore from '@/store/calculatorStore';
import useLanguageStore from '@/store/languageStore';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function CalculatorPage() {
  const { t } = useTranslation();
  const { currentStep, goBack } = useCalculatorStore();
  const { initializeLanguage } = useLanguageStore();

  useEffect(() => {
    initializeLanguage();

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = (dark: boolean) => {
      document.documentElement.classList.toggle('dark', dark);
    };
    apply(mq.matches);
    const handler = (e: MediaQueryListEvent) => apply(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [initializeLanguage]);

  const renderContent = () => {
    switch (currentStep) {
      case 'region':
        return <RegionSelector />;
      case 'investment':
        return <InvestmentSelector />;
      case 'calculator':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6 transition-all duration-300">
              <div className="flex items-center mb-4">
                <button
                  onClick={goBack}
                  className="flex items-center text-base py-2 px-3 rounded-lg transition-colors back-button bg-[var(--accent)] hover:bg-[var(--border)] text-[var(--foreground)]"
                >
                  <ArrowLeft size={20} className="mr-2" />
                  {t('calculator.backToInvestments')}
                </button>
              </div>
              <CalculatorForm />
            </div>
          </div>
        );
      case 'results':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6 transition-all duration-300 mb-8">
              <div className="flex items-center mb-4">
                <button
                  onClick={goBack}
                  className="flex items-center text-base py-2 px-3 rounded-lg transition-colors back-button bg-[var(--accent)] hover:bg-[var(--border)] text-[var(--foreground)]"
                >
                  <ArrowLeft size={20} className="mr-2" />
                  {t('calculator.backToInvestments')}
                </button>
              </div>
              <CalculatorForm />
            </div>
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6 transition-all duration-300">
              <ResultsDisplay />
            </div>
          </div>
        );
      default:
        return <RegionSelector />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 bg-[var(--background)] text-[var(--foreground)] overflow-fix">
      <Header />
      <main className="flex-grow pt-20 pb-16 px-4 md:px-6">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}
