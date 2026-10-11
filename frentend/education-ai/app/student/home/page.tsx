'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, BookOpen, ChartNoAxesColumnIncreasing, ClipboardCheck, UserRound } from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useLandingLanguage } from '@/components/app/LandingLanguageProvider';
import {
  getApiErrorMessage,
  getStudentDashboardProgress,
  getStudentProfile,
  type StudentClassProgress,
  type StudentProfile,
} from '@/lib/student-api';

const destinations = [
  { href: '/student/courses', title: 'studentCoursesTitle', subtitle: 'studentCoursesSubtitle', icon: BookOpen },
  { href: '/student/exercises', title: 'studentExercisesTitle', subtitle: 'studentExercisesSubtitle', icon: ClipboardCheck },
  { href: '/student/grades', title: 'studentGradesTitle', subtitle: 'studentGradesSubtitle', icon: ChartNoAxesColumnIncreasing },
  { href: '/student/profile', title: 'studentProfileTitle', subtitle: 'studentProfileSubtitle', icon: UserRound },
] as const;

export default function StudentHomePage() {
  const { language, messages } = useLandingLanguage();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [classProgress, setClassProgress] = useState<StudentClassProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    Promise.all([
      getStudentProfile(controller.signal),
      getStudentDashboardProgress(controller.signal),
    ])
      .then(([student, progress]) => {
        setProfile(student);
        setClassProgress(progress.classes);
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(getApiErrorMessage(requestError, messages.studentDashboardLoadError));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt, messages.studentDashboardLoadError]);

  return (
    <section className="space-y-5">
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="student-home-hero relative isolate flex h-56 flex-col justify-end overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-6 transition-colors dark:border-white/10 dark:bg-[#15130f] sm:h-64 sm:p-8"
      >
        <img
          src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=85"
          alt={messages.studentHeroImageAlt}
          className="absolute inset-0 -z-20 size-full object-cover object-center opacity-35 dark:opacity-60"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white via-white/85 to-white/35 dark:from-[#0a0a0a] dark:via-[#0a0a0a]/85 dark:to-transparent rtl:bg-gradient-to-l" />
        <div className="absolute end-5 top-5 rounded-full border border-amber-800/20 bg-white/75 px-3 py-1.5 text-start text-[9px] font-medium tracking-[0.15em] text-amber-900 backdrop-blur-sm dark:border-white/15 dark:bg-black/25 dark:text-white/75 sm:end-7 sm:top-7">
          {messages.studentSpace}
        </div>
        <div className="max-w-xl">
          <p className="mb-2 text-start text-[10px] font-semibold tracking-[0.2em] text-amber-800 dark:text-[#dfc27e]">{messages.studentNewDayToLearn}</p>
          {loading ? (
            <div role="status" className="h-9 w-52 animate-pulse rounded bg-white/10" />
          ) : error ? (
            <div role="alert">
              <h1 className="text-start text-xl font-semibold text-slate-900 dark:text-white">{messages.studentDashboardUnavailable}</h1>
              <p className="mt-2 max-w-md text-start text-xs leading-5 text-rose-700 dark:text-rose-100/85">{error}</p>
              <button onClick={() => setAttempt((value) => value + 1)} className="mt-3 min-h-9 text-start text-xs font-semibold text-amber-800 underline underline-offset-4 dark:text-[#f0d89d]">{messages.tryAgain}</button>
            </div>
          ) : (
            <>
              <h1 className="break-words text-start text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">{messages.studentGoodMorning.replace('{name}', profile?.full_name ?? '')}</h1>
              <p className="mt-2 text-start text-sm text-slate-700 dark:text-white/70">{messages.studentSmallSteps}</p>
            </>
          )}
        </div>
      </motion.header>

      {!loading && !error && (
        <motion.section
          aria-label={messages.studentYourProgress}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="space-y-3"
        >
          <header>
            <p className="text-start text-[10px] font-semibold tracking-[0.16em] text-amber-800 dark:text-[#d5ba7a]">{messages.studentYourProgress}</p>
            <h2 className="mt-1 text-start text-base font-semibold text-slate-900 dark:text-white">{messages.studentProgressByClass}</h2>
          </header>
          {classProgress.length ? (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {classProgress.map((classItem, classIndex) => {
                const chartData = classItem.exercises.map((exercise) => ({
                  ...exercise,
                  label: messages.studentExerciseShort.replace(
                    '{number}',
                    new Intl.NumberFormat(language === 'ar' ? 'ar' : 'en').format(exercise.sequence),
                  ),
                }));
                const hasScores = chartData.some((exercise) => exercise.percentage !== null);
                const classTitle = messages.studentClassProgressTitle
                  .replace('{className}', classItem.class_name)
                  .replace('{subject}', classItem.subject);

                return (
                  <motion.article
                    key={classItem.class_id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + classIndex * 0.04 }}
                    className="min-w-0 rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.025]"
                  >
                    <h3 dir="auto" className="text-start text-sm font-semibold text-slate-900 dark:text-white">
                      <bdi>{classTitle}</bdi>
                    </h3>
                    {chartData.length && hasScores ? (
                      <div className="mt-3 h-52 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                            <CartesianGrid stroke="var(--border)" strokeDasharray="3 5" vertical={false} />
                            <XAxis
                              dataKey="label"
                              tickLine={false}
                              axisLine={false}
                              tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                              minTickGap={12}
                            />
                            <YAxis
                              domain={[0, 100]}
                              tickLine={false}
                              axisLine={false}
                              tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                              tickFormatter={(value: number) => `${value}%`}
                              width={42}
                            />
                            <Tooltip
                              formatter={(value) => [`${Number(value).toFixed(1)}%`, messages.studentScore]}
                              contentStyle={{
                                borderRadius: 12,
                                border: '1px solid var(--border)',
                                background: 'var(--card)',
                                color: 'var(--card-foreground)',
                                fontSize: 12,
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="percentage"
                              name={messages.studentScore}
                              stroke="var(--primary)"
                              strokeWidth={2.5}
                              dot={{ r: 3, fill: 'var(--primary)', strokeWidth: 0 }}
                              activeDot={{ r: 5, fill: 'var(--primary)', stroke: 'var(--card)', strokeWidth: 2 }}
                              connectNulls
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <p className="mt-3 flex h-52 items-center justify-center rounded-lg bg-slate-50 text-center text-xs text-slate-500 dark:bg-white/[0.02] dark:text-white/45">
                        {chartData.length ? messages.studentNoScoresYet : messages.studentNoExercises}
                      </p>
                    )}
                  </motion.article>
                );
              })}
            </div>
          ) : (
            <p className="rounded-xl border border-slate-200 bg-white/80 p-4 text-start text-xs text-slate-500 dark:border-white/10 dark:bg-white/[0.025] dark:text-white/45">
              {messages.studentNoEnrolledClasses}
            </p>
          )}
        </motion.section>
      )}

      <section>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-start text-[10px] font-semibold tracking-[0.18em] text-amber-800 dark:text-[#c6a96b]">{messages.studentYourWorkspace}</p>
            <h2 dir="auto" className="mt-1 text-start text-base font-semibold text-slate-900 dark:text-white"><bdi>{messages.studentWhereToNext}</bdi></h2>
          </div>
          <span className="pb-0.5 text-[10px] text-slate-500 dark:text-white/35"><bdi dir="auto">{messages.studentDestinationCount.replace('{count}', new Intl.NumberFormat(language === 'ar' ? 'ar' : 'en').format(destinations.length))}</bdi></span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {destinations.map(({ href, title, subtitle, icon: Icon }, index) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + index * 0.04 }}
            >
              <Link href={href} className="group relative flex aspect-square flex-col justify-between overflow-hidden rounded-lg border border-slate-200 bg-white/75 p-4 transition-colors hover:border-amber-700/45 hover:bg-amber-50 dark:border-white/10 dark:bg-white/[0.025] dark:hover:border-[#c6a96b]/45 dark:hover:bg-[#c6a96b]/[0.04] sm:p-5">
                <span className="flex size-10 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-amber-900 dark:border-[#c6a96b]/25 dark:bg-[#c6a96b]/[0.07] dark:text-[#dfc27e]">
                  <Icon size={19} strokeWidth={1.7} />
                </span>
                <span>
                  <span className="block text-start text-sm font-semibold text-slate-900 dark:text-white">{messages[title]}</span>
                  <span className="mt-1 block text-start text-[11px] text-slate-600 dark:text-white/45">{messages[subtitle]}</span>
                </span>
                <ArrowUpRight size={16} className="absolute end-4 top-4 text-slate-500/60 transition-colors group-hover:text-amber-800 dark:text-white/30 dark:group-hover:text-[#dfc27e] sm:end-5 sm:top-5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </section>
  );
}