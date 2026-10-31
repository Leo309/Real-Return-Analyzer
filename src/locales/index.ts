// Language configuration and type definitions
import { en } from './en';

export type Language = 'en' | 'zh';

export type TranslationKey = keyof typeof en;

export interface LanguageConfig {
  code: Language;
  name: string;
  nativeName: string;
  currencyLocale: string;
}

export const languages: LanguageConfig[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'EN',
    currencyLocale: 'en-US'
  },
  {
    code: 'zh',
    name: 'Chinese (Simplified)',
    nativeName: '中',
    currencyLocale: 'zh-CN'
  }
];

export const DEFAULT_LANGUAGE: Language = 'en';

// Helper function to get language config
export function getLanguageConfig(code: Language): LanguageConfig {
  return languages.find(lang => lang.code === code) || languages[0];
}