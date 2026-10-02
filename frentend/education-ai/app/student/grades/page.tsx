'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChartNoAxesColumnIncreasing } from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ACTIVE_STUDENT_CLASS_KEY, getApiErrorMessage, getStudentExercises, getStudentGrades, type StudentExercise } from '@/lib/student-api';

type GradeRecord = {
  id: string;
  courseTitle: string;
  exerciseTitle: string;
  score: number;
  maxScore: number;
  gradedAt: string | null;
};

function formatDate(value: string | null) {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Date unavailable'
    : new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

function exerciseLabel(exercise: StudentExercise) {
  const source = exercise.material_file_path || exercise.file_path;
  const filename = source.split('/').pop()?.split('?')[0] ?? '';
  const decoded = decodeURIComponent(filename).replace(/\.[^.]+$/, '');
  return decoded || `Exercise ${exercise.id.slice(-6)}`;
}

export default function GradesPage() {
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    Promise.all([
      getStudentGrades(controller.signal),
      getStudentExercises(controller.signal),
    ])
      .then(([gradeData, exerciseData]) => {
        const selectedClassId = window.localStorage.getItem(ACTIVE_STUDENT_CLASS_KEY);
        const visibleExercises = selectedClassId
          ? exerciseData.filter((exercise) => exercise.class_id === selectedClassId)
          : exerciseData;
        const exerciseById = new Map(visibleExercises.map((exercise) => [exercise.id, exercise]));
        const records = gradeData.flatMap((grade): GradeRecord[] => {
          const exercise = exerciseById.get(grade.exercise_id);
          if (!exercise) return [];
          return [{
            id: grade.submission_id,
            courseTitle: exercise.course_title,
            exerciseTitle: exerciseLabel(exercise),
            score: grade.score,
            maxScore: exercise.max_score,
            gradedAt: grade.graded_at,
          }];
        });
        records.sort((a, b) => (a.gradedAt ?? '').localeCompare(b.gradedAt ?? ''));
        setGrades(records);
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(getApiErrorMessage(requestError, 'Grade history could not be loaded.'));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);

  const chartMax = Math.max(1, ...grades.map((grade) => grade.maxScore));
  const chartData = grades.filter((grade) => grade.gradedAt).map((grade) => ({
    date: grade.gradedAt as string,
    score: grade.score,
    course: grade.courseTitle,
    exercise: grade.exerciseTitle,
    maxScore: grade.maxScore,
  }));

  return (
    <section>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="mb-2 text-[10px] font-semibold tracking-[0.2em] text-[#c6a96b]">YOUR RESULTS</p>
        <div className="mb-7">
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Grades & progress</h1>
          <p className="mt-2 text-sm text-white/50">A timeline of your graded submissions.</p>
        </div>
      </motion.div>

      {loading && <div role="status" className="flex min-h-48 items-center justify-center gap-3 text-sm text-white/50"><span className="size-4 animate-spin rounded-full border-2 border-white/15 border-t-[#c6a96b]" />Loading grade history</div>}
      {!loading && error && (
        <div role="alert" className="rounded-lg border border-rose-300/20 bg-rose-300/[0.05] p-5">
          <p className="text-sm text-rose-200">{error}</p>
          <button onClick={() => setAttempt((value) => value + 1)} className="mt-4 min-h-10 text-sm font-medium text-[#dfc27e] underline underline-offset-4">Try again</button>
        </div>
      )}
      {!loading && !error && grades.length === 0 && (
        <div className="rounded-lg border border-white/10 px-5 py-12 text-center">
          <ChartNoAxesColumnIncreasing className="mx-auto mb-4 text-[#c6a96b]" size={24} strokeWidth={1.5} />
          <h2 className="text-base font-medium text-white">No grades yet</h2>
          <p className="mt-2 text-sm text-white/45">Your results will appear after submissions are graded.</p>
        </div>
      )}

      {!loading && !error && grades.length > 0 && (
        <>
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-7 rounded-lg border border-white/10 bg-white/[0.025] p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-white">Score progression</h2>
                <p className="mt-1 text-[11px] text-white/40">Marks by grading date</p>
              </div>
              <span className="text-[10px] text-white/40">Max {chartMax}</span>
            </div>
            {chartData.length > 0 ? (
              <div className="h-56 w-full sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke="#ffffff12" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value: string) => formatDate(value).replace(/, \d{4}$/, '')}
                      tick={{ fill: '#ffffff66', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      minTickGap={20}
                    />
                    <YAxis domain={[0, chartMax]} tick={{ fill: '#ffffff66', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      labelFormatter={(value) => formatDate(String(value))}
                      formatter={(value, _name, item) => [`${value} / ${item.payload.maxScore}`, item.payload.course]}
                      contentStyle={{ background: '#141414', border: '1px solid #ffffff1a', borderRadius: 8, color: '#f5f2e9', fontSize: 12 }}
                      labelStyle={{ color: '#c6a96b', marginBottom: 4 }}
                    />
                    <Line type="monotone" dataKey="score" name="Score" stroke="#d0b271" strokeWidth={2.5} dot={{ r: 3, fill: '#0a0a0a', stroke: '#d0b271', strokeWidth: 2 }} activeDot={{ r: 5, fill: '#d0b271', stroke: '#0a0a0a', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="py-10 text-center text-sm text-white/45">Grade dates are not available for charting.</p>
            )}
          </motion.section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Grade history</h2>
              <span className="text-[11px] text-white/40">{grades.length} graded</span>
            </div>
            <div className="divide-y divide-white/[0.08] rounded-lg border border-white/10 bg-white/[0.02] px-4">
              {[...grades].reverse().map((grade) => (
                <motion.article key={grade.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 py-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#c6a96b]/20 bg-[#c6a96b]/[0.06] text-xs font-semibold tabular-nums text-[#dfc27e]">
                    {Math.round((grade.score / Math.max(grade.maxScore, 1)) * 100)}%
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-medium text-white">{grade.courseTitle}</h3>
                    <p className="mt-1 truncate text-xs text-white/45">{grade.exerciseTitle} · {formatDate(grade.gradedAt)}</p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold tabular-nums text-white">{grade.score}<span className="ml-1 text-xs font-normal text-white/40">/ {grade.maxScore}</span></p>
                </motion.article>
              ))}
            </div>
          </section>
        </>
      )}
    </section>
  );
}
