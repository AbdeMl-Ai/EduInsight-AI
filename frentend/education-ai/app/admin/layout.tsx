'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Bell, BookOpen, GraduationCap, LayoutDashboard, UserRound, Users } from 'lucide-react';
import ThemeToggle from '@/components/app/ThemeToggle';
import AuthGuard from '@/components/app/AuthGuard';
import LanguageSwitcher from '@/components/app/LanguageSwitcher';
import { useLandingLanguage } from '@/components/app/LandingLanguageProvider';
import AdminToastProvider from '@/components/admin/AdminToastProvider';
import type { LucideIcon } from 'lucide-react';
import {
  getAdminErrorMessage,
  getAdminNotifications,
  markAdminNotificationsRead,
  type AdminNotification,
} from '@/lib/admin-api';

const navigation: Array<{ href: string; label: 'overview' | 'people' | 'classes' | 'profile'; icon: LucideIcon }> = [
  { href: '/admin/home', label: 'overview', icon: LayoutDashboard },
  { href: '/admin/people', label: 'people', icon: Users },
  { href: '/admin/classes', label: 'classes', icon: BookOpen },
  { href: '/admin/profile', label: 'profile', icon: UserRound },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { messages } = useLandingLanguage();
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const unreadCount = notifications.filter((item) => !item.is_read).length;

  function toggleNotifications() {
    if (notificationsOpen) {
      setNotificationsOpen(false);
      return;
    }

    setNotificationsOpen(true);
    setNotifications((current) =>
      current.map((item) => ({ ...item, is_read: true })),
    );
    void markAdminNotificationsRead().catch((error: unknown) => {
      console.warn(
        getAdminErrorMessage(error, messages.notificationsLoadError),
      );
      getAdminNotifications()
        .then(setNotifications)
        .catch((refreshError: unknown) => {
          console.warn(
            getAdminErrorMessage(
              refreshError,
              messages.notificationsLoadError,
            ),
          );
        });
    });
  }

  useEffect(() => {
    let cancelled = false;
    const refreshNotifications = () => {
      getAdminNotifications()
        .then((items) => {
          if (!cancelled) setNotifications(items);
        })
        .catch((error: unknown) => {
          if (!cancelled) {
            console.warn(
              getAdminErrorMessage(error, messages.notificationsLoadError),
            );
          }
        })
        .finally(() => {
          if (!cancelled) setNotificationsLoading(false);
        });
    };
    refreshNotifications();
    const interval = window.setInterval(refreshNotifications, 60_000);
    window.addEventListener('focus', refreshNotifications);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.removeEventListener('focus', refreshNotifications);
    };
  }, [messages.notificationsLoadError]);

  return (
    <AuthGuard role="admin">
    <AdminToastProvider>
    <div className="app-shell min-h-dvh bg-[#0a0a0a] text-[#f5f2e9]">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/[0.07] bg-[#0a0a0a]/95 px-4 backdrop-blur-md sm:px-6">
        <Link href="/admin/home" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg border border-yellow-500/30 bg-[#2A2420] text-[#dfc27e]">
            <GraduationCap size={18} strokeWidth={1.7} />
          </span>
          <span className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">EDUINSIGHT AI</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 text-[10px] font-medium tracking-[0.12em] text-white/45 sm:flex">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            {messages.adminWorkspace}
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={toggleNotifications}
              disabled={notificationsLoading}
              aria-label={messages.openNotifications}
              aria-expanded={notificationsOpen}
              aria-haspopup="dialog"
              title={messages.openNotifications}
              className="relative flex size-9 items-center justify-center rounded-lg text-white/55 transition-colors hover:bg-white/5 hover:text-[#dfc27e] disabled:opacity-50"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span
                  aria-label={messages.unreadNotifications}
                  className="absolute end-1.5 top-1.5 size-2 rounded-full bg-rose-500"
                />
              )}
            </button>
            {notificationsOpen && (
              <section
                role="dialog"
                aria-label={messages.notifications}
                className="fixed inset-x-2 top-[4.25rem] z-[60] flex max-h-[min(30rem,calc(100dvh-9rem))] w-auto flex-col overflow-hidden rounded-xl border border-white/10 bg-[#111111] shadow-2xl sm:absolute sm:inset-x-auto sm:end-0 sm:top-full sm:mt-3 sm:w-96"
              >
                <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <h2 className="text-sm font-semibold text-white">
                    {messages.notifications}
                  </h2>
                  <Link
                    href="/admin/notifications"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-[10px] font-semibold text-[#dfc27e] hover:text-white"
                  >
                    {messages.viewAllNotifications}
                  </Link>
                </header>
                <div className="min-w-0 overflow-y-auto p-3">
                  {notifications.length ? (
                    notifications.slice(0, 20).map((item) => (
                      <article
                        key={item.id}
                        className={`border-b border-white/[0.06] px-2 py-3 last:border-0 ${
                          item.is_read ? '' : 'bg-[#c6a96b]/[0.05]'
                        }`}
                      >
                        <p className="break-words text-[10px] font-medium text-[#dfc27e]">
                          {messages.sentBy.replace(
                            '{name}',
                            item.sender_name || messages.adminName,
                          )}
                        </p>
                        <p className="mt-1 min-w-0 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-xs leading-5 text-white/75">
                          {item.message}
                        </p>
                        <time className="mt-2 block text-[9px] text-white/35">
                          {new Date(item.created_at).toLocaleString()}
                        </time>
                      </article>
                    ))
                  ) : (
                    <p className="px-2 py-8 text-center text-xs text-white/45">
                      {messages.noNotifications}
                    </p>
                  )}
                </div>
              </section>
            )}
          </div>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto min-h-[calc(100dvh-3.5rem)] w-full max-w-5xl px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-6 sm:px-6 sm:pt-8">
        {children}
      </main>

      <nav
        aria-label={messages.navAdmin}
        className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#0b0b0b]/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
      >
        <div className="mx-auto grid h-[4.2rem] w-full max-w-[560px] grid-cols-4">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`relative flex min-w-0 flex-col items-center justify-center gap-1 transition-colors ${
                  active ? 'text-[#dfc27e]' : 'text-white/45 hover:text-white/80'
                }`}
              >
                {active && <span className="absolute top-0 h-px w-8 bg-[#c6a96b]" />}
                <Icon size={19} strokeWidth={active ? 2 : 1.7} />
                <span className="max-w-full truncate text-[9px] font-medium">{messages[label]}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
    </AdminToastProvider>
    </AuthGuard>
  );
}