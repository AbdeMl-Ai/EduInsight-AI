'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowUpRight, Bell, BookOpen, GraduationCap, Hand, Send, Users } from 'lucide-react';
import AdminRevenueAttendance from '@/components/admin/AdminRevenueAttendance';
import AdminWeeklySchedule from '@/components/admin/AdminWeeklySchedule';
import { useLandingLanguage } from '@/components/app/LandingLanguageProvider';
import {
  getAdminErrorMessage,
  getAdminProfile,
  getAdminNotifications,
  getAdminStats,
  type AdminProfile,
  type AdminNotification,
  type AdminStats,
} from '@/lib/admin-api';

export default function AdminHomePage() {
  const { messages } = useLandingLanguage();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setErrors([]);
    Promise.allSettled([
      getAdminProfile(controller.signal),
      getAdminStats(controller.signal),
      getAdminNotifications(controller.signal),
    ]).then((results) => {
      if (controller.signal.aborted) return;
      const nextErrors: string[] = [];
      if (results[0].status === 'fulfilled') setProfile(results[0].value);
      else nextErrors.push(getAdminErrorMessage(results[0].reason, 'Admin profile could not be loaded.'));
      if (results[1].status === 'fulfilled') setStats(results[1].value);
      else nextErrors.push(getAdminErrorMessage(results[1].reason, 'Dashboard counts could not be loaded.'));
      if (results[2].status === 'fulfilled') setNotifications(results[2].value);
      else nextErrors.push(getAdminErrorMessage(results[2].reason, 'Notifications could not be loaded.'));
      setErrors(nextErrors);
      setLoading(false);
    });
    return () => controller.abort();
  }, [attempt]);

  const statItems = [
    { label: 'Students', value: stats?.total_students, icon: GraduationCap, tone: 'gold', detail: '+20% this month', status: false },
    { label: 'Teaching staff', value: stats?.teaching_staff, icon: Users, tone: 'green', detail: 'Active', status: true },
    { label: 'Active classes', value: stats?.active_classes, icon: BookOpen, tone: 'violet', detail: 'Active', status: true },
  ];

  return (
    <section className="space-y-6">
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="hero-card relative isolate flex min-h-56 flex-col justify-end overflow-hidden rounded-2xl border border-slate-300/80 bg-gradient-to-br from-slate-100 via-slate-50 to-amber-50 p-4 shadow-[0_18px_55px_rgba(15,23,42,0.08)] transition-colors duration-300 dark:border-white/10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] sm:min-h-64 sm:p-8"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(to_right,rgba(100,116,139,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.12)_1px,transparent_1px)] [background-size:28px_28px] dark:opacity-35 dark:[background-image:linear-gradient(to_right,rgba(203,213,225,0.11)_1px,transparent_1px),linear-gradient(to_bottom,rgba(203,213,225,0.11)_1px,transparent_1px)]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 end-0 hidden w-[52%] items-center justify-center overflow-hidden sm:flex">
          <div className="absolute size-64 rounded-full border border-slate-400/20 bg-amber-300/10 blur-3xl dark:border-white/10 dark:bg-emerald-300/[0.04]" />
          <div className="relative flex size-52 items-center justify-center rounded-[2.5rem] border border-slate-400/20 bg-white/25 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.025]">
            <div className="absolute -end-5 -top-5 flex size-16 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-200/50 text-amber-800 dark:border-amber-200/15 dark:bg-amber-200/[0.06] dark:text-amber-200">
              <GraduationCap size={29} strokeWidth={1.4} />
            </div>
            <BookOpen className="text-slate-500/35 dark:text-slate-300/25" size={118} strokeWidth={0.8} />
            <div className="absolute -bottom-4 -left-4 flex size-14 items-center justify-center rounded-2xl border border-emerald-600/15 bg-emerald-100/70 text-emerald-800 dark:border-emerald-200/15 dark:bg-emerald-200/[0.06] dark:text-emerald-200">
              <Activity size={24} strokeWidth={1.5} />
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent dark:from-slate-950 dark:via-slate-950/85 dark:to-transparent rtl:bg-gradient-to-l" />
        <div className="relative z-10 flex h-full w-full flex-col items-start">
          <div className="max-w-xl">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-800/80 dark:text-amber-200/75">{messages.adminOffice}</p>
            <h1 className="break-words text-xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-3xl dark:text-white">
              {messages.welcomeBack.replace('{name}', profile?.full_name || messages.adminName)}
              <Hand className="ms-2 inline-block -rotate-12 text-amber-600 dark:text-amber-300" size={24} strokeWidth={1.8} aria-hidden="true" />
            </h1>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300/75">{messages.manageCommunityDesc}</p>
          </div>
          <div className="mt-auto flex w-full flex-col items-start gap-3 pt-5 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:pt-0">
            <Link href="/admin/people" className="inline-flex min-h-9 max-w-full items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-400 px-3.5 text-xs font-semibold text-slate-950 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-amber-300 dark:border-amber-200/30 dark:bg-amber-200 dark:hover:bg-amber-100">
              {messages.managePeopleLink} <ArrowUpRight size={15} />
            </Link>
            <div className="max-w-full rounded-full border border-slate-300 bg-white/65 px-2.5 py-1 text-[9px] font-medium tracking-[0.13em] text-slate-600 backdrop-blur-sm dark:border-white/15 dark:bg-black/30 dark:text-white/65">{messages.adminOffice}</div>
          </div>
        </div>
      </motion.header>

      <section aria-label="Notifications" className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm transition-colors duration-300 dark:border-white/10 dark:bg-white/[0.025]">
        <Link href="/admin/notifications" aria-label="Open notifications" title="Notifications" className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-[#c6a96b]/30 bg-[#c6a96b]/[0.08] text-[#dfc27e] hover:bg-[#c6a96b]/[0.14]"><Bell size={19} /></Link>
        <div className="min-w-0 flex-1"><p className="text-[10px] font-semibold tracking-[0.14em] text-slate-500 dark:text-white/40">LATEST NOTIFICATION</p><p className="mt-1 truncate text-xs text-slate-700 dark:text-white/70">{loading ? 'Loading notifications...' : notifications[0]?.message || 'No notifications yet.'}</p></div>
        <Link href="/admin/notifications" className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-md border border-white/10 px-2.5 text-[10px] font-semibold text-white/60 hover:border-[#c6a96b]/30 hover:text-[#dfc27e]"><Send size={13} />Send</Link>
      </section>

      <section aria-labelledby="admin-stats-heading">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.16em] text-slate-500 dark:text-white/40">AT A GLANCE</p>
            <h2 id="admin-stats-heading" className="mt-1 text-base font-semibold text-slate-900 dark:text-white">Learning community</h2>
          </div>
          <Link href="/admin/classes" className="text-[10px] font-medium text-amber-800 transition-colors hover:text-amber-600 dark:text-[#dfc27e] dark:hover:text-[#f0d89d]">View classes</Link>
        </div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-3">
          {statItems.map(({ label, value, icon: Icon, tone, detail, status }, index) => (
            <motion.article
              key={label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`group relative min-w-0 overflow-hidden rounded-xl border bg-white/80 p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:bg-white/[0.025] sm:p-5 ${
                tone === 'gold'
                  ? 'border-amber-300/70 shadow-amber-950/[0.035] hover:border-amber-400/80 dark:border-amber-200/15 dark:hover:border-amber-200/35 dark:hover:shadow-amber-200/[0.06]'
                  : tone === 'green'
                    ? 'border-emerald-300/60 shadow-emerald-950/[0.035] hover:border-emerald-400/80 dark:border-emerald-200/15 dark:hover:border-emerald-200/35 dark:hover:shadow-emerald-200/[0.06]'
                    : 'border-violet-300/60 shadow-violet-950/[0.035] hover:border-violet-400/80 dark:border-violet-200/15 dark:hover:border-violet-200/35 dark:hover:shadow-violet-200/[0.06]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className={`flex size-10 items-center justify-center rounded-xl border ${
                  tone === 'gold'
                    ? 'border-amber-400/25 bg-amber-400/10 text-amber-800 dark:text-amber-200'
                    : tone === 'green'
                      ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-800 dark:text-emerald-200'
                      : 'border-violet-400/25 bg-violet-400/10 text-violet-800 dark:text-violet-200'
                }`}>
                  <Icon size={19} strokeWidth={1.7} />
                </span>
                {status && <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.07] px-2 py-1 text-[9px] font-semibold text-emerald-800 dark:text-emerald-300"><span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-300" />{detail}</span>}
              </div>
              {loading ? (
                <div role="status" className="mt-4 h-7 w-10 animate-pulse rounded bg-slate-200 dark:bg-white/10" />
              ) : (
                <p className="mt-4 text-2xl font-semibold tabular-nums tracking-tight text-slate-950 dark:text-white sm:text-3xl">{value ?? '—'}</p>
              )}
              <div className="mt-1 flex min-h-6 items-center justify-between gap-2">
                <p className="text-xs font-medium text-slate-600 dark:text-white/55">{label}</p>
                {!status && <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold text-emerald-700 dark:text-emerald-300"><Activity size={12} />{detail}</span>}
              </div>
              {!status && <svg aria-hidden="true" viewBox="0 0 100 24" className="absolute bottom-4 right-4 h-6 w-20 text-emerald-500/70 dark:text-emerald-300/65"><path d="M1 19 C14 18 16 8 28 12 S46 20 56 10 73 6 81 9 91 4 99 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M1 19 C14 18 16 8 28 12 S46 20 56 10 73 6 81 9 91 4 99 2 L99 24 L1 24 Z" fill="currentColor" opacity=".08" /></svg>}
            </motion.article>
          ))}
        </div>
      </section>

      {errors.length > 0 && (
        <div role="alert" className="rounded-lg border border-rose-300/20 bg-rose-300/[0.05] p-4">
          <p className="text-xs leading-5 text-rose-200">{errors.join(' ')}</p>
          <button onClick={() => setAttempt((value) => value + 1)} className="mt-2 min-h-9 text-xs font-semibold text-[#dfc27e] underline underline-offset-4">Try again</button>
        </div>
      )}

      <AdminRevenueAttendance />
      <AdminWeeklySchedule />
    </section>
  );
}