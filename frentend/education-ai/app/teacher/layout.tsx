'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, BookOpen, CheckCircle, GraduationCap, House, Send, UserRound, X } from 'lucide-react';
import { getTeacherErrorMessage, getTeacherNotifications, type TeacherNotification } from '@/lib/teacher-api';
import ThemeToggle from '@/components/app/ThemeToggle';
import AuthGuard from '@/components/app/AuthGuard';
import type { LucideIcon } from 'lucide-react';

type NavigationItem = { href: string; label: string; icon: LucideIcon };
const navigation: NavigationItem[] = [
  { href: '/teacher/home', label: 'Home', icon: House },
  { href: '/teacher/classes', label: 'Classes', icon: BookOpen },
  { href: '/teacher/grading', label: 'Grading', icon: CheckCircle },
  { href: '/teacher/profile', label: 'Profile', icon: UserRound },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<TeacherNotification[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    getTeacherNotifications(controller.signal).then(setNotifications).catch((error: unknown) => { if (!controller.signal.aborted) console.warn(getTeacherErrorMessage(error, 'Teacher notifications unavailable.')); });
    return () => controller.abort();
  }, []);
  return (
    <AuthGuard role="teacher">
    <div className="app-shell min-h-dvh bg-[#0a0a0a] text-[#f5f2e9]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-[#0a0a0a] px-5 py-7 md:flex">
        <Link href="/teacher/home" className="mb-12 flex items-center gap-3 px-2"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-yellow-500/30 bg-[#2A2420] text-[#dfc27e]"><GraduationCap size={18} /></span><span className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">EDUINSIGHT AI</span></Link>
        <nav aria-label="Teacher navigation" className="space-y-1">{navigation.map(({ href, label, icon: Icon }) => { const active = isActive(pathname, href); return <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm transition-colors ${active ? 'bg-[#c6a96b]/10 text-[#e0c583]' : 'text-white/55 hover:bg-white/5 hover:text-white'}`}><Icon size={18} strokeWidth={1.8} />{label}</Link>; })}</nav>
        <p className="mt-auto px-2 text-[10px] font-medium tracking-[0.18em] text-white/30">TEACHER PORTAL</p>
      </aside>
      <div className="md:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/[0.07] bg-[#0a0a0a]/95 px-4 backdrop-blur-md sm:px-6 md:h-16 md:px-10"><Link href="/teacher/home" className="flex items-center gap-2.5 md:hidden"><span className="flex size-8 items-center justify-center rounded-lg border border-yellow-500/30 bg-[#2A2420] text-[#dfc27e]"><GraduationCap size={18} /></span><span className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">EDUINSIGHT AI</span></Link><div className="hidden text-xs font-medium tracking-[0.16em] text-white/40 md:block">TEACHER PORTAL</div><div className="ml-auto flex items-center gap-3 text-[11px] text-white/45"><Link href="/teacher/messages" aria-label="Compose message" title="Compose message" className="text-white/45 hover:text-[#dfc27e]"><Send size={17} /></Link><button onClick={() => setNotificationsOpen(true)} aria-label="Open notifications" title="Notifications" className="relative text-white/45 hover:text-[#dfc27e]"><Bell size={18} />{notifications.some((item) => !item.is_read) && <span className="absolute -right-1 -top-1 size-2 rounded-full bg-rose-400" />}</button><span className="hidden size-1.5 rounded-full bg-[#c6a96b] sm:block" /><span className="hidden sm:block">Teaching space</span><ThemeToggle /></div></header>
        <main className="mx-auto min-h-[calc(100dvh-3.5rem)] w-full max-w-6xl px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-6 sm:px-6 sm:pt-8 md:min-h-[calc(100dvh-4rem)] md:px-10 md:pb-12 md:pt-10">{children}</main>
        <AnimatePresence>{notificationsOpen && <motion.div className="fixed inset-0 z-[70] bg-black/65" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setNotificationsOpen(false)}><motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 26 }} onClick={(event) => event.stopPropagation()} className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l border-white/10 bg-[#111111] p-5 shadow-2xl"><div className="flex items-center justify-between"><div><p className="text-[10px] font-semibold tracking-[0.18em] text-[#dfc27e]">INBOX</p><h2 className="mt-1 text-lg font-semibold text-white">Notifications</h2></div><button onClick={() => setNotificationsOpen(false)} aria-label="Close notifications" className="flex size-10 items-center justify-center rounded-xl text-white/45"><X size={18} /></button></div><div className="mt-5 flex-1 space-y-2 overflow-y-auto">{notifications.length ? notifications.slice(0, 12).map((item) => <article key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.025] p-3"><p className="text-xs leading-5 text-white/75">{item.message}</p><time className="mt-2 block text-[10px] text-white/35">{new Date(item.created_at).toLocaleString()}</time></article>) : <p className="py-10 text-center text-xs text-white/40">No notifications yet.</p>}</div><Link href="/teacher/messages" onClick={() => setNotificationsOpen(false)} className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#c6a96b] text-xs font-semibold text-[#17130b]"><Send size={15} />Compose message</Link></motion.aside></motion.div>}</AnimatePresence>
      </div>
      <nav aria-label="Teacher navigation" className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#0b0b0b]/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"><div className="mx-auto grid h-[4.15rem] w-full max-w-[360px] grid-cols-4">{navigation.map(({ href, label, icon: Icon }) => { const active = isActive(pathname, href); return <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={`relative flex min-w-0 flex-col items-center justify-center gap-1 transition-colors ${active ? 'text-[#dfc27e]' : 'text-white/45 hover:text-white/80'}`}>{active && <span className="absolute top-0 h-px w-8 bg-[#c6a96b]" />}<Icon size={19} strokeWidth={active ? 2 : 1.7} /><span className="max-w-full truncate text-[9px] font-medium">{label}</span></Link>; })}</div></nav>
    </div>
    </AuthGuard>
  );
}
