'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bell,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Coins,
  CreditCard,
  DollarSign,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  MessageSquare,
  Percent,
  Plus,
  Send,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { getDashboardPath, useAuth } from '@/components/app/AuthProvider';
import { useLandingLanguage } from '@/components/app/LandingLanguageProvider';
import LanguageSwitcher from '@/components/app/LanguageSwitcher';

export default function LandingPage() {
  const router = useRouter();
  const { session, isReady } = useAuth();
  const { language, messages } = useLandingLanguage();
  const navigationStartedRef = useRef(false);

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
      {/* ─── NAVIGATION BAR ─── */}
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
              <span className="text-[10px] font-semibold tracking-wider text-amber-900/60 uppercase">
                School &amp; Center Management
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
              Features
            </button>
            <button
              onClick={() => scrollToSection('dashboard-preview')}
              className="transition-colors hover:text-amber-950"
            >
              Center Overview
            </button>
            <button
              onClick={() => scrollToSection('benefits')}
              className="transition-colors hover:text-amber-950"
            >
              Benefits
            </button>
          </nav>

          {/* Right Actions */}
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
              {messages.heroCtaExplore || 'Get Started'}
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28">
        {/* Subtle Ambient Background Warmth */}
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
              {messages.heroPill || 'All-in-One Educational Management'}
            </span>
          </motion.div>

          {/* Large, Bold Main Headline (Dark Brown) */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto max-w-4xl text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-amber-950 leading-[1.14]"
          >
            {messages.heroTitle || 'Manage Your Educational Center with Ease'}
          </motion.h1>

          {/* Descriptive Sub-headline (Lighter brown/gray) */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-base sm:text-lg lg:text-xl text-stone-600 leading-relaxed font-normal"
          >
            {messages.heroSubtitle ||
              'The all-in-one platform for admins, teachers, and students to seamlessly track attendance, grades, schedules, and payments.'}
          </motion.p>

          {/* Two CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* Solid Gold Button */}
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-yellow-600 hover:bg-yellow-700 text-white font-semibold text-sm shadow-md shadow-yellow-600/20 hover:shadow-lg hover:shadow-yellow-600/30 transition-all hover:-translate-y-0.5"
            >
              <span>{messages.heroCtaExplore || 'Get Started'}</span>
              <ArrowRight size={17} className="rtl:rotate-180" />
            </Link>

            {/* Outlined Brown Button */}
            <button
              type="button"
              onClick={() => scrollToSection('dashboard-preview')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-amber-900 text-amber-900 hover:bg-amber-900/5 font-semibold text-sm transition-all hover:-translate-y-0.5"
            >
              <span>{messages.heroCtaWorkspace || 'View Demo'}</span>
            </button>
          </motion.div>

          {/* ─── HERO DASHBOARD MOCKUP (School Management Workspace) ─── */}
          <motion.div
            id="dashboard-preview"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-14 sm:mt-16 mx-auto max-w-6xl rounded-3xl border border-amber-900/15 bg-white shadow-2xl shadow-amber-950/10 overflow-hidden text-start"
          >
            {/* School Workspace Top Bar */}
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
                    <BookOpen size={13} className="text-yellow-600" />
                    <span>Ibn Batouta Learning Center</span>
                  </span>
                  <span className="text-amber-900/40">/</span>
                  <span className="text-amber-900/70 font-normal truncate max-w-[180px] sm:max-w-none">
                    2025-2026 Academic Year
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-medium text-emerald-700 border border-emerald-200">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active Term
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-amber-900 bg-white border border-amber-900/15 px-3 py-1.5 rounded-lg shadow-xs hover:bg-stone-50"
                >
                  <FileSpreadsheet size={13} className="text-yellow-600" />
                  <span>Export Report</span>
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-amber-950 hover:bg-amber-900 px-3.5 py-1.5 rounded-lg shadow-xs transition-colors"
                >
                  <Plus size={13} strokeWidth={2.5} />
                  <span>Add Class</span>
                </button>
              </div>
            </div>

            {/* Main Interactive Center Dashboard Preview */}
            <div className="bg-[#fbf9f4] p-4 sm:p-6 lg:p-8 space-y-6">
              {/* Top Quick Metric Counters */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-amber-900/10 bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-amber-900/60">Enrolled Students</span>
                    <span className="flex size-7 items-center justify-center rounded-lg bg-yellow-500/15 text-yellow-700">
                      <Users size={15} />
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-extrabold text-amber-950">342</p>
                  <span className="text-[11px] font-semibold text-emerald-600">+14 enrolled this month</span>
                </div>

                <div className="rounded-2xl border border-amber-900/10 bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-amber-900/60">Active Classes</span>
                    <span className="flex size-7 items-center justify-center rounded-lg bg-amber-950 text-yellow-400">
                      <BookOpen size={15} />
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-extrabold text-amber-950">18</p>
                  <span className="text-[11px] text-stone-500">1AC to 2BAC Levels</span>
                </div>

                <div className="rounded-2xl border border-amber-900/10 bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-amber-900/60">Today's Attendance</span>
                    <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                      <UserCheck size={15} />
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-extrabold text-amber-950">96.4%</p>
                  <span className="text-[11px] font-semibold text-emerald-600">28/29 Present in Class</span>
                </div>

                <div className="rounded-2xl border border-amber-900/10 bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-amber-900/60">Monthly Fees Paid</span>
                    <span className="flex size-7 items-center justify-center rounded-lg bg-yellow-100 text-yellow-800">
                      <Coins size={15} />
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-extrabold text-amber-950">92%</p>
                  <span className="text-[11px] text-stone-500">Auto-split calculated</span>
                </div>
              </div>

              {/* Center Work Area: Live Class Session & Attendance Roll */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Live Session & Attendance Checklist (7 cols) */}
                <div className="lg:col-span-7 rounded-2xl border border-amber-900/10 bg-white p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    {/* Session Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-amber-900/10 pb-3 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-xs font-bold uppercase tracking-wider text-yellow-700">
                            Current Class In Session
                          </span>
                        </div>
                        <h4 className="mt-1 text-sm font-bold text-amber-950">
                          2BAC Science — Mathematics (Functions &amp; Limits)
                        </h4>
                      </div>
                      <div className="text-start sm:text-end text-xs">
                        <span className="font-semibold text-amber-950">10:00 - 12:00</span>
                        <p className="text-[11px] text-stone-500">Teacher: Prof. H. Amrani</p>
                      </div>
                    </div>

                    {/* Attendance Roster Table */}
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between py-1 text-[11px] font-semibold text-stone-500 border-b border-amber-900/5 px-2">
                        <span>Student Name</span>
                        <span>Level</span>
                        <span className="text-end">Attendance Status</span>
                      </div>

                      {/* Student 1 */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-[#faf6ee] border border-amber-900/5 text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="size-7 rounded-full bg-amber-950 text-yellow-400 font-bold flex items-center justify-center text-[11px]">
                            AE
                          </div>
                          <div>
                            <p className="font-bold text-amber-950">Aya El Mansouri</p>
                            <p className="text-[10px] text-stone-500">ID: #ST-2041</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-medium text-amber-900/70">2BAC Science</span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                          <Check size={11} strokeWidth={2.5} /> Present
                        </span>
                      </div>

                      {/* Student 2 */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-[#faf6ee] border border-amber-900/5 text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="size-7 rounded-full bg-yellow-600 text-white font-bold flex items-center justify-center text-[11px]">
                            OI
                          </div>
                          <div>
                            <p className="font-bold text-amber-950">Omar Idrissi</p>
                            <p className="text-[10px] text-stone-500">ID: #ST-2042</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-medium text-amber-900/70">2BAC Science</span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                          <Check size={11} strokeWidth={2.5} /> Present
                        </span>
                      </div>

                      {/* Student 3 */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-[#faf6ee] border border-amber-900/5 text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="size-7 rounded-full bg-amber-800 text-yellow-200 font-bold flex items-center justify-center text-[11px]">
                            ST
                          </div>
                          <div>
                            <p className="font-bold text-amber-950">Salma Tazi</p>
                            <p className="text-[10px] text-stone-500">ID: #ST-2043</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-medium text-amber-900/70">2BAC Science</span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 text-[11px] font-bold">
                          <Clock size={11} /> Late (10m)
                        </span>
                      </div>

                      {/* Student 4 */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-[#faf6ee] border border-amber-900/5 text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="size-7 rounded-full bg-stone-300 text-stone-700 font-bold flex items-center justify-center text-[11px]">
                            KM
                          </div>
                          <div>
                            <p className="font-bold text-amber-950">Karim Mansouri</p>
                            <p className="text-[10px] text-stone-500">ID: #ST-2044</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-medium text-amber-900/70">2BAC Science</span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 text-[11px] font-bold">
                          <X size={11} strokeWidth={2.5} /> Absent
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-amber-900/10 flex items-center justify-between text-xs">
                    <span className="text-stone-500">Attendance automatically saved &amp; logged</span>
                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white font-semibold text-xs shadow-xs transition-colors"
                    >
                      Save &amp; Notify Parents
                    </button>
                  </div>
                </div>

                {/* Right Column: Grades & Financial Distribution (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Recent Graded Exercise */}
                  <div className="rounded-2xl border border-amber-900/10 bg-white p-4 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-amber-950">Recent Exercise Evaluation</span>
                      <span className="text-[10px] font-bold text-yellow-700 bg-yellow-50 border border-yellow-200 px-2 py-0.5 rounded-md">
                        28/28 Graded
                      </span>
                    </div>
                    <p className="text-xs font-bold text-amber-950">Quiz #4: Polynomials &amp; Limits</p>
                    <div className="mt-3 flex items-center justify-between text-xs bg-[#faf6ee] p-2.5 rounded-xl border border-amber-900/5">
                      <div>
                        <span className="text-[10px] text-stone-500 block">Class Average</span>
                        <span className="text-sm font-extrabold text-amber-950">16.8 / 20</span>
                      </div>
                      <div className="h-8 w-px bg-amber-900/10" />
                      <div>
                        <span className="text-[10px] text-stone-500 block">Highest Score</span>
                        <span className="text-sm font-extrabold text-emerald-700">20 / 20</span>
                      </div>
                      <div className="h-8 w-px bg-amber-900/10" />
                      <div>
                        <span className="text-[10px] text-stone-500 block">Passing Rate</span>
                        <span className="text-sm font-extrabold text-yellow-700">96.4%</span>
                      </div>
                    </div>
                  </div>

                  {/* Financial & Revenue Percentage Breakdown */}
                  <div className="rounded-2xl border border-amber-900/10 bg-white p-4 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-amber-950">Monthly Tuition Collection</span>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        October Term
                      </span>
                    </div>

                    <div className="mt-2">
                      <div className="flex justify-between text-xs font-semibold text-amber-950 mb-1">
                        <span>Fee Collection Progress</span>
                        <span>42,800 / 46,000 MAD</span>
                      </div>
                      <div className="h-2.5 w-full bg-[#faf6ee] rounded-full overflow-hidden border border-amber-900/10">
                        <div className="h-full bg-yellow-600 rounded-full" style={{ width: '93%' }} />
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-amber-900/10 grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-[#faf6ee] border border-amber-900/5">
                        <span className="text-[10px] text-stone-500 block">Teacher Share (70%)</span>
                        <span className="font-extrabold text-amber-950">29,960 MAD</span>
                      </div>
                      <div className="p-2 rounded-lg bg-[#faf6ee] border border-amber-900/5">
                        <span className="text-[10px] text-stone-500 block">Center Share (30%)</span>
                        <span className="font-extrabold text-amber-950">12,840 MAD</span>
                      </div>
                    </div>
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
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              {/* Badge Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-950 text-yellow-400 text-xs font-bold tracking-wider uppercase mb-3">
                <GraduationCap size={14} />
                <span>{messages.bentoTag || 'CENTER MANAGEMENT'}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-amber-950">
                {messages.bentoTitle || 'Everything you need to run your center'}
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
              {messages.bentoSubtitle ||
                'Purpose-built tools for educational directors, teachers, and learners to excel together.'}
            </p>
          </div>

          {/* ─── BENTO BOX GRID (`grid-cols-1 md:grid-cols-3 gap-6`) ─── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ─── CARD 1: Smart Class Management (Spans 2 Columns) ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45 }}
              className="md:col-span-2 bg-white border border-amber-900/10 rounded-3xl p-6 sm:p-8 shadow-md md:shadow-lg hover:shadow-xl hover:border-amber-900/20 transition-all duration-300 flex flex-col justify-between"
            >
              {/* UI Mockup Hint: Mini-list of students with their class levels (1AC, 2BAC) */}
              <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#faf6ee] to-white border border-amber-900/5 p-4 sm:p-5 mb-6">
                <div className="flex items-center justify-between border-b border-amber-900/10 pb-2.5 mb-3 text-xs font-bold text-amber-950">
                  <span className="flex items-center gap-1.5">
                    <Users size={14} className="text-yellow-600" />
                    <span>Enrolled Student Roster</span>
                  </span>
                  <span className="text-[11px] font-semibold text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-md border border-yellow-200">
                    Unified Directory
                  </span>
                </div>

                <div className="space-y-2.5">
                  {/* Student Item 1 */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-amber-900/10 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-xl bg-amber-950 text-yellow-400 font-bold flex items-center justify-center text-xs">
                        AM
                      </div>
                      <div>
                        <p className="text-xs font-bold text-amber-950">Aya El Mansouri</p>
                        <p className="text-[10px] text-stone-500">Teacher: Prof. Amrani • Math</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[11px] font-bold">
                        2BAC Science
                      </span>
                      <span className="size-2 rounded-full bg-emerald-500" title="Enrolled & Active" />
                    </div>
                  </div>

                  {/* Student Item 2 */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-amber-900/10 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-xl bg-yellow-600 text-white font-bold flex items-center justify-center text-xs">
                        MC
                      </div>
                      <div>
                        <p className="text-xs font-bold text-amber-950">Mehdi Chraibi</p>
                        <p className="text-[10px] text-stone-500">Teacher: Prof. Tazi • Physics</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-yellow-100 text-yellow-800 text-[11px] font-bold">
                        1AC Middle School
                      </span>
                      <span className="size-2 rounded-full bg-emerald-500" title="Enrolled & Active" />
                    </div>
                  </div>

                  {/* Student Item 3 */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-amber-900/10 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-xl bg-stone-700 text-yellow-200 font-bold flex items-center justify-center text-xs">
                        NB
                      </div>
                      <div>
                        <p className="text-xs font-bold text-amber-950">Nour Benali</p>
                        <p className="text-[10px] text-stone-500">Teacher: Prof. Bennani • BioF</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[11px] font-bold">
                        2BAC BioF
                      </span>
                      <span className="size-2 rounded-full bg-emerald-500" title="Enrolled & Active" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div>
                <h3 className="text-xl font-bold text-amber-950">
                  {messages.bentoClassesTitle || 'Smart Class Management'}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {messages.bentoClassesDesc ||
                    'Easily organize classes, assign teachers, and manage student enrollments in one unified workspace.'}
                </p>
              </div>
            </motion.div>

            {/* ─── CARD 2: Grading & Attendance (1 Column) ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="bg-white border border-amber-900/10 rounded-3xl p-6 sm:p-8 shadow-md md:shadow-lg hover:shadow-xl hover:border-amber-900/20 transition-all duration-300 flex flex-col justify-between"
            >
              {/* UI Mockup Hint: Tap-friendly attendance buttons and graded exercise score */}
              <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#faf6ee] to-white border border-amber-900/5 p-4 mb-6 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-amber-950 pb-2 border-b border-amber-900/10">
                  <span>Fast Roll Call</span>
                  <span className="text-[10px] text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-md">
                    1-Tap Attendance
                  </span>
                </div>

                {/* 1-Tap Attendance Pills */}
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-2 text-emerald-800">
                    <p className="text-[10px] uppercase font-bold">Present</p>
                    <CheckCircle2 size={16} className="mx-auto mt-1 text-emerald-600" />
                  </div>
                  <div className="rounded-xl border border-amber-300 bg-amber-50 p-2 text-amber-800">
                    <p className="text-[10px] uppercase font-bold">Late</p>
                    <Clock size={16} className="mx-auto mt-1 text-amber-600" />
                  </div>
                  <div className="rounded-xl border border-rose-300 bg-rose-50 p-2 text-rose-800">
                    <p className="text-[10px] uppercase font-bold">Absent</p>
                    <X size={16} className="mx-auto mt-1 text-rose-600" />
                  </div>
                </div>

                {/* Grade Score Widget */}
                <div className="rounded-xl bg-white border border-amber-900/10 p-2.5 flex items-center justify-between shadow-xs">
                  <div>
                    <p className="text-[10px] text-stone-500">Exercise Grade</p>
                    <p className="text-xs font-bold text-amber-950">Calculus Quiz</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                    18.5 / 20
                  </span>
                </div>
              </div>

              {/* Text Content */}
              <div>
                <h3 className="text-xl font-bold text-amber-950">
                  {messages.bentoAttendanceTitle || 'Grading & Attendance'}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {messages.bentoAttendanceDesc ||
                    'Quickly record daily attendance and grade exercises in a fast, tap-friendly interface.'}
                </p>
              </div>
            </motion.div>

            {/* ─── CARD 3: Financial Tracking (1 Column) ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="bg-white border border-amber-900/10 rounded-3xl p-6 sm:p-8 shadow-md md:shadow-lg hover:shadow-xl hover:border-amber-900/20 transition-all duration-300 flex flex-col justify-between"
            >
              {/* UI Mockup Hint: Monthly fees with visual indicators and automatic teacher/center percentages */}
              <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#faf6ee] to-white border border-amber-900/5 p-4 mb-6 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-amber-950 pb-2 border-b border-amber-900/10">
                  <span className="flex items-center gap-1.5">
                    <Coins size={14} className="text-yellow-600" />
                    <span>Monthly Tuition Fee</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    94% Paid
                  </span>
                </div>

                {/* Student Payment Status Chip */}
                <div className="rounded-xl bg-white border border-amber-900/10 p-2.5 flex items-center justify-between shadow-xs">
                  <div>
                    <p className="text-[10px] text-stone-500">Student Tuition</p>
                    <p className="text-xs font-bold text-amber-950">Yasmine Bennani</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                    Paid: 450 MAD
                  </span>
                </div>

                {/* Percentage Split Calculation Indicator */}
                <div className="rounded-xl bg-white border border-amber-900/10 p-2.5 space-y-1.5 shadow-xs">
                  <div className="flex justify-between text-[11px] font-bold text-amber-950">
                    <span>Teacher Share (70%)</span>
                    <span>315 MAD</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-bold text-stone-600">
                    <span>Center Share (30%)</span>
                    <span>135 MAD</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#faf6ee] rounded-full overflow-hidden flex">
                    <div className="h-full bg-yellow-600" style={{ width: '70%' }} />
                    <div className="h-full bg-amber-950" style={{ width: '30%' }} />
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div>
                <h3 className="text-xl font-bold text-amber-950">
                  {messages.bentoFinanceTitle || 'Financial Tracking'}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {messages.bentoFinanceDesc ||
                    'Monitor student monthly fees with clear visual indicators and automatically calculate teacher/center percentages.'}
                </p>
              </div>
            </motion.div>

            {/* ─── CARD 4: Instant Notifications (Spans 2 Columns) ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="md:col-span-2 bg-white border border-amber-900/10 rounded-3xl p-6 sm:p-8 shadow-md md:shadow-lg hover:shadow-xl hover:border-amber-900/20 transition-all duration-300 flex flex-col justify-between"
            >
              {/* UI Mockup Hint: Direct messaging between administration and students */}
              <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#faf6ee] to-white border border-amber-900/5 p-4 sm:p-5 mb-6">
                <div className="flex items-center justify-between text-xs font-bold text-amber-950 pb-2.5 border-b border-amber-900/10 mb-3">
                  <span className="flex items-center gap-1.5">
                    <Bell size={14} className="text-yellow-600" />
                    <span>Center Direct Messaging</span>
                  </span>
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                    Admin Announcement
                  </span>
                </div>

                {/* Message Bubble Card */}
                <div className="rounded-xl bg-white border border-amber-900/10 p-3 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-md bg-amber-950 text-yellow-400 flex items-center justify-center text-[10px] font-bold">
                        DIR
                      </div>
                      <span className="text-xs font-bold text-amber-950">Center Administration</span>
                    </div>
                    <span className="text-[10px] text-stone-500">To: 2BAC Mathematics (32 Students)</span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed bg-[#faf6ee] p-2.5 rounded-lg border border-amber-900/5">
                    &ldquo;Reminder: The mock mathematics evaluation will take place this Saturday at 09:00. Please make sure your calculators and exercises are ready.&rdquo;
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-stone-500">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                      <CheckCircle2 size={12} /> Delivered to 32 students
                    </span>
                    <span className="text-amber-900/70 font-medium">Read by 30</span>
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div>
                <h3 className="text-xl font-bold text-amber-950">
                  {messages.bentoNotificationsTitle || 'Instant Notifications'}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {messages.bentoNotificationsDesc ||
                    'Keep everyone in the loop with direct messaging between administration and students.'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── BENEFITS & CENTER SUCCESS SECTION ─── */}
      <section id="benefits" className="py-20 md:py-28 bg-[#faf6ee]/70 border-y border-amber-900/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 text-center">
          {/* Eyebrow Tag */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-900/15 bg-white px-4 py-1.5 shadow-xs mb-4">
            <span className="size-2 rounded-full bg-yellow-600" />
            <span className="text-xs font-bold tracking-wider uppercase text-amber-950">
              {messages.platformTag || 'CENTER SUCCESS'}
            </span>
          </div>

          <h2 className="mx-auto max-w-3xl text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-amber-950 leading-tight">
            {messages.platformTitle || 'Designed for real educational centers'}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base text-stone-600 leading-relaxed">
            {messages.platformSubtitle ||
              'Admins, teachers, and students stay connected with simple, powerful daily workflows.'}
          </p>

          {/* 3 Metric Value Badges */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-start">
            <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm">
              <p className="text-3xl lg:text-4xl font-extrabold text-yellow-600">98%</p>
              <p className="mt-1 text-sm font-bold text-amber-950">On-Time Tuition Fee Collection</p>
              <p className="mt-1 text-xs text-stone-500">
                Clear monthly fee tracking and automatic receipt generation eliminate payment confusion.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm">
              <p className="text-3xl lg:text-4xl font-extrabold text-amber-950">15 min</p>
              <p className="mt-1 text-sm font-bold text-amber-950">Daily Attendance &amp; Admin Time</p>
              <p className="mt-1 text-xs text-stone-500">
                Teachers record roll call with one tap, freeing more time for teaching and student mentorship.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm">
              <p className="text-3xl lg:text-4xl font-extrabold text-yellow-600">100%</p>
              <p className="mt-1 text-sm font-bold text-amber-950">Grade &amp; Schedule Transparency</p>
              <p className="mt-1 text-xs text-stone-500">
                Students and parents have immediate access to grades, timetables, and direct school announcements.
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
                Ready to modernize your educational center?
              </span>
              <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">
                {messages.closingTitle || 'Together, toward smarter learning.'}
              </h3>
              <p className="mt-2 text-sm text-amber-100/70">
                Join modern learning centers, schools, and private tutoring academies using EduInsight AI today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 w-full sm:w-auto">
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-yellow-600 hover:bg-yellow-700 text-white font-semibold text-sm shadow-md transition-all text-center"
              >
                {messages.platformCtaButton || 'Get Started Free'}
              </Link>
              <button
                type="button"
                onClick={() => scrollToSection('dashboard-preview')}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-white/20 hover:bg-white/10 text-white font-semibold text-sm transition-all text-center"
              >
                {messages.platformDemoButton || 'View Demo'}
              </button>
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
                Features
              </a>
              <a href="#dashboard-preview" className="hover:text-amber-950 transition-colors">
                Center Demo
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
