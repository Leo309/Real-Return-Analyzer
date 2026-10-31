import { useEffect, useState } from 'react';
import useLanguageStore from '@/store/languageStore';
import { en } from '@/locales/en';
import { zh } from '@/locales/zh';

// Translation data mapping
const translations = {
  en,
  zh
};

export function useTranslation() {
  const { currentLanguage, initializeLanguage } = useLanguageStore();
  const [isClient, setIsClient] = useState(false);
  
  // Only run on client side to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
    initializeLanguage();
  }, [initializeLanguage]);
  
  const t = (key: string, replacements?: Record<string, string | number>) => {
    // Always use English on server to avoid hydration mismatch
    // On client, use selected language after hydration
    const translationData = isClient ? (translations[currentLanguage] || en) : en;
    
    // Parse the key path (e.g., "regionSelector.title")
    const parts = key.split('.');
    let value: unknown = translationData;
    
    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = (value as Record<string, unknown>)[part];
      } else {
        return key; // Return the key if translation not found
      }
    }
    
    if (typeof value === 'string' && replacements) {
      // Replace placeholders like {startYear} with actual values
      return Object.entries(replacements).reduce(
        (str, [key, val]) => str.replace(new RegExp(`{${key}}`, 'g'), String(val)),
        value
      );
    }
    
    return typeof value === 'string' ? value : key;
  };
  
  // Helper function for currency formatting with locale support
  const formatCurrency = (value: number, countryCode: string) => {
    const localeMap: Record<string, string> = {
      'en': 'en-US',
      'zh': 'zh-CN'
    };
    
    const locale = localeMap[currentLanguage] || 'en-US';
    
    // Currency mapping based on country
    const currencyMap: Record<string, string> = {
      'US': 'USD',
      'CA': 'CAD',
      'UK': 'GBP',
      'DE': 'EUR',
      'JP': 'JPY',
      'CN': 'CNY',
      'AU': 'AUD'
    };
    
    const currency = currencyMap[countryCode] || 'USD';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  return { 
    t, 
    currentLanguage, 
    formatCurrency 
  };
}