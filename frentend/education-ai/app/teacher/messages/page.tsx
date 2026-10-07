'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { LoaderCircle, Send } from 'lucide-react';
import { getTeacherClasses, getTeacherErrorMessage, getTeacherStudents, sendTeacherMessage, type TeacherClass, type TeacherStudent } from '@/lib/teacher-api';

type TargetType = 'admin' | 'class' | 'student';

export default function TeacherMessagesPage() {
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [students, setStudents] = useState<TeacherStudent[]>([]);
  const [targetType, setTargetType] = useState<TargetType>('admin');
  const [targetId, setTargetId] = useState('admin');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    getTeacherClasses(controller.signal).then(async (classData) => {
      setClasses(classData);
      const enrolled = await Promise.all(classData.map((item) => getTeacherStudents(item.class_id, controller.signal)));
      const unique = new Map(enrolled.flat().map((student) => [student.student_id, student]));
      setStudents([...unique.values()]);
    }).catch((requestError: unknown) => { if (!controller.signal.aborted) setError(getTeacherErrorMessage(requestError, 'Message recipients could not be loaded.')); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  function changeTarget(type: TargetType) {
    setTargetType(type);
    setTargetId(type === 'admin' ? 'admin' : '');
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true); setError(''); setFeedback('');
    try {
      await sendTeacherMessage({ target_type: targetType, target_id: targetId, subject: subject.trim(), message: message.trim() });
      setSubject(''); setMessage(''); setFeedback('Message sent successfully.');
    } catch (requestError) { setError(getTeacherErrorMessage(requestError, 'Message could not be sent.')); } finally { setSending(false); }
  }

  return <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl space-y-7 pb-24"><header><p className="text-[10px] font-semibold tracking-[0.2em] text-[#dfc27e]">COMMUNICATION</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Compose message</h1><p className="mt-2 text-sm text-white/45">Contact your administrator, a class, or a student.</p></header>{error && <p role="alert" className="rounded-2xl border border-red-200 bg-red-100 p-4 text-xs text-red-800 dark:border-red-700/40 dark:bg-red-900/30 dark:text-red-300">{error}</p>}<form onSubmit={submit} className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6"><div className="grid grid-cols-3 gap-1 rounded-xl border border-white/10 bg-black/20 p-1">{(['admin', 'class', 'student'] as const).map((type) => <button key={type} type="button" onClick={() => changeTarget(type)} className={`min-h-10 rounded-lg text-[10px] font-semibold capitalize ${targetType === type ? 'bg-[#c6a96b]/15 text-[#dfc27e]' : 'text-white/45'}`}>{type === 'admin' ? 'Admin' : type}</button>)}</div>{targetType !== 'admin' && <label className="block space-y-1.5"><span className="text-[10px] text-white/50">Recipient</span><select required value={targetId} onChange={(event) => setTargetId(event.target.value)} disabled={loading} className="min-h-12 w-full rounded-xl border border-white/10 bg-[#151515] px-3 text-sm text-white outline-none focus:border-[#c6a96b]/55"><option value="">{loading ? 'Loading recipients...' : `Choose a ${targetType}`}</option>{targetType === 'class' ? classes.map((item) => <option key={item.class_id} value={item.class_id}>{item.name} · {item.subject}</option>) : students.map((item) => <option key={item.student_id} value={item.student_id}>{item.full_name} · {item.email}</option>)}</select></label>}<Input label="Subject" value={subject} onChange={(event) => setSubject(event.target.value)} required placeholder="Schedule update" /><label className="block space-y-1.5"><span className="text-[10px] text-white/50">Message</span><textarea value={message} onChange={(event) => setMessage(event.target.value)} required minLength={1} maxLength={5000} rows={7} placeholder="Write your message..." className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.035] p-3 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-[#c6a96b]/55" /></label>{feedback && <p role="status" className="rounded-xl border border-green-200 bg-green-100 p-3 text-xs text-green-800 dark:border-green-700/40 dark:bg-green-900/30 dark:text-green-300">{feedback}</p>}<button type="submit" disabled={sending || loading || (targetType !== 'admin' && !targetId)} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#c6a96b] text-xs font-semibold text-[#17130b] disabled:opacity-50">{sending ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={16} />}{sending ? 'Sending' : 'Send message'}</button></form></motion.section>;
}

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) { return <label className="block space-y-1.5"><span className="text-[10px] text-white/50">{label}</span><input {...props} className="min-h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#c6a96b]/55" /></label>; }
