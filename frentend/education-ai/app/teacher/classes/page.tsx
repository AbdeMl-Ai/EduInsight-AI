"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  FilePlus2,
  LoaderCircle,
  Pencil,
  Plus,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useLandingLanguage } from "@/components/app/LandingLanguageProvider";
import {
  createTeacherCourse,
  createTeacherGradedWork,
  deleteTeacherCourse,
  deleteTeacherExercise,
  getTeacherClasses,
  getTeacherCourses,
  getTeacherErrorMessage,
  getTeacherExercises,
  getTeacherStudents,
  updateTeacherCourse,
  updateTeacherExercise,
  type TeacherClass,
  type TeacherCourse,
  type TeacherExercise,
  type TeacherStudent,
} from "@/lib/teacher-api";

type ModalMode =
  | "course"
  | "exercise"
  | "edit-course"
  | "edit-exercise"
  | null;

export default function TeacherClassesPage() {
  const { language, messages } = useLandingLanguage();
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [exercises, setExercises] = useState<TeacherExercise[]>([]);
  const [students, setStudents] = useState<Record<string, TeacherStudent[]>>(
    {},
  );
  const [mode, setMode] = useState<ModalMode>(null);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [editingCourse, setEditingCourse] = useState<TeacherCourse | null>(null);
  const [editingExercise, setEditingExercise] =
    useState<TeacherExercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      getTeacherClasses(controller.signal),
      getTeacherCourses(controller.signal),
      getTeacherExercises(controller.signal),
    ])
      .then(async ([classData, courseData, exerciseData]) => {
        setClasses(classData);
        setCourses(courseData);
        setExercises(exerciseData);
        const entries = await Promise.all(
          classData.map(
            async (item) =>
              [
                item.class_id,
                await getTeacherStudents(item.class_id, controller.signal),
              ] as const,
          ),
        );
        setStudents(Object.fromEntries(entries));
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted)
          setMessage(
            getTeacherErrorMessage(error, messages.teacherClassesLoadError),
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [messages.teacherClassesLoadError]);

  function openModal(nextMode: ModalMode, classId: string) {
    setMode(nextMode);
    setSelectedClassId(classId);
    setEditingCourse(null);
    setEditingExercise(null);
    setMessage("");
  }
  function openCourseEditor(course: TeacherCourse) {
    setEditingCourse(course);
    setEditingExercise(null);
    setMode("edit-course");
    setMessage("");
  }
  function openExerciseEditor(exercise: TeacherExercise) {
    setEditingCourse(null);
    setEditingExercise(exercise);
    setMode("edit-exercise");
    setMessage("");
  }
  function showToast(text: string) {
    setToast(text);
    window.setTimeout(() => setToast(""), 2800);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const title = String(values.get("title") ?? "").trim();
    const description = String(values.get("description") ?? "").trim();
    const fileValue = values.get("file");
    const file =
      fileValue instanceof File && fileValue.size ? fileValue : undefined;
    setSaving(true);
    setMessage("");
    try {
      if (mode === "course") {
        const course = await createTeacherCourse({
          class_id: selectedClassId,
          title,
          description,
          content_url: String(values.get("content_url") ?? "").trim(),
          file,
        });
        setCourses((current) => [course, ...current]);
        showToast(messages.teacherCourseCreated);
      } else if (mode === "exercise") {
        const exercise = await createTeacherGradedWork({
          class_id: selectedClassId,
          course_id: String(values.get("course_id") ?? ""),
          title,
          description,
          max_score: Number(values.get("max_score") ?? 20),
          due_date: `${String(values.get("due_date") ?? "")}T00:00:00`,
          file,
        });
        setExercises((current) => [exercise, ...current]);
        showToast(messages.teacherExerciseCreated);
      } else if (mode === "edit-course" && editingCourse) {
        await updateTeacherCourse(editingCourse.id, { title, description, file });
        setCourses((current) =>
          current.map((course) =>
            course.id === editingCourse.id
              ? { ...course, title, description }
              : course,
          ),
        );
        showToast(messages.teacherCourseUpdated);
      } else if (mode === "edit-exercise" && editingExercise) {
        const maxScore = Number(values.get("max_score") ?? 20);
        await updateTeacherExercise(editingExercise.id, {
          course_title: title,
          max_score: maxScore,
          file,
        });
        setExercises((current) =>
          current.map((exercise) =>
            exercise.id === editingExercise.id
              ? { ...exercise, course_title: title, max_score: maxScore }
              : exercise,
          ),
        );
        showToast(messages.teacherExerciseUpdated);
      }
      setMode(null);
      setEditingCourse(null);
      setEditingExercise(null);
    } catch (error) {
      setMessage(getTeacherErrorMessage(error, messages.teacherItemSaveError));
    } finally {
      setSaving(false);
    }
  }

  async function removeCourse(course: TeacherCourse, exerciseCount: number) {
    if (exerciseCount > 0) {
      setMessage(messages.teacherDeleteExercisesFirst);
      return;
    }
    if (
      !window.confirm(
        messages.teacherDeleteCourseConfirm.replace("{title}", course.title),
      )
    )
      return;
    setSaving(true);
    setMessage("");
    try {
      await deleteTeacherCourse(course.id);
      setCourses((current) => current.filter((item) => item.id !== course.id));
      showToast(messages.teacherCourseDeleted);
    } catch (error) {
      setMessage(
        getTeacherErrorMessage(error, messages.teacherCourseDeleteError),
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeExercise(exercise: TeacherExercise) {
    if (
      !window.confirm(
        messages.teacherDeleteExerciseConfirm.replace("{title}", exercise.course_title),
      )
    )
      return;
    setSaving(true);
    setMessage("");
    try {
      await deleteTeacherExercise(exercise.id);
      setExercises((current) =>
        current.filter((item) => item.id !== exercise.id),
      );
      showToast(messages.teacherExerciseDeleted);
    } catch (error) {
      setMessage(
        getTeacherErrorMessage(error, messages.teacherExerciseDeleteError),
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-7 pb-24"
    >
      <header>
        <p className="text-start text-[10px] font-semibold tracking-[0.2em] text-[#dfc27e]">
          {messages.teacherTeaching}
        </p>
        <h1 className="mt-2 text-start text-3xl font-semibold tracking-tight text-white">
          {messages.teacherMyClasses}
        </h1>
        <p className="mt-2 text-start text-sm text-white/45">
          {messages.teacherClassesDescription}
        </p>
      </header>
      {message && (
        <p
          role="alert"
          className="rounded-2xl border border-rose-300/20 bg-rose-300/[0.05] p-4 text-xs text-rose-200"
        >
          {message}
        </p>
      )}
      {loading ? (
        <LoaderCircle className="animate-spin text-[#dfc27e]" size={21} />
      ) : classes.length ? (
        <div className="space-y-4">
          {classes.map((item, index) => (
            <motion.article
              key={item.class_id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-5"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#c6a96b]/20 bg-[#c6a96b]/[0.07] text-[#dfc27e]">
                  <BookOpen size={19} />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 dir="auto" className="text-start text-sm font-semibold text-white">
                    {item.name}
                  </h2>
                  <p dir="auto" className="mt-1 text-start text-[11px] text-white/45">
                    {item.subject} · {item.academic_year}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-start text-[10px] text-white/40">
                    <Users size={13} />
                    <bdi dir="auto">{messages.teacherEnrolledCount.replace("{count}", new Intl.NumberFormat(language === "ar" ? "ar" : "en").format(students[item.class_id]?.length ?? 0))}</bdi>
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => openModal("course", item.class_id)}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 text-[10px] font-semibold text-white/65 hover:border-[#c6a96b]/35 hover:text-[#dfc27e]"
                >
                  <Plus size={14} />
                  {messages.teacherAddCourse}
                </button>
                <button
                  onClick={() => openModal("exercise", item.class_id)}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#c6a96b]/25 text-[10px] font-semibold text-[#dfc27e] hover:bg-[#c6a96b]/[0.08]"
                >
                  <FilePlus2 size={14} />
                  {messages.teacherAddExercise}
                </button>
              </div>
              {courses.filter((course) => course.class_id === item.class_id)
                .length > 0 && (
                <div className="mt-4 border-t border-white/[0.07] pt-3">
                  <p className="mb-2 text-[10px] font-semibold tracking-[0.14em] text-white/35">
                    {messages.teacherCourseLibrary}
                  </p>
                  {courses
                    .filter((course) => course.class_id === item.class_id)
                    .map((course) => {
                      const courseExercises = exercises.filter(
                        (exercise) => exercise.course_id === course.id,
                      );
                      return (
                        <div key={course.id} className="mb-3 last:mb-0">
                          <div className="flex items-center gap-2">
                            <p className="min-w-0 flex-1 truncate py-1 text-xs font-medium text-white/70">
                              {course.title}
                            </p>
                            <button
                              type="button"
                              title={messages.teacherEditCourseTitle}
                              aria-label={messages.teacherEditCourseAria.replace("{title}", course.title)}
                              disabled={saving}
                              onClick={() => openCourseEditor(course)}
                              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-white/45 hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              type="button"
                              title={
                                courseExercises.length
                                  ? messages.teacherDeleteExercisesFirstTitle
                                  : messages.teacherDeleteCourseTitle
                              }
                              aria-label={messages.teacherDeleteCourse.replace("{title}", course.title)}
                              disabled={saving || courseExercises.length > 0}
                              onClick={() =>
                                removeCourse(course, courseExercises.length)
                              }
                              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-rose-200/60 hover:bg-rose-300/[0.08] hover:text-rose-200 disabled:opacity-25"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          {courseExercises.length ? (
                            <ul className="space-y-1 border-s border-white/10 ps-3">
                              {courseExercises.map((exercise) => (
                                <li
                                  key={exercise.id}
                                  className="flex min-h-8 items-center gap-2 text-[11px] text-white/45"
                                >
                                  <span className="min-w-0 flex-1 truncate">
                                    {exercise.course_title} · {messages.teacherMaxScore}: {exercise.max_score}
                                  </span>
                                  <button
                                    type="button"
                                    title={messages.teacherEditExerciseTitle}
                                    aria-label={messages.teacherEditExerciseAria.replace("{title}", exercise.course_title)}
                                    disabled={saving}
                                    onClick={() => openExerciseEditor(exercise)}
                                    className="flex size-7 shrink-0 items-center justify-center rounded-lg text-white/40 hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
                                  >
                                    <Pencil size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    title={messages.teacherDeleteExercise}
                                    aria-label={messages.teacherDeleteExercise.replace("{title}", exercise.course_title)}
                                    disabled={saving}
                                    onClick={() => removeExercise(exercise)}
                                    className="flex size-7 shrink-0 items-center justify-center rounded-lg text-rose-200/60 hover:bg-rose-300/[0.08] hover:text-rose-200 disabled:opacity-40"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="ps-3 text-start text-[10px] text-white/30">
                              {messages.teacherNoExercisesYet}
                            </p>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </motion.article>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-white/10 px-4 py-12 text-center text-xs text-white/45">
          {messages.teacherNoAssignedClasses}
        </p>
      )}

      <AnimatePresence>
        {mode && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.form
              onSubmit={submit}
              className="w-full max-w-lg space-y-4 rounded-t-2xl border border-white/10 bg-[#111111] p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:rounded-2xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.18em] text-[#dfc27e]">
                    {mode === "course" || mode === "edit-course"
                      ? messages.teacherCourseLibrary
                      : messages.teacherAssessment}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-white">
                    {mode === "course"
                      ? messages.teacherAddCourse
                      : mode === "exercise"
                        ? messages.teacherAddExercise
                        : mode === "edit-course"
                          ? messages.teacherEditCourse
                          : messages.teacherEditExercise}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setMode(null)}
                  aria-label={messages.teacherCloseDialog}
                  className="flex size-10 items-center justify-center rounded-xl text-white/45"
                >
                  <X size={18} />
                </button>
              </div>
              {mode === "exercise" && (
                <label className="block space-y-1.5">
                  <span className="text-[10px] text-white/50">{messages.teacherCourseField}</span>
                  <select
                    name="course_id"
                    required
                    defaultValue={
                      courses.find(
                        (course) => course.class_id === selectedClassId,
                      )?.id ?? ""
                    }
                    className="min-h-11 w-full rounded-xl border border-white/10 bg-[#151515] px-3 text-sm text-white outline-none focus:border-[#c6a96b]/55"
                  >
                    <option value="" disabled>
                      {courses.some(
                        (course) => course.class_id === selectedClassId,
                      )
                        ? messages.teacherChooseCourse
                        : messages.teacherCreateCourseFirst}
                    </option>
                    {courses
                      .filter((course) => course.class_id === selectedClassId)
                      .map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                  </select>
                </label>
              )}
              <Input
                label={messages.teacherTitle}
                name="title"
                required
                defaultValue={
                  editingCourse?.title ?? editingExercise?.course_title ?? ""
                }
                placeholder={
                  mode === "course" || mode === "edit-course"
                    ? messages.teacherCourseTitlePlaceholder
                    : messages.teacherExerciseTitlePlaceholder
                }
              />
              {mode !== "edit-exercise" && (
                <label className="block space-y-1.5">
                  <span className="text-[10px] text-white/50">{messages.teacherDescription}</span>
                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={editingCourse?.description ?? ""}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.035] p-3 text-sm text-white outline-none focus:border-[#c6a96b]/55"
                  />
                </label>
              )}
              {mode === "course" ? (
                <>
                  <Input
                    label={messages.teacherContentUrlOptional}
                    name="content_url"
                    type="url"
                    placeholder="https://..."
                  />
                  <FileField label={messages.teacherFileOptional} />
                </>
              ) : mode === "edit-course" ? (
                <FileField label={messages.teacherReplaceFileOptional} />
              ) : mode === "exercise" ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label={messages.teacherMaxScore}
                      name="max_score"
                      type="number"
                      min="1"
                      step="0.01"
                      defaultValue="20"
                      required
                    />
                    <Input
                      label={messages.teacherDeadline}
                      name="due_date"
                      type="date"
                      defaultValue={new Date().toISOString().slice(0, 10)}
                      required
                    />
                  </div>
                  <FileField label={messages.teacherFileOptional} />
                </>
              ) : mode === "edit-exercise" ? (
                <>
                  <Input
                    label={messages.teacherMaxScore}
                    name="max_score"
                    type="number"
                    min="1"
                    step="0.01"
                    defaultValue={editingExercise?.max_score ?? 20}
                    required
                  />
                  <FileField label={messages.teacherReplaceFileOptional} />
                </>
              ) : null}
              <button
                type="submit"
                disabled={
                  saving ||
                  (mode === "exercise" &&
                    !courses.some(
                      (course) => course.class_id === selectedClassId,
                    ))
                }
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#c6a96b] text-xs font-semibold text-[#17130b] disabled:opacity-50"
              >
                {saving && <LoaderCircle size={16} className="animate-spin" />}
                {saving
                  ? messages.teacherSaving
                  : mode === "course"
                    ? messages.teacherAddCourse
                    : mode === "exercise"
                      ? messages.teacherCreateExercise
                      : messages.teacherSaveChanges}
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            role="status"
            className="fixed inset-x-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-50 rounded-2xl border border-emerald-300/20 bg-[#111]/95 p-3 text-center text-xs text-emerald-200 shadow-xl sm:inset-x-auto sm:end-6 sm:w-80"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

function FileField({ label }: { label: string }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[10px] text-white/50">{label}</span>
      <input
        name="file"
        type="file"
        accept="application/pdf,image/jpeg,image/png"
        className="block w-full rounded-xl border border-white/10 bg-white/[0.035] p-3 text-xs text-white/55 file:me-3 file:rounded-lg file:border-0 file:bg-[#c6a96b]/15 file:px-3 file:py-2 file:text-xs file:text-[#dfc27e]"
      />
    </label>
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
