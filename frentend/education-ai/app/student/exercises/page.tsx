'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownToLine, Check, FileImage, FileText, LoaderCircle, Send, Upload } from 'lucide-react';
import {
  ACTIVE_STUDENT_CLASS_KEY,
  createStudentSubmission,
  getApiErrorMessage,
  getStudentAssetUrl,
  getStudentExercises,
  getStudentSubmissions,
  replaceStudentSubmission,
  type StudentExercise,
  type StudentSubmission,
} from '@/lib/student-api';

function materialName(path: string) {
  const name = path.split('/').pop()?.split('?')[0] ?? '';
  return decodeURIComponent(name) || 'Exercise material';
}

function submissionName(file?: File) {
  if (!file) return 'Choose PDF, JPEG, or PNG';
  const extension = file.type === 'application/pdf' ? 'pdf' : file.type === 'image/jpeg' ? 'jpg' : 'png';
  return `Submission.${extension}`;
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<StudentExercise[]>([]);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [files, setFiles] = useState<Record<string, File | undefined>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<Record<string, { kind: 'success' | 'error'; text: string }>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    Promise.all([
      getStudentExercises(controller.signal),
      getStudentSubmissions(controller.signal),
    ])
      .then(([exerciseData, submissionData]) => {
        const selectedClassId = window.localStorage.getItem(ACTIVE_STUDENT_CLASS_KEY);
        const visibleExercises = selectedClassId
          ? exerciseData.filter((exercise) => exercise.class_id === selectedClassId)
          : exerciseData;
        const visibleExerciseIds = new Set(visibleExercises.map((exercise) => exercise.id));
        setExercises(visibleExercises);
        setSubmissions(submissionData.filter((submission) => visibleExerciseIds.has(submission.exercise_id)));
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(getApiErrorMessage(requestError, 'Exercises could not be loaded.'));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);

  const groupedExercises = exercises.reduce<Record<string, { courseTitle: string; items: StudentExercise[] }>>(
    (groups, exercise) => {
      const group = groups[exercise.course_id] ??= { courseTitle: exercise.course_title, items: [] };
      group.items.push(exercise);
      return groups;
    },
    {},
  );
  const submissionsByExercise = new Map(submissions.map((submission) => [submission.exercise_id, submission]));

  async function handleSubmit(exerciseId: string) {
    const file = files[exerciseId];
    if (!file) {
      setFeedback((current) => ({ ...current, [exerciseId]: { kind: 'error', text: 'Choose a PDF or image file first.' } }));
      return;
    }
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
      setFeedback((current) => ({ ...current, [exerciseId]: { kind: 'error', text: 'Only PDF, JPEG, and PNG files are accepted.' } }));
      return;
    }
    setBusy((current) => ({ ...current, [exerciseId]: true }));
    setFeedback((current) => {
      const next = { ...current };
      delete next[exerciseId];
      return next;
    });
    try {
      const existing = submissionsByExercise.get(exerciseId);
      const saved = existing
        ? await replaceStudentSubmission(existing.id, file, notes[exerciseId] ?? '')
        : await createStudentSubmission(exerciseId, file, notes[exerciseId] ?? '');
      setSubmissions((current) => [
        ...current.filter((submission) => submission.exercise_id !== exerciseId),
        saved,
      ]);
      setExercises((current) => current.map((exercise) =>
        exercise.id === exerciseId
          ? { ...exercise, submission_status: saved.submission_status, score: saved.score }
          : exercise,
      ));
      setFiles((current) => ({ ...current, [exerciseId]: undefined }));
      const fileInput = document.getElementById(`exercise-file-${exerciseId}`) as HTMLInputElement | null;
      if (fileInput) fileInput.value = '';
      setFeedback((current) => ({ ...current, [exerciseId]: { kind: 'success', text: 'Your file was submitted.' } }));
    } catch (requestError: unknown) {
      setFeedback((current) => ({
        ...current,
        [exerciseId]: { kind: 'error', text: getApiErrorMessage(requestError, 'Submission failed. Please try again.') },
      }));
    } finally {
      setBusy((current) => ({ ...current, [exerciseId]: false }));
    }
  }

  return (
    <section>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="mb-2 text-[10px] font-semibold tracking-[0.2em] text-[#c6a96b]">COURSEWORK</p>
        <div className="mb-7">
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Exercises</h1>
          <p className="mt-2 text-sm text-white/50">Upload your completed work as a PDF or image.</p>
        </div>
      </motion.div>

      {loading && <div role="status" className="flex min-h-48 items-center justify-center gap-3 text-sm text-white/50"><LoaderCircle className="animate-spin text-[#c6a96b]" size={18} />Loading exercises</div>}
      {!loading && error && (
        <div role="alert" className="rounded-lg border border-rose-300/20 bg-rose-300/[0.05] p-5">
          <p className="text-sm text-rose-200">{error}</p>
          <button onClick={() => setAttempt((value) => value + 1)} className="mt-4 min-h-10 text-sm font-medium text-[#dfc27e] underline underline-offset-4">Try again</button>
        </div>
      )}
      {!loading && !error && exercises.length === 0 && (
        <div className="rounded-lg border border-white/10 px-5 py-12 text-center">
          <Check className="mx-auto mb-4 text-[#c6a96b]" size={23} strokeWidth={1.6} />
          <h2 className="text-base font-medium text-white">No exercises assigned</h2>
          <p className="mt-2 text-sm text-white/45">New coursework will appear here.</p>
        </div>
      )}

      {!loading && !error && Object.entries(groupedExercises).map(([courseId, group], groupIndex) => (
        <section key={courseId} className="mb-8 last:mb-0">
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />
            <h2 className="max-w-[75%] truncate text-[10px] font-semibold tracking-[0.16em] text-[#d5ba7a]">{group.courseTitle}</h2>
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <div className="space-y-3">
            {group.items.map((exercise, index) => {
              const submission = submissionsByExercise.get(exercise.id);
              const material = exercise.material_file_path || exercise.file_path;
              const imageMaterial = /\.(jpe?g|png)(?:$|\?)/i.test(material);
              const feedbackItem = feedback[exercise.id];
              const fileInputId = `exercise-file-${exercise.id}`;
              return (
                <motion.article
                  key={exercise.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min((groupIndex + index) * 0.04, 0.2) }}
                  className="rounded-lg border border-white/10 bg-white/[0.025] p-4 sm:p-5"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-white/65">
                      {imageMaterial ? <FileImage size={17} /> : <FileText size={17} />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="break-words text-sm font-semibold leading-5 text-white">{materialName(material)}</h3>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/45">
                        <span>Maximum {exercise.max_score}</span>
                        {exercise.score !== null && <span className="text-[#d5ba7a]">Grade {exercise.score}</span>}
                        {submission && <span className="text-emerald-300/80">File submitted</span>}
                      </div>
                    </div>
                    <a href={getStudentAssetUrl(material)} target="_blank" rel="noreferrer" aria-label={`Open ${materialName(material)}`} className="flex size-9 shrink-0 items-center justify-center rounded-lg text-white/45 hover:bg-white/5 hover:text-[#dfc27e]">
                      <ArrowDownToLine size={17} />
                    </a>
                  </div>

                  <div className="mt-4 border-t border-white/[0.08] pt-4">
                    <label htmlFor={fileInputId} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-dashed border-white/15 px-3 text-xs text-white/55 transition-colors hover:border-[#c6a96b]/50 hover:text-white/80">
                      <Upload size={15} className="shrink-0 text-[#c6a96b]" />
                      <span className="min-w-0 flex-1 truncate">{submissionName(files[exercise.id])}</span>
                      <span className="shrink-0 text-[10px] text-white/35">Browse</span>
                    </label>
                    <input
                      id={fileInputId}
                      type="file"
                      accept="application/pdf,image/jpeg,image/png"
                      className="sr-only"
                      onChange={(event) => {
                        const file = event.currentTarget.files?.[0];
                        setFiles((current) => ({ ...current, [exercise.id]: file }));
                        setFeedback((current) => {
                          const next = { ...current };
                          delete next[exercise.id];
                          return next;
                        });
                      }}
                    />
                    <label htmlFor={`exercise-note-${exercise.id}`} className="mt-3 block space-y-1.5">
                      <span className="text-xs text-white/55">Student note (optional)</span>
                      <textarea
                        id={`exercise-note-${exercise.id}`}
                        value={notes[exercise.id] ?? submission?.student_note ?? ''}
                        onChange={(event) => setNotes((current) => ({ ...current, [exercise.id]: event.target.value }))}
                        maxLength={1000}
                        rows={3}
                        placeholder="Add a message for your teacher"
                        className="w-full resize-y rounded-lg border border-white/10 bg-white/[0.035] p-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#c6a96b]/55"
                      />
                    </label>
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p aria-live="polite" className={`min-h-4 text-xs ${feedbackItem?.kind === 'error' ? 'text-rose-300' : 'text-emerald-300'}`}>
                        {feedbackItem?.text ?? (submission ? 'Choose a new file to replace your submission.' : '')}
                      </p>
                      <button
                        onClick={() => handleSubmit(exercise.id)}
                        disabled={busy[exercise.id] || !files[exercise.id]}
                        className="inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[#c6a96b] px-4 text-xs font-semibold text-[#17130b] transition-colors hover:bg-[#d8bd83] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35 sm:w-auto"
                      >
                        {busy[exercise.id] ? <LoaderCircle size={15} className="animate-spin" /> : <Send size={14} />}
                        Envoyer la réponse
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>
      ))}
    </section>
  );
}
