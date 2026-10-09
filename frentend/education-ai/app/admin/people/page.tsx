'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Eye,
  LoaderCircle,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserRoundPen,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import {
  ACADEMIC_LEVELS,
  checkAdminPaymentDue,
  createAdminStudent,
  createAdminTeacher,
  createStudentPayment,
  deleteStudentMonthPayment,
  deleteAdminStudent,
  deleteAdminTeacher,
  getAdminClasses,
  getAdminErrorMessage,
  getAdminPaymentSummary,
  getStudentFinancials,
  getAdminStudents,
  getAdminTeachers,
  getAdminStudentReport,
  resetAdminStudentPassword,
  resetAdminTeacherPassword,
  updateAdminPaymentState,
  updateAdminStudent,
  updateAdminTeacher,
  type AdminClass,
  type AdminStudent,
  type AdminTeacher,
  type PaymentSummary,
  type StudentReport,
} from '@/lib/admin-api';
import { getPerformanceStatus, getSubjectAverages } from '@/lib/academic-report';
import { useLandingLanguage } from '@/components/app/LandingLanguageProvider';
import { useAdminToast } from '@/components/admin/AdminToastProvider';

type PeopleTab = 'Students' | 'Teachers';
type FormMode = 'add-student' | 'edit-student' | 'add-teacher' | 'edit-teacher' | null;
type PaymentTarget = { id: string; name: string; role: PaymentSummary['user_role'] };
const PAYMENT_YEAR = new Date().getFullYear();

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] ?? '').join('').toUpperCase() || '?';
}

function studentClassLabel(student: AdminStudent, classes: AdminClass[], noClassLabel: string) {
  const ids = student.class_ids?.length ? student.class_ids : student.class_id ? [student.class_id] : [];
  const labels = ids
    .map((id) => classes.find((item) => item.id === id))
    .filter((item): item is AdminClass => Boolean(item))
    .map((item) => {
      const duplicateName = classes.some((other) =>
        other.id !== item.id &&
        other.class_name === item.class_name &&
        other.class_level === item.class_level,
      );
      return duplicateName ? `${item.class_name} · #${item.id.slice(-5)}` : item.class_name;
    });
  return labels.length ? labels.join(', ') : student.level_academy || student.level || noClassLabel;
}

function conflictingStudentSubject(classIds: string[], classes: AdminClass[]) {
  const seenCombinations = new Set<string>();
  for (const classId of classIds) {
    const classItem = classes.find((item) => item.id === classId);
    if (!classItem) continue;
    const combination = `${classItem.class_level.toUpperCase()}::${classItem.subject.toUpperCase()}`;
    if (seenCombinations.has(combination)) return `${classItem.class_level} ${classItem.subject}`;
    seenCombinations.add(combination);
  }
  return null;
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-medium text-white/55">{label}</span>
      <input
        {...props}
        className={`min-h-11 w-full rounded-lg border border-white/10 bg-white/[0.035] px-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#c6a96b]/55 ${props.className ?? ''}`}
      />
    </label>
  );
}

export default function AdminPeoplePage() {
  const { messages } = useLandingLanguage();
  const { showSuccessToast } = useAdminToast();
  const [tab, setTab] = useState<PeopleTab>('Students');
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [teachers, setTeachers] = useState<AdminTeacher[]>([]);
  const [classes, setClasses] = useState<AdminClass[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [editingStudent, setEditingStudent] = useState<AdminStudent | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<AdminTeacher | null>(null);
  const [infoStudent, setInfoStudent] = useState<AdminStudent | null>(null);
  const [studentReport, setStudentReport] = useState<StudentReport | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState('');
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [formNotice, setFormNotice] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetBusy, setResetBusy] = useState(false);
  const [resetNotice, setResetNotice] = useState('');
  const [resetError, setResetError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedPersonId, setExpandedPersonId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [paymentTarget, setPaymentTarget] = useState<PaymentTarget | null>(null);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(null);
  const [persistedPaidMonths, setPersistedPaidMonths] = useState<number[]>([]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSaving, setPaymentSaving] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    Promise.all([
      getAdminStudents(controller.signal),
      getAdminTeachers(controller.signal),
      getAdminClasses(controller.signal),
    ])
      .then(([studentData, teacherData, classData]) => {
        if (controller.signal.aborted) return;
        setStudents(studentData);
        setTeachers(teacherData);
        setClasses(classData);
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) setError(getAdminErrorMessage(requestError, messages.peopleLoadError));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    checkAdminPaymentDue().catch(() => undefined);
    return () => controller.abort();
  }, [attempt, messages]);

  const filteredStudents = useMemo(() => students.filter((item) =>
    `${item.full_name} ${item.email} ${studentClassLabel(item, classes, messages.noClassAssigned)}`.toLowerCase().includes(query.toLowerCase()),
  ), [students, classes, query, messages]);
  const filteredTeachers = useMemo(() => teachers.filter((item) =>
    `${item.full_name} ${item.email} ${item.specialties.join(' ')}`.toLowerCase().includes(query.toLowerCase()),
  ), [teachers, query]);
  const studentSubjectConflict = conflictingStudentSubject(selectedClassIds, classes);

  function openForm(mode: Exclude<FormMode, null>, student?: AdminStudent, teacher?: AdminTeacher) {
    setFormError('');
    setFormNotice('');
    setEditingStudent(student ?? null);
    setEditingTeacher(teacher ?? null);
    setSelectedClassIds(student?.class_ids?.length ? student.class_ids : student?.class_id ? [student.class_id] : teacher?.classes.map((item) => item.class_id) ?? []);
    setFormMode(mode);
  }

  function closeForm() {
    if (saving) return;
    setFormMode(null);
    setEditingStudent(null);
    setEditingTeacher(null);
    setSelectedClassIds([]);
    setFormError('');
    setFormNotice('');
  }

  async function submitStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (studentSubjectConflict) {
      setFormError(messages.studentSubjectLimit);
      return;
    }
    setSaving(true);
    setFormError('');
    setFormNotice('');
    const values = new FormData(event.currentTarget);
    const full_name = String(values.get('full_name') ?? '').trim();
    const email = String(values.get('email') ?? '').trim();
    const phone_number = String(values.get('phone_number') ?? '').trim();
    const level = String(values.get('level') ?? '');
    const password = String(values.get('password') ?? '');

    try {
      if (formMode === 'edit-student' && editingStudent) {
        await updateAdminStudent(editingStudent.student_id, {
          full_name,
          email,
          phone_number,
          level,
          class_id: selectedClassIds[0] ?? null,
          class_ids: selectedClassIds,
        });
        if (password) {
          try {
            await resetAdminStudentPassword(editingStudent.student_id, password);
          } catch (passwordError) {
            await reloadPeople();
            setFormNotice(messages.profileSavedPasswordFailed);
            setFormError(getAdminErrorMessage(passwordError, messages.passwordResetFailed));
            return;
          }
        }
        setFormNotice(messages.studentProfileUpdated);
        showSuccessToast(messages.studentProfileUpdated, 'Student updated');
      } else {
        const selectedClass = classes.find((item) => item.id === selectedClassIds[0]);
        const created = await createAdminStudent({
          full_name,
          email,
          phone_number,
          level,
          class_id: selectedClassIds[0] ?? null,
          class_ids: selectedClassIds,
        });
        if (password) {
          try {
            await resetAdminStudentPassword(created.student_id, password);
          } catch (passwordError) {
            await reloadPeople();
            setFormNotice(messages.studentCreatedPasswordFailed);
            setFormError(getAdminErrorMessage(passwordError, messages.passwordSetupFailed));
            return;
          }
        }
        setFormNotice(password ? messages.studentAndLoginCreated : messages.studentCreatedSetPassword);
        showSuccessToast('Student added to the learning community.', 'Student added');
      }
      await reloadPeople();
    } catch (requestError) {
      setFormError(getAdminErrorMessage(requestError, messages.unableSaveStudent));
    } finally {
      setSaving(false);
    }
  }

  async function submitTeacher(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFormError('');
    setFormNotice('');
    const values = new FormData(event.currentTarget);
    const teacherData = {
      full_name: String(values.get('full_name') ?? '').trim(),
      email: String(values.get('email') ?? '').trim(),
      phone_number: String(values.get('phone_number') ?? '').trim(),
      specialties: String(values.get('specialties') ?? '').split(',').map((item) => item.trim()).filter(Boolean),
      class_ids: selectedClassIds,
    };
    const password = String(values.get('password') ?? '');
    try {
      if (formMode === 'edit-teacher' && editingTeacher) {
        await updateAdminTeacher(editingTeacher.teacher_id, teacherData);
        if (password) {
          try {
            await resetAdminTeacherPassword(editingTeacher.teacher_id, password);
          } catch (passwordError) {
            await reloadPeople();
            setFormNotice(messages.teacherProfileSavedPasswordFailed);
            setFormError(getAdminErrorMessage(passwordError, messages.passwordResetFailed));
            return;
          }
        }
        setFormNotice(password ? messages.teacherProfileLoginUpdated : messages.teacherProfileUpdated);
        showSuccessToast(messages.teacherProfileUpdated, 'Teacher updated');
      } else {
        await createAdminTeacher(teacherData);
        setFormNotice(messages.teacherProfileCreated);
        showSuccessToast(messages.teacherProfileCreated, 'Teacher added');
      }
      await reloadPeople();
    } catch (requestError) {
      setFormError(getAdminErrorMessage(requestError, messages.unableSaveTeacher));
    } finally {
      setSaving(false);
    }
  }

  async function reloadPeople() {
    const [studentData, teacherData, classData] = await Promise.all([
      getAdminStudents(),
      getAdminTeachers(),
      getAdminClasses(),
    ]);
    setStudents(studentData);
    setTeachers(teacherData);
    setClasses(classData);
  }

  async function handleResetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!infoStudent || resetPassword.length < 8) return;
    setResetBusy(true);
    setResetError('');
    setResetNotice('');
    try {
      await resetAdminStudentPassword(infoStudent.student_id, resetPassword);
      setResetPassword('');
      setResetNotice(messages.passwordResetShareSecurely);
      showSuccessToast(messages.passwordResetShareSecurely, 'Password updated');
    } catch (requestError) {
      setResetError(getAdminErrorMessage(requestError, messages.couldNotResetPassword));
    } finally {
      setResetBusy(false);
    }
  }

  async function openPayments(target: PaymentTarget) {
    setPaymentTarget(target);
    setPaymentSummary(null);
    setPaymentError('');
    setPaymentLoading(true);
    try {
      if (target.role === 'student') {
        const financials = await getStudentFinancials(target.id, PAYMENT_YEAR);
        setPaymentSummary(financials);
        setPersistedPaidMonths(financials.paid_months);
      } else {
        const summary = await getAdminPaymentSummary(target.id, target.role);
        setPaymentSummary(summary);
        setPersistedPaidMonths(summary.paid_months);
      }
    } catch (requestError) {
      setPaymentError(getAdminErrorMessage(requestError, messages.paymentDetailsLoadError));
    } finally {
      setPaymentLoading(false);
    }
  }

  async function savePayments() {
    if (!paymentTarget || !paymentSummary) return;
    setPaymentSaving(true);
    setPaymentError('');
    try {
      if (paymentTarget.role === 'student') {
        const selected = new Set(paymentSummary.paid_months);
        const previouslyPaid = new Set(persistedPaidMonths);
        const additions = [...selected].filter((month) => !previouslyPaid.has(month));
        const removals = [...previouslyPaid].filter((month) => !selected.has(month));
        for (const month of additions) {
          const monthValue = `${PAYMENT_YEAR}-${String(month).padStart(2, '0')}`;
          await createStudentPayment({
            student_id: paymentTarget.id,
            amount: paymentSummary.monthly_amount,
            month: monthValue,
            payment_date: `${monthValue}-01`,
          });
        }
        for (const month of removals) {
          const monthValue = `${PAYMENT_YEAR}-${String(month).padStart(2, '0')}`;
          await deleteStudentMonthPayment(paymentTarget.id, monthValue);
        }
        const saved = await getStudentFinancials(paymentTarget.id, PAYMENT_YEAR);
        setPaymentSummary(saved);
        setPersistedPaidMonths(saved.paid_months);
      } else {
        const summary = await updateAdminPaymentState(
          paymentTarget.id,
          paymentTarget.role,
          paymentSummary.paid_months,
        );
        setPaymentSummary(summary);
        setPersistedPaidMonths(summary.paid_months);
      }
      showSuccessToast('Payment details were updated.', 'Payment details saved');
    } catch (requestError) {
      setPaymentError(getAdminErrorMessage(requestError, messages.paymentStateSaveError));
    } finally {
      setPaymentSaving(false);
    }
  }

  async function removeStudent(student: AdminStudent) {
    if (!window.confirm(messages.deletePersonConfirm.replace('{name}', student.full_name))) return;
    setDeletingId(student.student_id);
    setError('');
    try {
      await deleteAdminStudent(student.student_id);
      showSuccessToast('The student was removed from the directory.', 'Student removed');
      if (infoStudent?.student_id === student.student_id) setInfoStudent(null);
      await reloadPeople();
    } catch (requestError) {
      setError(getAdminErrorMessage(requestError, messages.personDeletedError));
    } finally {
      setDeletingId(null);
    }
  }

  async function removeTeacher(teacher: AdminTeacher) {
    if (!window.confirm(messages.deletePersonConfirm.replace('{name}', teacher.full_name))) return;
    setDeletingId(teacher.teacher_id);
    setError('');
    try {
      await deleteAdminTeacher(teacher.teacher_id);
      showSuccessToast('The teacher was removed from the directory.', 'Teacher removed');
      await reloadPeople();
    } catch (requestError) {
      setError(getAdminErrorMessage(requestError, messages.personDeletedError));
    } finally {
      setDeletingId(null);
    }
  }

  const isStudentForm = formMode === 'add-student' || formMode === 'edit-student';
  const isEditing = formMode === 'edit-student' || formMode === 'edit-teacher';

  return (
    <section className="space-y-5">
      <header>
        <p className="text-[10px] font-semibold tracking-[0.18em] text-[#dfc27e]">{messages.directory}</p>
        <div className="mt-2 flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-white">{messages.directoryTitle}</h1>
            <p className="mt-1 text-xs text-white/45">{messages.managePeople}</p>
          </div>
          <span className="text-[10px] tabular-nums text-white/35">{tab === 'Students' ? students.length : teachers.length} {messages.total}</span>
        </div>
      </header>

      <div className="grid grid-cols-2 rounded-lg border border-white/10 bg-white/[0.025] p-1" role="tablist" aria-label={messages.peopleType}>
        {(['Students', 'Teachers'] as const).map((item) => (
          <button
            key={item}
            role="tab"
            aria-selected={tab === item}
            onClick={() => { setTab(item); setQuery(''); setOpenMenuId(null); setExpandedPersonId(null); }}
            className={`min-h-10 rounded-md text-xs font-semibold transition-colors ${tab === item ? 'bg-[#c6a96b]/[0.12] text-[#e0c783]' : 'text-white/45 hover:text-white/75'}`}
          >
            {item === 'Students' ? messages.students : messages.teachers}
          </button>
        ))}
      </div>

      <label className="relative block">
        <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-white/35" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={tab === 'Students' ? messages.searchStudents : messages.searchTeachers}
          className="min-h-11 w-full rounded-lg border border-white/10 bg-white/[0.025] ps-9 pe-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#c6a96b]/50"
        />
      </label>

      {error && (
        <div role="alert" className="rounded-lg border border-rose-300/20 bg-rose-300/[0.05] p-4">
          <p className="text-xs leading-5 text-rose-200">{error}</p>
          <button onClick={() => setAttempt((value) => value + 1)} className="mt-2 min-h-9 text-xs font-semibold text-[#dfc27e] underline underline-offset-4">{messages.tryAgain}</button>
        </div>
      )}

      {loading ? (
        <div role="status" className="space-y-3">
          {[0, 1, 2, 3].map((item) => <div key={item} className="h-[76px] animate-pulse rounded-lg border border-white/[0.06] bg-white/[0.025]" />)}
        </div>
      ) : !error && tab === 'Students' ? (
        filteredStudents.length ? (
          <div className="rounded-xl border border-slate-200 bg-white/70 px-3 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.02] sm:px-4">
            {filteredStudents.map((student) => (
              <article key={student.student_id} className="relative border-b border-slate-200/80 py-2.5 last:border-b-0 dark:border-white/[0.07]">
                <div className="flex min-w-0 items-center gap-3 border-s-2 border-amber-500/70 ps-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/10 text-[11px] font-semibold text-amber-800 dark:text-amber-200">{initials(student.full_name)}</span>
                  <button
                    type="button"
                    aria-expanded={expandedPersonId === `student:${student.student_id}`}
                    onClick={() => setExpandedPersonId((current) => current === `student:${student.student_id}` ? null : `student:${student.student_id}`)}
                    className="min-w-0 flex-1 py-1 text-start"
                  >
                    <span className="block truncate text-sm font-semibold text-slate-950 dark:text-white">{student.full_name}</span>
                    <span className="mt-1 hidden truncate text-[10px] text-slate-500 dark:text-white/45 sm:block">{student.email}</span>
                    <span className="mt-0.5 block truncate text-[10px] text-slate-500 dark:text-white/35">{studentClassLabel(student, classes, messages.noClassAssigned)}</span>
                  </button>
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      aria-label={`Actions for ${student.full_name}`}
                      aria-expanded={openMenuId === `student:${student.student_id}`}
                      onClick={() => setOpenMenuId((current) => current === `student:${student.student_id}` ? null : `student:${student.student_id}`)}
                      className="flex size-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-amber-400/50 hover:bg-amber-300/10 hover:text-amber-800 dark:border-white/10 dark:text-white/50 dark:hover:text-amber-200"
                    ><MoreHorizontal size={19} /></button>
                    <AnimatePresence>
                      {openMenuId === `student:${student.student_id}` && (
                        <motion.div initial={{ opacity: 0, y: -5, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5, scale: 0.98 }} className="absolute end-0 top-11 z-40 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-white/10 dark:bg-slate-900">
                          <button type="button" onClick={() => { setInfoStudent(student); setResetNotice(''); setResetError(''); setOpenMenuId(null); }} className="flex min-h-10 w-full items-center gap-2 rounded-lg px-3 text-start text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-white/80 dark:hover:bg-white/[0.06]"><Eye size={14} />{messages.viewAccountInfo}</button>
                          <button type="button" onClick={() => { setOpenMenuId(null); void openPayments({ id: student.student_id, name: student.full_name, role: 'student' }); }} className="flex min-h-10 w-full items-center gap-2 rounded-lg px-3 text-start text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-white/80 dark:hover:bg-white/[0.06]"><Wallet size={14} />{messages.payments}</button>
                          <button type="button" onClick={() => { setOpenMenuId(null); openForm('edit-student', student); }} className="flex min-h-10 w-full items-center gap-2 rounded-lg px-3 text-start text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-white/80 dark:hover:bg-white/[0.06]"><UserRoundPen size={14} />{messages.editStudent}</button>
                          <button type="button" onClick={() => { setOpenMenuId(null); void removeStudent(student); }} disabled={deletingId === student.student_id} className="flex min-h-10 w-full items-center gap-2 rounded-lg px-3 text-start text-xs font-medium text-rose-700 transition-colors hover:bg-rose-50 disabled:opacity-50 dark:text-rose-300 dark:hover:bg-rose-300/10"><Trash2 size={14} />{messages.deleteStudent}</button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <AnimatePresence initial={false}>
                  {expandedPersonId === `student:${student.student_id}` && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: 'easeOut' }} className="overflow-hidden">
                      <dl className="ms-[3.25rem] mt-3 grid grid-cols-1 gap-2 rounded-lg border border-slate-200 bg-slate-50/80 p-3 text-xs dark:border-white/[0.08] dark:bg-white/[0.025] sm:grid-cols-2">
                        <div className="min-w-0"><dt className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-white/40">{messages.loginEmail}</dt><dd className="mt-1 break-all text-slate-800 dark:text-white/80">{student.email}</dd></div>
                        <div><dt className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-white/40">{messages.phoneNumber}</dt><dd className="mt-1 text-slate-800 dark:text-white/80">{student.phone_number || '—'}</dd></div>
                        <div><dt className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-white/40">{messages.academicLevel}</dt><dd className="mt-1 text-slate-800 dark:text-white/80">{student.level_academy || student.level || '—'}</dd></div>
                        <div className="min-w-0"><dt className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-white/40">{messages.classLabelPlural}</dt><dd className="mt-1 truncate text-slate-800 dark:text-white/80">{studentClassLabel(student, classes, messages.noClassAssigned)}</dd></div>
                      </dl>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            ))}
          </div>
        ) : <EmptyPeople label={messages.students} singular={messages.student} onAdd={() => openForm('add-student')} />
      ) : !error ? (
        filteredTeachers.length ? (
          <div className="rounded-xl border border-slate-200 bg-white/70 px-3 shadow-sm transition-colors dark:border-white/10 dark:bg-white/[0.02] sm:px-4">
            {filteredTeachers.map((teacher) => (
              <article key={teacher.teacher_id} className="relative border-b border-slate-200/80 py-2.5 last:border-b-0 dark:border-white/[0.07]">
                <div className="flex min-w-0 items-center gap-3 border-s-2 border-emerald-500/70 ps-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-emerald-400/25 bg-emerald-400/10 text-[11px] font-semibold text-emerald-800 dark:text-emerald-200">{initials(teacher.full_name)}</span>
                  <button type="button" aria-expanded={expandedPersonId === `teacher:${teacher.teacher_id}`} onClick={() => setExpandedPersonId((current) => current === `teacher:${teacher.teacher_id}` ? null : `teacher:${teacher.teacher_id}`)} className="min-w-0 flex-1 py-1 text-start">
                    <span className="block truncate text-sm font-semibold text-slate-950 dark:text-white">{teacher.full_name}</span>
                    <span className="mt-1 hidden truncate text-[10px] text-slate-500 dark:text-white/45 sm:block">{teacher.email}</span>
                    <span className="mt-0.5 block truncate text-[10px] text-slate-500 dark:text-white/35">{teacher.classes.length} {teacher.classes.length === 1 ? messages.classAssigned : messages.classesAssigned}</span>
                  </button>
                  <div className="relative shrink-0">
                    <button type="button" aria-label={`Actions for ${teacher.full_name}`} aria-expanded={openMenuId === `teacher:${teacher.teacher_id}`} onClick={() => setOpenMenuId((current) => current === `teacher:${teacher.teacher_id}` ? null : `teacher:${teacher.teacher_id}`)} className="flex size-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-emerald-400/50 hover:bg-emerald-300/10 hover:text-emerald-800 dark:border-white/10 dark:text-white/50 dark:hover:text-emerald-200"><MoreHorizontal size={19} /></button>
                    <AnimatePresence>
                      {openMenuId === `teacher:${teacher.teacher_id}` && (
                        <motion.div initial={{ opacity: 0, y: -5, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5, scale: 0.98 }} className="absolute end-0 top-11 z-40 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-white/10 dark:bg-slate-900">
                          <button type="button" onClick={() => { setOpenMenuId(null); setExpandedPersonId(`teacher:${teacher.teacher_id}`); }} className="flex min-h-10 w-full items-center gap-2 rounded-lg px-3 text-start text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-white/80 dark:hover:bg-white/[0.06]"><Eye size={14} />View details</button>
                          <button type="button" onClick={() => { setOpenMenuId(null); void openPayments({ id: teacher.teacher_id, name: teacher.full_name, role: 'teacher' }); }} className="flex min-h-10 w-full items-center gap-2 rounded-lg px-3 text-start text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-white/80 dark:hover:bg-white/[0.06]"><Wallet size={14} />{messages.payments}</button>
                          <button type="button" onClick={() => { setOpenMenuId(null); openForm('edit-teacher', undefined, teacher); }} className="flex min-h-10 w-full items-center gap-2 rounded-lg px-3 text-start text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-white/80 dark:hover:bg-white/[0.06]"><UserRoundPen size={14} />{messages.editTeacher}</button>
                          <button type="button" onClick={() => { setOpenMenuId(null); void removeTeacher(teacher); }} disabled={deletingId === teacher.teacher_id} className="flex min-h-10 w-full items-center gap-2 rounded-lg px-3 text-start text-xs font-medium text-rose-700 transition-colors hover:bg-rose-50 disabled:opacity-50 dark:text-rose-300 dark:hover:bg-rose-300/10"><Trash2 size={14} />{messages.deleteTeacher}</button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <AnimatePresence initial={false}>
                  {expandedPersonId === `teacher:${teacher.teacher_id}` && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: 'easeOut' }} className="overflow-hidden">
                      <dl className="ms-[3.25rem] mt-3 grid grid-cols-1 gap-2 rounded-lg border border-slate-200 bg-slate-50/80 p-3 text-xs dark:border-white/[0.08] dark:bg-white/[0.025] sm:grid-cols-2">
                        <div className="min-w-0"><dt className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-white/40">{messages.loginEmail}</dt><dd className="mt-1 break-all text-slate-800 dark:text-white/80">{teacher.email}</dd></div>
                        <div><dt className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-white/40">{messages.phoneNumber}</dt><dd className="mt-1 text-slate-800 dark:text-white/80">{teacher.phone_number || '—'}</dd></div>
                        <div className="sm:col-span-2"><dt className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-white/40">{messages.classesAssigned}</dt><dd className="mt-1 truncate text-slate-800 dark:text-white/80">{teacher.classes.map((item) => item.name).join(', ') || '—'}</dd></div>
                        <div className="sm:col-span-2"><dt className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-white/40">{messages.specialtiesCommaSeparated}</dt><dd className="mt-1 truncate text-slate-800 dark:text-white/80">{teacher.specialties.join(', ') || '—'}</dd></div>
                      </dl>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            ))}
          </div>
        ) : <EmptyPeople label={messages.teachers} singular={messages.teacher} onAdd={() => openForm('add-teacher')} />
      ) : null}

      <button
        onClick={() => openForm(tab === 'Students' ? 'add-student' : 'add-teacher')}
        aria-label={tab === 'Students' ? messages.addStudent : messages.addTeacher}
        title={tab === 'Students' ? messages.addStudent : messages.addTeacher}
        className="fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom))] right-4 z-40 flex size-14 items-center justify-center rounded-full border border-[#eed49a]/30 bg-[#c6a96b] text-[#17130b] shadow-[0_8px_30px_rgba(0,0,0,0.45)] transition-transform hover:scale-105 sm:right-8"
      >
        <Plus size={23} />
      </button>

      <AnimatePresence>
        {paymentTarget && (
          <motion.div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget && !paymentSaving) setPaymentTarget(null); }}>
            <motion.section role="dialog" aria-modal="true" aria-label={`${paymentTarget.name} payments`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="w-full max-w-lg rounded-t-xl border border-white/10 bg-[#111111] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:rounded-xl sm:p-5">
              <div className="mb-5 flex items-start justify-between gap-3"><div><p className="text-[10px] font-semibold tracking-[0.16em] text-[#dfc27e]">{messages.financials}</p><h2 className="mt-1 text-base font-semibold text-white">{paymentTarget.name}</h2></div><button onClick={() => setPaymentTarget(null)} disabled={paymentSaving} aria-label={messages.closePayments} className="flex size-10 items-center justify-center rounded-lg text-white/45 hover:bg-white/5"><X size={18} /></button></div>
              {paymentLoading ? <div className="h-40 animate-pulse rounded-lg bg-white/[0.04]" /> : paymentSummary && <>
                <div className="grid grid-cols-2 gap-2"><div className="rounded-lg border border-[#c6a96b]/15 bg-[#c6a96b]/[0.05] p-3"><p className="text-[10px] text-white/40">{paymentTarget.role === 'student' ? messages.monthlyFee : messages.monthlyPayout}</p><p className="mt-1 text-lg font-semibold tabular-nums text-[#dfc27e]">{paymentSummary.monthly_amount.toFixed(2)} MAD</p></div><div className="rounded-lg border border-white/10 bg-white/[0.025] p-3"><p className="text-[10px] text-white/40">{messages.status}</p><p className={`mt-1 text-sm font-semibold ${paymentSummary.due ? 'text-rose-200' : 'text-emerald-200'}`}>{paymentSummary.due ? messages.paymentDue : messages.upToDate}</p></div></div>
                <div className="mt-5"><p className="mb-2 text-[11px] font-medium text-white/55">{messages.paidMonths}{paymentTarget.role === 'student' ? ` · ${PAYMENT_YEAR}` : ''}</p><div className="grid grid-cols-3 gap-2 sm:grid-cols-4">{messages.monthsShort.map((label, index) => { const month = index + 1; const checked = paymentSummary.paid_months.includes(month); return <label key={label} className={`flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border px-3 text-xs ${checked ? 'border-[#c6a96b]/40 bg-[#c6a96b]/[0.1] text-[#dfc27e]' : 'border-white/10 text-white/55'}`}><input type="checkbox" checked={checked} onChange={() => setPaymentSummary((current) => current ? { ...current, paid_months: checked ? current.paid_months.filter((item) => item !== month) : [...current.paid_months, month].sort((a, b) => a - b) } : current)} className="size-3.5 accent-[#c6a96b]" />{label}</label>; })}</div></div>
                {paymentError && <p role="alert" className="mt-3 text-xs text-rose-200">{paymentError}</p>}
                <button onClick={savePayments} disabled={paymentSaving} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#c6a96b] text-xs font-semibold text-[#17130b] disabled:opacity-50">{paymentSaving && <LoaderCircle size={15} className="animate-spin" />}{messages.savePaymentState}</button>
              </>}
              {!paymentLoading && !paymentSummary && paymentError && <p role="alert" className="text-xs text-rose-200">{paymentError}</p>}
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {formMode && (
          <Sheet title={`${isEditing ? messages.peopleEdit : messages.peopleAdd} ${isStudentForm ? messages.student : messages.teacher}`} onClose={closeForm}>
            <form onSubmit={isStudentForm ? submitStudent : submitTeacher} className="space-y-4">
              <Field label={messages.fullName} name="full_name" defaultValue={editingStudent?.full_name ?? editingTeacher?.full_name ?? ''} autoComplete="name" required />
              <Field label={messages.email} name="email" type="email" defaultValue={editingStudent?.email ?? editingTeacher?.email ?? ''} autoComplete="email" required />
              <Field label={messages.phoneNumber} name="phone_number" defaultValue={editingStudent?.phone_number ?? editingTeacher?.phone_number ?? ''} autoComplete="tel" required />
              {isStudentForm ? (
                <>
                  <label className="block space-y-1.5"><span className="text-[11px] font-medium text-white/55">{messages.academicLevel}</span><select name="level" required defaultValue={editingStudent?.level_academy || editingStudent?.level || ACADEMIC_LEVELS[0]} className="min-h-11 w-full rounded-lg border border-white/10 bg-[#151515] px-3 text-sm text-white outline-none focus:border-[#c6a96b]/55"><option value="">{messages.chooseAcademicLevel}</option>{ACADEMIC_LEVELS.map((levelOption) => <option key={levelOption} value={levelOption}>{levelOption}</option>)}</select></label>
                  <div className="space-y-2">
                    <p className="text-[11px] font-medium text-white/55">{messages.classLabelPlural}</p>
                    {classes.length ? classes.map((classItem) => (
                      <label key={classItem.id} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-white/[0.07] px-3 text-xs text-white/75 hover:bg-white/[0.03]">
                        <input
                          type="checkbox"
                          checked={selectedClassIds.includes(classItem.id)}
                          onChange={(event) => {
                            const nextIds = event.target.checked
                              ? [...selectedClassIds, classItem.id]
                              : selectedClassIds.filter((id) => id !== classItem.id);
                            const conflict = conflictingStudentSubject(nextIds, classes);
                            if (conflict) {
                              setFormError(messages.studentSubjectLimit);
                              return;
                            }
                            setFormError('');
                            setSelectedClassIds(nextIds);
                          }}
                          className="size-4 accent-[#c6a96b]"
                        />
                        <BookOpen size={14} className="text-[#dfc27e]" />
                        <span className="min-w-0 flex-1 truncate">{classItem.class_name}</span>
                        <span className="shrink-0 text-[10px] text-white/35">{classItem.teacher_name}</span>
                      </label>
                    )) : <p className="rounded-lg border border-amber-200/15 bg-amber-200/[0.04] p-3 text-xs text-amber-100/75">{messages.createClassBeforeStudent}</p>}
                    {studentSubjectConflict && <p role="alert" className="rounded-lg border border-rose-300/15 bg-rose-300/[0.04] p-3 text-xs text-rose-200">{messages.studentOneClassSubjectLevel}</p>}
                  </div>
                  <Field
                    label={isEditing ? messages.newPasswordOptional : messages.initialPasswordOptional}
                    name="password"
                    type="password"
                    minLength={8}
                    maxLength={72}
                    autoComplete="new-password"
                    placeholder={messages.leaveBlankForLater}
                  />
                  <p className="-mt-2 text-[10px] leading-4 text-white/35">{messages.passwordsHashed}</p>
                </>
              ) : (
                <>
                  <Field label={messages.specialtiesCommaSeparated} name="specialties" defaultValue={editingTeacher?.specialties.join(', ') ?? ''} />
                  <div className="space-y-2">
                    <p className="text-[11px] font-medium text-white/55">{messages.assignedClasses}</p>
                    {classes.map((classItem) => (
                      <label key={classItem.id} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-white/[0.07] px-3 text-xs text-white/75 hover:bg-white/[0.03]">
                        <input
                          type="checkbox"
                          checked={selectedClassIds.includes(classItem.id)}
                          onChange={(event) => setSelectedClassIds((current) => event.target.checked ? [...current, classItem.id] : current.filter((id) => id !== classItem.id))}
                          className="size-4 accent-[#c6a96b]"
                        />
                        <BookOpen size={14} className="text-[#dfc27e]" />
                        <span className="min-w-0 flex-1 truncate">{classItem.class_name}</span>
                        <span className="shrink-0 text-[10px] text-white/35">{classItem.class_level}</span>
                      </label>
                    ))}
                    {classes.length === 0 && <p className="text-xs text-white/40">{messages.noClassesExist}</p>}
                  </div>
                  {isEditing && <>
                    <Field
                      label={messages.newPasswordOptional}
                      name="password"
                      type="password"
                      minLength={8}
                      maxLength={72}
                      autoComplete="new-password"
                      placeholder={messages.leaveBlankForLater}
                    />
                    <p className="-mt-2 text-[10px] leading-4 text-white/35">{messages.passwordsHashed}</p>
                  </>}
                </>
              )}
              {formError && <p role="alert" className="rounded-lg border border-rose-300/15 bg-rose-300/[0.04] p-3 text-xs text-rose-200">{formError}</p>}
              {formNotice && <p role="status" className="rounded-lg border border-emerald-300/15 bg-emerald-300/[0.04] p-3 text-xs text-emerald-200">{formNotice}</p>}
              <div className="flex gap-2 border-t border-white/[0.08] pt-4">
                <button type="button" onClick={closeForm} disabled={saving} className="min-h-11 flex-1 rounded-lg border border-white/10 text-xs font-medium text-white/60 disabled:opacity-40">{messages.close}</button>
                <button type="submit" disabled={saving || (isStudentForm && Boolean(studentSubjectConflict))} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#c6a96b] text-xs font-semibold text-[#17130b] disabled:opacity-60">
                  {saving && <LoaderCircle size={15} className="animate-spin" />}
                  {saving ? messages.saving : isEditing ? messages.saveChanges : isStudentForm ? messages.addStudent : messages.addTeacher}
                </button>
              </div>
            </form>
          </Sheet>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {infoStudent && (
          <Sheet title={messages.studentAccount} onClose={() => { setInfoStudent(null); setResetPassword(''); setResetError(''); setResetNotice(''); }}>
            <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
              <span className="flex size-12 items-center justify-center rounded-full border border-[#c6a96b]/25 bg-[#c6a96b]/[0.07] text-xs font-semibold text-[#dfc27e]">{initials(infoStudent.full_name)}</span>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-white">{infoStudent.full_name}</h3>
                <p className="mt-1 truncate text-[11px] text-white/45">{studentClassLabel(infoStudent, classes, messages.noClassAssigned)}</p>
              </div>
            </div>
            <dl className="space-y-3 py-4">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.12em] text-white/35">{messages.loginEmail}</dt>
                <dd className="mt-1 break-all text-sm text-white/85">{infoStudent.email}</dd>
              </div>
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.025] p-3">
                <dt className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-white/45"><ShieldCheck size={14} className="text-emerald-300" />{messages.password}</dt>
                <dd className="mt-1 text-xs leading-5 text-white/60">{messages.passwordsSecureHashed}</dd>
              </div>
            </dl>
            <section className="border-t border-white/[0.08] py-4">
              <div className="flex items-center justify-between gap-3">
                <div><h3 className="text-xs font-semibold text-white">{messages.academicReport}</h3><p className="mt-1 text-[10px] text-white/40">{messages.courseAverages20}</p></div>
                <button
                  type="button"
                  onClick={async () => {
                    setReportLoading(true);
                    setReportError('');
                    try { setStudentReport(await getAdminStudentReport(infoStudent.student_id)); }
                    catch (requestError) { setReportError(getAdminErrorMessage(requestError, messages.studentReportCouldNotGenerate)); }
                    finally { setReportLoading(false); }
                  }}
                  disabled={reportLoading}
                  className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-3 text-[10px] font-semibold text-[#dfc27e] disabled:opacity-50"
                >{reportLoading && <LoaderCircle size={13} className="animate-spin" />}{reportLoading ? messages.loading : messages.viewReport}</button>
              </div>
              {reportError && <p role="alert" className="mt-3 text-[11px] text-rose-200">{reportError}</p>}
              {studentReport && studentReport.student_id === infoStudent.student_id && (
                <div className="mt-3 rounded-lg border border-white/[0.08] bg-white/[0.02] p-3">
                  <p className="text-[10px] text-white/45">{studentReport.class_info?.name ?? messages.noClassInformation}</p>
                  {studentReport.exercises_and_exams.length ? (
                    <ul className="mt-3 flex flex-col gap-3">
                      {getSubjectAverages(studentReport.exercises_and_exams).map((item) => {
                        const performance = item.average === null ? null : getPerformanceStatus(item.average);
                        const statusText = performance === null
                          ? messages.noGradedExercises
                          : performance.text === 'Excellent'
                            ? messages.performanceExcellent
                            : performance.text === 'Good'
                              ? messages.performanceGood
                              : performance.text === 'Average'
                                ? messages.performanceAverage
                                : messages.performanceNeedsAttention;
                        return (
                          <li key={item.subject} className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/[0.025] p-3 sm:flex-row sm:items-center sm:gap-4">
                            <span className="min-w-0 flex-1 truncate text-sm font-semibold text-white">
                              {messages.course} {item.subject}
                            </span>
                            <span className="text-base font-semibold tabular-nums text-white">
                              {item.average === null ? '—' : `${item.average.toFixed(2)} / 20`}
                            </span>
                            <span className={`text-xs font-semibold sm:w-36 sm:text-right ${performance?.color ?? 'text-white/40'}`}>
                              {statusText}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : <p className="mt-2 text-[11px] text-white/40">{messages.noGradedWork}</p>}
                </div>
              )}
            </section>
            <form onSubmit={handleResetPassword} className="space-y-3 border-t border-white/[0.08] pt-4">
              <Field
                label={messages.setNewPassword}
                type="password"
                autoComplete="new-password"
                minLength={8}
                maxLength={72}
                value={resetPassword}
                onChange={(event) => setResetPassword(event.target.value)}
                placeholder={messages.atLeast8Characters}
              />
              {resetError && <p role="alert" className="text-xs text-rose-200">{resetError}</p>}
              {resetNotice && <p role="status" className="text-xs text-emerald-200">{resetNotice}</p>}
              <button disabled={resetBusy || resetPassword.length < 8} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#c6a96b] text-xs font-semibold text-[#17130b] disabled:cursor-not-allowed disabled:opacity-40">
                {resetBusy ? <LoaderCircle size={15} className="animate-spin" /> : <ShieldCheck size={15} />}
                {resetBusy ? messages.resettingPassword : messages.resetStudentPassword}
              </button>
            </form>
          </Sheet>
        )}
      </AnimatePresence>
    </section>
  );
}

function EmptyPeople({ label, singular, onAdd }: { label: string; singular: string; onAdd: () => void }) {
  const { messages } = useLandingLanguage();
  return (
    <div className="rounded-lg border border-white/10 px-5 py-12 text-center">
      <Users className="mx-auto mb-3 text-[#c6a96b]" size={23} strokeWidth={1.6} />
      <h2 className="text-sm font-medium text-white">{messages.noLabelFound.replace('{label}', label)}</h2>
      <p className="mt-1 text-xs text-white/40">{messages.addToGetStarted.replace('{label}', singular)}</p>
      <button onClick={onAdd} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#c6a96b] px-4 text-xs font-semibold text-[#17130b]"><Plus size={15} />{messages.addLabel.replace('{label}', singular)}</button>
    </div>
  );
}

function Sheet({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  const { messages } = useLandingLanguage();
  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-xl border border-white/10 bg-[#111111] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:rounded-xl sm:p-5"
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <button type="button" onClick={onClose} aria-label={messages.closeDialog} className="flex size-10 items-center justify-center rounded-lg text-white/45 hover:bg-white/5 hover:text-white"><X size={18} /></button>
        </div>
        {children}
      </motion.section>
    </motion.div>
  );
}