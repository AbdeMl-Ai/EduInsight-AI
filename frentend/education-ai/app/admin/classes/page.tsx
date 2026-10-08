'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BookOpen, CalendarDays, FileText, LoaderCircle, Plus, Trash2, UserRound, Users, X } from 'lucide-react';
import {
  ACADEMIC_LEVELS,
  SUBJECTS,
  assignAdminTeacherClasses,
  createAdminClass,
  deleteAdminClass,
  getAdminClasses,
  getAdminClassStudents,
  getAdminErrorMessage,
  getAdminAttendanceSummary,
  getAdminStudentReport,
  getAdminTeachers,
  updateAdminClass,
  type AdminClass,
  type AdminTeacher,
  type AttendanceClassSummary,
  type ClassCreate,
  type AdminStudent,
} from '@/lib/admin-api';
import { getPerformanceStatus, getSubjectAverages } from '@/lib/academic-report';
import { useLandingLanguage } from '@/components/app/LandingLanguageProvider';

type ClassForm = Omit<ClassCreate, 'teacher_id'> & { teacher_id: string };

const emptyForm: ClassForm = {
  teacher_id: '',
  class_name: '',
  subject: '',
  class_level: '',
  center_rent_fee_per_student: 0,
  teacher_teaching_fee_per_student: 0,
  student_monthly_fee: 0,
};

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-medium text-white/55">{label}</span>
      <input {...props} className={`min-h-11 w-full rounded-lg border border-white/10 bg-white/[0.035] px-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#c6a96b]/55 ${props.className ?? ''}`} />
    </label>
  );
}

export default function AdminClassesPage() {
  const { messages } = useLandingLanguage();
  const reduceMotion = useReducedMotion();
  const [classes, setClasses] = useState<AdminClass[]>([]);
  const [teachers, setTeachers] = useState<AdminTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<AdminClass | null>(null);
  const [form, setForm] = useState<ClassForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reportClassId, setReportClassId] = useState('');
  const [attendance, setAttendance] = useState<AttendanceClassSummary | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState('');
  const [expandedClassId, setExpandedClassId] = useState<string | null>(null);
  const [classStudents, setClassStudents] = useState<Record<string, AdminStudent[]>>({});
  const [studentsLoading, setStudentsLoading] = useState<string | null>(null);
  const [reportStudentId, setReportStudentId] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    Promise.all([getAdminClasses(controller.signal), getAdminTeachers(controller.signal)])
      .then(([classData, teacherData]) => {
        if (controller.signal.aborted) return;
        setClasses(classData);
        setTeachers(teacherData);
        setReportClassId((current) => current || classData[0]?.id || '');
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) setError(getAdminErrorMessage(requestError, messages.classCouldNotLoad));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt, messages]);

  function openCreate() {
    setEditingClass(null);
    setForm({ ...emptyForm, teacher_id: teachers[0]?.teacher_id ?? '' });
    setFormError('');
    setFormOpen(true);
  }

  function openEdit(classItem: AdminClass) {
    setEditingClass(classItem);
    setForm({
      teacher_id: classItem.teacher_id,
      class_name: classItem.class_name,
      subject: classItem.subject,
      class_level: classItem.class_level,
      center_rent_fee_per_student: classItem.center_rent_fee_per_student,
      teacher_teaching_fee_per_student: classItem.teacher_teaching_fee_per_student,
      student_monthly_fee: classItem.student_monthly_fee,
    });
    setFormError('');
    setFormOpen(true);
  }

  async function reloadClasses() {
    const [classData, teacherData] = await Promise.all([getAdminClasses(), getAdminTeachers()]);
    setClasses(classData);
    setTeachers(teacherData);
  }

  async function saveClass(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      if (editingClass) {
        await updateAdminClass(editingClass.id, form);
      } else {
        const created = await createAdminClass(form);
        await assignAdminTeacherClasses(form.teacher_id, [created.id]);
      }
      setFormOpen(false);
      setEditingClass(null);
      await reloadClasses();
    } catch (requestError) {
      setFormError(getAdminErrorMessage(requestError, messages.classCouldNotSave));
      await reloadClasses().catch(() => undefined);
    } finally {
      setSaving(false);
    }
  }

  async function removeClass(classItem: AdminClass) {
    if (!window.confirm(messages.deleteClassConfirm.replace('{name}', classItem.class_name))) return;
    setDeletingId(classItem.id);
    setError('');
    try {
      await deleteAdminClass(classItem.id);
      setClasses((current) => current.filter((item) => item.id !== classItem.id));
      setAttendance(null);
      setReportClassId((current) => current === classItem.id ? '' : current);
    } catch (requestError) {
      setError(getAdminErrorMessage(requestError, messages.classCouldNotDelete));
    } finally {
      setDeletingId(null);
    }
  }

  async function loadAttendance() {
    if (!reportClassId) return;
    setReportLoading(true);
    setReportError('');
    setAttendance(null);
    try {
      setAttendance(await getAdminAttendanceSummary(reportClassId));
    } catch (requestError) {
      setReportError(getAdminErrorMessage(requestError, messages.attendanceLoadError));
    } finally {
      setReportLoading(false);
    }
  }

  async function toggleClassStudents(classId: string) {
    if (expandedClassId === classId) {
      setExpandedClassId(null);
      return;
    }
    setExpandedClassId(classId);
    if (classStudents[classId]) return;
    setStudentsLoading(classId);
    setReportError('');
    try {
      const students = await getAdminClassStudents(classId);
      setClassStudents((current) => ({ ...current, [classId]: students }));
    } catch (requestError) {
      setReportError(getAdminErrorMessage(requestError, messages.studentsCouldNotLoad));
    } finally {
      setStudentsLoading(null);
    }
  }

  async function downloadStudentReport(student: AdminStudent) {
    setReportStudentId(student.student_id);
    setReportError('');
    try {
      const report = await getAdminStudentReport(student.student_id);
      const [{ jsPDF }, { default: Chart }] = await Promise.all([
        import('jspdf'),
        import('chart.js/auto'),
      ]);
      const pdf = new jsPDF();
      const canvas = globalThis.document.createElement('canvas');
      canvas.width = 1100;
      canvas.height = 420;
      const scores = report.exercises_and_exams.map((exercise) =>
        exercise.score === null
          ? null
          : exercise.max_score > 0
            ? (exercise.score / exercise.max_score) * 20
            : exercise.score,
      );
      const chart = new Chart(canvas, {
        type: 'line',
        data: {
          labels: report.exercises_and_exams.map((exercise) => exercise.exercise_name),
          datasets: [{
            label: messages.reportScoreLabel,
            data: scores,
            borderColor: '#c6a96b',
            backgroundColor: 'rgba(198, 169, 107, 0.18)',
            pointBackgroundColor: '#dfc27e',
            tension: 0.3,
            spanGaps: true,
          }],
        },
        options: {
          responsive: false,
          animation: false,
          scales: { y: { min: 0, max: 20 } },
        },
      });
      pdf.setFontSize(18);
      pdf.text(`${report.name} | ${messages.reportAcademicProgress}`, 14, 18);
      pdf.setFontSize(10);
      pdf.text(report.email, 14, 25);
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 14, 32, 182, 69);
      chart.destroy();
      const subjectAverages = getSubjectAverages(report.exercises_and_exams);
      let y = 112;
      pdf.setFontSize(13);
      pdf.setTextColor(42, 36, 32);
      pdf.text(messages.reportAverageByCourse, 14, y);
      y += 10;
      if (!subjectAverages.length) {
        pdf.setFontSize(10);
        pdf.text(messages.reportNoSubjects, 14, y);
      }
      for (const item of subjectAverages) {
        if (y > 275) {
          pdf.addPage();
          y = 20;
        }
        pdf.setDrawColor(230, 217, 194);
        pdf.line(14, y + 4, 196, y + 4);
        pdf.setFontSize(10);
        pdf.setTextColor(42, 36, 32);
        pdf.text(`${messages.course} ${item.subject}`, 16, y);
        pdf.text(
          item.average === null ? '— / 20' : `${item.average.toFixed(2)} / 20`,
          132,
          y,
        );
        const performance = item.average === null ? null : getPerformanceStatus(item.average).text;
        const status = performance === null
          ? messages.noGradedExercises
          : performance === 'Excellent'
            ? messages.performanceExcellent
            : performance === 'Good'
              ? messages.performanceGood
              : performance === 'Average'
                ? messages.performanceAverage
                : messages.performanceNeedsAttention;
        pdf.setTextColor(98, 87, 74);
        pdf.text(status, 194, y, { align: 'right' });
        y += 12;
      }
      pdf.save(`${report.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-progress-report.pdf`);
    } catch (requestError) {
      setReportError(getAdminErrorMessage(requestError, messages.studentReportCouldNotGenerate));
    } finally {
      setReportStudentId(null);
    }
  }

  const selectedTeacher = (teacherId: string) => teachers.find((teacher) => teacher.teacher_id === teacherId);
  return (
    <section className="space-y-6">
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.18em] text-[#dfc27e]">{messages.organization}</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">{messages.classes}</h1>
          <p className="mt-1 text-xs text-white/45">{messages.classGroupsDescription}</p>
        </div>
        <button onClick={openCreate} className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg bg-[#c6a96b] px-3 text-xs font-semibold text-[#17130b]"><Plus size={15} />{messages.newClass}</button>
      </header>

      {error && <div role="alert" className="rounded-lg border border-rose-300/20 bg-rose-300/[0.05] p-4 text-xs text-rose-200">{error}<button onClick={() => setAttempt((value) => value + 1)} className="ms-2 underline underline-offset-4">{messages.tryAgain}</button></div>}

      <section aria-labelledby="classes-list-title">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="classes-list-title" className="text-sm font-semibold text-white">{messages.yourClasses}</h2>
          <span className="text-[10px] tabular-nums text-white/40">{classes.length} {messages.total}</span>
        </div>
        {loading ? (
          <div role="status" className="space-y-3">{[0, 1, 2].map((key) => <div key={key} className="h-24 animate-pulse rounded-lg border border-white/[0.06] bg-white/[0.025]" />)}</div>
        ) : classes.length ? (
          <div className="space-y-3">
            {classes.map((classItem, index) => {
              const teacher = selectedTeacher(classItem.teacher_id);
              return (
                <motion.article key={classItem.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.04, 0.2) }} className="rounded-lg border border-white/10 bg-white/[0.025] p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#c6a96b]/20 bg-[#c6a96b]/[0.06] text-[#dfc27e]"><BookOpen size={18} /></span>
                    <div className="min-w-0 flex-1">
                      <h3 className="break-words text-sm font-semibold text-white">{classItem.class_name}</h3>
                      <p className="mt-1 text-[11px] text-white/45">{classItem.subject} · {classItem.class_level}</p>
                      <p className="mt-2 flex items-center gap-1.5 text-[10px] text-white/40"><UserRound size={13} />{teacher?.full_name ?? messages.teacherUnavailable}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button onClick={() => toggleClassStudents(classItem.id)} aria-label={messages.viewStudentsIn.replace('{name}', classItem.class_name)} title={messages.viewStudents} className={`flex size-9 items-center justify-center rounded-lg ${expandedClassId === classItem.id ? 'bg-[#c6a96b]/[0.12] text-[#dfc27e]' : 'text-white/45 hover:bg-white/5 hover:text-[#dfc27e]'}`}><Users size={16} /></button>
                      <button onClick={() => openEdit(classItem)} aria-label={`${messages.editClass}: ${classItem.class_name}`} title={messages.editClass} className="flex size-9 items-center justify-center rounded-lg text-white/45 hover:bg-white/5 hover:text-[#dfc27e]"><UserRound size={16} /></button>
                      <button onClick={() => removeClass(classItem)} disabled={deletingId === classItem.id} aria-label={`${messages.deleteClass}: ${classItem.class_name}`} title={messages.deleteClass} className="flex size-9 items-center justify-center rounded-lg text-white/35 hover:bg-rose-300/10 hover:text-rose-300 disabled:opacity-40">{deletingId === classItem.id ? <LoaderCircle size={15} className="animate-spin" /> : <Trash2 size={15} />}</button>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 border-t border-white/[0.07] pt-3 text-center">
                    <div><p className="text-[9px] text-white/35">{messages.centerFee}</p><p className="mt-1 text-[11px] tabular-nums text-white/70">{classItem.center_rent_fee_per_student}</p></div>
                    <div><p className="text-[9px] text-white/35">{messages.teacherFee}</p><p className="mt-1 text-[11px] tabular-nums text-white/70">{classItem.teacher_teaching_fee_per_student}</p></div>
                    <div><p className="text-[9px] text-white/35">{messages.monthlyFee}</p><p className="mt-1 text-[11px] tabular-nums text-white/70">{classItem.student_monthly_fee}</p></div>
                  </div>
                  <AnimatePresence initial={false}>
                    {expandedClassId === classItem.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="mt-3 border-t border-white/[0.07] pt-3">
                          <p className="mb-2 text-[10px] font-semibold tracking-[0.14em] text-white/40">{messages.enrolledStudents}</p>
                          {studentsLoading === classItem.id ? <p className="py-3 text-xs text-white/40">{messages.loadingStudents}</p> : classStudents[classItem.id]?.length ? (
                            <ul className="divide-y divide-white/[0.06]">
                              {classStudents[classItem.id].map((student) => <li key={student.student_id} className="flex items-center gap-2 py-2"><span className="min-w-0 flex-1 truncate text-xs text-white/75">{student.full_name}</span><button onClick={() => downloadStudentReport(student)} disabled={reportStudentId === student.student_id} className="inline-flex min-h-8 shrink-0 items-center gap-1.5 rounded-md border border-[#c6a96b]/25 px-2.5 text-[10px] font-semibold text-[#dfc27e] hover:bg-[#c6a96b]/[0.08] disabled:opacity-40"><FileText size={13} />{reportStudentId === student.student_id ? messages.generating : messages.getReport}</button></li>)}
                            </ul>
                          ) : <p className="py-3 text-xs text-white/40">{messages.noStudentsInClass}</p>}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </div>
        ) : !error ? (
          <div className="rounded-lg border border-white/10 px-5 py-10 text-center">
            <BookOpen className="mx-auto mb-3 text-[#c6a96b]" size={23} />
            <h3 className="text-sm font-medium text-white">{messages.noClassesYet}</h3>
            <p className="mt-1 text-xs text-white/40">{messages.createClassOrganize}</p>
          </div>
        ) : null}
      </section>

      <section className="rounded-lg border border-white/10 bg-white/[0.025] p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-emerald-300/15 bg-emerald-300/[0.05] text-emerald-200"><CalendarDays size={17} /></span>
          <div>
            <h2 className="text-sm font-semibold text-white">Attendance analytics</h2>
            <p className="mt-1 text-[11px] text-white/40">Each rate covers every attendance session recorded for the class.</p>
          </div>
        </div>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.3 }}
          className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]"
        >
          <select value={reportClassId} onChange={(event) => { setReportClassId(event.target.value); setAttendance(null); }} aria-label={messages.selectClassAttendance} className="min-h-11 rounded-lg border border-white/10 bg-[#151515] px-3 text-xs text-white outline-none focus:border-[#c6a96b]/50">
            <option value="">{messages.chooseClass}</option>
            {classes.map((item) => <option key={item.id} value={item.id}>{item.class_name}</option>)}
          </select>
          <button onClick={loadAttendance} disabled={!reportClassId || reportLoading} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#c6a96b]/25 px-4 text-xs font-semibold text-[#dfc27e] hover:bg-[#c6a96b]/[0.06] disabled:opacity-40">{reportLoading ? <LoaderCircle size={15} className="animate-spin" /> : <Users size={15} />}{messages.viewAttendanceReport}</button>
        </motion.div>
        {reportError && <p role="alert" className="mt-3 text-xs text-rose-200">{reportError}</p>}
        <AnimatePresence mode="wait">
        {attendance && (
          <motion.div
            key={attendance.class_id}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: reduceMotion ? 0 : 0.28 }}
            className="mt-4 border-t border-white/[0.08] pt-4"
          >
            <p className="text-xs font-medium text-white">
              {attendance.total_sessions} total session{attendance.total_sessions === 1 ? '' : 's'} · {attendance.students.length} students
            </p>
            {attendance.students.length ? (
              <motion.ul
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.035 } },
                }}
                className="mt-3 divide-y divide-white/[0.06]"
              >
                {attendance.students.map((student) => (
                  <motion.li
                    key={student.student_id}
                    variants={{
                      hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: reduceMotion ? 0 : 0.24 }}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 py-3 sm:grid-cols-[minmax(0,1fr)_minmax(8rem,2fr)_auto]"
                  >
                    <span className="truncate text-xs font-medium text-white/75">{student.student_name}</span>
                    <div className="col-span-2 flex items-center gap-3 sm:col-span-1">
                      <div
                        role="progressbar"
                        aria-label={`${student.student_name} attendance`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.min(100, Math.max(0, student.attendance_percentage))}
                        className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-white/10"
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, Math.max(0, student.attendance_percentage))}%` }}
                          transition={{ duration: reduceMotion ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full rounded-full bg-emerald-300"
                        />
                      </div>
                      <span className="w-12 shrink-0 text-right text-xs font-semibold tabular-nums text-emerald-200">
                        {student.attendance_percentage.toLocaleString(undefined, { maximumFractionDigits: 2 })}%
                      </span>
                    </div>
                    <span className="text-right text-[10px] tabular-nums text-white/40">
                      {student.present_sessions}/{student.total_sessions} present
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            ) : (
              <p className="mt-3 text-xs text-white/40">No students are enrolled in this class.</p>
            )}
          </motion.div>
        )}
        </AnimatePresence>
      </section>

      <AnimatePresence>
        {formOpen && (
          <motion.div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) setFormOpen(false); }}>
            <motion.section role="dialog" aria-modal="true" aria-label={editingClass ? messages.editClass : messages.createClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-xl border border-white/10 bg-[#111111] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:rounded-xl sm:p-5">
              <div className="mb-5 flex items-center justify-between"><h2 className="text-base font-semibold text-white">{editingClass ? messages.editClass : messages.newClass}</h2><button onClick={() => setFormOpen(false)} aria-label={messages.close} className="flex size-10 items-center justify-center rounded-lg text-white/45 hover:bg-white/5"><X size={18} /></button></div>
              <form onSubmit={saveClass} className="space-y-4">
                <Field label={messages.className} value={form.class_name} onChange={(event) => setForm((current) => ({ ...current, class_name: event.target.value }))} required />
                <label className="block space-y-1.5"><span className="text-[11px] font-medium text-white/55">{messages.subject}</span><select required value={form.subject} onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))} className="min-h-11 w-full rounded-lg border border-white/10 bg-[#151515] px-3 text-sm text-white outline-none focus:border-[#c6a96b]/55"><option value="">{messages.chooseSubject}</option>{SUBJECTS.map((subject) => <option key={subject} value={subject}>{subject === 'Math' ? messages.subjectMath : subject === 'PC' ? messages.subjectPhysicsChemistry : subject === 'SVT' ? messages.subjectBiologyGeology : subject === 'English' ? messages.subjectEnglish : messages.subjectFrench}</option>)}</select></label>
                <label className="block space-y-1.5"><span className="text-[11px] font-medium text-white/55">{messages.academicLevel}</span><select required value={form.class_level} onChange={(event) => setForm((current) => ({ ...current, class_level: event.target.value }))} className="min-h-11 w-full rounded-lg border border-white/10 bg-[#151515] px-3 text-sm text-white outline-none focus:border-[#c6a96b]/55"><option value="">{messages.chooseAcademicLevel}</option>{ACADEMIC_LEVELS.map((level) => <option key={level} value={level}>{level}</option>)}</select></label>
                <label className="block space-y-1.5"><span className="text-[11px] font-medium text-white/55">{messages.teacher}</span><select required value={form.teacher_id} onChange={(event) => setForm((current) => ({ ...current, teacher_id: event.target.value }))} className="min-h-11 w-full rounded-lg border border-white/10 bg-[#151515] px-3 text-sm text-white outline-none focus:border-[#c6a96b]/55"><option value="">{messages.chooseTeacher}</option>{teachers.map((teacher) => <option key={teacher.teacher_id} value={teacher.teacher_id}>{teacher.full_name}</option>)}</select>{teachers.length === 0 && <span className="text-[10px] text-amber-100/65">{messages.addTeacherBeforeClass}</span>}</label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Field label={messages.centerFeePerStudent} type="number" min="0" step="0.01" value={form.center_rent_fee_per_student} onChange={(event) => setForm((current) => ({ ...current, center_rent_fee_per_student: Number(event.target.value) }))} required />
                  <Field label={messages.teacherFeePerStudent} type="number" min="0" step="0.01" value={form.teacher_teaching_fee_per_student} onChange={(event) => setForm((current) => ({ ...current, teacher_teaching_fee_per_student: Number(event.target.value) }))} required />
                  <Field label={messages.studentMonthlyFee} type="number" min="0" step="0.01" value={form.student_monthly_fee} onChange={(event) => setForm((current) => ({ ...current, student_monthly_fee: Number(event.target.value) }))} required />
                </div>
                {formError && <p role="alert" className="rounded-lg border border-rose-300/15 bg-rose-300/[0.04] p-3 text-xs text-rose-200">{formError}</p>}
                <div className="flex gap-2 border-t border-white/[0.08] pt-4"><button type="button" onClick={() => setFormOpen(false)} disabled={saving} className="min-h-11 flex-1 rounded-lg border border-white/10 text-xs text-white/60">{messages.cancel}</button><button type="submit" disabled={saving || !teachers.length} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#c6a96b] text-xs font-semibold text-[#17130b] disabled:opacity-50">{saving && <LoaderCircle size={15} className="animate-spin" />}{saving ? messages.saving : editingClass ? messages.saveChanges : messages.createClass}</button></div>
              </form>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}