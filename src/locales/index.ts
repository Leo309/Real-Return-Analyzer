// Language configuration and type definitions
import { en } from './en';

export type Language = 'en' | 'zh' | 'fr';

export type TranslationKey = keyof typeof en;

export interface LanguageConfig {
  code: Language;
  name: string;
  nativeName: string;
  currencyLocale: string; // For number formatting
}

export const languages: LanguageConfig[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    currencyLocale: 'en-US'
  },
  {
    code: 'zh',
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    currencyLocale: 'zh-CN'
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    currencyLocale: 'fr-FR'
  }
];

export const DEFAULT_LANGUAGE: Language = 'en';

// Helper function to get language config
export function getLanguageConfig(code: Language): LanguageConfig {
  return languages.find(lang => lang.code === code) || languages[0];
}