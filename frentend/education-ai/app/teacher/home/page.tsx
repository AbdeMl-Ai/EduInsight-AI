'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, BookOpen, CalendarDays, LoaderCircle, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { getTeacherClasses, getTeacherErrorMessage, getTeacherProfile, getTeacherSchedule, getTeacherStudents, type TeacherClass, type TeacherProfile, type TeacherSchedule } from '@/lib/teacher-api';
import { useLandingLanguage } from '@/components/app/LandingLanguageProvider';

const DAY_MESSAGE_KEYS = {
  monday: 'monday',
  tuesday: 'tuesday',
  wednesday: 'wednesday',
  thursday: 'thursday',
  friday: 'friday',
  saturday: 'saturday',
  sunday: 'sunday',
} as const;

export default function TeacherHomePage() {
  const { language, messages } = useLandingLanguage();
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [schedule, setSchedule] = useState<TeacherSchedule[]>([]);
  const [studentCount, setStudentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    Promise.allSettled([getTeacherProfile(controller.signal), getTeacherClasses(controller.signal), getTeacherSchedule(controller.signal)])
      .then(async ([profileResult, classesResult, scheduleResult]) => {
        if (controller.signal.aborted) return;
        const errors: string[] = [];
        if (profileResult.status === 'fulfilled') setProfile(profileResult.value);
        else errors.push(`Profile: ${getTeacherErrorMessage(profileResult.reason, 'unavailable')}`);
        if (classesResult.status === 'fulfilled') {
          setClasses(classesResult.value);
          const enrolled = await Promise.allSettled(classesResult.value.map((item) => getTeacherStudents(item.class_id, controller.signal)));
          setStudentCount(new Set(enrolled.flatMap((result) => result.status === 'fulfilled' ? result.value.map((student) => student.student_id) : [])).size);
        } else errors.push(`Classes: ${getTeacherErrorMessage(classesResult.reason, 'unavailable')}`);
        if (scheduleResult.status === 'fulfilled') setSchedule(scheduleResult.value);
        else errors.push(`Schedule: ${getTeacherErrorMessage(scheduleResult.reason, 'unavailable')}`);
        if (errors.length) setError(errors.join(' '));
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  const today = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
  const todayLabel = new Intl.DateTimeFormat(language === 'ar' ? 'ar' : 'en-US', { weekday: 'long' }).format(new Date());
  const todaySchedule = useMemo(() => schedule.filter((item) => item.day === today).sort((a, b) => a.start_time.localeCompare(b.start_time)), [schedule, today]);
  const allSchedule = useMemo(() => [...schedule].sort((a, b) => `${a.day}-${a.start_time}`.localeCompare(`${b.day}-${b.start_time}`)), [schedule]);

  return <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-7">
    <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="hero-card relative isolate flex h-56 flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-[#11100e] p-6 sm:h-64 sm:p-8">
      <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1800&q=85" alt="Teacher working with students in a classroom" className="absolute inset-0 size-full object-cover object-center opacity-50" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
      <div className="relative z-10 max-w-xl"><p className="text-[10px] font-semibold tracking-[0.2em] text-[#dfc27e]">TEACHER OVERVIEW</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{loading ? 'Welcome back' : `Welcome back, ${profile?.full_name || 'Teacher'}`}</h1><p className="mt-3 text-sm leading-6 text-white/60">Your classes, students, and schedule in one considered workspace.</p><Link href="/teacher/grading" className="mt-6 inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-[#dfc27e] hover:text-[#f0d89d]">Open grading <ArrowUpRight size={15} /></Link></div>
    </motion.header>
    {error && <p role="alert" className="rounded-2xl border border-rose-300/20 bg-rose-300/[0.05] p-4 text-xs text-rose-200">{error}</p>}
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3"><Stat icon={BookOpen} label="Active classes" value={loading ? null : profile?.active_classes ?? 0} /><Stat icon={Users} label="Total students" value={loading ? null : profile?.total_students ?? 0} /><Stat icon={CalendarDays} label="Today's classes" value={loading ? null : todaySchedule.length} /></div>
    <section aria-labelledby="schedule-title"><div className="mb-4 flex items-end justify-between"><div><p className="text-[10px] font-semibold tracking-[0.18em] text-white/40">{messages.timetable}</p><h2 id="schedule-title" className="mt-1 text-lg font-semibold text-white">{messages.teachingSchedule}</h2></div><span className="text-[10px] text-white/35">{todayLabel}</span></div>{allSchedule.length ? <div className="space-y-3">{allSchedule.map((item, index) => { const dayKey = item.day.toLowerCase() as keyof typeof DAY_MESSAGE_KEYS; const dayMessageKey = DAY_MESSAGE_KEYS[dayKey]; return <motion.article key={item.id} initial={{ opacity: 0, x: language === 'ar' ? 8 : -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4"><div className="min-w-[5.2rem] text-xs font-semibold tabular-nums text-[#dfc27e]">{item.start_time}<span className="mt-1 block text-[10px] font-normal text-white/35">{item.end_time}</span></div><div className="min-w-0 border-s border-[#c6a96b]/25 ps-4"><p className="text-[10px] font-semibold tracking-[0.12em] text-[#dfc27e]">{dayMessageKey ? messages[dayMessageKey] : item.day}</p><h3 className="mt-1 truncate text-sm font-medium text-white">{item.class_name}</h3><p className="mt-1 text-[11px] text-white/45">{item.subject || item.level}</p></div></motion.article>; })}</div> : <div className="rounded-2xl border border-white/10 px-4 py-10 text-center"><CalendarDays className="mx-auto mb-2 text-[#c6a96b]" size={21} /><p className="text-xs text-white/45">{messages.noTeacherSessions}</p></div>}</section>
  </motion.section>;
}

function Stat({ icon: Icon, label, value }: { icon: typeof BookOpen; label: string; value: number | null }) { return <article className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-5"><span className="flex size-9 items-center justify-center rounded-xl border border-[#c6a96b]/20 bg-[#c6a96b]/[0.07] text-[#dfc27e]"><Icon size={17} /></span>{value === null ? <LoaderCircle className="mt-4 animate-spin text-white/40" size={19} /> : <p className="mt-4 text-2xl font-semibold tabular-nums text-white">{value}</p>}<p className="mt-1 text-[10px] text-white/45 sm:text-xs">{label}</p></article>; }
