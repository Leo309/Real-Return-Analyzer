'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import useLanguageStore from '@/store/languageStore';
import { useTranslation } from '@/hooks/useTranslation';
import { useInView } from '@/hooks/useInView';
import { TrendingDown, BarChart3, Globe2, ArrowRight, MousePointer2, LineChart, Shield } from 'lucide-react';

function FadeInSection({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(24px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const { t } = useTranslation();
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

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] overflow-fix">
      <Header />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInSection>
            <p className="text-sm font-medium tracking-widest uppercase text-[var(--text-secondary)] mb-6">
              {t('landing.hero.badge')}
            </p>
          </FadeInSection>

          <FadeInSection delay={100}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
              {t('landing.hero.titleStart')}{' '}
              <span className="text-[var(--primary)]">{t('landing.hero.titleHighlight')}</span>{' '}
              {t('landing.hero.titleEnd')}
            </h1>
          </FadeInSection>

          <FadeInSection delay={200}>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
              {t('landing.hero.subtitle')}
            </p>
          </FadeInSection>

          <FadeInSection delay={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/calculator"
                className="inline-flex items-center px-8 py-4 bg-[var(--foreground)] text-[var(--background)] font-medium rounded-lg hover:opacity-90 transition-opacity text-lg"
              >
                {t('landing.hero.cta')}
                <ArrowRight size={20} className="ml-2" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center px-8 py-4 border border-[var(--border)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-colors text-lg"
              >
                {t('landing.hero.learnMore')}
              </a>
            </div>
          </FadeInSection>

          <FadeInSection delay={400}>
            <div className="mt-16 flex items-center justify-center gap-8 text-sm text-[var(--text-secondary)]">
              <div className="flex items-center gap-2">
                <Shield size={16} />
                <span>{t('landing.hero.trustBadge1')}</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-[var(--border)]" />
              <div className="hidden sm:flex items-center gap-2">
                <Globe2 size={16} />
                <span>{t('landing.hero.trustBadge2')}</span>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('landing.features.title')}
              </h2>
              <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
                {t('landing.features.subtitle')}
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <FadeInSection delay={0}>
              <div className="p-8 rounded-xl border border-[var(--border)] hover:bg-[var(--card-hover)] transition-colors h-full">
                <div className="w-12 h-12 rounded-lg bg-[var(--accent)] flex items-center justify-center mb-5">
                  <TrendingDown size={24} className="text-[var(--primary)]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t('landing.features.purchasingPower.title')}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">{t('landing.features.purchasingPower.description')}</p>
              </div>
            </FadeInSection>

            <FadeInSection delay={100}>
              <div className="p-8 rounded-xl border border-[var(--border)] hover:bg-[var(--card-hover)] transition-colors h-full">
                <div className="w-12 h-12 rounded-lg bg-[var(--accent)] flex items-center justify-center mb-5">
                  <BarChart3 size={24} className="text-[var(--primary)]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t('landing.features.compare.title')}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">{t('landing.features.compare.description')}</p>
              </div>
            </FadeInSection>

            <FadeInSection delay={200}>
              <div className="p-8 rounded-xl border border-[var(--border)] hover:bg-[var(--card-hover)] transition-colors h-full">
                <div className="w-12 h-12 rounded-lg bg-[var(--accent)] flex items-center justify-center mb-5">
                  <Globe2 size={24} className="text-[var(--primary)]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t('landing.features.economies.title')}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">{t('landing.features.economies.description')}</p>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 md:py-32 px-6 bg-[var(--accent)]">
        <div className="max-w-5xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('landing.howItWorks.title')}
              </h2>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeInSection delay={0}>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center mx-auto mb-6">
                  <span className="text-xl font-bold text-[var(--foreground)]">1</span>
                </div>
                <div className="w-12 h-12 rounded-lg bg-[var(--background)] flex items-center justify-center mx-auto mb-4">
                  <MousePointer2 size={22} className="text-[var(--primary)]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('landing.howItWorks.step1.title')}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{t('landing.howItWorks.step1.description')}</p>
              </div>
            </FadeInSection>

            <FadeInSection delay={100}>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center mx-auto mb-6">
                  <span className="text-xl font-bold text-[var(--foreground)]">2</span>
                </div>
                <div className="w-12 h-12 rounded-lg bg-[var(--background)] flex items-center justify-center mx-auto mb-4">
                  <LineChart size={22} className="text-[var(--primary)]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('landing.howItWorks.step2.title')}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{t('landing.howItWorks.step2.description')}</p>
              </div>
            </FadeInSection>

            <FadeInSection delay={200}>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center mx-auto mb-6">
                  <span className="text-xl font-bold text-[var(--foreground)]">3</span>
                </div>
                <div className="w-12 h-12 rounded-lg bg-[var(--background)] flex items-center justify-center mx-auto mb-4">
                  <BarChart3 size={22} className="text-[var(--primary)]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('landing.howItWorks.step3.title')}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{t('landing.howItWorks.step3.description')}</p>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-6">
        <FadeInSection>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-[var(--text-secondary)] text-lg">
              {t('landing.trust.text')}
            </p>
          </div>
        </FadeInSection>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-24 md:py-32 px-6">
        <FadeInSection>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('landing.bottomCta.title')}
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-10 max-w-xl mx-auto">
              {t('landing.bottomCta.subtitle')}
            </p>
            <Link
              href="/calculator"
              className="inline-flex items-center px-8 py-4 bg-[var(--foreground)] text-[var(--background)] font-medium rounded-lg hover:opacity-90 transition-opacity text-lg"
            >
              {t('landing.bottomCta.cta')}
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        </FadeInSection>
      </section>

      <Footer />
    </div>
  );
}
