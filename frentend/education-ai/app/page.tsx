'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  BookOpenCheck,
  GraduationCap,
  Languages,
  Presentation,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { getDashboardPath, useAuth } from '@/components/app/AuthProvider';
import {
  LandingLanguageProvider,
  useLandingLanguage,
} from '@/components/app/LandingLanguageProvider';

const roleIcons = [ShieldCheck, Presentation, BookOpenCheck];

function scrollToConcept() {
  document.getElementById('concept')?.scrollIntoView({ behavior: 'smooth' });
}

function LandingPage() {
  const router = useRouter();
  const { session, isReady } = useAuth();
  const { language, messages, setLanguage } = useLandingLanguage();
  const navigationStartedRef = useRef(false);

  useEffect(() => {
    if (!isReady || !session || navigationStartedRef.current) return;
    navigationStartedRef.current = true;
    router.replace(getDashboardPath(session.role));
  }, [isReady, router, session]);

  return (
    <motion.main
      key={language}
      lang={language}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      initial={{ opacity: 0.94 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="min-h-dvh overflow-hidden bg-[#0a0a0a] text-start text-[#f5f2e9] transition-colors duration-200"
    >
      <section className="relative isolate flex min-h-dvh flex-col justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          className="absolute inset-0 -z-20 size-full object-cover"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              language === 'ar'
                ? 'linear-gradient(90deg,rgba(10,10,10,0.48),rgba(10,10,10,0.78) 45%,rgba(10,10,10,0.96)),linear-gradient(0deg,rgba(10,10,10,0.68),transparent 42%)'
                : 'linear-gradient(270deg,rgba(10,10,10,0.48),rgba(10,10,10,0.78) 45%,rgba(10,10,10,0.96)),linear-gradient(0deg,rgba(10,10,10,0.68),transparent 42%)',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_28%_48%,rgba(198,169,107,0.14),transparent_42%)]"
        />

        <header className="absolute inset-x-0 top-0 z-10 border-b border-white/[0.09]">
          <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-x-3 whitespace-nowrap"
              aria-label={messages.homeLabel}
            >
              <span className="flex size-10 items-center justify-center rounded-xl border border-[#c6a96b]/35 bg-black/25 text-[#d9bd7d] backdrop-blur-sm">
                <GraduationCap size={22} strokeWidth={1.7} />
              </span>
              <span dir="ltr" className="text-xs font-semibold tracking-[0.16em] text-white">
                EDUINSIGHT <span className="text-[#c6a96b]">AI</span>
              </span>
            </Link>

            <nav className="hidden flex-1 items-center justify-center gap-7 md:flex" aria-label={messages.navConcept}>
              <a href="#concept" className="text-sm text-white/70 transition-colors hover:text-white">
                {messages.navConcept}
              </a>
              <Link href="/login" className="text-sm text-white/70 transition-colors hover:text-white">
                {messages.login}
              </Link>
            </nav>

            <button
              type="button"
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              lang={language === 'ar' ? 'en' : 'ar'}
              aria-label={`${messages.languageLabel}: ${messages.switchLanguage}`}
              className="inline-flex min-h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-white/15 bg-black/20 px-3 text-xs font-medium text-white/80 transition-colors hover:border-[#c6a96b]/45 hover:text-white sm:px-4"
            >
              <Languages size={15} className="text-[#d9bd7d]" />
              <span>{messages.switchLanguage}</span>
            </button>

            <button
              type="button"
              onClick={scrollToConcept}
              className="inline-flex min-h-10 shrink-0 items-center justify-center gap-x-2 whitespace-nowrap rounded-lg bg-[#c6a96b] px-4 text-xs font-semibold text-[#17130b] transition-colors hover:bg-[#d8bd83] sm:px-5 sm:text-sm"
            >
              {messages.getStarted} <ArrowDown size={15} />
            </button>
          </div>
        </header>

        <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-12">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-7 inline-flex items-center gap-x-2 rounded-full border border-[#c6a96b]/25 bg-black/25 px-3.5 py-2 backdrop-blur-sm"
            >
              <Sparkles size={14} className="text-[#d9bd7d]" />
              <span className="text-xs font-semibold tracking-wide text-[#dfc887]">
                {messages.badge}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="text-5xl font-semibold leading-[1.15] tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              {messages.heroTitle}
              <br />
              <span className={`${language === 'ar' ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-[#f2dfaa] via-[#d7b96f] to-[#a9823d] bg-clip-text text-transparent`}>
                {messages.heroAccent}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="mt-7 max-w-xl text-base leading-8 text-white/70 sm:text-lg"
            >
              {messages.heroDescription}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <button
                type="button"
                onClick={scrollToConcept}
                className="inline-flex min-h-12 items-center justify-center gap-x-2 rounded-lg bg-[#c6a96b] px-6 text-sm font-semibold text-[#17130b] transition-all hover:-translate-y-0.5 hover:bg-[#d8bd83]"
              >
                {messages.conceptButton} <ArrowRight className="rtl:rotate-180" size={16} />
              </button>
              <Link
                href="/login"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/20 bg-black/20 px-6 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:border-white/35 hover:bg-black/35"
              >
                {messages.login}
              </Link>
            </motion.div>
            <p className="mt-6 text-xs text-white/45">
              {messages.heroSupport}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.28 }}
            className="mt-4 flex justify-center justify-self-center lg:mt-0"
            aria-hidden="true"
          >
            <div className="flex size-44 items-center justify-center rounded-full border border-[#d5b66d]/20 bg-black/15 shadow-[0_0_100px_rgba(198,169,107,0.12)] backdrop-blur-[2px] sm:size-56 lg:size-64 xl:size-80">
              <div className="flex size-32 items-center justify-center rounded-full border border-[#d5b66d]/20 bg-black/20 sm:size-40 lg:size-48 xl:size-60">
                <GraduationCap className="size-16 text-[#e0c783]/90 sm:size-20 lg:size-[104px]" strokeWidth={0.8} />
              </div>
            </div>
          </motion.div>
        </div>
        <div className="mx-auto flex w-full max-w-7xl items-center gap-2 px-5 pb-7 text-xs text-white/40 sm:px-8 lg:px-12">
          <span className="h-px w-8 bg-[#c6a96b]/55" />
          {messages.scrollHint}
        </div>
      </section>

      <section id="concept" className="scroll-mt-6 border-t border-white/[0.07] bg-[#0d0d0c]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
          <div className="mb-10 grid gap-5 sm:mb-12 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="mb-3 text-xs font-semibold tracking-wide text-[#c6a96b]">
                {messages.conceptEyebrow}
              </p>
              <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                {messages.conceptTitle}
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-white/50">
              {messages.conceptDescription}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {messages.roles.map(({ number, title, description, detail }, index) => {
              const Icon = roleIcons[index];
              return (
                <motion.article
                  key={number}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="group rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 transition-colors hover:border-[#c6a96b]/25 hover:bg-white/[0.035] sm:p-7"
                >
                  <div className="mb-8 flex items-start justify-between">
                    <span className="flex size-11 items-center justify-center rounded-xl border border-[#c6a96b]/20 bg-[#c6a96b]/[0.07] text-[#d9bd7d] transition-colors group-hover:bg-[#c6a96b]/[0.12]">
                      <Icon size={20} strokeWidth={1.7} />
                    </span>
                    <span className="text-xs tracking-[0.14em] text-white/30">{number}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-3 min-h-[72px] text-sm leading-7 text-white/55">{description}</p>
                  <div className="mt-6 border-t border-white/[0.08] pt-4 text-xs font-medium text-[#cfb577]">
                    {detail}
                  </div>
                </motion.article>
              );
            })}
          </div>

          <div className="mt-12 flex flex-col gap-5 rounded-2xl border border-[#c6a96b]/15 bg-gradient-to-l from-[#c6a96b]/[0.08] via-white/[0.025] to-transparent p-6 sm:p-9 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold tracking-wide text-[#c6a96b]">
                EDUINSIGHT AI
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {messages.closingTitle}
              </h2>
            </div>
            <Link
              href="/login"
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-x-2 self-start whitespace-nowrap rounded-lg border border-white/15 bg-white/[0.025] px-5 text-sm font-medium text-white transition-colors hover:border-white/30 hover:bg-white/[0.06] md:self-auto"
            >
              {messages.login} <ArrowRight className="rtl:rotate-180" size={16} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.07] px-5 py-6 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <span dir="ltr">© {new Date().getFullYear()} EduInsight AI</span>
          <span>{messages.footerTagline}</span>
        </div>
      </footer>
    </motion.main>
  );
}

export default function Home() {
  return (
    <LandingLanguageProvider>
      <LandingPage />
    </LandingLanguageProvider>
  );
}
