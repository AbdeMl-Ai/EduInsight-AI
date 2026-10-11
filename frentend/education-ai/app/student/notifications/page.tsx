'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bell, LoaderCircle } from 'lucide-react';
import { useLandingLanguage } from '@/components/app/LandingLanguageProvider';
import {
  getApiErrorMessage,
  getStudentNotifications,
  STUDENT_NOTIFICATIONS_UPDATED_EVENT,
  type StudentNotification,
} from '@/lib/student-api';

export default function StudentNotificationsPage() {
  const { language, messages } = useLandingLanguage();
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    getStudentNotifications(controller.signal)
      .then((items) => {
        setNotifications(items);
        window.dispatchEvent(
          new CustomEvent(
            STUDENT_NOTIFICATIONS_UPDATED_EVENT,
            {
              detail: items.filter((notification) => !notification.is_read)
                .length,
            },
          ),
        );
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(getApiErrorMessage(requestError, 'Notifications could not be loaded.'));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return (
    <section>
      <p className="mb-2 text-[10px] font-semibold tracking-[0.2em] text-[#c6a96b]">{messages.studentUpdates}</p>
      <div className="mb-7">
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{messages.notifications}</h1>
        <p className="mt-2 text-sm text-white/50">{messages.studentNotificationsDescription}</p>
      </div>

      {error && <p role="alert" className="mb-4 rounded-lg border border-rose-300/20 bg-rose-300/[0.05] p-3 text-xs text-rose-200">{error}</p>}
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
              <motion.article key={notification.notification_id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.04, 0.2) }} className="py-4">
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
    </section>
  );
}