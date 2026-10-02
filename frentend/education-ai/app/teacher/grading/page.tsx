"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ClipboardList,
  Eye,
  LoaderCircle,
  MessageSquare,
  Save,
  Send,
  Trophy,
  X,
} from "lucide-react";
import {
  getTeacherAssetUrl,
  getTeacherClasses,
  getTeacherErrorMessage,
  getTeacherExercises,
  getTeacherStudents,
  getTeacherSubmissions,
  saveTeacherGrade,
  sendTeacherMessage,
  type TeacherClass,
  type TeacherExercise,
  type TeacherStudent,
  type TeacherSubmission,
} from "@/lib/teacher-api";

export default function TeacherGradingPage() {
  const [view, setView] = useState<"grades" | "ranking">("grades");
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [exercises, setExercises] = useState<TeacherExercise[]>([]);
  const [students, setStudents] = useState<TeacherStudent[]>([]);
  const [submissions, setSubmissions] = useState<TeacherSubmission[]>([]);
  const [scores, setScores] = useState<Record<string, string>>({});
  const [classId, setClassId] = useState("");
  const [subject, setSubject] = useState("");
  const [exerciseId, setExerciseId] = useState("");
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [messageStudent, setMessageStudent] = useState<TeacherStudent | null>(null);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      getTeacherClasses(controller.signal),
      getTeacherExercises(controller.signal),
      getTeacherSubmissions(controller.signal),
    ])
      .then(([classData, exerciseData, submissionData]) => {
        if (controller.signal.aborted) return;
        setClasses(classData);
        setExercises(exerciseData);
        setSubmissions(submissionData);
        setClassId(classData[0]?.class_id ?? "");
        setSubject(classData[0]?.subject ?? "");
        setExerciseId(exerciseData[0]?.id ?? "");
        setScores(
          Object.fromEntries(
            submissionData.map((item) => [
              `${item.exercise_id}:${item.student_id}`,
              item.score === null ? "" : String(item.score),
            ]),
          ),
        );
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted && !axios.isCancel(error))
          setMessage(
            getTeacherErrorMessage(
              error,
              "Grading workspace could not be loaded.",
            ),
          );
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!classId) return;
    const controller = new AbortController();
    setStudentsLoading(true);
    getTeacherStudents(classId, controller.signal)
      .then(setStudents)
      .catch((error: unknown) => {
        if (!controller.signal.aborted && !axios.isCancel(error))
          setMessage(
            getTeacherErrorMessage(error, "Students could not be loaded."),
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setStudentsLoading(false);
      });
    return () => controller.abort();
  }, [classId]);

  const subjects = useMemo(
    () => [...new Set(classes.map((item) => item.subject))],
    [classes],
  );
  const selectedClass = classes.find((item) => item.class_id === classId);
  const visibleExercises = exercises.filter(
    (item) =>
      item.class_id === classId &&
      (!subject || selectedClass?.subject === subject),
  );
  const selectedExercise = exercises.find((item) => item.id === exerciseId);
  const rankingRows = students
    .map((student) => {
      const scoresForStudent = submissions.flatMap((submission) => {
        if (
          submission.student_id !== student.student_id ||
          submission.score === null
        )
          return [];
        const exercise = exercises.find(
          (item) =>
            item.id === submission.exercise_id && item.class_id === classId,
        );
        return exercise ? [submission.score] : [];
      });
      const average = scoresForStudent.length
        ? scoresForStudent.reduce((total, score) => total + score, 0) /
          scoresForStudent.length
        : null;
      return { student, average, scoredExercises: scoresForStudent.length };
    })
    .sort((left, right) => {
      if (left.average === null) return right.average === null ? 0 : 1;
      if (right.average === null) return -1;
      return right.average - left.average;
    });

  function showToast(text: string) {
    setToast(text);
    window.setTimeout(() => setToast(""), 2800);
  }
  function selectClass(nextClassId: string) {
    const nextClass = classes.find((item) => item.class_id === nextClassId);
    setClassId(nextClassId);
    setSubject(nextClass?.subject ?? "");
    setExerciseId(
      exercises.find((item) => item.class_id === nextClassId)?.id ?? "",
    );
  }
  function openStudentMessage(student: TeacherStudent) {
    setMessageStudent(student);
    setMessageSubject(
      selectedExercise ? `About ${selectedExercise.course_title}` : "",
    );
    setMessageBody("");
    setMessage("");
  }

  async function saveScore(student: TeacherStudent) {
    if (!selectedExercise) return;
    const score = Number(
      scores[`${selectedExercise.id}:${student.student_id}`],
    );
    if (
      !Number.isFinite(score) ||
      score < 0 ||
      score > selectedExercise.max_score
    ) {
      setMessage(`Enter a score between 0 and ${selectedExercise.max_score}.`);
      return;
    }
    setSavingId(student.student_id);
    setMessage("");
    try {
      await saveTeacherGrade(selectedExercise.id, student.student_id, score);
      setSubmissions((current) => {
        const existing = current.some(
          (item) =>
            item.exercise_id === selectedExercise.id &&
            item.student_id === student.student_id,
        );
        if (existing)
          return current.map((item) =>
            item.exercise_id === selectedExercise.id &&
            item.student_id === student.student_id
              ? { ...item, score }
              : item,
          );
        return [
          ...current,
          {
            id: `${selectedExercise.id}:${student.student_id}`,
            student_id: student.student_id,
            student_name: student.full_name,
            exercise_id: selectedExercise.id,
            file_url: "",
            student_note: "",
            score,
          },
        ];
      });
      showToast(`Grade saved for ${student.full_name}.`);
    } catch (error) {
      setMessage(getTeacherErrorMessage(error, "Grade could not be saved."));
    } finally {
      setSavingId(null);
    }
  }

  async function sendStudentMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!messageStudent) return;
    setMessage("");
    setSendingMessage(true);
    try {
      await sendTeacherMessage({
        target_type: "student",
        target_id: messageStudent.student_id,
        subject: messageSubject.trim(),
        message: messageBody.trim(),
      });
      setMessageStudent(null);
      setMessageSubject("");
      setMessageBody("");
      showToast(`Message sent to ${messageStudent.full_name}.`);
    } catch (error) {
      setMessage(
        getTeacherErrorMessage(error, "Message could not be sent."),
      );
    } finally {
      setSendingMessage(false);
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-7 pb-24"
    >
      <header>
        <p className="text-[10px] font-semibold tracking-[0.2em] text-[#dfc27e]">
          ASSESSMENT
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
          Grading
        </h1>
        <p className="mt-2 text-sm text-white/45">
          Record scores in a focused, tap-friendly workspace.
        </p>
      </header>
      {message && (
        <div
          role="alert"
          className="rounded-2xl border border-rose-300/20 bg-rose-300/[0.05] p-4 text-xs text-rose-200"
        >
          {message}
          <button
            onClick={() => setMessage("")}
            className="ml-2 underline underline-offset-4"
          >
            Dismiss
          </button>
        </div>
      )}

      <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] text-white/40">
              FILTERS
            </p>
            <h2 className="mt-1 text-sm font-semibold text-white">
              Choose a class
            </h2>
          </div>
          <div
            role="tablist"
            aria-label="Grading views"
            className="grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-black/20 p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={view === "grades"}
              onClick={() => setView("grades")}
              className={`inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg px-2 text-[10px] font-semibold ${view === "grades" ? "bg-[#c6a96b]/15 text-[#dfc27e]" : "text-white/45 hover:text-white"}`}
            >
              <ClipboardList size={14} />
              Grades
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === "ranking"}
              onClick={() => setView("ranking")}
              className={`inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg px-2 text-[10px] font-semibold ${view === "ranking" ? "bg-[#c6a96b]/15 text-[#dfc27e]" : "text-white/45 hover:text-white"}`}
            >
              <Trophy size={14} />
              Classement
            </button>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {classes.map((item) => (
            <button
              key={item.class_id}
              onClick={() => selectClass(item.class_id)}
              className={`shrink-0 rounded-full border px-4 py-2.5 text-xs transition-colors ${classId === item.class_id ? "border-[#c6a96b]/50 bg-[#c6a96b]/10 text-[#dfc27e]" : "border-white/10 text-white/50 hover:text-white"}`}
            >
              {item.name}
            </button>
          ))}
        </div>
        <label className="mt-4 block space-y-1.5">
          <span className="text-[10px] text-white/45">Subject</span>
          <select
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="min-h-11 w-full rounded-xl border border-white/10 bg-[#151515] px-3 text-sm text-white outline-none focus:border-[#c6a96b]/55"
          >
            <option value="">All subjects</option>
            {subjects.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="space-y-3">
        <label className="block space-y-1.5">
          <span className="text-[10px] font-medium text-white/45">
            Graded work
          </span>
          <select
            value={exerciseId}
            onChange={(event) => setExerciseId(event.target.value)}
            disabled={!visibleExercises.length}
            className="min-h-12 w-full rounded-xl border border-white/10 bg-[#151515] px-3 text-sm text-white outline-none disabled:opacity-50"
          >
            <option value="">
              {visibleExercises.length
                ? "Choose an assignment"
                : "No graded work for this class"}
            </option>
            {visibleExercises.map((item) => (
              <option key={item.id} value={item.id}>
                {item.course_title} · max {item.max_score}
              </option>
            ))}
          </select>
        </label>
        {selectedExercise && (
          <div className="rounded-2xl border border-[#c6a96b]/20 bg-[#c6a96b]/[0.05] p-4">
            <p className="text-sm font-semibold text-[#dfc27e]">
              {selectedExercise.course_title}
            </p>
            {selectedExercise.description && (
              <p className="mt-1 text-xs leading-5 text-white/55">
                {selectedExercise.description}
              </p>
            )}
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] text-white/40">
              {view === "grades" ? "STUDENT SCORES" : "CLASSEMENT"}
            </p>
            <h2 className="mt-1 text-lg font-semibold text-white">
              {view === "grades"
                ? `${students.length} enrolled`
                : `${students.length} students`}
            </h2>
          </div>
          {view === "grades" && selectedExercise && (
            <span className="text-[10px] text-white/40">
              Maximum {selectedExercise.max_score}
            </span>
          )}
        </div>
        {loading || studentsLoading ? (
          <LoaderCircle className="animate-spin text-[#dfc27e]" size={21} />
        ) : view === "ranking" ? (
          rankingRows.length ? (
            <div className="space-y-3">
              {rankingRows.map(({ student, average, scoredExercises }, index) => (
                <motion.article
                  key={student.student_id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.025 }}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-3.5 sm:p-4"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#c6a96b]/25 bg-[#c6a96b]/[0.07] text-xs font-semibold text-[#dfc27e]">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {student.full_name}
                    </p>
                    <p className="mt-1 truncate text-[10px] text-white/40">
                      {scoredExercises
                        ? `Average of ${scoredExercises} scored ${scoredExercises === 1 ? "exercise" : "exercises"}`
                        : "No scores yet"}
                    </p>
                    <button
                      type="button"
                      onClick={() => openStudentMessage(student)}
                      className="mt-2 inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-white/10 px-2.5 text-[11px] font-medium text-[#dfc27e] hover:bg-white/[0.05]"
                    >
                      <MessageSquare size={14} />
                      Message
                    </button>
                  </div>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-white">
                    {average === null ? "--" : `${average.toFixed(1)} pts`}
                  </span>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 px-4 py-12 text-center">
              <Check className="mx-auto mb-2 text-[#c6a96b]" size={21} />
              <p className="text-xs text-white/45">No students are enrolled in this class.</p>
            </div>
          )
        ) : selectedExercise && students.length ? (
          <div className="space-y-3">
            {students.map((student, index) => {
              const key = `${selectedExercise.id}:${student.student_id}`;
              const submission = submissions.find(
                (item) =>
                  item.exercise_id === selectedExercise.id &&
                  item.student_id === student.student_id,
              );
              return (
                <motion.article
                  key={student.student_id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.025 }}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-3.5 sm:p-4"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#c6a96b]/25 bg-[#c6a96b]/[0.07] text-xs font-semibold text-[#dfc27e]">
                    {student.full_name.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {submission?.student_name ?? student.full_name}
                    </p>
                    <p className="mt-1 truncate text-[10px] text-white/40">
                      {student.email}
                    </p>
                    {submission?.student_note && (
                      <p className="mt-2 max-h-12 overflow-y-auto whitespace-pre-wrap break-words text-xs leading-5 text-white/65">
                        {submission.student_note}
                      </p>
                    )}
                    {submission?.file_url && (
                      <a
                        href={getTeacherAssetUrl(submission.file_url)}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-white/10 px-2.5 text-[11px] font-medium text-[#dfc27e] hover:bg-white/[0.05]"
                      >
                        <Eye size={14} />
                        View Answer
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => openStudentMessage(student)}
                      className="mt-2 inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-white/10 px-2.5 text-[11px] font-medium text-[#dfc27e] hover:bg-white/[0.05]"
                    >
                      <MessageSquare size={14} />
                      Message
                    </button>
                  </div>
                  <input
                    aria-label={`Score for ${student.full_name}`}
                    type="number"
                    min="0"
                    max={selectedExercise.max_score}
                    step="0.01"
                    value={scores[key] ?? ""}
                    onChange={(event) =>
                      setScores((current) => ({
                        ...current,
                        [key]: event.target.value,
                      }))
                    }
                    className="h-11 w-20 rounded-xl border border-white/10 bg-[#151515] px-2 text-center text-sm tabular-nums text-white outline-none focus:border-[#c6a96b]/55"
                  />
                  <button
                    onClick={() => saveScore(student)}
                    disabled={savingId === student.student_id}
                    aria-label={`Save grade for ${student.full_name}`}
                    title="Save grade"
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#c6a96b]/25 text-[#dfc27e] hover:bg-[#c6a96b]/[0.08] disabled:opacity-40"
                  >
                    {savingId === student.student_id ? (
                      <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                  </button>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 px-4 py-12 text-center">
            <Check className="mx-auto mb-2 text-[#c6a96b]" size={21} />
            <p className="text-xs text-white/45">
              Choose a class and graded work to begin.
            </p>
          </div>
        )}
      </section>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            role="status"
            className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-4 right-4 z-50 rounded-2xl border border-emerald-300/20 bg-[#111]/95 p-3 text-center text-xs text-emerald-200 shadow-xl sm:left-auto sm:right-6 sm:w-80"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {messageStudent && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.form
              onSubmit={sendStudentMessage}
              className="w-full max-w-lg space-y-4 rounded-t-2xl border border-white/10 bg-[#111111] p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:rounded-2xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.18em] text-[#dfc27e]">
                    STUDENT MESSAGE
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-white">
                    To {messageStudent.full_name}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setMessageStudent(null)}
                  aria-label="Close"
                  className="flex size-10 items-center justify-center rounded-xl text-white/45"
                >
                  <X size={18} />
                </button>
              </div>
              <Input
                label="Subject"
                name="subject"
                value={messageSubject}
                onChange={(event) => setMessageSubject(event.target.value)}
                required
                maxLength={200}
                placeholder="Message subject"
              />
              <label className="block space-y-1.5">
                <span className="text-[10px] text-white/50">Message</span>
                <textarea
                  name="message"
                  value={messageBody}
                  onChange={(event) => setMessageBody(event.target.value)}
                  rows={5}
                  required
                  maxLength={5000}
                  placeholder="Write a message for this student"
                  className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.035] p-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#c6a96b]/55"
                />
              </label>
              <button
                type="submit"
                disabled={sendingMessage}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#c6a96b] text-xs font-semibold text-[#17130b] disabled:opacity-50"
              >
                {sendingMessage ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <Send size={15} />
                )}
                Send message
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

function Input({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[10px] text-white/50">{label}</span>
      <input
        {...props}
        className="min-h-11 w-full rounded-xl border border-white/10 bg-white/[0.035] px-3 text-sm text-white outline-none focus:border-[#c6a96b]/55"
      />
    </label>
  );
}
