'use client';

import {
  useEffect,
  useState,
  type FormEvent,
} from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bell, LoaderCircle, Plus, Send, X } from 'lucide-react';
import { useLandingLanguage } from '@/components/app/LandingLanguageProvider';
import {
  getApiErrorMessage,
  getStudentMessageTeachers,
  getStudentNotifications,
  markAllStudentNotificationsRead,
  sendStudentMessage,
  STUDENT_NOTIFICATIONS_UPDATED_EVENT,
  type StudentMessageTeacher,
  type StudentNotification,
} from '@/lib/student-api';

export default function StudentNotificationsPage() {
  const { language, messages } = useLandingLanguage();
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [messageOpen, setMessageOpen] = useState(false);
  const [recipientRole, setRecipientRole] = useState<'admin' | 'teacher'>('admin');
  const [recipientId, setRecipientId] = useState('admin');
  const [teachers, setTeachers] = useState<StudentMessageTeacher[]>([]);
  const [teachersLoading, setTeachersLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [messageBody, setMessageBody] = useState('');
  const [sendError, setSendError] = useState('');
  const [sendSuccess, setSendSuccess] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    window.dispatchEvent(
      new CustomEvent(STUDENT_NOTIFICATIONS_UPDATED_EVENT, { detail: 0 }),
    );

    async function loadNotifications() {
      try {
        await markAllStudentNotificationsRead(controller.signal);
      } catch (requestError) {
        if (controller.signal.aborted) return;
        setError(
          getApiErrorMessage(
            requestError,
            messages.studentNotificationReadError,
          ),
        );
      }

      try {
        const items = await getStudentNotifications(controller.signal);
        if (controller.signal.aborted) return;
        setNotifications(items);
        window.dispatchEvent(
          new CustomEvent(STUDENT_NOTIFICATIONS_UPDATED_EVENT, {
            detail: items.filter((notification) => !notification.is_read)
              .length,
          }),
        );
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setError(
            getApiErrorMessage(
              requestError,
              'Notifications could not be loaded.',
            ),
          );
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadNotifications();
    return () => controller.abort();
  }, [messages.studentNotificationReadError]);

  useEffect(() => {
    if (!messageOpen || recipientRole !== 'teacher') return;
    const controller = new AbortController();
    setTeachersLoading(true);
    setSendError('');
    getStudentMessageTeachers(controller.signal)
      .then((items) => {
        if (controller.signal.aborted) return;
        setTeachers(items);
        setRecipientId((current) =>
          items.some((teacher) => teacher.id === current)
            ? current
            : items[0]?.id ?? '',
        );
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setSendError(
            getApiErrorMessage(requestError, messages.studentTeachersLoadError),
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setTeachersLoading(false);
      });
    return () => controller.abort();
  }, [messageOpen, recipientRole, messages.studentTeachersLoadError]);

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setSendError('');
    setSendSuccess('');
    try {
      await sendStudentMessage({
        recipient_id: recipientRole === 'admin' ? null : recipientId,
        recipient_role: recipientRole,
        message: messageBody.trim(),
      });
      setSendSuccess(messages.studentMessageSent);
      setMessageBody('');
      setMessageOpen(false);
    } catch (requestError) {
      setSendError(
        getApiErrorMessage(requestError, messages.studentMessageSendError),
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <section>
      <p className="mb-2 text-[10px] font-semibold tracking-[0.2em] text-[#c6a96b]">{messages.studentUpdates}</p>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{messages.notifications}</h1>
          <p className="mt-2 text-sm text-white/50">{messages.studentNotificationsDescription}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setRecipientRole('admin');
            setRecipientId('admin');
            setSendError('');
            setSendSuccess('');
            setMessageOpen(true);
          }}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#c6a96b] px-3.5 text-xs font-semibold text-[#17130b] transition-colors hover:bg-[#d8bd83]"
        >
          <Plus size={15} />
          {messages.studentNewMessage}
        </button>
      </div>

      {error && <p role="alert" className="mb-4 rounded-lg border border-rose-300/20 bg-rose-300/[0.05] p-3 text-xs text-rose-200">{error}</p>}
      {sendSuccess && <p role="status" className="mb-4 rounded-lg border border-emerald-300/20 bg-emerald-300/[0.05] p-3 text-xs text-emerald-200">{sendSuccess}</p>}
      {loading && <div role="status" className="flex min-h-48 items-center justify-center gap-3 text-sm text-white/50"><LoaderCircle size={18} className="animate-spin text-[#c6a96b]" />Loading notifications</div>}
      {!loading && !error && notifications.length === 0 && (
        <div className="rounded-lg border border-white/10 px-5 py-12 text-center">
          <Bell className="mx-auto mb-4 text-[#c6a96b]" size={23} strokeWidth={1.6} />
          <h2 className="text-base font-medium text-white">You’re all caught up</h2>
          <p className="mt-2 text-sm text-white/45">New messages will show up here.</p>
        </div>
      )}
      {!loading && notifications.length > 0 && (
        <div className="divide-y divide-white/[0.08] rounded-lg border border-white/10 bg-white/[0.02] px-4 sm:px-5">
          {notifications.map((notification, index) => {
            const resourceLink = notification.link ?? notification.reference_link;
            const message =
              notification.notification_type === 'course_added'
                ? messages.studentCourseAddedNotification
                    .replace('{teacher}', notification.sender_name)
                    .replace('{title}', notification.resource_title ?? '')
                : notification.notification_type === 'exercise_added'
                  ? messages.studentExerciseAddedNotification
                      .replace('{teacher}', notification.sender_name)
                      .replace('{title}', notification.resource_title ?? '')
                  : notification.message;
            const notificationContent = (
              <>
                <span className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border ${notification.is_read ? 'border-white/10 text-white/35' : 'border-[#c6a96b]/25 bg-[#c6a96b]/[0.06] text-[#dfc27e]'}`}>
                  <Bell size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="break-words text-sm font-medium text-white">{notification.sender_name}</h2>
                    {!notification.is_read && <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#d7b86e]" aria-label="Unread" />}
                  </div>
                  <p className="mt-1 whitespace-pre-wrap break-words text-xs leading-5 text-white/55">{message}</p>
                  <time className="mt-3 block text-[10px] text-white/35" dateTime={notification.created_at}>
                    {new Date(notification.created_at).toLocaleString(language === 'ar' ? 'ar' : 'en')}
                  </time>
                </div>
              </>
            );

            return (
              <motion.article
                key={notification.notification_id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.04, 0.2) }}
                className="py-4"
              >
                {resourceLink ? (
                  <Link
                    href={resourceLink}
                    className="flex gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[#c6a96b]"
                  >
                    {notificationContent}
                  </Link>
                ) : (
                  <div className="flex gap-3">{notificationContent}</div>
                )}
              </motion.article>
            );
          })}
        </div>
      )}

      {messageOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setMessageOpen(false);
          }}
        >
          <motion.form
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-message-title"
            onSubmit={submitMessage}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-lg space-y-4 rounded-t-2xl border border-white/10 bg-[#111111] p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 id="student-message-title" className="text-lg font-semibold text-white">
                {messages.studentNewMessage}
              </h2>
              <button
                type="button"
                onClick={() => setMessageOpen(false)}
                aria-label={messages.closeNotifications}
                className="flex size-10 items-center justify-center rounded-lg text-white/50 hover:bg-white/5 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            {sendError && <p role="alert" className="rounded-lg border border-rose-300/20 bg-rose-300/[0.05] p-3 text-xs text-rose-200">{sendError}</p>}
            <label className="block space-y-1.5">
              <span className="text-xs text-white/60">{messages.studentRecipientRole}</span>
              <select
                value={recipientRole}
                onChange={(event) => {
                  const role =
                    event.target.value === 'teacher' ? 'teacher' : 'admin';
                  setRecipientRole(role);
                  setRecipientId(role === 'admin' ? 'admin' : '');
                }}
                className="min-h-11 w-full rounded-lg border border-white/10 bg-[#171717] px-3 text-sm text-white outline-none focus:border-[#c6a96b]/60"
              >
                <option value="admin">{messages.studentAdminRole}</option>
                <option value="teacher">{messages.teacher}</option>
              </select>
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs text-white/60">{messages.studentRecipientName}</span>
              <select
                required
                value={recipientRole === 'admin' ? 'admin' : recipientId}
                onChange={(event) => setRecipientId(event.target.value)}
                disabled={recipientRole === 'teacher' && teachersLoading}
                className="min-h-11 w-full rounded-lg border border-white/10 bg-[#171717] px-3 text-sm text-white outline-none focus:border-[#c6a96b]/60 disabled:opacity-50"
              >
                {recipientRole === 'admin' ? (
                  <option value="admin">{messages.studentAdminPortal}</option>
                ) : (
                  <>
                    <option value="">{teachersLoading ? messages.loading : messages.studentSelectTeacher}</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.full_name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </label>
            {recipientRole === 'teacher' && !teachersLoading && teachers.length === 0 && (
              <p className="text-xs text-white/45">{messages.studentNoTeachersAvailable}</p>
            )}
            <label className="block space-y-1.5">
              <span className="text-xs text-white/60">{messages.studentMessageBody}</span>
              <textarea
                required
                value={messageBody}
                onChange={(event) => setMessageBody(event.target.value)}
                maxLength={5000}
                rows={5}
                className="w-full resize-y rounded-lg border border-white/10 bg-[#171717] p-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#c6a96b]/60"
              />
            </label>
            <button
              type="submit"
              disabled={
                sending ||
                !messageBody.trim() ||
                (recipientRole === 'teacher' &&
                  (teachersLoading || !recipientId))
              }
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#c6a96b] px-4 text-sm font-semibold text-[#17130b] hover:bg-[#d8bd83] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={15} />}
              {sending ? messages.studentSending : messages.send}
            </button>
          </motion.form>
        </div>
      )}
    </section>
  );
}