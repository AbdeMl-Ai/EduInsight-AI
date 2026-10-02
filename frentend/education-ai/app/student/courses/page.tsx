'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, BookOpen, FileImage, FileText, LoaderCircle, X } from 'lucide-react';
import {
  ACTIVE_STUDENT_CLASS_KEY,
  getApiErrorMessage,
  getStudentAssetUrl,
  getStudentCourses,
  type StudentCourse,
} from '@/lib/student-api';

export default function CoursesPage() {
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<StudentCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    getStudentCourses(controller.signal)
      .then((courseData) => {
        const selectedClassId = window.localStorage.getItem(ACTIVE_STUDENT_CLASS_KEY);
        setCourses(selectedClassId
          ? courseData.filter((course) => course.class_id === selectedClassId)
          : courseData);
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(getApiErrorMessage(requestError, 'Courses could not be loaded.'));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);

  const materialPath = selectedCourse?.material_file_path;
  const materialUrl = materialPath ? getStudentAssetUrl(materialPath) : null;
  const isImage = Boolean(materialPath && /\.(jpe?g|png)(?:$|\?)/i.test(materialPath));

  return (
    <section>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="mb-2 text-[10px] font-semibold tracking-[0.2em] text-[#c6a96b]">YOUR LIBRARY</p>
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Courses</h1>
            <p className="mt-2 text-sm text-white/50">Your classes and learning materials.</p>
          </div>
          {!loading && !error && <span className="text-xs tabular-nums text-white/40">{courses.length} total</span>}
        </div>
      </motion.div>

      {loading && (
        <div role="status" className="flex min-h-48 items-center justify-center gap-3 text-sm text-white/50">
          <LoaderCircle className="animate-spin text-[#c6a96b]" size={18} />
          Loading your courses
        </div>
      )}

      {!loading && error && (
        <div role="alert" className="rounded-lg border border-rose-300/20 bg-rose-300/[0.05] p-5">
          <p className="text-sm text-rose-200">{error}</p>
          <button onClick={() => setAttempt((value) => value + 1)} className="mt-4 min-h-10 text-sm font-medium text-[#dfc27e] underline underline-offset-4">Try again</button>
        </div>
      )}

      {!loading && !error && courses.length === 0 && (
        <div className="rounded-lg border border-white/10 px-5 py-12 text-center">
          <BookOpen className="mx-auto mb-4 text-[#c6a96b]" size={24} strokeWidth={1.5} />
          <h2 className="text-base font-medium text-white">No courses available</h2>
          <p className="mt-2 text-sm text-white/45">Courses assigned to you will appear here.</p>
        </div>
      )}

      {!loading && !error && courses.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course, index) => (
            <motion.article
              key={course.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.04, 0.2) }}
              className="flex min-h-44 flex-col rounded-lg border border-white/10 bg-white/[0.025] p-5 transition-colors hover:border-[#c6a96b]/40"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-lg border border-[#c6a96b]/20 bg-[#c6a96b]/[0.06] text-[#d4b875]">
                  {course.material_file_path?.toLowerCase().endsWith('.png') || /\.jpe?g(?:$|\?)/i.test(course.material_file_path ?? '')
                    ? <FileImage size={17} strokeWidth={1.7} />
                    : <FileText size={17} strokeWidth={1.7} />}
                </span>
                {course.material_file_path && <span className="text-[10px] font-medium tracking-[0.12em] text-white/35">MATERIAL</span>}
              </div>
              <h2 className="text-base font-semibold leading-snug text-white">{course.title}</h2>
              <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-white/50">{course.description || 'No course description provided.'}</p>
              {course.material_file_path ? (
                <button
                  onClick={() => setSelectedCourse(course)}
                  className="mt-5 flex min-h-10 w-full items-center justify-between border-t border-white/[0.08] pt-3 text-left text-xs font-medium text-[#dfc27e]"
                >
                  Open course material <ArrowUpRight size={15} />
                </button>
              ) : (
                <p className="mt-5 border-t border-white/[0.08] pt-3 text-xs text-white/35">No material attached</p>
              )}
            </motion.article>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedCourse && materialUrl && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelectedCourse(null);
            }}
          >
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="material-title"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 18 }}
              className="flex h-[90dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-xl border border-white/10 bg-[#101010] sm:h-[min(84dvh,800px)] sm:rounded-xl"
            >
              <div className="flex min-h-14 items-center justify-between border-b border-white/10 px-4 sm:px-5">
                <div className="min-w-0">
                  <p className="text-[9px] font-medium tracking-[0.18em] text-[#c6a96b]">COURSE MATERIAL</p>
                  <h2 id="material-title" className="truncate text-sm font-medium text-white">{selectedCourse.title}</h2>
                </div>
                <button onClick={() => setSelectedCourse(null)} aria-label="Close material" className="flex size-10 shrink-0 items-center justify-center rounded-lg text-white/60 hover:bg-white/5 hover:text-white">
                  <X size={19} />
                </button>
              </div>
              <div className="flex min-h-0 flex-1 items-center justify-center bg-[#080808] p-2 sm:p-4">
                {isImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={materialUrl} alt={`${selectedCourse.title} material`} className="max-h-full max-w-full object-contain" />
                ) : (
                  <iframe src={materialUrl} title={`${selectedCourse.title} PDF material`} className="h-full w-full border-0" />
                )}
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
