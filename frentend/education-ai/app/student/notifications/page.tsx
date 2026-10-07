'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, LoaderCircle } from 'lucide-react';
import {
  getApiErrorMessage,
  getStudentNotifications,
  markStudentNotificationRead,
  type StudentNotification,
} from '@/lib/student-api';

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const latestNotifications = useMemo(() => {
    const latestBySender = new Map<string, StudentNotification>();
    for (const notification of notifications) {
      const senderId = notification.sender_id ?? 'admin';
      if (!latestBySender.has(senderId)) latestBySender.set(senderId, notification);
    }
    return [...latestBySender.values()];
  }, [notifications]);

  useEffect(() => {
    const controller = new AbortController();
    getStudentNotifications(controller.signal)
      .then(setNotifications)
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

  async function markRead(notificationId: string) {
    setBusy(notificationId);
    setError('');
    try {
      await markStudentNotificationRead(notificationId);
      setNotifications((current) => current.map((notification) =>
        notification.notification_id === notificationId
          ? { ...notification, is_read: true }
          : notification,
      ));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'This notification could not be updated.'));
    } finally {
      setBusy(null);
    }
  }

  return (
    <section>
      <p className="mb-2 text-[10px] font-semibold tracking-[0.2em] text-[#c6a96b]">UPDATES</p>
      <div className="mb-7">
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Notifications</h1>
        <p className="mt-2 text-sm text-white/50">Messages about your classes and coursework.</p>
      </div>

      {error && <p role="alert" className="mb-4 rounded-lg border border-rose-300/20 bg-rose-300/[0.05] p-3 text-xs text-rose-200">{error}</p>}
      {loading && <div role="status" className="flex min-h-48 items-center justify-center gap-3 text-sm text-white/50"><LoaderCircle size={18} className="animate-spin text-[#c6a96b]" />Loading notifications</div>}
      {!loading && !error && latestNotifications.length === 0 && (
        <div className="rounded-lg border border-white/10 px-5 py-12 text-center">
          <Bell className="mx-auto mb-4 text-[#c6a96b]" size={23} strokeWidth={1.6} />
          <h2 className="text-base font-medium text-white">You’re all caught up</h2>
          <p className="mt-2 text-sm text-white/45">New messages will show up here.</p>
        </div>
      )}
      {!loading && latestNotifications.length > 0 && (
        <div className="divide-y divide-white/[0.08] rounded-lg border border-white/10 bg-white/[0.02] px-4 sm:px-5">
          {latestNotifications.map((notification, index) => (
            <motion.article key={notification.notification_id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.04, 0.2) }} className="flex gap-3 py-4">
              <span className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border ${notification.is_read ? 'border-white/10 text-white/35' : 'border-[#c6a96b]/25 bg-[#c6a96b]/[0.06] text-[#dfc27e]'}`}>
                <Bell size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="break-words text-sm font-medium text-white">{notification.sender_name}</h2>
                  {!notification.is_read && <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#d7b86e]" aria-label="Unread" />}
                </div>
                <p className="mt-1 whitespace-pre-wrap break-words text-xs leading-5 text-white/55">{notification.message}</p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <time className="text-[10px] text-white/35" dateTime={notification.created_at}>
                    {new Date(notification.created_at).toLocaleString()}
                  </time>
                  {notification.reference_link && <a href={notification.reference_link} className="text-[10px] font-medium text-[#dfc27e] underline underline-offset-4">Open link</a>}
                  {!notification.is_read && (
                    <button onClick={() => markRead(notification.notification_id)} disabled={busy === notification.notification_id} className="inline-flex min-h-8 items-center gap-1.5 text-[10px] font-medium text-white/55 hover:text-[#dfc27e] disabled:opacity-40">
                      {busy === notification.notification_id ? <LoaderCircle size={13} className="animate-spin" /> : <Check size={13} />}
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </section>
  );
}