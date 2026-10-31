'use client';

import React, { useState, useEffect } from 'react';
import useLanguageStore from '@/store/languageStore';
import type { Language } from '@/locales';

const LanguageSwitcher: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { currentLanguage, setLanguage } = useLanguageStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleToggle = () => {
    const next: Language = currentLanguage === 'en' ? 'zh' : 'en';
    setLanguage(next);
  };

  if (!isMounted) {
    return (
      <button className="flex items-center text-sm px-2 py-1.5 rounded-md text-[var(--text-secondary)]">
        <span className="font-medium text-[var(--foreground)]">EN</span>
        <span className="mx-1.5 text-[var(--border)]">|</span>
        <span>中</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className="flex items-center text-sm px-2 py-1.5 rounded-md transition-colors duration-200 hover:bg-[var(--accent)]"
      aria-label="Change language"
    >
      <span className={`font-medium transition-colors ${currentLanguage === 'en' ? 'text-[var(--foreground)]' : 'text-[var(--text-secondary)]'}`}>
        EN
      </span>
      <span className="mx-1.5 text-[var(--border)]">|</span>
      <span className={`font-medium transition-colors ${currentLanguage === 'zh' ? 'text-[var(--foreground)]' : 'text-[var(--text-secondary)]'}`}>
        中
      </span>
    </button>
  );
};

export default LanguageSwitcher;
