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

export type LandingLanguage = 'en' | 'ar';
const LANGUAGE_KEY = 'eduinsight_landing_language';

const dictionaries = {
  en: english,
  ar: arabic,
};

type LandingLanguageContextValue = {
  language: LandingLanguage;
  messages: (typeof dictionaries)[LandingLanguage];
  setLanguage: (language: LandingLanguage) => void;
  isReady: boolean;
};

const LandingLanguageContext =
  createContext<LandingLanguageContextValue | null>(null);

export function LandingLanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setCurrentLanguage] = useState<LandingLanguage>('ar');
  const [isReady, setIsReady] = useState(false);

  const setLanguage = useCallback((nextLanguage: LandingLanguage) => {
    localStorage.setItem(LANGUAGE_KEY, nextLanguage);
    setCurrentLanguage(nextLanguage);
  }, []);

  useEffect(() => {
    const storedLanguage = localStorage.getItem(LANGUAGE_KEY);
    if (storedLanguage === 'en' || storedLanguage === 'ar') {
      setCurrentLanguage(storedLanguage);
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  return (
    <LandingLanguageContext.Provider
      value={{ language, messages: dictionaries[language], setLanguage, isReady }}
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
