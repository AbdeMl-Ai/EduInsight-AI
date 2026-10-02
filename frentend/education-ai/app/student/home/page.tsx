'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, BookOpen, ChartNoAxesColumnIncreasing, ClipboardCheck, UserRound } from 'lucide-react';
import {
  ACTIVE_STUDENT_CLASS_KEY,
  getApiErrorMessage,
  getStudentClasses,
  getStudentExercises,
  getStudentGrades,
  getStudentProfile,
  type StudentClass,
  type StudentExercise,
  type StudentGrade,
  type StudentProfile,
} from '@/lib/student-api';

const destinations = [
  { href: '/student/courses', title: 'My Courses', subtitle: 'Classes & materials', icon: BookOpen },
  { href: '/student/exercises', title: 'Exercises', subtitle: 'Your coursework', icon: ClipboardCheck },
  { href: '/student/grades', title: 'Grades', subtitle: 'Marks & progress', icon: ChartNoAxesColumnIncreasing },
  { href: '/student/profile', title: 'Profile', subtitle: 'Your account', icon: UserRound },
];

export default function StudentHomePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [classes, setClasses] = useState<StudentClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [exercises, setExercises] = useState<StudentExercise[]>([]);
  const [grades, setGrades] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    Promise.all([
      getStudentProfile(controller.signal),
      getStudentClasses(controller.signal),
      getStudentExercises(controller.signal),
      getStudentGrades(controller.signal),
    ])
      .then(([student, studentClasses, studentExercises, studentGrades]) => {
        const storedClassId = window.localStorage.getItem(ACTIVE_STUDENT_CLASS_KEY);
        const initialClassId = studentClasses.some((item) => item.id === storedClassId)
          ? storedClassId
          : studentClasses[0]?.id ?? null;
        setProfile(student);
        setClasses(studentClasses);
        setExercises(studentExercises);
        setGrades(studentGrades);
        setSelectedClassId(initialClassId);
        if (initialClassId) window.localStorage.setItem(ACTIVE_STUDENT_CLASS_KEY, initialClassId);
        else window.localStorage.removeItem(ACTIVE_STUDENT_CLASS_KEY);
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(getApiErrorMessage(requestError, 'Your dashboard could not be loaded.'));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);

  const selectedExercises = selectedClassId
    ? exercises.filter((exercise) => exercise.class_id === selectedClassId)
    : exercises;
  const selectedExerciseIds = new Set(selectedExercises.map((exercise) => exercise.id));
  const gradedExerciseIds = new Set(
    grades.filter((grade) => selectedExerciseIds.has(grade.exercise_id)).map((grade) => grade.exercise_id),
  );
  const complete = selectedExercises.filter((exercise) => gradedExerciseIds.has(exercise.id)).length;
  const total = selectedExercises.length;
  const percent = total ? Math.round((complete / total) * 100) : 0;

  function selectClass(classId: string) {
    setSelectedClassId(classId);
    window.localStorage.setItem(ACTIVE_STUDENT_CLASS_KEY, classId);
  }

  return (
    <section className="space-y-5">
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="hero-card relative isolate flex h-56 flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-[#15130f] p-6 sm:h-64 sm:p-8"
      >
        <img
          src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=85"
          alt="A student studying at a desk"
          className="absolute inset-0 -z-20 size-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
        <div className="absolute right-5 top-5 rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-[9px] font-medium tracking-[0.15em] text-white/75 backdrop-blur-sm sm:right-7 sm:top-7">
          STUDENT SPACE
        </div>
        <div className="max-w-xl">
          <p className="mb-2 text-[10px] font-semibold tracking-[0.2em] text-[#dfc27e]">A NEW DAY TO LEARN</p>
          {loading ? (
            <div role="status" className="h-9 w-52 animate-pulse rounded bg-white/10" />
          ) : error ? (
            <div role="alert">
              <h1 className="text-xl font-semibold text-white">Your dashboard is unavailable</h1>
              <p className="mt-2 max-w-md text-xs leading-5 text-rose-100/85">{error}</p>
              <button onClick={() => setAttempt((value) => value + 1)} className="mt-3 min-h-9 text-xs font-semibold text-[#f0d89d] underline underline-offset-4">Try again</button>
            </div>
          ) : (
            <>
              <h1 className="break-words text-2xl font-semibold tracking-tight text-white sm:text-3xl">Good morning, {profile?.full_name}</h1>
              <p className="mt-2 text-sm text-white/70">Small steps every day lead to big results.</p>
            </>
          )}
        </div>
      </motion.header>

      {!loading && !error && classes.length > 0 && (
        <section aria-label="Select active class" className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max min-w-full gap-2 pb-1">
            {classes.map((classItem) => {
              const active = selectedClassId === classItem.id;
              return (
                <button
                  key={classItem.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => selectClass(classItem.id)}
                  className={`min-h-11 shrink-0 rounded-full border px-4 text-left transition-colors ${active
                    ? 'border-[#e2c47f]/70 bg-[#c6a96b] text-[#17130b] shadow-[0_4px_18px_rgba(198,169,107,0.13)]'
                    : 'border-white/10 bg-white/[0.035] text-white/65 hover:border-[#c6a96b]/35 hover:text-white'
                  }`}
                >
                  <span className="block text-xs font-semibold">{classItem.class_name}</span>
                  <span className={`mt-0.5 block text-[9px] ${active ? 'text-[#17130b]/65' : 'text-white/35'}`}>{classItem.class_level} · {classItem.subject}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {!loading && !error && (
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="rounded-lg border border-[#c6a96b]/20 bg-[linear-gradient(110deg,rgba(198,169,107,0.08),rgba(255,255,255,0.02)_55%)] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.16em] text-[#d5ba7a]">YOUR PROGRESS</p>
              <p className="mt-2 text-sm font-medium text-white">{total ? `${complete} of ${total} exercises graded` : 'No exercises assigned yet'}</p>
            </div>
            <span className="text-lg font-semibold tabular-nums text-[#e0c783]">{total ? `${percent}%` : '—'}</span>
          </div>
          <div
            className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-label="Graded exercise progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="h-full rounded-full bg-[#c6a96b]"
            />
          </div>
        </motion.section>
      )}

      <section>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] text-[#c6a96b]">YOUR WORKSPACE</p>
            <h2 className="mt-1 text-base font-semibold text-white">Where to next?</h2>
          </div>
          <span className="pb-0.5 text-[10px] text-white/35">4 destinations</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {destinations.map(({ href, title, subtitle, icon: Icon }, index) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + index * 0.04 }}
            >
              <Link href={href} className="group relative flex aspect-square flex-col justify-between overflow-hidden rounded-lg border border-white/10 bg-white/[0.025] p-4 transition-colors hover:border-[#c6a96b]/45 hover:bg-[#c6a96b]/[0.04] sm:p-5">
                <span className="flex size-10 items-center justify-center rounded-lg border border-[#c6a96b]/25 bg-[#c6a96b]/[0.07] text-[#dfc27e]">
                  <Icon size={19} strokeWidth={1.7} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">{title}</span>
                  <span className="mt-1 block text-[11px] text-white/45">{subtitle}</span>
                </span>
                <ArrowUpRight size={16} className="absolute right-4 top-4 text-white/30 transition-colors group-hover:text-[#dfc27e] sm:right-5 sm:top-5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </section>
  );
}