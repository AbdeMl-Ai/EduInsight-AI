'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Bell, BookOpen, GraduationCap, Send, Users } from 'lucide-react';
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
    { label: 'Students', value: stats?.total_students, icon: GraduationCap, tone: 'text-[#dfc27e] border-[#c6a96b]/20 bg-[#c6a96b]/[0.07]' },
    { label: 'Teaching staff', value: stats?.teaching_staff, icon: Users, tone: 'text-emerald-300 border-emerald-300/15 bg-emerald-300/[0.05]' },
    { label: 'Active classes', value: stats?.active_classes, icon: BookOpen, tone: 'text-[#dfc27e] border-[#c6a96b]/20 bg-[#c6a96b]/[0.07]' },
  ];

  return (
    <section className="space-y-6">
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="hero-card relative isolate flex h-56 flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-[#11100e] p-6 sm:h-64 sm:p-8"
      >
        <img
          src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=85"
          alt="A modern office workspace"
          className="absolute inset-0 size-full object-cover object-center opacity-55"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
        <div className="relative z-10 flex h-full w-full flex-col items-start">
          <div className="max-w-xl">
            <h1 className="break-words text-2xl font-semibold text-white sm:text-3xl">
              {messages.welcomeBack.replace('{name}', profile?.full_name || messages.adminName)}
              <span className="ms-2" aria-hidden="true">👋</span>
            </h1>
            <p className="mt-2 text-sm leading-6 text-white/70">{messages.manageCommunityDesc}</p>
          </div>
          <div className="mt-auto flex w-full items-end justify-between gap-4">
            <Link href="/admin/people" className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-[#dfc27e] hover:text-[#f0d89d]">
              {messages.managePeopleLink} <ArrowUpRight size={15} />
            </Link>
            <div className="rounded-full border border-white/15 bg-black/30 px-2.5 py-1 text-[9px] font-medium tracking-[0.13em] text-white/65 backdrop-blur-sm">{messages.adminOffice}</div>
          </div>
        </div>
      </motion.header>

      <section aria-label="Notifications" className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.025] p-3">
        <Link href="/admin/notifications" aria-label="Open notifications" title="Notifications" className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-[#c6a96b]/30 bg-[#c6a96b]/[0.08] text-[#dfc27e] hover:bg-[#c6a96b]/[0.14]"><Bell size={19} /></Link>
        <div className="min-w-0 flex-1"><p className="text-[10px] font-semibold tracking-[0.14em] text-white/40">LATEST NOTIFICATION</p><p className="mt-1 truncate text-xs text-white/70">{loading ? 'Loading notifications...' : notifications[0]?.message || 'No notifications yet.'}</p></div>
        <Link href="/admin/notifications" className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-md border border-white/10 px-2.5 text-[10px] font-semibold text-white/60 hover:border-[#c6a96b]/30 hover:text-[#dfc27e]"><Send size={13} />Send</Link>
      </section>

      <section aria-labelledby="admin-stats-heading">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.16em] text-white/40">AT A GLANCE</p>
            <h2 id="admin-stats-heading" className="mt-1 text-base font-semibold text-white">Learning community</h2>
          </div>
          <Link href="/admin/classes" className="text-[10px] font-medium text-[#dfc27e]">View classes</Link>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {statItems.map(({ label, value, icon: Icon, tone }, index) => (
            <motion.article
              key={label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="min-w-0 rounded-lg border border-white/10 bg-white/[0.025] p-3 sm:p-4"
            >
              <span className={`flex size-8 items-center justify-center rounded-lg border ${tone}`}>
                <Icon size={16} strokeWidth={1.8} />
              </span>
              {loading ? (
                <div role="status" className="mt-4 h-7 w-10 animate-pulse rounded bg-white/10" />
              ) : (
                <p className="mt-3 text-xl font-semibold tabular-nums text-white sm:text-2xl">{value ?? '—'}</p>
              )}
              <p className="mt-1 min-h-7 text-[10px] leading-4 text-white/45 sm:text-xs">{label}</p>
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

      <AdminWeeklySchedule />
    </section>
  );
}