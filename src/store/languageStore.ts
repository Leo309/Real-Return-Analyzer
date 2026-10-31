import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Language } from '@/locales';
import { DEFAULT_LANGUAGE } from '@/locales';

interface LanguageState {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  initializeLanguage: () => void;
}

const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      currentLanguage: DEFAULT_LANGUAGE,
      
      setLanguage: (language: Language) => {
        set({ currentLanguage: language });
        
        // Update document language attribute
        if (typeof document !== 'undefined') {
          document.documentElement.lang = language;
        }
      },
      
      initializeLanguage: () => {
        // Only run on client side
        if (typeof window === 'undefined') return;
        
        // Check if already initialized to prevent multiple calls
        const current = get().currentLanguage;
        if (current !== DEFAULT_LANGUAGE) return;
        
        try {
          // First try to get from localStorage (handled by persist middleware)
          const stored = localStorage.getItem('language-store');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed?.state?.currentLanguage && parsed.state.currentLanguage !== DEFAULT_LANGUAGE) {
              return; // Let persist middleware handle it
            }
          }
          
          // Fallback to browser language detection
          const browserLang = navigator.language.toLowerCase();
          let detectedLang: Language = DEFAULT_LANGUAGE;
          
          if (browserLang.startsWith('zh')) {
            detectedLang = 'zh';
          }
          
          if (detectedLang !== DEFAULT_LANGUAGE) {
            get().setLanguage(detectedLang);
          }
        } catch (error) {
          console.warn('Failed to initialize language:', error);
        }
      }
    }),
    {
      name: 'language-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ currentLanguage: state.currentLanguage }),
      // Avoid hydration mismatch by using default value on server
      getStorage: () => (typeof window !== 'undefined' ? localStorage : undefined),
    }
  )
);

export default useLanguageStore;