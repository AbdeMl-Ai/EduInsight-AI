'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import arabic from '@/locales/ar.json';
import english from '@/locales/en.json';
import { LANGUAGE_KEY } from '@/lib/i18n';

export type LandingLanguage = 'en' | 'ar';
const LANGUAGE_CHANGE_EVENT = 'eduinsight-language-change';

const dictionaries = {
  en: english,
  ar: arabic,
};

type LandingLanguageContextValue = {
  language: LandingLanguage;
  messages: (typeof dictionaries)[LandingLanguage];
  setLanguage: (language: LandingLanguage) => void;
};

const LandingLanguageContext =
  createContext<LandingLanguageContextValue | null>(null);

export function LandingLanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setCurrentLanguage] = useState<LandingLanguage>('ar');

  const setLanguage = useCallback((nextLanguage: LandingLanguage) => {
    localStorage.setItem(LANGUAGE_KEY, nextLanguage);
    setCurrentLanguage(nextLanguage);
    window.dispatchEvent(
      new CustomEvent(LANGUAGE_CHANGE_EVENT, { detail: nextLanguage }),
    );
  }, []);

  useEffect(() => {
    const storedLanguage = localStorage.getItem(LANGUAGE_KEY);
    if (storedLanguage === 'en' || storedLanguage === 'ar') {
      setCurrentLanguage(storedLanguage);
    }

    function handleLanguageChange(event: Event) {
      const selectedLanguage = (event as CustomEvent<unknown>).detail;
      if (selectedLanguage === 'en' || selectedLanguage === 'ar') {
        setCurrentLanguage(selectedLanguage);
      }
    }

    function handleStorage(event: StorageEvent) {
      if (event.key !== LANGUAGE_KEY) return;
      if (event.newValue === 'en' || event.newValue === 'ar') {
        setCurrentLanguage(event.newValue);
      }
    }

    window.addEventListener(LANGUAGE_CHANGE_EVENT, handleLanguageChange);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleLanguageChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  return (
    <LandingLanguageContext.Provider
      value={{ language, messages: dictionaries[language], setLanguage }}
    >
      {children}
    </LandingLanguageContext.Provider>
  );
}

export function useLandingLanguage() {
  const context = useContext(LandingLanguageContext);
  if (!context) {
    throw new Error(
      'useLandingLanguage must be used within a LandingLanguageProvider.',
    );
  }
  return context;
}
