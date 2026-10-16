'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bot,
  Briefcase,
  Check,
  CheckCircle2,
  ChevronRight,
  Database,
  FileCheck,
  FileText,
  GraduationCap,
  Layers,
  Link as LinkIcon,
  Lock,
  Plus,
  Play,
  Share2,
  Shield,
  ShieldCheck,
  Sliders,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  Workflow,
  Zap,
} from 'lucide-react';
import { getDashboardPath, useAuth } from '@/components/app/AuthProvider';
import { useLandingLanguage } from '@/components/app/LandingLanguageProvider';
import LanguageSwitcher from '@/components/app/LanguageSwitcher';

export default function LandingPage() {
  const router = useRouter();
  const { session, isReady } = useAuth();
  const { language, messages } = useLandingLanguage();
  const navigationStartedRef = useRef(false);
  const [activeTab, setActiveTab] = useState<'canvas' | 'workflow'>('canvas');

  useEffect(() => {
    if (!isReady || !session || navigationStartedRef.current) return;
    navigationStartedRef.current = true;
    router.replace(getDashboardPath(session.role));
  }, [isReady, router, session]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      key={language}
      lang={language}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-gradient-to-b from-[#faf6ee] via-[#f7f2e7] to-white text-amber-950 font-sans selection:bg-yellow-500/25 selection:text-amber-950 antialiased"
    >
      {/* ─── STICKY HEADER / NAVIGATION ─── */}
      <header className="sticky top-0 z-50 border-b border-amber-900/10 bg-[#faf6ee]/85 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-900 rounded-xl"
            aria-label={messages.homeLabel || 'EduInsight AI Home'}
          >
            <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-950 text-yellow-500 shadow-sm transition-transform duration-300 group-hover:scale-105">
              <GraduationCap size={22} strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-amber-950">
                EDUINSIGHT <span className="text-yellow-600 font-black">AI</span>
              </span>
              <span className="text-[10px] font-medium tracking-widest text-amber-900/60 uppercase">
                Enterprise SaaS
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-8 text-sm font-medium text-amber-900/75"
            aria-label="Main Navigation"
          >
            <button
              onClick={() => scrollToSection('features')}
              className="transition-colors hover:text-amber-950"
            >
              {messages.bentoTitle || 'Use Cases'}
            </button>
            <button
              onClick={() => scrollToSection('dashboard-preview')}
              className="transition-colors hover:text-amber-950"
            >
              {messages.navConcept || 'Product'}
            </button>
            <button
              onClick={() => scrollToSection('workflows')}
              className="transition-colors hover:text-amber-950"
            >
              Solutions
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="transition-colors hover:text-amber-950"
            >
              Pricing
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher
              className="inline-flex min-h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl border border-amber-900/15 bg-white/70 px-3.5 text-xs font-semibold text-amber-900 shadow-sm transition-all hover:bg-white hover:border-amber-900/30 hover:text-amber-950 sm:px-4"
              iconClassName="text-yellow-600"
            />
            <Link
              href="/login"
              className="hidden sm:inline-flex text-sm font-semibold text-amber-900 hover:text-amber-950 px-3 py-2 transition-colors"
            >
              {messages.login || 'Log in'}
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-yellow-600 hover:bg-yellow-700 text-white font-semibold text-xs sm:text-sm shadow-sm shadow-yellow-600/20 transition-all hover:shadow-md hover:shadow-yellow-600/30"
            >
              {messages.getStarted || 'Get Started'}
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28">
        {/* Subtle Ambient Warm Background Blobs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[680px] rounded-full bg-gradient-to-tr from-amber-200/35 via-yellow-100/40 to-transparent blur-3xl" />
          <div className="absolute top-1/3 -right-24 size-[400px] rounded-full bg-amber-100/30 blur-2xl" />
        </div>

        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 text-center">
          {/* Eyebrow Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-amber-900/15 bg-white/80 px-4 py-1.5 shadow-xs backdrop-blur-xs mb-6"
          >
            <Sparkles size={14} className="text-yellow-600" />
            <span className="text-xs font-semibold tracking-wide text-amber-900">
              {messages.heroPill || 'Next-Gen Academic Automation'}
            </span>
          </motion.div>

          {/* Large, Bold Main Headline (Dark Brown) */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto max-w-4xl text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-amber-950 leading-[1.12]"
          >
            {messages.heroTitle || 'Automation that adapts to every team'}
          </motion.h1>

          {/* Descriptive Sub-headline (Lighter brown/gray) */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-base sm:text-lg lg:text-xl text-stone-600 leading-relaxed"
          >
            {messages.heroSubtitle ||
              'Every team runs processes that involve multiple tools, approvals, and manual steps. EduInsight AI unifies them into intelligent automated workflows.'}
          </motion.p>

          {/* Two CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* Solid Gold Button */}
            <button
              onClick={() => scrollToSection('features')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-yellow-600 hover:bg-yellow-700 text-white font-semibold text-sm shadow-md shadow-yellow-600/20 hover:shadow-lg hover:shadow-yellow-600/30 transition-all hover:-translate-y-0.5"
            >
              <span>{messages.heroCtaExplore || 'Explore Use Cases'}</span>
              <ArrowRight size={17} className="rtl:rotate-180" />
            </button>

            {/* Outlined Brown Button */}
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-amber-900 text-amber-900 hover:bg-amber-900/5 font-semibold text-sm transition-all hover:-translate-y-0.5"
            >
              <span>{messages.heroCtaWorkspace || 'Access Platform'}</span>
            </Link>
          </motion.div>

          {/* ─── HERO DASHBOARD MOCKUP (Centered Below Text) ─── */}
          <motion.div
            id="dashboard-preview"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-14 sm:mt-16 mx-auto max-w-6xl rounded-3xl border border-amber-900/15 bg-white shadow-2xl shadow-amber-950/10 overflow-hidden text-start"
          >
            {/* SaaS App Header Chrome */}
            <div className="flex items-center justify-between border-b border-amber-900/10 bg-[#faf6ee] px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <div className="size-3 rounded-full bg-red-400" />
                  <div className="size-3 rounded-full bg-amber-400" />
                  <div className="size-3 rounded-full bg-emerald-400" />
                </div>
                <div className="h-4 w-px bg-amber-900/15 mx-1 hidden sm:block" />
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-950">
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white border border-amber-900/10 shadow-xs">
                    <Workflow size={13} className="text-yellow-600" />
                    <span>EduInsight Canvas</span>
                  </span>
                  <span className="text-amber-900/40">/</span>
                  <span className="text-amber-900/70 font-normal truncate max-w-[200px] sm:max-w-none">
                    Multi-Department Automated Grading & Verification
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-medium text-emerald-700 border border-emerald-200">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Flow
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xs font-medium text-amber-900/60 hidden sm:inline-block">
                  100%
                </span>
                <button
                  type="button"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-amber-900 bg-white border border-amber-900/15 px-3 py-1.5 rounded-lg shadow-xs hover:bg-stone-50"
                >
                  <Share2 size={13} />
                  <span>Share</span>
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-amber-950 hover:bg-amber-900 px-3.5 py-1.5 rounded-lg shadow-xs transition-colors"
                >
                  <Play size={12} fill="currentColor" />
                  <span>Execute</span>
                </button>
              </div>
            </div>

            {/* Interactive Canvas Grid Workspace */}
            <div className="relative min-h-[440px] lg:min-h-[520px] bg-[#fbf9f4] bg-[radial-gradient(#e5dec9_1px,transparent_1px)] [background-size:18px_18px] p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
              {/* Left Mini Canvas Palette */}
              <div className="hidden sm:flex flex-col gap-2 shrink-0 border border-amber-900/10 bg-white/90 p-2 rounded-2xl shadow-sm h-fit backdrop-blur-xs">
                <button
                  type="button"
                  title="Select / Move"
                  className="flex size-9 items-center justify-center rounded-xl bg-amber-950 text-white"
                >
                  <Sliders size={16} />
                </button>
                <button
                  type="button"
                  title="Add Automation Node"
                  className="flex size-9 items-center justify-center rounded-xl hover:bg-amber-50 text-amber-900/70 hover:text-amber-950 transition-colors"
                >
                  <Plus size={16} />
                </button>
                <button
                  type="button"
                  title="Layers"
                  className="flex size-9 items-center justify-center rounded-xl hover:bg-amber-50 text-amber-900/70 hover:text-amber-950 transition-colors"
                >
                  <Layers size={16} />
                </button>
                <button
                  type="button"
                  title="Connected Database"
                  className="flex size-9 items-center justify-center rounded-xl hover:bg-amber-50 text-amber-900/70 hover:text-amber-950 transition-colors"
                >
                  <Database size={16} />
                </button>
              </div>

              {/* Main Node Graph Diagram */}
              <div className="flex-1 flex flex-col justify-center gap-6 relative">
                {/* Visual Node Flow Line (Desktop SVG Connector) */}
                <svg
                  className="hidden lg:block absolute inset-0 size-full pointer-events-none z-0"
                  aria-hidden="true"
                >
                  <path
                    d="M 280 100 C 350 100, 360 160, 430 160"
                    fill="none"
                    stroke="#c69225"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M 280 280 C 350 280, 360 200, 430 180"
                    fill="none"
                    stroke="#78350f"
                    strokeWidth="2"
                  />
                </svg>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                  {/* Node 1: Start Trigger */}
                  <div className="rounded-2xl border border-amber-900/15 bg-white p-5 shadow-md shadow-amber-950/5 relative group hover:border-yellow-600/40 transition-colors">
                    <div className="flex items-center justify-between border-b border-amber-900/10 pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded-lg bg-yellow-500/15 text-yellow-700">
                          <Zap size={14} />
                        </span>
                        <div>
                          <p className="text-xs font-bold text-amber-950">Start: Intake</p>
                          <p className="text-[10px] text-amber-900/50">Entry point for automation</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                        <Check size={10} /> Ready
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between rounded-lg bg-[#faf6ee] p-2 border border-amber-900/5">
                        <span className="text-amber-900/70 font-medium flex items-center gap-1.5">
                          <FileText size={13} className="text-yellow-600" />
                          Student Submissions
                        </span>
                        <span className="text-[10px] font-semibold text-amber-950">Auto-listen</span>
                      </div>
                      <div className="space-y-1.5 pt-1 text-[11px] text-stone-600">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                          <span>Student credentials validated</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                          <span>Class rubric automatically linked</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                          <span>Plagiarism scan triggered</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Node 2: AI Evaluation & Tasks */}
                  <div className="rounded-2xl border border-amber-900/15 bg-white p-5 shadow-md shadow-amber-950/5 relative group hover:border-yellow-600/40 transition-colors">
                    <div className="flex items-center justify-between border-b border-amber-900/10 pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded-lg bg-amber-950 text-yellow-500">
                          <Bot size={14} />
                        </span>
                        <div>
                          <p className="text-xs font-bold text-amber-950">AI Analysis & Scoring</p>
                          <p className="text-[10px] text-amber-900/50">Rubric comparison engine</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-0.5 text-[10px] font-semibold text-yellow-800 border border-yellow-200">
                        Running
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="rounded-lg bg-amber-500/10 p-2.5 border border-amber-500/20">
                        <p className="text-[11px] font-semibold text-amber-950">
                          94.2% Criteria Alignment
                        </p>
                        <p className="text-[10px] text-amber-900/70 mt-0.5">
                          Calculated feedback and recommended grade formulated for teacher review.
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                        <span>Approval Queue:</span>
                        <span className="font-semibold text-amber-950">Dean & Faculty Lead</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Node 3: Synchronized Action Card */}
                <div className="rounded-2xl border border-amber-900/15 bg-white p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amber-950">Automated Gradebook Sync</p>
                      <p className="text-[11px] text-stone-500">
                        Updates student portal, generates PDF report & notifies guardian
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-yellow-700 bg-yellow-50 px-3 py-1 rounded-lg border border-yellow-200">
                    Instant Triggered
                  </span>
                </div>
              </div>

              {/* Right Configuration Inspector Panel (Just like reference) */}
              <div className="w-full lg:w-80 shrink-0 rounded-2xl border border-amber-900/15 bg-white p-4 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-amber-900/10 pb-3 mb-4">
                    <span className="text-xs font-bold text-amber-950">Workflow Inspector</span>
                    <span className="text-[10px] font-medium text-amber-900/50 uppercase tracking-wider">
                      Setup &gt; Rules
                    </span>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-amber-950 mb-1">
                        Active Connector
                      </label>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-[#faf6ee] border border-amber-900/10 font-medium text-stone-700">
                        <span>EduInsight Core API</span>
                        <span className="text-[10px] text-yellow-700 font-semibold">Configured</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-amber-950 mb-1">
                        Trigger Event
                      </label>
                      <div className="p-2 rounded-lg bg-[#faf6ee] border border-amber-900/10 text-stone-700">
                        Assignment Submission Received
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-amber-950 mb-1">
                        Routing Strategy
                      </label>
                      <div className="p-2 rounded-lg bg-[#faf6ee] border border-amber-900/10 text-stone-700 text-[11px]">
                        Auto-publish if Score &gt;= 85% with no flags
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-900/10">
                  <div className="flex items-center justify-between text-[11px] text-stone-500 mb-2">
                    <span>Connected account:</span>
                    <span className="font-semibold text-amber-950">academics@eduinsight.ai</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    <span className="text-[11px] font-medium text-emerald-700">
                      Webhook active &amp; verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ("BENTO GRID") ─── */}
      <section id="features" className="py-20 md:py-28 relative">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          {/* Section Header (Inspired directly by reference) */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              {/* Badge Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-950 text-yellow-400 text-xs font-bold tracking-wider uppercase mb-3">
                <Plus size={12} strokeWidth={3} />
                <span>{messages.bentoTag || 'USE CASES'}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-amber-950">
                {messages.bentoTitle || 'Automation for every department'}
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
              {messages.bentoSubtitle ||
                'EduInsight helps coordinate processes across academic and administrative departments while maintaining clarity and control.'}
            </p>
          </div>

          {/* Bento Box CSS Grid (`grid-cols-1 md:grid-cols-3 gap-6`) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ─── CARD 1: Business Operations (1 Column) ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45 }}
              className="bg-white border border-amber-900/10 rounded-3xl p-6 sm:p-8 shadow-md md:shadow-lg hover:shadow-xl hover:border-amber-900/20 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Top Graphic: Linked Orbital Badges (Mirroring Reference) */}
              <div className="relative h-44 w-full flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#faf6ee] to-white border border-amber-900/5 mb-6">
                {/* Orbital Circles */}
                <div
                  aria-hidden="true"
                  className="absolute size-36 rounded-full border border-amber-900/10"
                />
                <div
                  aria-hidden="true"
                  className="absolute size-24 rounded-full border border-yellow-600/20 bg-yellow-500/[0.04]"
                />

                {/* Linked Nodes */}
                <div className="relative flex items-center gap-3 z-10">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-950 text-yellow-400 shadow-md">
                    <Briefcase size={22} />
                  </div>
                  <div className="h-0.5 w-6 bg-yellow-600" />
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-900 text-white shadow-md">
                    <LinkIcon size={20} />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-xl font-bold text-amber-950">
                  {messages.bentoOpTitle || 'Academic & Business Operations'}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {messages.bentoOpDesc ||
                    'Automatically routing actions, course approvals, and keeping operational processes moving smoothly.'}
                </p>
              </div>
            </motion.div>

            {/* ─── CARD 2: Finance & Accounting / Automated Grading (2 Columns Spanning) ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="md:col-span-2 bg-white border border-amber-900/10 rounded-3xl p-6 sm:p-8 shadow-md md:shadow-lg hover:shadow-xl hover:border-amber-900/20 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Top Graphic: Horizontal Workflow Nodes Pipeline */}
              <div className="relative min-h-[176px] w-full flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#faf6ee] to-white border border-amber-900/5 p-4 mb-6">
                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
                  {/* Step 1 */}
                  <div className="w-full sm:w-auto flex-1 rounded-xl bg-white border border-amber-900/10 p-3 shadow-xs">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-900/50">
                      Trigger
                    </p>
                    <p className="mt-1 text-xs font-bold text-amber-950 truncate">
                      Submission Uploaded
                    </p>
                  </div>

                  <ArrowRight
                    size={16}
                    className="text-yellow-600 shrink-0 rotate-90 sm:rotate-0 rtl:rotate-180"
                  />

                  {/* Step 2 (Highlighted with Avatar) */}
                  <div className="w-full sm:w-auto flex-1 rounded-xl bg-amber-50 border-2 border-yellow-600/40 p-3 shadow-xs relative">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-yellow-800">
                        AI Extract &amp; Rubric
                      </p>
                      <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <p className="mt-1 text-xs font-bold text-amber-950 truncate">
                      Criteria Scoring
                    </p>
                    <div className="absolute -bottom-2.5 -right-2 flex items-center gap-1 bg-amber-950 text-white text-[9px] px-1.5 py-0.5 rounded-full shadow-xs">
                      <UserCheck size={9} className="text-yellow-400" />
                      <span>Evaluated</span>
                    </div>
                  </div>

                  <ArrowRight
                    size={16}
                    className="text-yellow-600 shrink-0 rotate-90 sm:rotate-0 rtl:rotate-180"
                  />

                  {/* Step 3 */}
                  <div className="w-full sm:w-auto flex-1 rounded-xl bg-white border border-amber-900/10 p-3 shadow-xs">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-900/50">
                      Validate
                    </p>
                    <p className="mt-1 text-xs font-bold text-amber-950 truncate">
                      Grade Approval Sync
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-xl font-bold text-amber-950">
                  {messages.bentoGradingTitle || 'Finance & Academic Approvals'}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {messages.bentoGradingDesc ||
                    'Capture submission data, validate criteria with AI rubrics, and streamline multi-step faculty approvals with automated processing.'}
                </p>
              </div>
            </motion.div>

            {/* ─── CARD 3: Sales & CRM / Student Performance Analytics (2 Columns Spanning) ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="md:col-span-2 bg-white border border-amber-900/10 rounded-3xl p-6 sm:p-8 shadow-md md:shadow-lg hover:shadow-xl hover:border-amber-900/20 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Top Graphic: Smooth Performance Trend Chart (From Reference) */}
              <div className="relative h-44 w-full flex flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-b from-[#faf6ee] to-white border border-amber-900/5 p-4 mb-6">
                {/* Floating Metric Tooltip Badge */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-950">
                    Student Retention &amp; Mastery Trend
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                    <TrendingUp size={11} />
                    {messages.bentoAnalyticsBadge || '+86% Retention Rate'}
                  </span>
                </div>

                {/* SVG Curve Graphic */}
                <div className="relative w-full h-24">
                  <svg
                    viewBox="0 0 500 120"
                    preserveAspectRatio="none"
                    className="w-full h-full"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#d97706" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#d97706" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 100 Q 150 95, 250 55 T 500 15 L 500 120 L 0 120 Z"
                      fill="url(#goldGradient)"
                    />
                    <path
                      d="M 0 100 Q 150 95, 250 55 T 500 15"
                      fill="none"
                      stroke="#b45309"
                      strokeWidth="3"
                    />
                    {/* Node Pointer Point */}
                    <circle cx="250" cy="55" r="5" fill="#78350f" stroke="#ffffff" strokeWidth="2" />
                  </svg>
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-amber-950 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
                    {messages.bentoAnalyticsStat || '1,420 Active Students'}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-xl font-bold text-amber-950">
                  {messages.bentoAnalyticsTitle || 'Student Performance & Retention'}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {messages.bentoAnalyticsDesc ||
                    'Track learning trends and automatically route high-impact intervention alerts to advisors and educators.'}
                </p>
              </div>
            </motion.div>

            {/* ─── CARD 4: HR & Operations (1 Column) ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="bg-white border border-amber-900/10 rounded-3xl p-6 sm:p-8 shadow-md md:shadow-lg hover:shadow-xl hover:border-amber-900/20 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Top Graphic: Hub-and-Spoke Avatar Team Network */}
              <div className="relative h-44 w-full flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#faf6ee] to-white border border-amber-900/5 mb-6">
                {/* Central Team Hub */}
                <div className="relative flex size-12 items-center justify-center rounded-2xl bg-amber-950 text-yellow-400 shadow-md z-10">
                  <Users size={20} />
                </div>

                {/* Satellite Mini Nodes */}
                <div className="absolute top-5 left-10 size-8 rounded-full bg-amber-100 border border-amber-900/10 flex items-center justify-center text-[10px] font-bold text-amber-900">
                  ENG
                </div>
                <div className="absolute top-6 right-10 size-8 rounded-full bg-yellow-100 border border-yellow-600/20 flex items-center justify-center text-[10px] font-bold text-yellow-800">
                  SCI
                </div>
                <div className="absolute bottom-5 left-12 size-8 rounded-full bg-amber-50 border border-amber-900/10 flex items-center justify-center text-[10px] font-bold text-amber-900">
                  ADM
                </div>
                <div className="absolute bottom-6 right-12 size-8 rounded-full bg-yellow-50 border border-yellow-600/20 flex items-center justify-center text-[10px] font-bold text-yellow-800">
                  FAC
                </div>

                {/* Connecting Dotted Radii */}
                <svg className="absolute inset-0 size-full pointer-events-none" aria-hidden="true">
                  <line
                    x1="50%"
                    y1="50%"
                    x2="28%"
                    y2="28%"
                    stroke="#c69225"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1="50%"
                    y1="50%"
                    x2="72%"
                    y2="30%"
                    stroke="#c69225"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1="50%"
                    y1="50%"
                    x2="32%"
                    y2="72%"
                    stroke="#c69225"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1="50%"
                    y1="50%"
                    x2="68%"
                    y2="70%"
                    stroke="#c69225"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                </svg>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-xl font-bold text-amber-950">
                  {messages.bentoFacultyTitle || 'Faculty & Staff Collaboration'}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {messages.bentoFacultyDesc ||
                    'Connect instructors, advisors, and department heads through automated onboarding and unified coordination.'}
                </p>
              </div>
            </motion.div>

            {/* ─── CARD 5: IT & Access Control (3 Columns or 1 Column Full Width) ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.25 }}
              className="md:col-span-3 bg-white border border-amber-900/10 rounded-3xl p-6 sm:p-8 shadow-md md:shadow-lg hover:shadow-xl hover:border-amber-900/20 transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-8"
            >
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-3">
                  <ShieldCheck size={14} className="text-yellow-600" />
                  <span>Enterprise Security &amp; Compliance</span>
                </div>
                <h3 className="text-2xl font-bold text-amber-950">
                  {messages.bentoItTitle || 'IT & Access Governance'}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600 max-w-xl">
                  {messages.bentoItDesc ||
                    'Automatically grant permissions, manage credentials, and alert system administrators when anomalies occur.'}
                </p>
              </div>

              {/* Micro UI Widget on the Right */}
              <div className="w-full md:w-80 rounded-2xl bg-[#faf6ee] border border-amber-900/10 p-4 text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-amber-950">Role-Based Access</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between text-stone-600 pt-1 border-t border-amber-900/10">
                  <span>Single Sign-On (SSO)</span>
                  <span className="font-semibold text-amber-950">Enforced</span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span>Audit Logging</span>
                  <span className="font-semibold text-amber-950">Real-time</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── OPERATIONAL WORKFLOW SECTION (Image 2 Inspired) ─── */}
      <section id="workflows" className="py-20 md:py-28 bg-[#faf6ee]/70 border-y border-amber-900/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 text-center">
          {/* Eyebrow Tag */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-900/15 bg-white px-4 py-1.5 shadow-xs mb-4">
            <span className="size-2 rounded-full bg-yellow-600" />
            <span className="text-xs font-bold tracking-wider uppercase text-amber-950">
              {messages.platformTag || 'HOW TEAMS USE EDUINSIGHT'}
            </span>
          </div>

          <h2 className="mx-auto max-w-3xl text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-amber-950 leading-tight">
            {messages.platformTitle || 'A platform designed for real operational workflows'}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base text-stone-600 leading-relaxed">
            {messages.platformSubtitle ||
              'Institutions use EduInsight to automate processes that span multiple tools, educators, and departments.'}
          </p>

          {/* 3 Value Metric Badges */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-start">
            <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm">
              <p className="text-3xl lg:text-4xl font-extrabold text-yellow-600">99.4%</p>
              <p className="mt-1 text-sm font-bold text-amber-950">Grading Turnaround Acceleration</p>
              <p className="mt-1 text-xs text-stone-500">
                Automated rubric extraction delivers accurate feedback in minutes instead of weeks.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm">
              <p className="text-3xl lg:text-4xl font-extrabold text-amber-950">4.8x</p>
              <p className="mt-1 text-sm font-bold text-amber-950">Faster Departmental Approvals</p>
              <p className="mt-1 text-xs text-stone-500">
                No more bottlenecks or manual email chains for curriculum changes or grade sign-offs.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm">
              <p className="text-3xl lg:text-4xl font-extrabold text-yellow-600">100%</p>
              <p className="mt-1 text-sm font-bold text-amber-950">Audit &amp; Compliance Trail</p>
              <p className="mt-1 text-xs text-stone-500">
                Full transparency across all educational evaluations and institutional data.
              </p>
            </div>
          </div>

          {/* Bottom Conversion Card */}
          <div className="mt-16 rounded-3xl bg-amber-950 text-white p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 text-start relative overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute -right-20 -top-20 size-72 rounded-full bg-yellow-500/10 blur-3xl pointer-events-none"
            />
            <div className="max-w-xl relative z-10">
              <span className="text-xs font-bold uppercase tracking-widest text-yellow-400">
                Ready to transform your institution?
              </span>
              <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">
                {messages.closingTitle || 'Together, toward smarter learning.'}
              </h3>
              <p className="mt-2 text-sm text-amber-100/70">
                Get started today and see how effortless academic and administrative workflow
                automation can be.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 w-full sm:w-auto">
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-yellow-600 hover:bg-yellow-700 text-white font-semibold text-sm shadow-md transition-all text-center"
              >
                {messages.platformCtaButton || 'Start Automating Today'}
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-white/20 hover:bg-white/10 text-white font-semibold text-sm transition-all text-center"
              >
                {messages.platformDemoButton || 'Book a Consultation'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-amber-900/10 bg-[#faf6ee] py-12">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-amber-900/10">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-amber-950 text-yellow-500">
                <GraduationCap size={18} />
              </div>
              <span className="text-sm font-bold tracking-tight text-amber-950">
                EDUINSIGHT <span className="text-yellow-600">AI</span>
              </span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-stone-600">
              <Link href="/login" className="hover:text-amber-950 transition-colors">
                {messages.login || 'Sign In'}
              </Link>
              <a href="#features" className="hover:text-amber-950 transition-colors">
                {messages.bentoTitle || 'Use Cases'}
              </a>
              <a href="#dashboard-preview" className="hover:text-amber-950 transition-colors">
                Platform Demo
              </a>
              <span className="text-amber-900/20">|</span>
              <span className="text-stone-500">
                {messages.footerTagline || 'Designed for better learning outcomes.'}
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
            <span>© {new Date().getFullYear()} EduInsight AI. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <LanguageSwitcher
                className="inline-flex min-h-8 items-center gap-1.5 text-xs text-amber-900/70 hover:text-amber-950 px-2 py-1 rounded-md"
                iconClassName="text-yellow-600"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
