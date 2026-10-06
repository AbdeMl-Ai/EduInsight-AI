'use client';

import { Languages } from 'lucide-react';
import { useLandingLanguage } from '@/components/app/LandingLanguageProvider';

export default function LanguageSwitcher() {
  const { language, messages, setLanguage } = useLandingLanguage();
  const nextLanguage = language === 'ar' ? 'en' : 'ar';

  return (
    <button
      type="button"
      onClick={() => setLanguage(nextLanguage)}
      lang={nextLanguage}
      aria-label={`${messages.languageLabel}: ${messages.switchLanguage}`}
      className="inline-flex min-h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-white/15 bg-black/20 px-3 text-xs font-medium text-white/80 transition-colors hover:border-[#c6a96b]/45 hover:text-white sm:px-4"
    >
      <Languages size={15} className="text-[#d9bd7d]" />
      <span>{messages.switchLanguage}</span>
    </button>
  );
}
