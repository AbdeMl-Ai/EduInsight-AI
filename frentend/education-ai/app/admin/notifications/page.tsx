'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, LoaderCircle, Send } from 'lucide-react';
import {
  getAdminClasses,
  getAdminErrorMessage,
  getAdminNotifications,
  getAdminStudents,
  getAdminTeachers,
  sendAdminNotification,
  type AdminClass,
  type AdminNotification,
  type AdminStudent,
  type AdminTeacher,
} from '@/lib/admin-api';

type RecipientMode = 'class' | 'student' | 'teacher';

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Date unavailable'
    : new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export default function AdminNotificationsPage() {
  const [classes, setClasses] = useState<AdminClass[]>([]);
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [teachers, setTeachers] = useState<AdminTeacher[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [mode, setMode] = useState<RecipientMode>('class');
  const [classId, setClassId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    Promise.all([
      getAdminClasses(controller.signal),
      getAdminStudents(controller.signal),
      getAdminTeachers(controller.signal),
      getAdminNotifications(controller.signal),
    ])
      .then(([classData, studentData, teacherData, notificationData]) => {
        if (controller.signal.aborted) return;
        setClasses(classData);
        setStudents(studentData);
        setTeachers(teacherData);
        setNotifications(notificationData);
        setClassId((current) => current || classData[0]?.id || '');
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) setError(getAdminErrorMessage(requestError, 'Communication data could not be loaded.'));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);

  const classStudents = useMemo(() => students.filter((student) =>
    (student.class_ids?.length ? student.class_ids : student.class_id ? [student.class_id] : []).includes(classId),
  ), [students, classId]);

  async function refreshNotifications() {
    setNotifications(await getAdminNotifications());
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setError('');
    setFeedback('');
    try {
      await sendAdminNotification({ message: message.trim(), ...(mode === 'class' ? { class_id: classId } : mode === 'student' ? { student_id: studentId } : { teacher_id: teacherId }) });
      setMessage('');
      setStudentId('');
      setTeacherId('');
      setFeedback(mode === 'class' ? 'Announcement sent to the class.' : mode === 'student' ? 'Message sent to the student.' : 'Message sent to the teacher.');
      await refreshNotifications();
    } catch (requestError) {
      setError(getAdminErrorMessage(requestError, 'Notification could not be sent.'));
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="space-y-6">
      <header>
        <Link href="/admin/home" className="inline-flex min-h-9 items-center gap-1.5 text-[11px] font-medium text-white/45 hover:text-[#dfc27e]"><ArrowLeft size={14} />Overview</Link>
        <p className="mt-3 text-[10px] font-semibold tracking-[0.18em] text-[#dfc27e]">COMMUNICATION</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Notifications</h1>
        <p className="mt-1 text-xs text-white/45">Send an update to a class or an individual student.</p>
      </header>

      {error && <div role="alert" className="rounded-lg border border-rose-300/20 bg-rose-300/[0.05] p-4"><p className="text-xs text-rose-200">{error}</p><button onClick={() => setAttempt((value) => value + 1)} className="mt-2 text-xs font-semibold text-[#dfc27e] underline underline-offset-4">Try again</button></div>}

      <motion.form initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="space-y-4 rounded-lg border border-white/10 bg-white/[0.025] p-4 sm:p-5">
        <div className="grid grid-cols-3 rounded-lg border border-white/10 bg-black/20 p-1" role="tablist" aria-label="Notification recipient">
          {(['class', 'student', 'teacher'] as const).map((item) => <button key={item} type="button" role="tab" aria-selected={mode === item} onClick={() => { setMode(item); setStudentId(''); setTeacherId(''); }} className={`min-h-10 rounded-md text-xs font-semibold capitalize transition-colors ${mode === item ? 'bg-[#c6a96b]/[0.12] text-[#e0c783]' : 'text-white/45'}`}>{item === 'class' ? 'Whole class' : item === 'student' ? 'One student' : 'Teacher'}</button>)}
        </div>

        {mode !== 'teacher' && <label className="block space-y-1.5"><span className="text-[11px] font-medium text-white/55">Class</span><select required value={classId} onChange={(event) => { setClassId(event.target.value); setStudentId(''); }} className="min-h-11 w-full rounded-lg border border-white/10 bg-[#151515] px-3 text-sm text-white outline-none focus:border-[#c6a96b]/55"><option value="">Choose a class</option>{classes.map((item) => <option key={item.id} value={item.id}>{item.class_name} · {item.class_level}</option>)}</select></label>}

        {mode === 'student' && <label className="block space-y-1.5"><span className="text-[11px] font-medium text-white/55">Student</span><select required value={studentId} onChange={(event) => setStudentId(event.target.value)} disabled={!classId} className="min-h-11 w-full rounded-lg border border-white/10 bg-[#151515] px-3 text-sm text-white outline-none focus:border-[#c6a96b]/55 disabled:opacity-50"><option value="">{classStudents.length ? 'Choose a student' : 'No students in this class'}</option>{classStudents.map((student) => <option key={student.student_id} value={student.student_id}>{student.full_name} · {student.email}</option>)}</select></label>}

        {mode === 'teacher' && <label className="block space-y-1.5"><span className="text-[11px] font-medium text-white/55">Teacher</span><select required value={teacherId} onChange={(event) => setTeacherId(event.target.value)} className="min-h-11 w-full rounded-lg border border-white/10 bg-[#151515] px-3 text-sm text-white outline-none focus:border-[#c6a96b]/55"><option value="">{teachers.length ? 'Choose a teacher' : 'No teachers available'}</option>{teachers.map((teacher) => <option key={teacher.teacher_id} value={teacher.teacher_id}>{teacher.full_name} · {teacher.email}</option>)}</select></label>}

        {mode === 'class' && classId && <p className="rounded-lg border border-[#c6a96b]/15 bg-[#c6a96b]/[0.04] p-3 text-[11px] leading-5 text-white/55">This will send the announcement to students currently assigned to {classes.find((item) => item.id === classId)?.class_name}.</p>}

        <label className="block space-y-1.5"><span className="text-[11px] font-medium text-white/55">Message</span><textarea required minLength={1} maxLength={5000} rows={4} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write your announcement" className="w-full resize-y rounded-lg border border-white/10 bg-white/[0.035] px-3 py-3 text-sm leading-5 text-white outline-none placeholder:text-white/25 focus:border-[#c6a96b]/55" /><span className="block text-right text-[10px] tabular-nums text-white/30">{message.length}/5000</span></label>

        {feedback && <p role="status" className="rounded-lg border border-emerald-300/15 bg-emerald-300/[0.04] p-3 text-xs text-emerald-200">{feedback}</p>}
        <button type="submit" disabled={loading || sending || (mode !== 'teacher' && !classes.length) || (mode === 'student' && !studentId) || (mode === 'teacher' && !teacherId)} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#c6a96b] text-xs font-semibold text-[#17130b] disabled:cursor-not-allowed disabled:opacity-45">{sending ? <LoaderCircle size={15} className="animate-spin" /> : <Send size={15} />}{sending ? 'Sending' : 'Send notification'}</button>
      </motion.form>

      <section aria-labelledby="recent-messages-heading">
        <div className="mb-3 flex items-center justify-between"><div><p className="text-[10px] font-semibold tracking-[0.16em] text-white/40">ACTIVITY</p><h2 id="recent-messages-heading" className="mt-1 text-sm font-semibold text-white">Recent notifications</h2></div><span className="text-[10px] text-white/35">{notifications.length}</span></div>
        {loading ? <div role="status" className="space-y-3">{[0, 1].map((item) => <div key={item} className="h-20 animate-pulse rounded-lg border border-white/[0.06] bg-white/[0.025]" />)}</div> : notifications.length ? (
          <div className="divide-y divide-white/[0.07] rounded-lg border border-white/10 bg-white/[0.02] px-4">
            {notifications.slice(0, 8).map((notification) => <article key={notification.id} className="flex gap-3 py-3.5"><span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#c6a96b]/20 bg-[#c6a96b]/[0.05] text-[#dfc27e]"><Bell size={15} /></span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><h3 className="truncate text-xs font-medium text-white/80">{notification.title || notification.notification_type}</h3><time className="shrink-0 text-[9px] text-white/35">{formatDate(notification.created_at)}</time></div><p className="mt-1 whitespace-pre-wrap break-words text-[11px] leading-5 text-white/45">{notification.message}</p></div></article>)}
          </div>
        ) : <div className="rounded-lg border border-white/10 px-4 py-8 text-center"><Bell className="mx-auto mb-2 text-[#c6a96b]" size={20} /><p className="text-xs text-white/45">No notifications yet.</p><p className="mt-1 text-[10px] text-white/30">Messages sent to classes or students appear here.</p></div>}
      </section>
    </section>
  );
}